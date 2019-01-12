"use strict";

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Exit = require("../common/Exit");

class CPhone {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _getPhone(token, id, systemid) {
        return new Promise(function(resolve, reject) {
            NodeSDK.get("/api/rainbow/admin/v1.0/systems/" + systemid + "/phone-numbers/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getListOfPhones(token, systemid, options) {
        return new Promise(function(resolve, reject) {
            var offset = "";
            if (options.page > 0) {
                offset = "&offset=";
                if (options.page > 1) {
                    offset += options.limit * (options.page - 1);
                } else {
                    offset += 0;
                }
            }

            var limit = "&limit=" + Math.min(options.limit, 1000);

            NodeSDK.get(
                "/api/rainbow/admin/v1.0/systems/" + systemid + "/phone-numbers?format=full" + offset + limit,
                token
            )
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    getPhones(systemid, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List phones", null, options);
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
                    return that._getListOfPhones(that._prefs.token, systemid, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.csv) {
                        Message.csv(options.csv, json.data, false)
                            .then(() => {})
                            .catch(err => {
                                Exit.error();
                            });
                    } else if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        if (json.total > json.limit) {
                            Message.tablePage(json, options);
                        }
                        Message.lineFeed();
                        Message.tablePhones(json, options);
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

    getPhone(id, systemid, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Get informaton for phone", id);

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
                    return that._getPhone(that._prefs.token, id, systemid);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.table2D(json.data);
                        Message.lineFeed();
                        Message.success(options);
                        Message.log("finished!");
                    }
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

module.exports = CPhone;
