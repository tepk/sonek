'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostsToServer = hostsToServer;
exports.currentManagers = currentManagers;
exports.desiredManagers = desiredManagers;
exports.findNodes = findNodes;
exports.nodeIdsToServer = nodeIdsToServer;
exports.currentLabels = currentLabels;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _swarmOptions = require('./swarm-options');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var log = (0, _debug2.default)('mup:swarm-utils');

function hostsToServer(config, hosts) {
  var servers = config.servers;
  var result = [];

  Object.keys(servers).forEach(function (key) {
    var server = servers[key];

    if (hosts.indexOf(server.host) > -1) {
      result.push(key);
    }
  });

  return result;
}

function currentManagers(config, serverInfo) {
  var hosts = [];

  // TODO: handle managers from multiple clusters.

  Object.keys(serverInfo).forEach(function (key) {
    var server = serverInfo[key];

    if (server.swarm && server.swarm.LocalNodeState !== 'inactive' && server.swarm.Cluster) {
      hosts.push(key);
    }
  });

  var result = hostsToServer(config, hosts);

  log('current managers', result);

  return result;
}

function desiredManagers(config, serverInfo) {
  var _getOptions = (0, _swarmOptions.getOptions)(config),
      managers = _getOptions.managers;

  var servers = Object.keys(config.servers);
  var additionalManagers = 0;

  log('requrested managers', managers);

  // Try to get an odd number of managers
  if (managers.length % 2 === 0 && managers.length < servers.length) {
    additionalManagers = 1;
  }

  // When there are enough servers, make sure there are
  // at least 3 managers, since it can then handle one manager
  // going down
  if (servers.length >= 3 && managers.length < 3) {
    additionalManagers = 3 - managers.length;
  }

  log('additional managers', additionalManagers);

  if (additionalManagers > 0) {
    var current = currentManagers(config, serverInfo);
    var diff = _lodash2.default.difference(current, managers);
    var managersToAdd = diff.splice(0, additionalManagers);

    log('managers to add', managersToAdd);
    additionalManagers -= managersToAdd.length;
    managers.push.apply(managers, _toConsumableArray(managersToAdd));
  }

  if (additionalManagers > 0) {
    var _diff = _lodash2.default.difference(Object.keys(config.servers), managers);
    var _managersToAdd = _diff.splice(0, additionalManagers);
    log('random servers to add', _managersToAdd);
    managers.push.apply(managers, _toConsumableArray(_managersToAdd));
  }

  log('desired managers', managers);

  return managers;
}

function findNodes(config, serverInfo) {
  var nodes = [];
  var managers = currentManagers(config, serverInfo);

  if (managers.length === 0) {
    return nodes;
  }

  // TODO: handle nodes that aren't listed in the config.server
  // TODO: handle multiple clusters

  var manager = config.servers[managers[0]].host;
  var ids = Object.keys(serverInfo).reduce(function (result, host) {
    if (serverInfo[host].swarm) {
      var id = serverInfo[host].swarm.NodeID;
      result[id] = host;
    }

    return result;
  }, {});

  var nodeHosts = serverInfo[manager].swarmNodes.map(function (node) {
    return ids[node.ID];
  });

  return hostsToServer(config, nodeHosts);
}

function nodeIdsToServer(config, serverInfo) {
  var hostToServer = Object.keys(config.servers).reduce(function (result, key) {
    result[config.servers[key].host] = key;

    return result;
  }, {});

  var allIds = [];
  var result = {};

  Object.keys(serverInfo).forEach(function (host) {
    if (serverInfo[host].swarm) {
      result[serverInfo[host].swarm.NodeID] = hostToServer[host];
    }
    if (serverInfo[host].swarmNodes) {
      var nodes = serverInfo[host].swarmNodes;
      allIds.push.apply(allIds, _toConsumableArray(nodes.map(function (node) {
        return node.ID;
      })));
    }
  });

  allIds.forEach(function (id) {
    if (!(id in result)) {
      // This node isn't listed in config.servers
      result[id] = null;
    }
  });

  return result;
}

function currentLabels(config, info) {
  var result = {};
  var idToHost = nodeIdsToServer(config, info);

  Object.keys(info).forEach(function (host) {
    if (info[host].swarmNodes instanceof Array) {
      info[host].swarmNodes.forEach(function (node) {
        var nodeHost = idToHost[node.ID];

        // Check if it is a server mup has access to
        if (nodeHost === null) {
          return;
        }

        result[nodeHost] = node.Spec.Labels;
      });
    }
  });

  return result;
}
//# sourceMappingURL=swarm-utils.js.map