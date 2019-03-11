"use strict";

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Helper = require("../common/Helper");
const Exit = require("../common/Exit");
const pkg = require("../package.json");

class CNetwork {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _list(token, options) {
        let that = this;

        return new Promise(function(resolve, reject) {
            var filterToApply = "format=full";

            if (options.format) {
                filterToApply = "format=" + options.format;
            }

            if (options.page > 0) {
                filterToApply += "&offset=";
                if (options.page > 1) {
                    filterToApply += options.limit * (options.page - 1);
                } else {
                    filterToApply += 0;
                }
            }

            filterToApply += "&limit=" + Math.min(options.limit, 1000);

            NodeSDK.get("/api/rainbow/enduser/v1.0/users/networks?" + filterToApply, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    list(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List contacts in network", null, options);
            }

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
                    return that._list(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json);
                    } else {
                        if (json.total > json.limit) {
                            Message.tablePage(json, options);
                        }
                        Message.lineFeed();
                        Message.tableNetwork(json, options);
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

module.exports = CNetwork;
