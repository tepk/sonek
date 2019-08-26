'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function copy(session, _options, callback) {
  var options = (0, _lodash.clone)(_options);
  var retries = 0;

  if (_typeof(options.hostVars) === 'object' && options.hostVars[session._host]) {
    options.vars = (0, _lodash.merge)(options.vars, options.hostVars[session._host]);
  }

  function doCopy() {
    session.copy(options.src, options.dest, options, cb);
  }
  function cb(err) {
    // Check if common error that a known fix
    if (err) {
      if (err.message === 'No such file') {
        err.solution = 'Please run "mup setup" to create missing folders on the server.';

        // Skip retries since we will have the same error
        retries = 10;
      }
    }

    retries += 1;

    if (err && retries < 4) {
      var timeout = retries * 3000;

      console.log('Failed to copy file ', err.message);
      console.log('Retrying in ' + timeout / 1000 + ' seconds');

      setTimeout(doCopy, timeout);

      return;
    }
    callback(err);
  }

  doCopy();
}

function executeScript(session, _options, callback, varsMapper) {
  var options = (0, _lodash.clone)(_options);
  if (_typeof(options.hostVars) === 'object' && options.hostVars[session._host]) {
    options.vars = (0, _lodash.merge)(options.vars, options.hostVars[session._host]);
  }

  session.executeScript(options.script, options, createCallback(callback, varsMapper));
}

function createCallback(cb, varsMapper) {
  return function (err, code) {
    var logs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    logs.stderr = logs.stderr || '';
    logs.stdout = logs.stdout || '';

    if (err) {
      return cb(err);
    }
    if (code > 0) {
      var message = '\n      ------------------------------------STDERR------------------------------------\n      ' + logs.stderr.substring(logs.stderr.length - 4200) + '\n      ------------------------------------STDOUT------------------------------------\n      ' + logs.stdout.substring(logs.stdout.length - 4200) + '\n      ------------------------------------------------------------------------------\n      ';

      return cb(new Error(message));
    }

    if (varsMapper) {
      varsMapper(logs.stdout, logs.stderr);
    }

    cb();
  };
}

_nodemiral2.default.registerTask('copy', copy);
_nodemiral2.default.registerTask('executeScript', executeScript);
//# sourceMappingURL=nodemiral.js.map