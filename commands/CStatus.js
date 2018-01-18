"use strict";

const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

class CStatus {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getAPIStatus(token) {


        let doRequest = (url, name, token) => {
            return new Promise((resolve) => {

                NodeSDK.get(url, token).then(function(json) {
                    resolve({"name": json.description, "version": json.version});
                }).catch((err) => {
                    resolve({"name": name, "version": "Not started"});
                });

            });
        };

        return new Promise(function(resolve, reject) {

            var portals = [];

            Promise.all([
                doRequest('/api/rainbow/authentication/v1.0/about', "Rainbow Authentication portal", token),
                doRequest('/api/rainbow/admin/v1.0/about', "Rainbow Admin portal", token),
                doRequest('/api/rainbow/subscription/v1.0/about', "Rainbow Subscription portal", token),
                doRequest('/api/rainbow/invoicing/v1.0/about', "Rainbow Invoices portal", token),
                doRequest('/api/rainbow/applications/v1.0/about', "Rainbow Applications portal", token),
                doRequest('/api/rainbow/channels/v1.0/about', "Rainbow Channels portal", token),
                doRequest('/api/rainbow/enduser/v1.0/about', "Rainbow End user portal", token),
                doRequest('/api/rainbow/filestorage/v1.0/about', "Rainbow File-storage portal", token),
                doRequest('/api/rainbow/metrics/v1.0/about', "Rainbow Metrics portal", token),
                doRequest('/api/rainbow/calendar/v1.0/about', "Rainbow Calendar portal", token),
                doRequest('/api/rainbow/telephony/v1.0/about', "Rainbow Telephony portal", token),
                doRequest('/api/rainbow/massprovisioning/v1.0/about', "Rainbow Mass-provisioning portal", token)
            ]).then((portals) => {
                resolve(portals);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    getStatus(options) {
        var that = this;
        
        Message.welcome(options);
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("API status information for host " + this._prefs.host);
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.log("execute action...");
                return that._getAPIStatus(that._prefs.token);
            }).then(function(json) {

                Message.unspin(spin);
                Message.log("action done...", json); 
                
                if(options.noOutput) {
                    Message.out(json);
                }
                else {
                    Message.lineFeed();
                    Message.tableAPI(json, options);
                }
                Message.log("finished!");

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