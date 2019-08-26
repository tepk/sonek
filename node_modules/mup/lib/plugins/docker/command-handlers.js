'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.status = exports.setupSwarm = undefined;

var setupSwarm = exports.setupSwarm = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(api) {
    var config, swarmConfig, serverInfo, _ref2, currentManagers, desiredManagers, managersToAdd, managersToRemove, managersToKeep, host, _ref3, currentNodes, nodeIDs, currentLabels, desiredLabels, wantedNodes, nodesToAdd, token, managerIP, managerIDs, _diffLabels, toRemove, toAdd;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = api.getConfig();
            swarmConfig = config.swarm;

            if (swarmConfig) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return');

          case 4:
            _context.next = 6;
            return api.getServerInfo();

          case 6:
            serverInfo = _context.sent;
            _context.next = 9;
            return api.swarmInfo();

          case 9:
            _ref2 = _context.sent;
            currentManagers = _ref2.currentManagers;
            desiredManagers = _ref2.desiredManagers;


            log('currentManagers', currentManagers);
            log('wantedManagers', desiredManagers);

            managersToAdd = (0, _lodash.difference)(desiredManagers, currentManagers);
            managersToRemove = (0, _lodash.difference)(currentManagers, desiredManagers);
            managersToKeep = (0, _lodash.intersection)(currentManagers, desiredManagers);


            log('managers to add', managersToAdd);
            log('managers to remove', managersToRemove);
            log('managers keeping', managersToKeep);

            if (!(currentManagers.length === 0)) {
              _context.next = 28;
              break;
            }

            log('Creating swarm cluster');
            host = config.servers[managersToAdd[0]].host;
            _context.next = 25;
            return (0, _swarm.initSwarm)(managersToAdd, host, api);

          case 25:

            managersToKeep.push(managersToAdd.shift());
            log('finished creating cluster');
            api.serverInfoStale();

          case 28:
            _context.next = 30;
            return api.getServerInfo();

          case 30:
            serverInfo = _context.sent;


            // TODO: we should always keep one manager until
            // after the new managers are added
            if (managersToRemove.length > 0) {
              (0, _swarm.removeManagers)(managersToRemove, api);
              api.serverInfoStale();
            }

            _context.next = 34;
            return api.swarmInfo();

          case 34:
            _ref3 = _context.sent;
            currentNodes = _ref3.nodes;
            nodeIDs = _ref3.nodeIDs;
            currentLabels = _ref3.currentLabels;
            desiredLabels = _ref3.desiredLabels;
            wantedNodes = Object.keys(config.servers);
            nodesToAdd = (0, _lodash.difference)(wantedNodes, currentNodes);


            log('current nodes', currentNodes);
            log('adding nodes', nodesToAdd);

            if (!(nodesToAdd.length > 0)) {
              _context.next = 48;
              break;
            }

            // TODO: make sure token is for correct cluster
            token = Object.keys(serverInfo).reduce(function (result, item) {
              return result || serverInfo[item].swarmToken;
            }, null);
            managerIP = config.servers[desiredManagers[0]].host;
            _context.next = 48;
            return (0, _swarm.joinNodes)(nodesToAdd, token, managerIP, api);

          case 48:

            log('remaining managers to add', managersToAdd);

            if (!(managersToAdd.length > 0)) {
              _context.next = 53;
              break;
            }

            managerIDs = managersToAdd.map(function (name) {
              return (0, _lodash.findKey)(nodeIDs, (0, _lodash.partial)(_lodash.isEqual, name));
            });
            _context.next = 53;
            return (0, _swarm.promoteNodes)(managersToKeep[0], managerIDs, api);

          case 53:

            // Update tags
            _diffLabels = (0, _swarm.diffLabels)(currentLabels, desiredLabels), toRemove = _diffLabels.toRemove, toAdd = _diffLabels.toAdd;

            if (!(toRemove.length > 0 || toAdd.length > 0)) {
              _context.next = 59;
              break;
            }

            toRemove = toRemove.map(function (data) {
              data.server = (0, _lodash.findKey)(nodeIDs, (0, _lodash.partial)(_lodash.isEqual, data.server));

              return data;
            });

            toAdd = toAdd.map(function (data) {
              data.server = (0, _lodash.findKey)(nodeIDs, (0, _lodash.partial)(_lodash.isEqual, data.server));

              return data;
            });

            _context.next = 59;
            return (0, _swarm.updateLabels)(api, currentManagers[0], toAdd, toRemove);

          case 59:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function setupSwarm(_x) {
    return _ref.apply(this, arguments);
  };
}();

var status = exports.status = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(api) {
    var config, results, lines, overallColor, _ref5, currentManagers, nodes, list;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            config = api.getConfig();

            if (config.servers) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt('return');

          case 3:
            _context2.next = 5;
            return (0, _bluebird.map)(Object.values(config.servers), function (server) {
              return api.runSSHCommand(server, 'sudo docker version --format "{{.Server.Version}}"');
            }, { concurrency: 2 });

          case 5:
            results = _context2.sent;
            lines = [];
            overallColor = _chalk2.default.green;


            results.forEach(function (result) {
              var dockerStatus = 'Running';
              var color = 'green';

              if (result.code === 1) {
                dockerStatus = 'Stopped';
                color = 'red';
                overallColor = _chalk2.default.red;
              } else if (result.code === 127) {
                dockerStatus = 'Not installed';
                color = 'red';
                overallColor = _chalk2.default.red;
              }

              var version = result.output.trim().length > 1 ? result.output.trim() : '';
              var versionColor = _chalk2.default.green;

              if (!(0, _utils.checkVersion)(version)) {
                overallColor = _chalk2.default.red;
                versionColor = _chalk2.default.red;
              }

              lines.push(' - ' + result.host + ': ' + versionColor(version) + ' ' + _chalk2.default[color](dockerStatus));
            });

            console.log(overallColor('\n=> Docker Status'));
            console.log(lines.join('\n'));

            if (config.swarm) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt('return');

          case 13:
            _context2.next = 15;
            return api.swarmInfo();

          case 15:
            _ref5 = _context2.sent;
            currentManagers = _ref5.currentManagers;
            nodes = _ref5.nodes;
            list = [];


            currentManagers.forEach(function (manager) {
              list.push('- ' + manager + ' (Manager)');
            });

            (0, _lodash.difference)(nodes, currentManagers).forEach(function (node) {
              list.push('- ' + node);
            });

            if (!(currentManagers.length === 0)) {
              _context2.next = 24;
              break;
            }

            console.log('No swarm managers');

            return _context2.abrupt('return');

          case 24:

            // TODO show swarm health:
            // https://docs.docker.com/engine/swarm/admin_guide/#monitor-swarm-health

            console.log('Swarm Nodes: ' + nodes.length);
            console.log(list.join('\n'));

          case 26:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function status(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.setup = setup;
exports.restart = restart;
exports.removeSwarm = removeSwarm;
exports.ps = ps;

var _lodash = require('lodash');

var _swarm = require('./swarm');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('./utils');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _async = require('async');

var _bluebird = require('bluebird');

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = (0, _debug2.default)('mup:module:docker');

function uniqueSessions(api) {
  var sessions = api.getSessions(['app', 'mongo', 'proxy']);

  return sessions.reduce(function (prev, curr) {
    if (prev.map(function (session) {
      return session._host;
    }).indexOf(curr._host) === -1) {
      prev.push(curr);
    }

    return prev;
  }, []);
}

function setup(api) {
  log('exec => mup docker setup');
  var config = api.getConfig();
  var swarmEnabled = config.swarm;
  var servers = Object.keys(config.servers || {});

  var list = _nodemiral2.default.taskList('Setup Docker');

  list.executeScript('Setup Docker', {
    script: api.resolvePath(__dirname, 'assets/docker-setup.sh')
  });

  var sessions = swarmEnabled ? api.getSessionsForServers(servers) : uniqueSessions(api);

  if (sessions.length === 0) {
    // There are no servers, so we can skip running the list
    return;
  }

  return api.runTaskList(list, sessions, {
    verbose: api.verbose
  }).then(function () {
    return setupSwarm(api);
  });
}

function restart(api) {
  var list = _nodemiral2.default.taskList('Restart Docker Daemon');

  list.executeScript('Restart Docker', {
    script: api.resolvePath(__dirname, 'assets/docker-restart.sh')
  });

  var sessions = uniqueSessions(api);

  return api.runTaskList(list, sessions, {
    verbose: api.verbose
  });
}

function removeSwarm(api) {
  var list = _nodemiral2.default.taskList('Removing swarm');
  var servers = Object.keys(api.getConfig().servers);
  var sessions = api.getSessionsForServers(servers);

  list.executeScript('Removing swarm', {
    script: api.resolvePath(__dirname, 'assets/swarm-leave.sh')
  });

  return api.runTaskList(list, sessions, {
    verbose: api.verbose
  });
}

function ps(api) {
  var args = api.getArgs();
  args.shift();
  (0, _async.each)(uniqueSessions(api), function (session, cb) {
    session.execute('sudo docker ' + args.join(' ') + ' 2>&1', function (err, code, logs) {
      console.log(_chalk2.default.magenta('[' + session._host + ']') + _chalk2.default.blue(' docker ' + args.join(' ')));
      console.log(logs.stdout);
      cb();
    });
  });
}
//# sourceMappingURL=command-handlers.js.map