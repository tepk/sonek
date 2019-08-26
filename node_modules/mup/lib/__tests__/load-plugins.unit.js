'use strict';

var _loadPlugins = require('../load-plugins');

var _loadPlugins2 = _interopRequireDefault(_loadPlugins);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('load-plugins', function () {
  it('should load included plugins', function () {
    (0, _chai.expect)(Object.keys(_loadPlugins2.default)).to.have.length.greaterThan(4);
    (0, _chai.expect)(Object.keys(_loadPlugins2.default)).to.contain('default');
  });

  describe('locatePluginDir', function () {
    it('should identify paths', function () {
      var configPath = '/projects/a/mup.js';

      function createResult(value) {
        return (0, _loadPlugins.locatePluginDir)(value, configPath).replace(/\\/g, '/');
      }

      (0, _chai.expect)(createResult('./test')).to.contain('/projects/a/test');
      (0, _chai.expect)(createResult('~/test')).to.contain('/test');
      (0, _chai.expect)(createResult('/test')).to.length.lessThan(10);
    });
  });
});
//# sourceMappingURL=load-plugins.unit.js.map