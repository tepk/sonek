'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkVersion = checkVersion;
var minMajor = 1;
var minMinor = 13;

function checkVersion() {
  var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var parts = version.trim().split('.');
  var valid = true;

  if (parseInt(parts[0], 10) < minMajor) {
    valid = false;
  } else if (parseInt(parts[0], 10) === minMajor && parseInt(parts[1], 10) < minMinor) {
    valid = false;
  }

  return valid;
}
//# sourceMappingURL=utils.js.map