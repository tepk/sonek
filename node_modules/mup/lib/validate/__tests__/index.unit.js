'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('validator', function () {
  beforeEach(function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(_index._pluginValidators)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var prop = _step.value;

        delete _index._pluginValidators[prop];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });

  describe('addPluginValidator', function () {
    it('should add validator', function () {
      var handler = function handler() {};

      (0, _index.addPluginValidator)('metrics', handler);
      (0, _chai.expect)(_index._pluginValidators.metrics).to.equal(handler);
    });
  });

  describe('validate', function () {
    it('should validate the config', function () {
      var config = {
        servers: {
          one: {
            host: '0.0.0.0'
          }
        }
      };

      var problems = void 0;

      try {
        problems = (0, _index2.default)(config);
      } catch (e) {
        console.log(e);
      }
      // console.log(errors);
      (0, _chai.expect)(problems.errors).instanceOf(Array);
      (0, _chai.expect)(problems.depreciations).instanceOf(Array);
    });
  });
});
//# sourceMappingURL=index.unit.js.map