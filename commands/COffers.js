"use strict";

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Exit = require("../common/Exit");
const Helper = require("../common/Helper");
const pkg = require("../package.json");

class COffers {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _getCatalog(token, id) {
        let that = this;

        return new Promise(function(resolve, reject) {
            NodeSDK.get("/api/rainbow/admin/v1.0/catalogs/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _createCatalog(token, name, description) {
        return new Promise(function(resolve, reject) {
            description = description || "";

            NodeSDK.post("/api/rainbow/admin/v1.0/catalogs", token, { name: name, description: description })
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _deleteCatalog(token, id, options) {
        var that = this;

        return new Promise(function(resolve, reject) {
            NodeSDK.delete("/api/rainbow/admin/v1.0/catalogs/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getListOfCatalogs(token, options) {
        var that = this;

        return new Promise(function(resolve, reject) {
            var filterToApply = "";

            if (options.name) {
                filterToApply += "&name=" + encodeURIComponent(options.name);
            }

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

            NodeSDK.get("/api/rainbow/admin/v1.0/catalogs?format=full" + filterToApply + offset + limit, token)
                .then(function(offers) {
                    resolve(offers);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getOffer(token, id) {
        let that = this;

        return new Promise(function(resolve, reject) {
            NodeSDK.get("/api/rainbow/admin/v1.0/offers/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getListOfOffers(token, options) {
        var that = this;

        return new Promise(function(resolve, reject) {
            var filterToApply = "";

            if (options.name) {
                filterToApply += "&name=" + encodeURIComponent(options.name);
            }

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

            NodeSDK.get("/api/rainbow/admin/v1.0/offers?format=full" + filterToApply + offset + limit, token)
                .then(function(offers) {
                    resolve(offers);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    createCatalog(name, description, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Create new catalog", name, options);
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
                    return that._createCatalog(that._prefs.token, name, description);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Catalog created with Id", json.data.id, options);
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

    deleteCatalog(id, options) {
        var that = this;

        var doDelete = function(id) {
            Message.action("Delete catalog", id, options);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host)
                .then(function() {
                    Message.log("execute action...");
                    return that._deleteCatalog(that._prefs.token, id, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    Message.lineFeed();
                    Message.success(options);
                    Message.log("finished!");
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
                Message.confirm("Are-you sure ? It will remove it completely").then(function(confirm) {
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

    getCatalog(id, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Get information for catalog", id, options);

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
                    return that._getCatalog(that._prefs.token, id);
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

    getCatalogs(options) {
        var that = this;

        Message.welcome(options);

        var offers = null;

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List Catalogs:", null, options);
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
                    return that._getListOfOffers(that._prefs.token, options);
                })
                .then(listOfOffers => {
                    offers = listOfOffers.data;
                    return that._getListOfCatalogs(that._prefs.token, options);
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
                        Message.tableCatalogs(json, options, offers);
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

    getOffer(id, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Get information for offer", id, options);

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
                    return that._getOffer(that._prefs.token, id);
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

    getOffers(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List Offers:", null, options);
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
                    return that._getListOfOffers(that._prefs.token, options);
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
                        Message.tableOffers(json, options);
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

module.exports = COffers;
