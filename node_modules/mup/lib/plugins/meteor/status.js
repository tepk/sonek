'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkUrls = undefined;

var checkUrls = exports.checkUrls = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(server, appConfig, api) {
    var remote, inDocker, local;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return api.runSSHCommand(server, 'curl 127.0.0.1:' + appConfig.env.PORT);

          case 2:
            remote = _context.sent;
            _context.next = 5;
            return api.runSSHCommand(server, 'docker exec ' + appConfig.name + ' curl http://localhost:' + appConfig.docker.imagePort);

          case 5:
            inDocker = _context.sent;
            local = void 0;
            _context.prev = 7;
            _context.next = 10;
            return _axios2.default.get('http://' + server.host + ':' + appConfig.env.PORT);

          case 10:
            local = _context.sent;
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context['catch'](7);

            local = false;

          case 16:
            return _context.abrupt('return', {
              inDocker: inDocker.code === 0,
              remote: remote.code === 0,
              local: local !== false
            });

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[7, 13]]);
  }));

  return function checkUrls(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getInformation = getInformation;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function getInformation(server, appName, api) {
  return api.runSSHCommand(server, 'docker inspect ' + appName + ' --format "{{json .}}"').then(function (_ref) {
    var host = _ref.host,
        output = _ref.output;

    var info = void 0;

    try {
      info = JSON.parse(output.trim());
    } catch (e) {
      return {
        statusColor: 'red',
        status: 'Stopped',
        host: server.host
      };
    }

    var statusColor = 'green';
    if (info.State.Restarting) {
      statusColor = 'yellow';
    } else if (!info.State.Running) {
      statusColor = 'red';
    }

    var publishedPorts = [];
    var exposedPorts = [];
    Object.keys(info.NetworkSettings.Ports || {}).forEach(function (key) {
      if (info.NetworkSettings.Ports[key]) {
        publishedPorts.push(key + ' => ' + info.NetworkSettings.Ports[key][0].HostPort);
      } else {
        exposedPorts.push(key);
      }
    });

    var env = {};
    info.Config.Env.forEach(function (envVariable) {
      var name = envVariable.split('=')[0];
      env[name] = envVariable;
    });

    var restartCount = info.RestartCount;
    var restartColor = 'green';
    if (restartCount > 0) {
      restartColor = 'yellow';
    } else if (restartCount > 2) {
      restartColor = 'red';
    }

    return {
      host: host,
      created: info.Created,
      status: info.State.Status,
      statusColor: statusColor,
      env: Object.values(env),
      restartCount: restartCount,
      restartColor: restartColor,
      publishedPorts: publishedPorts,
      exposedPorts: exposedPorts
    };
  });
}
//# sourceMappingURL=status.js.map