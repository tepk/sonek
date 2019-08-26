'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.status = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var status = exports.status = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(api) {
    var servers, lines, overallColor, command, results;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            servers = Object.values(api.getConfig().servers);
            lines = [];
            overallColor = 'green';
            command = 'lsb_release -r -s || echo "false"; lsb_release -is; apt-get -v &> /dev/null && echo "true" || echo "false"; echo $BASH';
            _context.next = 6;
            return (0, _bluebird.map)(servers, function (server) {
              return api.runSSHCommand(server, command);
            }, { concurrency: 2 });

          case 6:
            results = _context.sent;


            results.forEach(function (_ref2) {
              var host = _ref2.host,
                  output = _ref2.output;

              var text = '  - ' + host + ': ';
              var color = _chalk2.default.green;

              var _output$trim$split = output.trim().split('\n'),
                  _output$trim$split2 = _slicedToArray(_output$trim$split, 4),
                  version = _output$trim$split2[0],
                  distribution = _output$trim$split2[1],
                  aptGet = _output$trim$split2[2],
                  _output$trim$split2$ = _output$trim$split2[3],
                  bash = _output$trim$split2$ === undefined ? '' : _output$trim$split2$;

              var versionCorrect = parseInt(version, 10) > 13;
              var distributionCorrect = distribution === 'Ubuntu';
              var hasAptGet = aptGet.trim() === 'true';
              var defaultBash = bash.trim().length > 0;

              var colors = statusColor(versionCorrect, distributionCorrect, hasAptGet, defaultBash, overallColor);

              color = colors.color;
              overallColor = colors.overallColor;

              text += color(distribution + ' ' + version);
              if (!hasAptGet) {
                text += _chalk2.default.red(' apt-get not available');
              }

              if (!defaultBash) {
                text += _chalk2.default.red(' Bash is not the default shell');
              }

              lines.push(text);
            });

            console.log(_chalk2.default[overallColor]('=> Servers'));
            console.log(lines.join('\n'));

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function status(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.deploy = deploy;
exports.logs = logs;
exports.reconfig = reconfig;
exports.restart = restart;
exports.setup = setup;
exports.start = start;
exports.stop = stop;
exports.ssh = ssh;
exports.validate = validate;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ssh = require('ssh2');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = (0, _debug2.default)('mup:module:default');

function deploy() {
  log('exec => mup deploy');
}

function logs() {
  log('exec => mup logs');
}

function reconfig() {
  log('exec => mup reconfig');
}

function restart() {
  log('exec => mup restart');
}

function setup(api) {
  process.on('exit', function (code) {
    if (code > 0) {
      return;
    }

    console.log('');
    console.log('Next, you should run:');
    console.log('    mup deploy');
  });

  log('exec => mup setup');

  return api.runCommand('docker.setup');
}

function start() {
  log('exec => mup start');
}

function stop() {
  log('exec => mup stop');
}

function ssh(api) {
  var servers = api.getConfig().servers;
  var serverOption = api.getArgs()[1];

  if (!(serverOption in servers)) {
    if (Object.keys(servers).length === 1) {
      serverOption = Object.keys(servers)[0];
    } else {
      console.log('mup ssh <server>');
      console.log('Available servers are:\n', Object.keys(servers).join('\n '));
      process.exitCode = 1;

      return;
    }
  }

  var server = servers[serverOption];
  var sshOptions = api._createSSHOptions(server);

  var conn = new _ssh.Client();
  conn.on('ready', function () {
    conn.shell(function (err, stream) {
      if (err) {
        throw err;
      }
      stream.on('close', function () {
        conn.end();
        process.exit();
      });

      process.stdin.setRawMode(true);
      process.stdin.pipe(stream);

      stream.pipe(process.stdout);
      stream.stderr.pipe(process.stderr);
      stream.setWindow(process.stdout.rows, process.stdout.columns);

      process.stdout.on('resize', function () {
        stream.setWindow(process.stdout.rows, process.stdout.columns);
      });
    });
  }).connect(sshOptions);
}

function validate(api) {
  // Shows validation errors
  api.getConfig();

  if (api.getOptions().show || api.getOptions().scrub) {
    var config = api.getConfig();

    if (api.getOptions().scrub) {
      config = api.scrubConfig();
    }
    console.log(JSON.stringify(config, null, 2));
  }

  var errors = api.validateConfig('');
  if (errors.length > 0) {
    process.exitCode = 1;
  } else {
    console.log(_chalk2.default.green('\u2713 Config is valid'));
  }
}

function statusColor(versionCorrect, distributionCorrect, hasAptGet, defaultBash, _overallColor) {
  var color = _chalk2.default.green;
  var overallColor = _overallColor;

  if (!hasAptGet) {
    color = _chalk2.default.red;
    overallColor = 'red';
  } else if (!distributionCorrect) {
    color = _chalk2.default.yellow;
    if (overallColor !== 'red') {
      overallColor = 'yellow';
    }
  } else if (!versionCorrect) {
    color = _chalk2.default.red;
    overallColor = 'red';
  } else if (!defaultBash) {
    color = _chalk2.default.red;
    overallColor = 'red';
  }

  return {
    color: color,
    overallColor: overallColor
  };
}
//# sourceMappingURL=command-handlers.js.map