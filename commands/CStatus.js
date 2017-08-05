"use strict";

const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

class CStatus {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getAPIStatus(token) {

        return new Promise(function(resolve, reject) {

            var portals = [];

            NodeSDK.get('/api/rainbow/admin/v1.0/about', token).then(function(json) {
                var status = {"name": json.description, "version": json.version};
                portals.push(status);
                return NodeSDK.get('/api/rainbow/applications/v1.0/about', token);
            }).then(function(json) {
                var status = {"name": json.description, "version": json.version};
                portals.push(status);
                return NodeSDK.get('/api/rainbow/authentication/v1.0/about', token);
            }).then(function(json) {
                var status = {"name": json.description, "version": json.version};
                portals.push(status);
                return NodeSDK.get('/api/rainbow/subscription/v1.0/about', token);
            }).then(function(json) {
                var status = {"name": json.description, "version": json.version};
                portals.push(status);
            }).then(function() {
                resolve(portals);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    getStatus(options) {
        var that = this;
        
        Message.welcome(options);
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);

            Message.action("API status information");
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._getAPIStatus(that._prefs.token);
            }).then(function(json) {

                Message.unspin(spin); 
                
                if(options.noOutput) {
                    Message.out(json);
                }
                else {
                    Message.lineFeed();
                    Message.tableAPI(json, options);
                }

            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }
}

module.exports = CStatus;