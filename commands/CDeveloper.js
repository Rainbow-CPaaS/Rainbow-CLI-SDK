"use strict";

const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

class CDeveloper {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getPayments(token, options, prefs) {

        let that = this;

        return new Promise(function (resolve, reject) {

            var filterToApply = "format=full";

            var id = prefs.user.id;
            if (options.id) {
                id = options.id;
            }

            NodeSDK.get('/api/rainbow/subscription/v1.0/developers/' + id + '/accounts?' + filterToApply, token).then(function (json) {
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    _getMethods(token, options, prefs) {

        let that = this;

        return new Promise(function (resolve, reject) {

            var id = prefs.user.id;
            if (options.id) {
                id = options.id;
            }

            NodeSDK.get('/api/rainbow/subscription/v1.0/developers/' + id + '/payments/methods', token).then(function (json) {
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    _getMethod(token, options, prefs) {

        let that = this;

        return new Promise(function (resolve, reject) {

            var id = prefs.user.id;
            if (options.id) {
                id = options.id;
            }

            NodeSDK.get('/api/rainbow/subscription/v1.0/developers/' + id + '/payments/methods', token).then(function (json) {

                let method = json.data.find((existingMethod) => {
                    return (existingMethod.Id === options.methodid);
                });

                resolve(method);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    _getSubscriptions(token, options, prefs) {

        let that = this;

        return new Promise(function (resolve, reject) {

            var id = prefs.user.id;
            if (options.id) {
                id = options.id;
            }

            NodeSDK.get('/api/rainbow/subscription/v1.0/developers/' + id + '/subscriptions', token).then(function (json) {
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    _getInvoices(token, options, prefs) {

        let that = this;

        return new Promise(function (resolve, reject) {

            var id = prefs.user.id;
            if (options.id) {
                id = options.id;
            }

            NodeSDK.get('/api/rainbow/subscription/v1.0/developers/' + id + '/invoices', token).then(function (json) {
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    _deletePayment(token, options, prefs) {

        var id = prefs.user.id;
        if (options.id) {
            id = options.id;
        }

        return new Promise(function (resolve, reject) {
            NodeSDK.put('/api/rainbow/subscription/v1.0/developers/' + id + '/accounts/cancel', token, null).then(function (json) {
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    _deleteMethod(token, options, prefs) {

        var id = prefs.user.id;
        if (options.id) {
            id = options.id;
        }

        return new Promise(function (resolve, reject) {
            NodeSDK.delete('/api/rainbow/subscription/v1.0/developers/' + id + '/payments/methods/' + options.methodid, token).then(function (json) {
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    _addRole(token, options) {
        return new Promise(function (resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/developers/' + options.userId + '/addRole?role=' + options.role, token, {})
            .then(function (json) {
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    _removeRole(token, options) {
        return new Promise(function (resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/developers/' + options.userId + '/removeRole?role=' + options.role, token, {})
            .then(function (json) {
                resolve(json);
            }).catch(function (err) {
                reject(err);
            });
        });
    }

    getPayments(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List payment for user ", options.id, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function () {
                Message.log("execute action...");
                return that._getPayments(that._prefs.token, options, that._prefs);
            }).then(function (json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if (options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.table2D(json.data);
                    Message.lineFeed();
                    Message.success(options);
                }
                Message.log("finished!");

            }).catch(function (err) {
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

    getMethods(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List payment methods for user ", options.id, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function () {
                Message.log("execute action...");
                return that._getMethods(that._prefs.token, options, that._prefs);
            }).then(function (json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if (options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.tableMethods(json, options);
                    Message.lineFeed();
                    Message.success(options);
                }
                Message.log("finished!");

            }).catch(function (err) {
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

    getMethod(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List information of payment method ", options.methodid, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function () {
                Message.log("execute action...");
                return that._getMethod(that._prefs.token, options, that._prefs);
            }).then(function (json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if (options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.table2D(json, options);
                    Message.lineFeed();
                    Message.success(options);
                }
                Message.log("finished!");

            }).catch(function (err) {
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

    getSubscriptions(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List subscriptions for user ", options.id, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function () {
                Message.log("execute action...");
                return that._getSubscriptions(that._prefs.token, options, that._prefs);
            }).then(function (json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if (options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.tableSubscriptions(json, options);
                    Message.lineFeed();
                    Message.success(options);
                }
                Message.log("finished!");

            }).catch(function (err) {
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

    deletePayment(options) {
        var that = this;

        var doDelete = function (options) {
            Message.action("Delete payment", options.id, options);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function () {
                Message.log("execute action...");
                return that._deletePayment(that._prefs.token, options, that._prefs);
            }).then(function (json) {
                Message.unspin(spin);
                Message.log("action done...", json);
                Message.lineFeed();
                Message.success(options);
                Message.log("finished!");
            }).catch(function (err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (options.noconfirmation) {
                doDelete(options);
            }
            else {
                Message.confirm('Are-you sure ? It will remove it completely').then(function (confirm) {
                    if (confirm) {
                        doDelete(options);
                    }
                    else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    deleteMethod(options) {
        var that = this;

        var doDelete = function (options) {
            Message.action("Delete payment method", options.methodid, options);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function () {
                Message.log("execute action...");
                return that._deleteMethod(that._prefs.token, options, that._prefs);
            }).then(function (json) {
                Message.unspin(spin);
                Message.log("action done...", json);
                Message.lineFeed();
                Message.success(options);
                Message.log("finished!");
            }).catch(function (err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (options.noconfirmation) {
                doDelete(options);
            }
            else {
                Message.confirm('Are-you sure ? It will remove it completely').then(function (confirm) {
                    if (confirm) {
                        doDelete(options);
                    }
                    else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getInvoices(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List invoices for user ", options.id, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function () {
                Message.log("execute action...");
                return that._getInvoices(that._prefs.token, options, that._prefs);
            }).then(function (json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if (options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.tableInvoicesDeveloper(json, options);
                    Message.lineFeed();
                    Message.success(options);
                }
                Message.log("finished!");

            }).catch(function (err) {
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

    addRole(options) {
        var that = this;

        Message.action("Add a developer's role to developer with id", options.userId, options);

        let spin = Message.spin(options);
        NodeSDK.start(
            that._prefs.email, 
            that._prefs.password, 
            that._prefs.host,
            that._prefs.proxy,
            that._prefs.appid,
            that._prefs.appsecret
        ).then(function () {
            Message.log("execute action...");
            return that._addRole(that._prefs.token, options);
        }).then(function (json) {
            Message.unspin(spin);
            Message.log("action done...", json);
            Message.lineFeed();
            Message.success(options);
            Message.log("finished!");
        }).catch(function (err) {
            Message.unspin(spin);
            Message.error(err, options);
            Exit.error();
        });
    }

    removeRole(options) {
        var that = this;

        Message.action("Remove a developer's role to developer with id", options.userId, options);

        let spin = Message.spin(options);
        NodeSDK.start(
            that._prefs.email, 
            that._prefs.password, 
            that._prefs.host,
            that._prefs.proxy,
            that._prefs.appid,
            that._prefs.appsecret
        ).then(function () {
            Message.log("execute action...");
            return that._removeRole(that._prefs.token, options);
        }).then(function (json) {
            Message.unspin(spin);
            Message.log("action done...", json);
            Message.lineFeed();
            Message.success(options);
            Message.log("finished!");
        }).catch(function (err) {
            Message.unspin(spin);
            Message.error(err, options);
            Exit.error();
        });
    }
}

module.exports = CDeveloper;