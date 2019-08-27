'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _utils = require('../utils');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('validator utils', function () {
  describe('serversExist', function () {
    it('should find nonexistent servers', function () {
      var serversConfig = { one: {}, two: {} };
      var usedServers = { one: {}, three: {} };
      var result = (0, _utils.serversExist)(serversConfig, usedServers);
      var expectedLength = 1;

      (0, _assert2.default)(result.length === expectedLength);
    });
  });
  describe('addDepreciation', function () {
    it('should add a depreciation detail', function () {
      var details = [];
      var path = 'servers.test';
      var reason = 'Use "testing" instead';
      var link = 'http://google.com';

      var _addDepreciation = (0, _utils.addDepreciation)(details, path, reason, link),
          _addDepreciation2 = _slicedToArray(_addDepreciation, 1),
          result = _addDepreciation2[0];

      (0, _assert2.default)(result.type === 'depreciation');
      (0, _assert2.default)(result.path === path);
      (0, _assert2.default)(result.message.indexOf(reason) > -1);
      (0, _assert2.default)(result.message.indexOf(link) > -1);
    });
  });

  describe('addLocation', function () {
    it('should add location to message', function () {
      var expected = '"app.a.b.c" message';
      var details = [{
        path: ['a', 'b', 'c'],
        message: 'message'
      }];
      var location = 'app';

      var _addLocation = (0, _utils.addLocation)(details, location),
          _addLocation2 = _slicedToArray(_addLocation, 1),
          message = _addLocation2[0].message;

      (0, _assert2.default)(message === expected, message);
    });
    it('should support paths from joi v10', function () {
      var expected = '"app.a.b.c" message';
      var details = [{
        path: 'a.b.c',
        message: 'message'
      }];
      var location = 'app';

      var _addLocation3 = (0, _utils.addLocation)(details, location),
          _addLocation4 = _slicedToArray(_addLocation3, 1),
          message = _addLocation4[0].message;

      (0, _assert2.default)(message === expected, message);
    });
  });
});
//# sourceMappingURL=utils.unit.js.map