"use strict";

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Exit = require("../common/Exit");

class COrganization {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _createOrganization(token, name, option) {
        return new Promise(function(resolve, reject) {
            var data = {
                name: name,
                visibility: option.public ? "public" : "private"
            };

            NodeSDK.post("/api/rainbow/admin/v1.0/organisations", token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getOrganization(token, id) {
        var that = this;

        return new Promise(function(resolve, reject) {
            if (!id) {
                id = that._prefs.user.organisationId;
            }

            NodeSDK.get("/api/rainbow/admin/v1.0/organisations/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _deleteOrganization(token, id) {
        var that = this;

        return new Promise(function(resolve, reject) {
            NodeSDK.delete("/api/rainbow/admin/v1.0/organisations/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
            resolve();
        });
    }

    _getListOfOrganizations(token, options) {
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

            NodeSDK.get("/api/rainbow/admin/v1.0/organisations?format=full" + offset + limit, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    deleteOrganization(id, options) {
        var that = this;

        var doDelete = function(id) {
            Message.action("Delete organization", id.yellow);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host)
                .then(function() {
                    Message.log("execute action...");
                    return that._deleteOrganization(that._prefs.token, id);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);
                    Message.lineFeed();
                    Message.success(options);
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        };

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (options.noconfirmation) {
                doDelete(id);
            } else {
                Message.confirm("Are-you sure ? It will unlink existing linked companies").then(function(confirm) {
                    if (confirm) {
                        doDelete(id);
                    } else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
            Message.log("finished!");
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getOrganizations(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List organizations", null, options);
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
                    return that._getListOfOrganizations(that._prefs.token, options);
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
                        Message.tableOrganizations(json, options);
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

    getOrganization(id, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Get informaton for organization", id, options);

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
                    return that._getOrganization(that._prefs.token, id);
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

    createOrganization(name, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Create new organization", name, options);

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
                    return that._createOrganization(that._prefs.token, name, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Organization created with Id", json.data.id, options);
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

module.exports = COrganization;
