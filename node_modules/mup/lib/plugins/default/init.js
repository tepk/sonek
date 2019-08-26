'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('mup:init');

_shelljs2.default.config.silent = true;

function findDestination(api) {
  var base = process.cwd();

  var inMeteorApp = _fs2.default.existsSync(api.resolvePath(base, '.meteor/release'));
  var parentMeteorApp = _fs2.default.existsSync(api.resolvePath(base, '../.meteor/release'));
  var parentChildren = _fs2.default.readdirSync(api.resolvePath(base, '../'));
  var siblingMeteorApp = false;
  var otherChild = '';

  if (parentChildren.length === 2) {
    otherChild = parentChildren.filter(function (child) {
      return child !== _path2.default.basename(base);
    })[0];
    if (_fs2.default.existsSync(api.resolvePath('..', otherChild, '.meteor/release'))) {
      siblingMeteorApp = true;
    }
  }

  log('in meteor app', inMeteorApp);
  log('Parent Meteor app', parentMeteorApp);
  log('siblingMeteorApp', siblingMeteorApp);

  var dest = base;
  var appPath = './';
  var createFolder = false;

  if (inMeteorApp) {
    dest = api.resolvePath(base, '.deploy');
    appPath = '../';
    createFolder = true;
  } else if (parentMeteorApp) {
    dest = base;
    appPath = '../';
  } else if (siblingMeteorApp) {
    dest = base;
    appPath = '../' + otherChild;
  }

  return {
    appPath: appPath,
    dest: dest,
    createFolder: createFolder
  };
}

function createDeployFolder(api) {
  var base = process.cwd();
  var folderPath = api.resolvePath(base, '.deploy');
  if (!_fs2.default.existsSync(folderPath)) {
    _fs2.default.mkdirSync(folderPath);
  }
}

function init(api) {
  var configSource = api.resolvePath(__dirname, 'template/mup.js.sample');
  var settingsSource = api.resolvePath(__dirname, 'template/settings.json');

  var _findDestination = findDestination(api),
      appPath = _findDestination.appPath,
      dest = _findDestination.dest,
      createFolder = _findDestination.createFolder;

  var settingsDest = api.resolvePath(dest, 'settings.json');
  var configDest = api.resolvePath(dest, 'mup.js');

  var configExists = _fs2.default.existsSync(api.resolvePath(configDest));
  var settingsExist = _fs2.default.existsSync(settingsDest);

  if (createFolder) {
    createDeployFolder(api);
    console.log('Created .deploy folder');
  }

  if (!settingsExist) {
    _shelljs2.default.cp(settingsSource, settingsDest);
    console.log('Created settings.json at ' + settingsDest);
  } else {
    console.log('Skipping creation of settings.json.');
    console.log('settings.json already exists at ' + settingsDest);
  }

  if (!configExists) {
    var configContents = _fs2.default.readFileSync(configSource).toString().replace('<app path>', appPath);
    _fs2.default.writeFileSync(configDest, configContents);

    console.log('Created mup.js at ' + configDest);
    console.log('');
    console.log('Next Steps:');
    console.log('');
    console.log('  Open mup.js and edit the config to meet your needs.');
    console.log('  Required changes have been marked with a TODO comment.');
    console.log('');
    console.log('  Available options can be found in the docs at');
    console.log('    https://github.com/zodern/meteor-up');
    console.log('');
    console.log('  Then, run the command:');
    console.log('    mup setup');
  } else {
    console.log('Skipping creation of mup.js');
    console.log('mup.js already exists at ' + configDest);
  }
}
//# sourceMappingURL=init.js.map