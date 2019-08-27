'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAppStarted = checkAppStarted;
exports.addStartAppTask = addStartAppTask;
exports.prepareBundleSupported = prepareBundleSupported;
function checkAppStarted(list, api) {
  var script = api.resolvePath(__dirname, 'assets/meteor-deploy-check.sh');

  var _api$getConfig = api.getConfig(),
      app = _api$getConfig.app;

  var publishedPort = app.docker.imagePort || 80;

  list.executeScript('Verifying Deployment', {
    script: script,
    vars: {
      deployCheckWaitTime: app.deployCheckWaitTime || 60,
      appName: app.name,
      deployCheckPort: publishedPort
    }
  });

  return list;
}

function addStartAppTask(list, api) {
  var appConfig = api.getConfig().app;
  var isDeploy = api.commandHistory.find(function (_ref) {
    var name = _ref.name;
    return name === 'meteor.deploy';
  });

  list.executeScript('Start Meteor', {
    script: api.resolvePath(__dirname, 'assets/meteor-start.sh'),
    vars: {
      appName: appConfig.name,
      removeImage: isDeploy && !prepareBundleSupported(appConfig.docker)
    }
  });

  return list;
}

function prepareBundleSupported(dockerConfig) {
  var supportedImages = ['abernix/meteord', 'zodern/meteor'];

  if ('prepareBundle' in dockerConfig) {
    return dockerConfig.prepareBundle;
  }

  return supportedImages.find(function (supportedImage) {
    return dockerConfig.image.indexOf(supportedImage) === 0;
  }) || false;
}
//# sourceMappingURL=utils.js.map