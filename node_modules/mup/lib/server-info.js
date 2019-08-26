'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._collectors = exports.builtInParsers = undefined;
exports.seperateCollectors = seperateCollectors;
exports.parseCollectorOutput = parseCollectorOutput;
exports.createHostResult = createHostResult;
exports.getServerInfo = getServerInfo;
exports.default = serverInfo;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _bluebird = require('bluebird');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('mup:server-info');

function parseJSONArray(stdout, code) {
  if (code === 0) {
    try {
      var output = stdout.split('\n').join(',');
      output = '[' + output + ']';

      var result = JSON.parse(output);

      if (!(result instanceof Array)) {
        return [result];
      }

      return result;
    } catch (e) {
      return null;
    }
  }

  return null;
}

var builtInParsers = exports.builtInParsers = {
  json: function json(stdout, code) {
    if (code === 0) {
      try {
        return JSON.parse(stdout);
      } catch (e) {
        return null;
      }
    }

    return null;
  },

  jsonArray: parseJSONArray
};

var _collectors = exports._collectors = {
  swarm: {
    command: 'docker info --format \'{{json .Swarm}}\'',
    parser: function parser(stdout, code) {
      if (code === 0) {
        try {
          return JSON.parse(stdout);
        } catch (e) {
          return null;
        }
      }

      return null;
    }
  },
  swarmNodes: {
    command: 'docker node inspect $(docker node ls -q) --format \'{{json .}}\'',
    parser: parseJSONArray
  },
  swarmToken: {
    command: 'docker swarm join-token worker -q',
    parser: function parser(stdout, code) {
      if (code === 0 && stdout.indexOf('Error response') === -1) {
        return stdout.trim();
      }

      return null;
    }
  },
  swarmServices: {
    command: 'docker service ls --format \'{{json .}}\'',
    parser: parseJSONArray
  },
  images: {
    command: 'docker images --format \'{{json .}}\'',
    parser: parseJSONArray
  }
};

var prefix = '<============mup-var-start========';
var suffix = '================mup-var-stop=====>';
var codeSeperator = 'mup-var-code=======';

function generateVarCommand(name, command) {
  return '\n  echo "' + prefix + name + suffix + '"\n  ' + command + ' 2>&1\n  echo "' + codeSeperator + '"\n  echo $?\n  ';
}

function generateScript(collectors) {
  var script = '';
  Object.keys(collectors).forEach(function (key) {
    var collector = collectors[key];
    script += generateVarCommand(key, collector.command);
  });

  return script;
}

function seperateCollectors(output) {
  var collectors = output.split(prefix);
  collectors.shift();

  return collectors.map(function (collectorOutput) {
    var name = collectorOutput.split(suffix)[0];
    var commandOutput = collectorOutput.split(suffix)[1].split(codeSeperator)[0];

    return {
      name: name.trim(),
      output: commandOutput.trim(),
      code: parseInt(collectorOutput.split(codeSeperator)[1].trim(), 10)
    };
  });
}

function parseCollectorOutput(name, output, code, collectors) {
  if (typeof collectors[name].parser === 'string') {
    return builtInParsers[collectors[name].parser](output, code);
  }

  return collectors[name].parser(output, code);
}

function createHostResult(collectorData, host, collectors) {
  var result = { _host: host };
  collectorData.forEach(function (data) {
    result[data.name] = parseCollectorOutput(data.name, data.output, data.code, collectors);
  });

  return result;
}

function getServerInfo(server, collectors) {
  var command = generateScript(collectors);

  return (0, _utils.runSSHCommand)(server, command).then(function (result) {
    var collectorData = seperateCollectors(result.output);
    var hostResult = createHostResult(collectorData, server.host, collectors);

    return hostResult;
  }).catch(function (err) {
    console.log(err, server);
  });
}

function serverInfo(servers) {
  var collectors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _collectors;

  log('starting');

  return (0, _bluebird.map)(servers, function (server) {
    return getServerInfo(server, collectors);
  }, { concurrency: 2 }).then(function (serverResults) {
    var result = {};
    serverResults.forEach(function (serverResult) {
      result[serverResult._host] = serverResult;
    });

    log('finished');

    return result;
  });
}
//# sourceMappingURL=server-info.js.map