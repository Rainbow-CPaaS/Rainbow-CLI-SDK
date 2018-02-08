"use strict";

const NodeSDK   = require('rainbow-node-sdk');
const Logger    = require('./Logger');

const LOG_ID = 'PRINT - ';

const config = {
  rainbow: {
      "host": "sandbox",
      "mode": "cli"
  },
  credentials: {
      "login": "",
      "password": ""
  },
  application: {
    "appID": "595a9fed159edbaee3aa4f88",
    "appSecret": "bUjJn7MEBY3uLTjP62ttHHYj"
  },
  proxy: {
    host: "",
    port: 80,
    protocol: 'http'
  },
  logs: {
      enableConsoleLogs: false,
      enableFileLogs: false,
      file: {
        path: '/var/tmp/rainbowsdk/',
        level: 'debug'
      }
  },
  im: {
      sendReadReceipt: false  //false to not send a read receipt automatically
  }
};

class SDK {

    constructor() {
        this.nodeSDK = null;
    }

    start(login, password, platform, proxy) {

        var that = this;
    
        return new Promise(function(resolve, reject) {

            Logger.logs("CLI/SDK - (start) use account", login);

            config.credentials.login = login;
            config.credentials.password = password;
            config.rainbow.host = platform;

            if(proxy) {
                config.proxy = proxy;
            }

            config.logs.enableConsoleLogs = Logger.isActive;

            that._nodeSDK = new NodeSDK(config);
        
            that._nodeSDK.events.once('rainbow_onerror', function(jsonMessage) {
                reject();
            });

            Logger.logs("CLI/SDK - (start) call startCLI");
            that._nodeSDK.startCLI().then(function() {
                Logger.logs("CLI/SDK - (start) call startCLI successfull");
                resolve();
            }).catch(function(err) {
                Logger.error("CLI/SDK - (start) call startCLI error", err);
                reject(err);
            });
        });
    } 

    signin() {

        var that = this;

        Logger.logs("CLI/SDK - (signin)");

        return new Promise(function(resolve, reject) {
            Logger.logs("CLI/SDK - (signin) call startCLI");
            that._nodeSDK.signinCLI().then(function(json) {
                Logger.logs("CLI/SDK - (signin) call startCLI successfull");
                resolve(json);
            }).catch(function(err) {
                Logger.error("CLI/SDK - (signin) call startCLI error", err);
                reject(err);
            });
        });  
    } 

    get(url, token) {
        var that = this;

        return new Promise(function(resolve, reject) {

            that._nodeSDK.rest.get(url, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    post(url, token, data, contentType) {
        var that = this;

        return new Promise(function(resolve, reject) {

            that._nodeSDK.rest.post(url, token, data, contentType).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    put(url, token, data) {
        var that = this;

        return new Promise(function(resolve, reject) {

            that._nodeSDK.rest.put(url, token, data).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    delete(url, token, data) {
        var that = this;

        return new Promise(function(resolve, reject) {

            that._nodeSDK.rest.delete(url, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }
}

module.exports = new SDK();