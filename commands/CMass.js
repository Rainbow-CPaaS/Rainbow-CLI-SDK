"use strict";

const csv = require('csv');
const fs = require('fs');

const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

class CMass {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getTemplate(token, options) {

        let filterToApply = "?mode=" + options.type;

        return new Promise((resolve, reject) => {
            NodeSDK.get('/api/rainbow/massprovisioning/v1.0/users/template' + filterToApply, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _check(token, options) {
        
        let filterToApply = "";

        return new Promise((resolve, reject) => {

            fs.readFile(options.file, 'utf8', (err, data) => {

                let string = data;
                if (err) {
                    reject(err);
                } else {
                    NodeSDK.post('/api/rainbow/massprovisioning/v1.0/users/imports/check' + filterToApply, token, string, "text/csv").then(function(json) {
                        resolve(json);
                    }).catch(function(err) {
                        reject(err);
                    });
                }
            });
        });
    }

    _status(token, options) {
        
        let filterToApply = "";

        return new Promise((resolve, reject) => {

            NodeSDK.get('/api/rainbow/massprovisioning/v1.0/users/imports/' + options.reqid + '/details' + filterToApply, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _statusCompany(token, options) {
        
        let filterToApply = "";

        if(options.companyId) {
            filterToApply += "&companyId=" + options.companyId;
        }

        return new Promise((resolve, reject) => {

            NodeSDK.get('/api/rainbow/massprovisioning/v1.0/users/imports' + filterToApply, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _import(token, options) {
        
        let filterToApply = "";

        return new Promise((resolve, reject) => {

            fs.readFile(options.file, 'utf8', (err, data) => {

                let string = data;
                if (err) {
                    reject(err);
                } else {
                    NodeSDK.post('/api/rainbow/massprovisioning/v1.0/users/imports' + filterToApply, token, string, "text/csv").then(function(json) {
                        resolve(json);
                    }).catch(function(err) {
                        reject(err);
                    });
                }
            });
        });
    }

    _deleteStatus(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.delete('/api/rainbow/massprovisioning/v1.0/users/imports/' + options.reqid + '/details', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    template(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("Retrieve mass-provisioning template for <" + options.type + ">", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._getTemplate(that._prefs.token, options, that._prefs);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.csv) {
                    Message.csv(options.csv, json, true).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
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

    check(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("check mass-provisioning file", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._check(that._prefs.token, options, that._prefs);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                Message.lineFeed();
                Message.table2D(json.data.actions);
                Message.lineFeed();
                Message.success(options);

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

    status(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("status mass-provisioning file", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._status(that._prefs.token, options, that._prefs);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                Message.lineFeed();
                Message.table2D(json.data);
                Message.lineFeed();
                Message.success(options);

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

    statusCompany(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("status mass-provisioning company", options.companyId, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._statusCompany(that._prefs.token, options, that._prefs);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                Message.lineFeed();
                Message.tableImports(json.data, options);
                Message.lineFeed();
                Message.success(options);

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

    import(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("import mass-provisioning file", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._import(that._prefs.token, options, that._prefs);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                Message.lineFeed();
                Message.table2D(json.data);
                Message.lineFeed();
                Message.success(options);

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

    deleteStatus(options) {
        var that = this;

        var doDelete = function(options) {
            Message.action("Delete status", options.reqid, options);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                Message.log("execute action...");
                return that._deleteStatus(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);
                Message.log("action done...", json);
                Message.lineFeed();
                Message.success(options);
                Message.log("finished!");
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        
        Message.welcome(options);
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(options.noconfirmation) {
                doDelete(options);
            }
            else {
                Message.confirm('Are-you sure ? It will remove it completely').then(function(confirm) {
                    if(confirm) {
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
}

module.exports = CMass;