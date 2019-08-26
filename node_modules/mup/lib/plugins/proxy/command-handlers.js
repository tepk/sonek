'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.status = exports.nginxConfig = undefined;

var nginxConfig = exports.nginxConfig = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(api) {
    var command, _api$getConfig, servers, app, serverObjects;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            log('exec => mup proxy nginx-config');

            command = 'docker exec ' + PROXY_CONTAINER_NAME + ' cat /etc/nginx/conf.d/default.conf';
            _api$getConfig = api.getConfig(), servers = _api$getConfig.servers, app = _api$getConfig.app;
            serverObjects = Object.keys(app.servers).map(function (serverName) {
              return servers[serverName];
            });
            _context.next = 6;
            return Promise.all(serverObjects.map(function (server) {
              return api.runSSHCommand(server, command);
            })).then(function (results) {
              results.forEach(function (_ref2) {
                var host = _ref2.host,
                    output = _ref2.output;

                console.log('===== ' + host + ' ======');
                console.log(output);
              });
            });

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function nginxConfig(_x) {
    return _ref.apply(this, arguments);
  };
}();

var status = exports.status = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(api) {
    var config, servers, lines, overallColor, collectorConfig, serverInfo;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            config = api.getConfig();
            servers = Object.keys(config.app.servers).map(function (key) {
              return config.servers[key];
            });
            lines = [];
            overallColor = 'green';
            collectorConfig = {
              nginxDocker: {
                command: 'docker inspect ' + PROXY_CONTAINER_NAME + ' --format "{{json .}}"',
                parser: 'json'
              },
              letsEncryptDocker: {
                command: 'docker inspect ' + PROXY_CONTAINER_NAME + '-letsencrypt --format "{{json .}}"',
                parser: 'json'
              },
              certificateExpire: {
                command: 'cd /opt/' + PROXY_CONTAINER_NAME + '/mounted-certs && find . -name \'*.chain.pem\' -exec echo \'{}\' \\; -exec openssl x509 -enddate -noout -in \'{}\' \\;',
                parser: function parser(stdout, code) {
                  if (code === 0) {
                    return stdout.split('\n').reduce(function (result, item, index, items) {
                      if (!(index % 2) && item.trim() !== '') {
                        result[item.slice(2)] = items[index + 1].split('=')[1];
                      }

                      return result;
                    }, {});
                  }

                  return null;
                }
              }
            };
            _context2.next = 7;
            return api.getServerInfo(servers, collectorConfig);

          case 7:
            serverInfo = _context2.sent;


            Object.values(serverInfo).forEach(function (_ref4) {
              var _host = _ref4._host,
                  nginxDocker = _ref4.nginxDocker,
                  letsEncryptDocker = _ref4.letsEncryptDocker,
                  certificateExpire = _ref4.certificateExpire;

              lines.push(' - ' + _host + ':');
              lines.push('   - NGINX:');
              lines.push('     - Status: ' + (nginxDocker ? nginxDocker.State.Status : 'Stopped'));

              if (nginxDocker && nginxDocker.State.Status !== 'running') {
                overallColor = 'red';
              }

              if (nginxDocker) {
                lines.push('     - Ports:');
                Object.keys(nginxDocker.NetworkSettings.Ports || {}).forEach(function (key) {
                  if (key === '443/tcp') {
                    lines.push('       - HTTPS: ' + nginxDocker.NetworkSettings.Ports[key][0].HostPort);
                  } else if (key === '80/tcp') {
                    lines.push('       - HTTP: ' + nginxDocker.NetworkSettings.Ports[key][0].HostPort);
                  }
                });
              }

              lines.push('   - Let\'s Encrypt');
              lines.push('     - Status: ' + (letsEncryptDocker ? letsEncryptDocker.State.Status : 'Stopped'));

              if (letsEncryptDocker && letsEncryptDocker.State.Status !== 'running') {
                overallColor = 'red';
              }

              if (certificateExpire && certificateExpire.length > 0) {
                lines.push('     - Certificates');
                Object.keys(certificateExpire).forEach(function (key) {
                  lines.push('       - ' + key + ': ' + certificateExpire[key]);
                });
              }
            });

            console.log(_chalk2.default[overallColor]('\n=> Reverse Proxy Status'));
            console.log(lines.join('\n'));

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function status(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.logs = logs;
exports.leLogs = leLogs;
exports.setup = setup;
exports.reconfigShared = reconfigShared;
exports.start = start;
exports.stop = stop;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var log = (0, _debug2.default)('mup:module:proxy');
var PROXY_CONTAINER_NAME = 'mup-nginx-proxy';

function logs(api) {
  log('exec => mup proxy logs');
  var config = api.getConfig().proxy;

  if (!config) {
    console.error('error: no configs found for proxy');
    process.exit(1);
  }

  var args = api.getArgs().slice(1);
  var sessions = api.getSessions(['app']);

  return api.getDockerLogs(PROXY_CONTAINER_NAME, sessions, args);
}

function leLogs(api) {
  log('exec => mup proxy le-logs');
  var config = api.getConfig().proxy;

  if (!config) {
    console.error('error: no configs found for proxy');
    process.exit(1);
  }

  var args = api.getArgs().slice(1);
  args[0] = 'logs';
  var sessions = api.getSessions(['app']);

  return api.getDockerLogs(PROXY_CONTAINER_NAME + '-letsencrypt', sessions, args);
}

function setup(api) {
  log('exec => mup proxy setup');
  var config = api.getConfig().proxy;
  var appName = api.getConfig().app.name;

  if (!config) {
    console.error('error: no configs found for proxy');
    process.exit(1);
  }

  var list = _nodemiral2.default.taskList('Setup proxy');
  var domains = config.domains.split(',');

  list.executeScript('Setup Environment', {
    script: api.resolvePath(__dirname, 'assets/proxy-setup.sh'),
    vars: {
      name: PROXY_CONTAINER_NAME
    }
  });

  list.copy('Pushing the Startup Script', {
    src: api.resolvePath(__dirname, 'assets/templates/start.sh'),
    dest: '/opt/' + PROXY_CONTAINER_NAME + '/config/start.sh',
    vars: {
      appName: PROXY_CONTAINER_NAME,
      letsEncryptEmail: config.ssl ? config.ssl.letsEncryptEmail : null
    }
  });

  var nginxServerConfig = '';
  if (config.nginxServerConfig) {
    nginxServerConfig = _fs2.default.readFileSync(api.resolvePath(api.getBasePath(), config.nginxServerConfig)).toString('utf8');
  }

  var nginxLocationConfig = '';
  if (config.nginxLocationConfig) {
    nginxLocationConfig = _fs2.default.readFileSync(api.resolvePath(api.getBasePath(), config.nginxLocationConfig)).toString('utf8');
  }

  list.executeScript('Pushing Nginx Config', {
    script: api.resolvePath(__dirname, 'assets/nginx-config.sh'),
    vars: {
      hasServerConfig: config.nginxServerConfig,
      hasLocationConfig: config.nginxLocationConfig,
      serverConfig: nginxServerConfig,
      locationConfig: nginxLocationConfig,
      domains: domains,
      proxyName: PROXY_CONTAINER_NAME,
      clientUploadLimit: config.clientUploadLimit || '10M'
    }
  });

  list.executeScript('Cleaning Up SSL Certificates', {
    script: api.resolvePath(__dirname, 'assets/ssl-cleanup.sh'),
    vars: {
      name: appName,
      proxyName: PROXY_CONTAINER_NAME
    }
  });

  if (config.ssl && !config.ssl.letsEncryptEmail && config.ssl.upload !== false && config.ssl.crt) {
    list.copy('Copying SSL Certificate Bundle', {
      src: api.resolvePath(api.getBasePath(), config.ssl.crt),
      dest: '/opt/' + appName + '/config/bundle.crt'
    });
    list.copy('Copying SSL Private Key', {
      src: api.resolvePath(api.getBasePath(), config.ssl.key),
      dest: '/opt/' + appName + '/config/private.key'
    });
    list.executeScript('Setup SSL Certificates for Domains', {
      script: api.resolvePath(__dirname, 'assets/ssl-setup.sh'),
      vars: {
        appName: appName,
        proxyName: PROXY_CONTAINER_NAME,
        domains: domains
      }
    });
  }

  var sessions = api.getSessions(['app']);

  return api.runTaskList(list, sessions, {
    series: true,
    verbose: api.getVerbose()
  }).then(function () {
    return api.runCommand('proxy.start');
  });
}

function reconfigShared(api) {
  var config = api.getConfig().proxy;
  var shared = config.shared || {};

  if (!config) {
    console.error('error: no configs found for proxy');
    process.exit(1);
  }

  console.log('The shared settings affect all apps using this reverse proxy.');

  if (Object.keys(shared).length === 0) {
    console.log('No shared config properties are set. Resetting proxy to defaults.');
  }

  var list = _nodemiral2.default.taskList('Configuring Proxy\'s Shared Settings');

  list.copy('Sending shared variables', {
    src: api.resolvePath(__dirname, 'assets/templates/shared-config.sh'),
    dest: '/opt/' + PROXY_CONTAINER_NAME + '/config/shared-config.sh',
    vars: {
      httpPort: shared.httpPort,
      httpsPort: shared.httpsPort,
      clientUploadLimit: shared.clientUploadLimit
    }
  });

  var env = (0, _lodash.clone)(shared.env);

  list.copy('Sending proxy environment variables', {
    src: api.resolvePath(__dirname, 'assets/templates/env.list'),
    dest: '/opt/' + PROXY_CONTAINER_NAME + '/config/env.list',
    vars: {
      env: env || {}
    }
  });

  var envLetsEncrypt = (0, _lodash.clone)(shared.envLetsEncrypt);

  list.copy('Sending let\'s encrypt environment variables', {
    src: api.resolvePath(__dirname, 'assets/templates/env.list'),
    dest: '/opt/' + PROXY_CONTAINER_NAME + '/config/env_letsencrypt.list',
    vars: {
      env: envLetsEncrypt || {}
    }
  });

  var sharedNginxConfig = shared.nginxConfig || api.resolvePath(__dirname, 'assets/proxy.conf');
  list.copy('Sending nginx config', {
    src: sharedNginxConfig,
    dest: '/opt/' + PROXY_CONTAINER_NAME + '/config/nginx-default.conf'
  });

  var sessions = api.getSessions(['app']);

  return api.runTaskList(list, sessions, {
    series: true,
    verbose: api.verbose
  }).then(function () {
    return api.runCommand('proxy.start');
  });
}

function start(api) {
  log('exec => mup proxy start');
  var config = api.getConfig().proxy;
  if (!config) {
    console.error('error: no configs found for proxy');
    process.exit(1);
  }

  var list = _nodemiral2.default.taskList('Start proxy');

  list.executeScript('Start proxy', {
    script: api.resolvePath(__dirname, 'assets/proxy-start.sh'),
    vars: {
      appName: PROXY_CONTAINER_NAME
    }
  });

  var sessions = api.getSessions(['app']);

  return api.runTaskList(list, sessions, {
    series: true,
    verbose: api.getVerbose()
  });
}

function stop(api) {
  log('exec => mup proxy stop');

  var list = _nodemiral2.default.taskList('Stop proxy');

  list.executeScript('Stop proxy', {
    script: api.resolvePath(__dirname, 'assets/proxy-stop.sh'),
    vars: {
      appName: PROXY_CONTAINER_NAME
    }
  });

  var sessions = api.getSessions(['app']);

  return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
}
//# sourceMappingURL=command-handlers.js.map