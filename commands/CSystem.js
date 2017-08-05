"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

const csv = require('csv');
const fs = require('fs');

const pkg = require('../package.json');
const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Tools = require('../common/Tools');
const Message = require('../common/Message');
const Helper = require('../common/Helper');
const Exit = require('../common/Exit');

class CSystem {

    constructor(prefs) {
        this._prefs = prefs;
    }
    
    _createSystem(token, name, siteId, pbxType, country) {

        return new Promise(function(resolve, reject) {

            var data = {
                name: name,
                siteId: siteId,
                type: pbxType,
                country: country,
                pbxMainBundlePrefix: ["0"]
            };

            NodeSDK.post('/api/rainbow/admin/v1.0/systems', token, data).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }
    
    _getSystem(token, id) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/admin/v1.0/systems/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _deleteSystem(token, id) {

        var that = this;

        return new Promise(function(resolve, reject) {
            NodeSDK.delete('/api/rainbow/admin/v1.0/systems/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
            resolve();
        });
    }

    _getListOfSystems(token, options) {

        return new Promise(function(resolve, reject) {

            var offset = "";
            if(options.page > 0) {
                offset = "&offset=";
                if(options.page > 1) {
                    offset += (options.limit * (options.page - 1));
                }
                else {
                    offset +=0;
                }
            }

            var limit = "&limit=" + Math.min(options.limit, 1000);

            if(options.siteid) {
                NodeSDK.get('/api/rainbow/admin/v1.0/sites/' + options.siteid + '/systems?format=full' + offset + limit, token).then(function(json) {
                    resolve(json);
                }).catch(function(err) {
                    reject(err);
                });
            }
            else {
                NodeSDK.get('/api/rainbow/admin/v1.0/systems?format=full' + offset + limit, token).then(function(json) {
                    resolve(json);
                }).catch(function(err) {
                    reject(err);
                });
            }
        });
    }

    _linkSystem(token, systemid, siteid) {

        return new Promise(function(resolve, reject) {

            var data = {
                systemId: systemid
            };

            NodeSDK.post('/api/rainbow/admin/v1.0/sites/' + siteid + "/systems", token, data).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _unlinkSystem(token, systemid, siteid) {

        return new Promise(function(resolve, reject) {

            NodeSDK.delete('/api/rainbow/admin/v1.0/sites/' + siteid + "/systems/" + systemid, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    deleteSystem(id, options) {
        var that = this;

        var doDelete = function(id) {
            Message.action("Delete system", id);
            
            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                return that._deleteSystem(that._prefs.token, id);
            }).then(function(json) {
                Message.unspin(spin);
                Message.lineFeed();
                Message.success(options);
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);

            if(options.noconfirmation) {
                doDelete(id);
            }
            else {
                Message.confirm('Are-you sure ? It will remove definitively this system').then(function(confirm) {
                    if(confirm) {
                        doDelete(id);
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

    getSystems(options) {
        var that = this;

        Message.welcome(options);
        
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);

            if(!options.csv) {
                Message.action("List systems", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._getListOfSystems(that._prefs.token, options);
            }).then(function(json) {

                Message.unspin(spin);

                if(options.csv) {
                    Message.csv(options.csv, json.data).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else if(options.noOutput) {
                    Message.out(json.data);
                }
                else {

                    if(json.total > json.imit) {
                        Message.tablePage(json, options);
                    }
                    Message.lineFeed();
                    Message.tableSystems(json, options);
                }

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

    getSystem(id, options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
        
            Message.action("Get informaton for system", id, options);

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._getSystem(that._prefs.token, id);
            }).then(function(json) {

                Message.unspin(spin);
                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.table2D(json.data);
                    Message.lineFeed();
                    Message.success(options);
                }
                
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

    createSystem(name, siteId, options) {
        var that = this;

        function doCreate(pbxType, country) {
            
            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                return that._createSystem(that._prefs.token, name, siteId, pbxType, country, options);
            }).then(function(json) {
                Message.unspin(spin);
                Message.printSuccess('System created with id', json.data.id, options);    
                Message.success(options);
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
        
            Message.action("Create new system", name);

             Message.choices('What kind of PBX you want to create ?', Helper.PABX_list).then(function(pbxType) {
                    
                Message.choices('For which country do you want to create it ?', Helper.country_list).then(function(country) {
                    doCreate(pbxType, country);
                });

            });
            
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    linkSystem(systemid, siteid, options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
            
            Message.action("Link system", systemid);

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._linkSystem(that._prefs.token, systemid, siteid, options);
            }).then(function(json) {
                Message.unspin(spin);
                Message.lineFeed();
                Message.success(options);
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

    unlinkSystem(systemid, siteid, options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
            Message.action("Unlink system", systemid);

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._unlinkSystem(that._prefs.token, systemid, siteid, options);
            }).then(function(json) {
                Message.unspin(spin);
                Message.lineFeed();
                Message.success(options);
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
}

module.exports = CSystem;