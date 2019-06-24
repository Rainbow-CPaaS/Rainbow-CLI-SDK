"use strict";

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Exit = require("../common/Exit");

class CUser {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _getUsers(token, options) {
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

            if (options.companyId) {
                filterToApply += "&companyId=" + options.companyId;
            } else {
                if (that._prefs.user.adminType === "company_admin") {
                    // Limit company_admin to only their company (sandbox)
                    filterToApply += "&companyId=" + that._prefs.user.companyId;
                } else if (that._prefs.user.adminType === "organization_admin") {
                    // Limit organization_admin to only their organization (sandbox)
                    filterToApply += "&organisationId=" + that._prefs.user.organisationId;
                }
            }

            if (options.name) {
                filterToApply += "&displayName=" + encodeURIComponent(options.name);
            }

            if (options.company) {
                filterToApply += "&companyName=" + encodeURIComponent(options.company);
            }

            if (options.email) {
                filterToApply += "&loginEmail=" + encodeURIComponent(options.email);
            }

            if (options.onlyTerminated) {
                filterToApply += "&isTerminated=true";
            } else {
                filterToApply += "&isTerminated=false";
            }

            if (options.role) {
                filterToApply += "&roles=" + options.role;
            }

            NodeSDK.get("/api/rainbow/admin/v1.0/users?" + filterToApply, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _create(token, data) {
        return new Promise(function(resolve, reject) {
            NodeSDK.post("/api/rainbow/admin/v1.0/users", token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _join(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.post(`/api/rainbow/admin/v1.0/users/${options.id}/networks`, token, {
                users: [options.userToAddId],
                presence: options.presence
            })
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _changedata(token, id, data) {
        return new Promise(function(resolve, reject) {
            NodeSDK.put("/api/rainbow/admin/v1.0/users/" + id, token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _delete(token, id) {
        return new Promise(function(resolve, reject) {
            NodeSDK.delete("/api/rainbow/admin/v1.0/users/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getUser(token, id) {
        return new Promise(function(resolve, reject) {
            NodeSDK.get("/api/rainbow/admin/v1.0/users/" + id, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _createSimple(token, email, password, firstname, lastname, options) {
        var user = {
            loginEmail: email,
            password: password,
            firstName: firstname,
            lastName: lastname,
            isActive: true,
            isInitialized: false,
            language: "en",
            adminType: "undefined",
            roles: ["user"],
            accountType: "free"
        };

        if (options.companyId) {
            user.companyId = options.companyId;
        }

        if (options.isAdmin) {
            user.roles.push("admin");
            user.adminType = "company_admin";
        }

        if (options.orgId) {
            if (!user.roles.includes("admin")) {
                user.roles.push("admin");
            }
            user.adminType = "organization_admin";
            user.organisationId = options.orgId;
        }

        if (options.public) {
            user.visibility = "public";
        }

        return this._create(token, user);
    }

    getUsers(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List users", null, options);
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
                    return that._getUsers(that._prefs.token, options, that._prefs);
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
                        if (json.total > json.limit) {
                            Message.tablePage(json, options);
                        }
                        Message.lineFeed();
                        Message.tableUsers(json, options);
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

    create(email, password, firstname, lastname, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Create new user", email, options);

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
                    return that._createSimple(that._prefs.token, email, password, firstname, lastname, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("User created with Id", json.data.id, options);
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

    join(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Join for user", options.id, options);

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
                    return that._join(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("User added", options.userToAddId, options);
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

    changepwd(id, password, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Change password of user", id, options);

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
                    return that._changedata(
                        that._prefs.token,
                        id,
                        {
                            password: password
                        },
                        options
                    );
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Password changed for user", json.data.id, options);
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

    changelogin(id, login, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Change login of user", id, options);

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
                    return that._changedata(
                        that._prefs.token,
                        id,
                        {
                            loginEmail: login,
                            isTerminated: false
                        },
                        options
                    );
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Login changed for user", json.data.id, options);
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

    delete(id, options) {
        var that = this;

        var doDelete = function(id) {
            Message.action("Delete user", id, options);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host)
                .then(function() {
                    Message.log("execute action...");
                    return that._delete(that._prefs.token, id);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("User deleted", json.data.id, options);
                        Message.success(options);
                    }
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

    getUser(id, options) {
        var that = this;

        try {
            Message.welcome(options);

            if (this._prefs.token && this._prefs.user) {
                Message.loggedin(this._prefs, options);
                Message.action("Get information for user", id, options);

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
                        return that._getUser(that._prefs.token, id);
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

    blockOrUnblock(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            if (options.toBlock) {
                Message.action("Deactivate user", options.id, options);
            } else {
                Message.action("Activate user", options.id, options);
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
                    return that._changedata(
                        that._prefs.token,
                        options.id,
                        {
                            isActive: !options.toBlock
                        },
                        options
                    );
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        if (options.toBlock) {
                            Message.printSuccess("User has been deactivated", options.id, options);
                        } else {
                            Message.printSuccess("User has been activated", options.id, options);
                        }
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

    initializedOrUninitialize(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            if (options.toInitialize) {
                Message.action("Initialize user", options.id, options);
            } else {
                Message.action("Uninitialize user", options.id, options);
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
                    return that._changedata(
                        that._prefs.token,
                        options.id,
                        {
                            isInitialized: options.toInitialize
                        },
                        options
                    );
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        if (options.toInitialize) {
                            Message.printSuccess("User has been initialized", options.id, options);
                        } else {
                            Message.printSuccess("User has been uninitialized", options.id, options);
                        }
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
}

module.exports = CUser;
