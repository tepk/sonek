'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.status = undefined;

var status = exports.status = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(api) {
    var config, mongoServer, server, _ref2, dockerStatus, mongoCommand, _ref3, mongoStatus, mongoVersion, connections, storageEngine, containerStatus, statusColor, createdTime, restartCount, restartCountColor, overallColor, info, hour, upTime;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = api.getConfig();

            if (config.mongo) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return');

          case 3:
            mongoServer = Object.keys(config.mongo.servers)[0];
            server = config.servers[mongoServer];
            _context.next = 7;
            return api.runSSHCommand(server, 'docker inspect mongodb --format "{{json .}}"');

          case 7:
            _ref2 = _context.sent;
            dockerStatus = _ref2.output;
            mongoCommand = '"JSON.stringify(db.runCommand({serverStatus: 1, metrics: 0, wiredTiger: 1}))"';
            _context.next = 12;
            return api.runSSHCommand(server, 'docker exec mongodb mongo --eval ' + mongoCommand + ' --quiet');

          case 12:
            _ref3 = _context.sent;
            mongoStatus = _ref3.output;
            _context.prev = 14;

            mongoStatus = JSON.parse(mongoStatus);
            _context.next = 23;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context['catch'](14);

            console.log(_chalk2.default.red('\n=> Mongo Status'));
            console.log(_chalk2.default.red(' - Stopped'));

            return _context.abrupt('return');

          case 23:
            mongoVersion = mongoStatus.version;
            connections = mongoStatus.connections.current;
            storageEngine = mongoStatus.storageEngine.name;
            containerStatus = void 0;
            statusColor = 'green';
            createdTime = void 0;
            restartCount = 0;
            restartCountColor = 'green';
            overallColor = 'green';


            if (dockerStatus.trim() === '') {
              containerStatus = 'Not started';
              statusColor = 'red';
            } else {
              info = JSON.parse(dockerStatus);

              containerStatus = info.State.Status;

              if (info.State.Restarting) {
                statusColor = 'yellow';
              } else if (info.State.Running !== true) {
                statusColor = 'red';
              }

              hour = 1000 * 60 * 60;

              createdTime = info.Created;
              upTime = new Date(info.State.FinishedAt).getTime() - new Date(info.Created).getTime();

              restartCount = info.RestartCount;

              if (restartCount > 0 && upTime / hour <= restartCount) {
                restartCountColor = 'red';
              } else if (restartCount > 1) {
                restartCountColor = 'yellow';
              }
            }

            if (statusColor === 'green' && restartCountColor === 'green') {
              overallColor = 'green';
            } else {
              console.log('status', statusColor === 'green');
              console.log('restart', restartCountColor === 'green');
              overallColor = 'red';
            }

            console.log(_chalk2.default[overallColor]('\n=> Mongo Status'));
            console.log(_chalk2.default[statusColor]('  ' + containerStatus + ' on server ' + server.host));
            console.log(_chalk2.default[restartCountColor]('  Restarted ' + restartCount + ' times'));
            console.log('  Running since ' + createdTime);
            console.log('  Version: ' + mongoVersion);
            console.log('  Connections: ' + connections);
            console.log('  Storage Engine: ' + storageEngine);

          case 41:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[14, 18]]);
  }));

  return function status(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.logs = logs;
exports.setup = setup;
exports.start = start;
exports.stop = stop;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = (0, _debug2.default)('mup:module:mongo');

function logs(api) {
  log('exec => mup mongo logs');

  var args = api.getArgs();
  var sessions = api.getSessions(['mongo']);

  // remove mongo from args sent to docker
  args.shift();

  return api.getDockerLogs('mongodb', sessions, args);
}

function setup(api) {
  log('exec => mup mongo setup');

  if (!api.getConfig().mongo) {
    // could happen when running "mup mongo setup"
    console.log('Not setting up built-in mongodb since there is no mongo config');

    return;
  }

  var mongoSessions = api.getSessions(['mongo']);
  var meteorSessions = api.getSessions(['app']);

  if (meteorSessions.length !== 1) {
    console.log('To use mup built-in mongodb setup, you should have only one meteor app server. To have more app servers, use an external mongodb setup');

    return;
  } else if (mongoSessions[0]._host !== meteorSessions[0]._host) {
    console.log('To use mup built-in mongodb setup, you should have both meteor app and mongodb on the same server');

    return;
  }

  var list = _nodemiral2.default.taskList('Setup Mongo');

  list.executeScript('Setup Environment', {
    script: api.resolvePath(__dirname, 'assets/mongo-setup.sh')
  });

  list.copy('Copying mongodb.conf', {
    src: api.resolvePath(__dirname, 'assets/mongodb.conf'),
    dest: '/opt/mongodb/mongodb.conf'
  });

  var sessions = api.getSessions(['mongo']);

  return api.runTaskList(list, sessions, { verbose: api.verbose });
}

function start(api) {
  log('exec => mup mongo start');

  var mongoSessions = api.getSessions(['mongo']);
  var meteorSessions = api.getSessions(['app']);
  var config = api.getConfig().mongo;

  if (meteorSessions.length !== 1 || mongoSessions[0]._host !== meteorSessions[0]._host) {
    log('Skipping mongodb start. Incompatible config');

    return;
  }

  var list = _nodemiral2.default.taskList('Start Mongo');

  list.executeScript('Start Mongo', {
    script: api.resolvePath(__dirname, 'assets/mongo-start.sh'),
    vars: {
      mongoVersion: config.version || '3.4.1',
      mongoDbDir: '/var/lib/mongodb'
    }
  });

  var sessions = api.getSessions(['mongo']);

  return api.runTaskList(list, sessions, { verbose: api.verbose });
}

function stop(api) {
  log('exec => mup mongo stop');
  var list = _nodemiral2.default.taskList('Stop Mongo');

  list.executeScript('stop mongo', {
    script: api.resolvePath(__dirname, 'assets/mongo-stop.sh')
  });

  var sessions = api.getSessions(['mongo']);

  return api.runTaskList(list, sessions, { verbose: api.verbose });
}
//# sourceMappingURL=command-handlers.js.map