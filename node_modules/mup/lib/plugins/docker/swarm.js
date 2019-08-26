'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.initSwarm = initSwarm;
exports.promoteNodes = promoteNodes;
exports.removeManagers = removeManagers;
exports.joinNodes = joinNodes;
exports.diffLabels = diffLabels;
exports.updateLabels = updateLabels;

var _nodemiral = require('nodemiral');

var _nodemiral2 = _interopRequireDefault(_nodemiral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initSwarm(managers, host, api) {
  var list = _nodemiral2.default.taskList('Setting Up Docker Swarm');
  var sessions = api.getSessionsForServers(managers);

  list.executeScript('Creating Manager', {
    script: api.resolvePath(__dirname, 'assets/init-swarm.sh'),
    vars: {
      host: host
    }
  });

  return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
}

function promoteNodes(manager, nodeIds, api) {
  var list = _nodemiral2.default.taskList('Promoting Nodes to Managers');
  var sessions = api.getSessionsForServers([manager]);

  list.executeScript('Promoting Node', {
    script: api.resolvePath(__dirname, 'assets/swarm-promote.sh'),
    vars: {
      nodeIds: nodeIds
    }
  });

  return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
}

function removeManagers(managers, api) {
  var list = _nodemiral2.default.taskList('Removing Swarm Managers');
  var sessions = api.getSessionsForServers(managers);

  list.executeScript('Removing Managers', {
    scripts: api.resolvePath(__dirname, 'assets/swarm-leave.sh')
  });

  return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
}

function joinNodes(servers, token, managerIP, api) {
  var list = _nodemiral2.default.taskList('Add Swarm Nodes');
  var sessions = api.getSessionsForServers(servers);

  list.executeScript('Joining node', {
    script: api.resolvePath(__dirname, 'assets/swarm-join.sh'),
    vars: {
      token: token,
      managerIP: managerIP
    }
  });

  return api.runTaskList(list, sessions, { verbose: api.getVerbose() });
}

function diffLabels(currentLabels, desiredLabels) {
  var toRemove = [];
  var toAdd = [];

  // check for labels to add or update
  Object.keys(desiredLabels).forEach(function (server) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.entries(desiredLabels[server])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            label = _step$value[0],
            value = _step$value[1];

        if (!currentLabels[server] || currentLabels[server][label] !== value) {
          toAdd.push({ server: server, label: label, value: value });
        }
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

  // check for labels no longer used
  Object.keys(currentLabels).forEach(function (server) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = Object.entries(currentLabels[server])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = _slicedToArray(_step2.value, 1),
            label = _step2$value[0];

        if (!desiredLabels[server] || !(label in desiredLabels[server])) {
          toRemove.push({ server: server, label: label });
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });

  return { toRemove: toRemove, toAdd: toAdd };
}

function updateLabels(api, manager, toAdd, toRemove) {
  var list = _nodemiral2.default.taskList('Update Swarm Labels');
  var session = api.getSessionsForServers([manager]);

  list.executeScript('Update Labels', {
    script: api.resolvePath(__dirname, 'assets/swarm-labels.sh'),
    vars: {
      toAdd: toAdd,
      toRemove: toRemove
    }
  });

  return api.runTaskList(list, session, { verbose: api.getVerbose() });
}
//# sourceMappingURL=swarm.js.map