'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config, _ref) {
  var combineErrorDetails = _ref.combineErrorDetails,
      serversExist = _ref.serversExist,
      addLocation = _ref.addLocation,
      VALIDATE_OPTIONS = _ref.VALIDATE_OPTIONS;

  var origionalConfig = config._origionalConfig;
  var details = [];

  var validationErrors = _joi2.default.validate(config.mongo, schema, VALIDATE_OPTIONS);
  details = combineErrorDetails(details, validationErrors);
  details = combineErrorDetails(details, serversExist(config.servers, config.mongo.servers));
  details = combineErrorDetails(details, externalMongoUrl(origionalConfig.app || origionalConfig.meteor));

  return addLocation(details, 'mongo');
};

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _joi2.default.object().keys({
  // TODO: mongo.oplog and mongo.port is unused,
  // but was part of the example config.
  // decide what to do with it
  oplog: _joi2.default.bool(),
  port: _joi2.default.number(),
  version: _joi2.default.string(),
  servers: _joi2.default.object().keys().required()
});

function externalMongoUrl(appConfig) {
  var result = [];

  if (!appConfig || !appConfig.env || !appConfig.env.MONGO_URL) {
    return result;
  }

  var mongoUrl = appConfig.env.MONGO_URL;

  // Detect IP Addresses and domain names
  var periodExists = mongoUrl.indexOf('.') > -1;
  // Detect username:password@domain.com
  var atExists = mongoUrl.indexOf('@') > -1;

  if (periodExists || atExists) {
    result.push({
      message: 'It looks like app.env.MONGO_URL is for an external database. Remove the `mongo` object to use external databases.',
      path: ''
    });
  }

  return result;
}
//# sourceMappingURL=validate.js.map