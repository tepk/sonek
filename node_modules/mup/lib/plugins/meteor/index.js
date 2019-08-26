'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = exports.validate = exports.commands = exports.description = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.prepareConfig = prepareConfig;
exports.scrubConfig = scrubConfig;
exports.swarmOptions = swarmOptions;

var _commands2 = require('./commands');

var _commands = _interopRequireWildcard(_commands2);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _lodash = require('lodash');

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var description = exports.description = 'Deploy and manage meteor apps';

var commands = exports.commands = _commands;

var validate = exports.validate = {
  meteor: _validate2.default,
  app: function app(config, utils) {
    if (_typeof(config.meteor) === 'object' || config.app && config.app.type !== 'meteor') {
      // The meteor validator will check the config
      // Or the config is telling a different app to handle deployment
      return [];
    }

    return (0, _validate2.default)(config, utils);
  }
};

function prepareConfig(config) {
  if (!config.app || config.app.type !== 'meteor') {
    return config;
  }

  config.app.docker = (0, _lodash.defaultsDeep)(config.app.docker, {
    image: config.app.dockerImage || 'kadirahq/meteord',
    stopAppDuringPrepareBundle: true
  });

  delete config.app.dockerImage;

  return config;
}

function meteorEnabled(api) {
  var config = api.getConfig();

  return config.app && config.app.type === 'meteor';
}

function onlyMeteorEnabled() {
  for (var _len = arguments.length, commandNames = Array(_len), _key = 0; _key < _len; _key++) {
    commandNames[_key] = arguments[_key];
  }

  return function (api) {
    var index = 0;

    function thenHandler() {
      index += 1;
      if (commandNames.length > index) {
        return api.runCommand(commandNames[index]).then(thenHandler);
      }
    }

    if (meteorEnabled(api)) {
      return api.runCommand(commandNames[index]).then(thenHandler);
    }
  };
}

var hooks = exports.hooks = {
  'post.default.setup': onlyMeteorEnabled('meteor.setup'),
  'post.default.deploy': onlyMeteorEnabled('meteor.deploy'),
  'post.default.start': onlyMeteorEnabled('meteor.start'),
  'post.default.stop': onlyMeteorEnabled('meteor.stop'),
  'post.default.logs': onlyMeteorEnabled('meteor.logs'),
  'post.default.reconfig': onlyMeteorEnabled('meteor.envconfig', 'meteor.start'),
  'post.default.restart': onlyMeteorEnabled('meteor.restart'),
  'post.default.status': onlyMeteorEnabled('meteor.status')
};

function scrubConfig(config, utils) {
  if (config.meteor) {
    delete config.meteor;
  }

  if (config.app) {
    // eslint-disable-next-line
    config.app = (0, _traverse2.default)(config.app).map(function () {
      var path = this.path.join('.');

      switch (path) {
        case 'name':
          return this.update('my-app');
        case 'buildOptions.server':
          return this.update(utils.scrubUrl(this.node));

        case 'env.ROOT_URL':
          return this.update(utils.scrubUrl(this.node));

        case 'env.MONGO_URL':
          if (config.mongo) {
            var url = this.node.split('/');
            url.pop();
            url.push('my-app');

            return this.update(url.join('/'));
          }

          return this.update(utils.scrubUrl(this.node));

        // no default
      }
    });
  }

  return config;
}

function swarmOptions(config) {
  if (config && config.app && config.app.type === 'meteor') {
    return {
      labels: Object.keys(config.app.servers).reduce(function (result, server) {
        result[server] = _defineProperty({}, 'mup-app-' + config.app.name, 'true');

        return result;
      }, {})
    };
  }
}
//# sourceMappingURL=index.js.map