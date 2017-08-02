"use strict";

const NodeSDK   = require('rainbow-node-sdk');

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

    start(login, password, platform) {

        var that = this;
    
        return new Promise(function(resolve, reject) {

            config.credentials.login = login;
            config.credentials.password = password;
            config.rainbow.host = platform;

            that._nodeSDK = new NodeSDK(config);
        
            that._nodeSDK.events.once('rainbow_onerror', function(jsonMessage) {
                reject();
            });

            that._nodeSDK.startCLI().then(function() {
            }).then(function() {
            resolve();
            }).catch(function(err) {
                reject(err);
            });
        });
    } 

    signin(login, password) {

        var that = this;

        return new Promise(function(resolve, reject) {

            that._nodeSDK.signinCLI().then(function(json) {
                resolve(json);
            }).catch(function(err) {
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

    post(url, token, data) {
        var that = this;

        return new Promise(function(resolve, reject) {

            that._nodeSDK.rest.post(url, token, data).then(function(json) {
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