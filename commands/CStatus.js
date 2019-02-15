"use strict";

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Exit = require("../common/Exit");

class CStatus {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _getAPIStatus(token) {
        let doRequest = (url, name, token) => {
            return new Promise(resolve => {
                NodeSDK.get(url, token)
                    .then(function(json) {
                        resolve({ name: name, version: json.version, description: json.description });
                    })
                    .catch(err => {
                        resolve({ name: name, version: "Not started" });
                    });
            });
        };

        return new Promise(function(resolve, reject) {
            var portals = [];

            Promise.all([
                doRequest("/api/rainbow/admin/v1.0/about", "Rainbow Admin API", token),
                doRequest("/api/rainbow/applications/v1.0/about", "Rainbow Applications API", token),
                doRequest("/api/rainbow/authentication/v1.0/about", "Rainbow Authentication API", token),
                doRequest("/api/rainbow/calendar/v1.0/about", "Rainbow Calendar API", token),
                doRequest("/api/rainbow/channels/v1.0/about", "Rainbow Channels API", token),
                doRequest("/api/rainbow/conference/v1.0/about", "Rainbow Conference API", token),
                doRequest("/api/rainbow/enduser/v1.0/about", "Rainbow End user API", token),
                doRequest("/api/rainbow/filestorage/v1.0/about", "Rainbow File-storage API", token),
                doRequest("/api/rainbow/geolocation/v1.0/about", "Rainbow Geolocation API", token),
                doRequest("/api/rainbow/invoicing/v1.0/about", "Rainbow Invoices API", token),
                doRequest("/api/rainbow/massprovisioning/v1.0/about", "Rainbow Mass-provisioning API", token),
                doRequest("/api/rainbow/metrics/v1.0/about", "Rainbow Metrics API", token),
                doRequest("/api/rainbow/search/v1.0/about", "Rainbow Search API", token),
                doRequest("/api/rainbow/subscription/v1.0/about", "Rainbow Subscription API", token),
                doRequest("/api/rainbow/telephony/v1.0/about", "Rainbow Telephony API", token),
                doRequest("/api/rainbow/mediapillar/v1.0/about", "Rainbow WebRTC Gateway API", token),
                doRequest("/api/rainbow/mediapillarnumbering/v1.0/about", "Rainbow WebRTC Gateway Numbering API", token)
            ])
                .then(portals => {
                    resolve(portals);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    _getPlatformStatus(token) {
        let doRequest = (url, name, token) => {
            return new Promise(resolve => {
                let start = new Date().getTime();

                NodeSDK.get(url, token)
                    .then(function(json) {
                        let rtt = new Date().getTime() - start;
                        let eventLoop = Math.floor(json.data.eventLoopLagMilliseconds * 100);
                        Message.log("Request RTT", rtt);
                        Message.log("Request Event loop", eventLoop);
                        resolve({ name: name, status: json.status, eventloop: eventLoop, rtt: rtt });
                    })
                    .catch(err => {
                        resolve({ name: name, status: "Error" });
                    });
            });
        };

        return new Promise(function(resolve, reject) {
            var portals = [];

            Promise.all([doRequest("/api/rainbow/ping", "Platform status", token)])
                .then(portals => {
                    resolve(portals);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    getStatus(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("API status information for host", this._prefs.host, options);

            let spin = Message.spin(options);
            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._getAPIStatus(that._prefs.token);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json);
                    } else {
                        Message.lineFeed();
                        Message.tableAPI(json, options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getPlatformStatus(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Platform status information for host", this._prefs.host, options);

            let spin = Message.spin(options);
            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._getPlatformStatus(that._prefs.token);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json);
                    } else {
                        Message.lineFeed();
                        Message.tablePlatform(json, options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }
}

module.exports = CStatus;
