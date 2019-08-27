'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._optionFunctions = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.registerSwarmOptions = registerSwarmOptions;
exports.getOptions = getOptions;

var _lodash = require('lodash');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _optionFunctions = exports._optionFunctions = [];

function registerSwarmOptions(optionFunction) {
  _optionFunctions.push(optionFunction);
}

function getOptions(config) {
  return _optionFunctions.reduce(function (result, optionFunction) {
    var _ref = optionFunction(config) || {},
        labels = _ref.labels,
        managers = _ref.managers;

    if ((typeof labels === 'undefined' ? 'undefined' : _typeof(labels)) === 'object') {
      Object.keys(labels).forEach(function (host) {
        result.labels[host] = result.labels[host] || {};
        result.labels[host] = (0, _lodash.merge)(result.labels[host], labels[host]);
      });
    }

    if (managers) {
      var _result$managers;

      (_result$managers = result.managers).push.apply(_result$managers, _toConsumableArray(managers));
    }

    return result;
  }, { labels: {}, managers: [] });
}
//# sourceMappingURL=swarm-options.js.map