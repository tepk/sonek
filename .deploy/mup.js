module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '192.168.0.5',
      username: 'estp',
      // pem: './path/to/pem'
      password: 'Just4Fun',
      // or neither for authenticate from ssh-agent
      opts: {
        port: 7722
      }
    }

  },

  app: {
    // TODO: change app name and path
    name: 'sonek',
    path: '../',

    servers: {
      one: {
        env: {
          PORT: 7722
        }
      },
    },

    /* buildOptions: {
      serverOnly: true,
    }, */

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'http://192.168.0.5',
      MONGO_URL: 'localhost',
      //MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '2.6.7',
    servers: {
      one: {}
    }
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
