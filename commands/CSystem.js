"use strict";

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Helper = require("../common/Helper");
const Exit = require("../common/Exit");

class CSystem {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _createSystem(token, options) {
        return new Promise(function(resolve, reject) {
            var data = {
                name: options.name,
                siteId: options.siteId,
                type: options.type,
                country: options.country,
                pbxMainBundlePrefix: ["0"]
            };

            if (options.pbxId) {
                data.pbxId = options.pbxId;
            }

            NodeSDK.post("/api/rainbow/admin/v1.0/systems", token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getSystem(token, id) {
        return new Promise(function(resolve, reject) {
            NodeSDK.get("/api/rainbow/admin/v1.0/systems/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _deleteSystem(token, id) {
        var that = this;

        return new Promise(function(resolve, reject) {
            NodeSDK.delete("/api/rainbow/admin/v1.0/systems/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getListOfSystems(token, options) {
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

            var opts = "?format=full";

            if (options.name) {
                opts += "&name=" + options.name;
            }

            if (options.siteid) {
                opts += "&siteId=" + options.siteid;
            }

            NodeSDK.get("/api/rainbow/admin/v1.0/systems" + opts + offset + limit, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _linkSystem(token, options) {
        return new Promise(function(resolve, reject) {
            var data = {
                systemId: options.systemid
            };

            NodeSDK.post("/api/rainbow/admin/v1.0/sites/" + options.siteid + "/systems", token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _unlinkSystem(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.delete("/api/rainbow/admin/v1.0/sites/" + options.siteid + "/systems/" + options.systemid, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _updateSystem(token, options) {
        return new Promise(function(resolve, reject) {
            let data = {};

            if (options.isShared) {
                data.isShared = true;
                data.isCentrex = false;
            }

            if (options.isCentrex) {
                data.isShared = false;
                data.isCentrex = true;
            }

            if (options.unshared) {
                data.isShared = false;
            }

            if (options.version) {
                data.version = options.version;
            }

            NodeSDK.put("/api/rainbow/admin/v1.0/systems/" + options.systemid, token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    deleteSystem(id, options) {
        var that = this;

        var doDelete = function(id) {
            Message.action("Delete system", id);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host)
                .then(function() {
                    Message.log("execute action...");
                    return that._deleteSystem(that._prefs.token, id);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);
                    if (options.noOutput) {
                        Message.out(json);
                    } else {
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
        };

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (options.noconfirmation) {
                doDelete(id);
            } else {
                Message.confirm("Are-you sure ? It will remove definitively this system").then(function(confirm) {
                    if (confirm) {
                        doDelete(id);
                    } else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getSystems(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List systems", null, options);
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
                    return that._getListOfSystems(that._prefs.token, options);
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
                        Message.out(json);
                    } else {
                        if (json.total > json.imit) {
                            Message.tablePage(json, options);
                        }
                        Message.lineFeed();
                        Message.tableSystems(json, options);
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

    getSystem(id, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Get informaton for system", id, options);

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
                    return that._getSystem(that._prefs.token, id);
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
    }

    createSystem(options) {
        var that = this;

        function doCreate(options) {
            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host)
                .then(function() {
                    Message.log("execute action...");
                    return that._createSystem(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);
                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.printSuccess("System created with id", json.data.id, options);
                        Message.success(options);
                        Message.log("finished!");
                    }
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        }

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Create new system", options.name, options);

            if (options.interactive) {
                Message.choices("What kind of PBX you want to create ?", Helper.PABX_list).then(function(pbxType) {
                    options.type = pbxType;
                    Message.choices("For which country do you want to create it ?", Helper.country_list).then(function(
                        country
                    ) {
                        options.country = country;
                        doCreate(options);
                    });
                });
            } else {
                doCreate(options);
            }
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    linkSystem(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Link system", options.systemid);

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
                    return that._linkSystem(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);
                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
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

    unlinkSystem(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Unlink system", options.systemid);

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
                    console.log("1");
                    Message.log("execute action...");
                    return that._unlinkSystem(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);
                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
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

    updateSystem(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Update system", options.systemId, options);

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
                    return that._updateSystem(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);
                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
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

module.exports = CSystem;
