"use strict";
const fs = require("fs");

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Exit = require("../common/Exit");
const moment = require("moment");
const timezone = require("moment-timezone");
const Helper = require("../common/Helper");

class CBotsService {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _getBotServices(token, options) {
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

            if (options.cid) {
                filterToApply += "&companyId=" + options.cid;
            }

            NodeSDK.get("/api/rainbow/admin/v1.0/bots?" + filterToApply, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getBotService(token, options) {
        return new Promise(function(resolve, reject) {
            let serviceid = options.serviceid;
            let filterToApply = "";

            if (options.cid) {
                filterToApply = "?companyId=" + options.cid;
            }

            NodeSDK.get("/api/rainbow/admin/v1.0/bots/" + serviceid + filterToApply, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    getBotServices(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

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
                    return that._getBotServices(that._prefs.token, options, that._prefs);
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
                        Message.tableBotServices(json, options);
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

    getBotService(options) {
        var that = this;

        try {
            Message.welcome(options);

            if (this._prefs.token && this._prefs.user) {
                Message.loggedin(this._prefs, options);
                Message.action("Get a bot service data ", options.serviceid, options);

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
                        return that._getBotService(that._prefs.token, options);
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
        } catch (err) {
            Message.error(err, options);
            Exit.error();
        }
    }
}

module.exports = CBotsService;