'use strict';

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _chai = require('chai');

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('utils', function () {
  describe('addStdioHandlers', function () {
    it('should add stdio handlers to nodemiral task list', function () {
      var list = _nodemiral2.default.taskList('Test');
      list.executeScript('testing', {});
      // Test that it doesn't throw an error
      utils.addStdioHandlers(list);
    });
  });

  describe('runTaskList', function () {
    it('should resolve when list is sucessfull', function (cb) {
      var list = {
        run: function run(sessions, opts, runCb) {
          runCb({});
        }
      };
      utils.runTaskList(list, {}, {}).then(function () {
        cb();
      });
    });

    it('should add stdio handlers for verbose', function (cb) {
      var list = {
        _taskQueue: [],
        run: function run(sessions, opts, runCb) {
          (0, _chai.expect)(opts.verbose).to.equal(undefined);
          runCb({});
        }
      };

      utils.runTaskList(list, {}, { verbose: true }).then(function () {
        cb();
      });
    });

    it('should reject if a task failed', function (cb) {
      var list = {
        run: function run(sessions, opts, runCb) {
          runCb({
            copy: {
              error: 'error'
            }
          });
        }
      };

      utils.runTaskList(list, {}, {}).catch(function () {
        cb();
      });
    });
  });

  describe('countOccurences', function () {
    it('should return the correct count', function () {
      var needle = 'Meteor';
      var haystack = 'Production Quality Meteor Deployments. Meteor Up is a command line tool that allows you to deploy any Meteor app to your own server.';
      var count = utils.countOccurences(needle, haystack);
      (0, _assert2.default)(count === 3);
    });
  });

  describe('resolvePath', function () {
    it('should return the correct path', function () {
      var result = utils.resolvePath('/root', '../opt');
      var expected = _path2.default.resolve('/root', '../opt');
      (0, _assert2.default)(result === expected);
    });
    it('should expand tilde', function () {
      var result = utils.resolvePath('~/.ssh');
      (0, _assert2.default)(result.indexOf('~') === -1);
    });
  });

  describe('createOption', function () {
    it('should handle long options', function () {
      var result = utils.createOption('option');

      (0, _assert2.default)(result === '--option');
    });
    it('should handle short options', function () {
      var result = utils.createOption('o');

      (0, _assert2.default)(result === '-o');
    });
  });

  describe('argvContains', function () {
    it('should find exact matches', function () {
      var result = utils.argvContains(['a', 'b'], 'a');

      (0, _assert2.default)(result);
    });
    it('should find matches that contain the value', function () {
      var result = utils.argvContains(['a', 'b=c'], 'b');

      (0, _assert2.default)(result);
    });
    it('should return false if not found', function () {
      var result = utils.argvContains(['a', 'b'], 'c');

      (0, _assert2.default)(!result);
    });
  });

  describe('filterArgv', function () {
    it('should remove unwanted options', function () {
      var argv = { _: ['logs'], config: './mup.js', tail: true };
      var argvArray = ['mup', 'logs', '--config=./mup.js', '--tail'];
      var unwanted = ['_', 'config'];
      var result = utils.filterArgv(argvArray, argv, unwanted);

      (0, _chai.expect)(result).to.deep.equal(['logs', '--tail']);
    });
    it('should remove undefined and false options', function () {
      var argv = { _: ['logs'], config: undefined, verbose: true, follow: false };
      var argvArray = ['mup', 'logs', '--verbose'];
      var unwanted = ['_'];

      var result = utils.filterArgv(argvArray, argv, unwanted);

      (0, _chai.expect)(result).to.deep.equal(['logs', '--verbose']);
    });
    it('should add non-boolean values', function () {
      var argv = { _: ['logs'], tail: '10', follow: true };
      var argvArray = ['mup', 'logs', '--tail=10', '--follow'];
      var unwanted = ['_'];

      var result = utils.filterArgv(argvArray, argv, unwanted);

      (0, _chai.expect)(result).to.deep.equal(['logs', '--tail', '10', '--follow']);
    });
    it('should remove options not provided by user', function () {
      var argv = { _: ['logs'], follow: true, tail: '10' };
      var argvArray = ['mup', 'logs'];
      var unwanted = ['_'];

      var result = utils.filterArgv(argvArray, argv, unwanted);

      (0, _chai.expect)(result).to.deep.equal(['logs']);
    });
  });
});
//# sourceMappingURL=utils.unit.js.map