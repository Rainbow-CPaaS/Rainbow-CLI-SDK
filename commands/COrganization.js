"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

const pkg = require('../package.json');
const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Tools = require('../common/Tools');
const Message = require('../common/Message');

class COrganization {

    constructor(prefs) {
        this._prefs = prefs;
        //this._user = new CUser(this._prefs);
    }

    _createOrganization(token, name, option) {

        return new Promise(function(resolve, reject) {

            var data = {
                name: name,
                visibility: option.public ? "public" : "private"
            };

            NodeSDK.post('/api/rainbow/admin/v1.0/organisations', token, data).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getOrganization(token, id) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/admin/v1.0/organisations/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _deleteOrganization(token, id) {

        var that = this;

        return new Promise(function(resolve, reject) {
            NodeSDK.delete('/api/rainbow/admin/v1.0/organisations/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
            resolve();
        });
    }

    _getListOfOrganizations(token, page, filter) {

        return new Promise(function(resolve, reject) {

            var offset = "";
            if(page > -1) {
                offset = "&offset=";
                if(page > 1) {
                    offset += (25 * (page - 1));
                }
                else {
                    offset +=0;
                }
            }

            var limit = "";
            if(page > -1) {
                limit = "&limit=25";
            }
            else {
                limit = "&limit=1000";
            }

            NodeSDK.get('/api/rainbow/admin/v1.0/organisations?format=full' + offset + limit, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    deleteOrganization(id, options) {
        var that = this;

        var confirmDeleteOrganization = function(id) {
            Screen.print("Request to delete organization".white + " '".yellow + id.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
                return that._deleteOrganization(that._prefs.token, id);
            }).then(function(json) {
                status.stop();
                Screen.print('');
                Screen.success('Organization'.white + " '".yellow + id.yellow + "'".yellow + " has been successfully deleted.".white);
            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);

            if(options.force) {
                confirmDeleteOrganization(id);
            }
            else {
                Message.confirm('Are-you sure ? It will unlink existing linked companies').then(function(confirm) {
                    if(confirm) {
                        confirmDeleteOrganization(id);
                    }
                    else {
                        Message.canceled();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn();
        }
    }

    getOrganizations(page, filter) {
        var that = this;

        Message.welcome();
        
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);

            Screen.print("Current Organizations:".white);
            
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getListOfOrganizations(that._prefs.token, page, filter);
            }).then(function(json) {
                status.stop(); 

                if(json.total > json.limit) {
                    var page = Math.floor(json.offset / json.limit) + 1
                    var totalPage = Math.floor(json.total / json.limit) + 1;
                    
                    Screen.print('Displaying Page '.white + page.toString().yellow + " on ".white + totalPage.toString().yellow);
                }
                Screen.print('');

                var array = [];

                array.push([ "#".gray, "Organization name".gray, "Visibility".gray, "Identifier".gray]);
                array.push([ "-".gray, "-----------------".gray, "----------".gray, "----------".gray]);  

                for (var i = 0; i < json.data.length; i++) {
                    var org = json.data[i];
                    
                    var visibility = "private".white;
                    if(org.visibility === "public") {
                        visibility = "public".yellow;
                    }
                    
                    var number = i+1+json.offset;

                    array.push([ number.toString().white, org.name.cyan, visibility, org.id.white]); 
                }

                var t = table(array);
                Screen.table(t);
                Screen.print('');
                Screen.success(json.total + ' organizations found.');
            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }

    getOrganization(id) {
        var that = this;

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);
        
            Screen.print("Request informaton for organization".white + " '".yellow + id.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getOrganization(that._prefs.token, id);
            }).then(function(json) {

                status.stop();
                Screen.print('');

                var array = [];
                array.push([ "#".gray, "Attribute".gray, "Value".gray]);
                array.push([ "-".gray, "---------".gray, "-----".gray]);  
                var index = 1;
                for (var key in json.data) {
                    var data = json.data[key];
                    if(data === null) {
                        array.push([ index.toString().white, key.toString().cyan, 'null'.white ]);  
                    } 
                    else if(typeof data === "string" && data.length === 0) {
                        array.push([  index.toString().white, key.toString().cyan, "''".white ]);  
                    }
                    else if(Tools.isArray(data) && data.length === 0) {
                        array.push([  index.toString().white, key.toString().cyan, "[ ]".white ]);  
                    }
                    else if((Tools.isArray(data)) && data.length === 1) {
                        array.push([  index.toString().white, key.toString().cyan, "[ ".white + JSON.stringify(data[0]).white + " ]".white]);  
                    }
                    else if((Tools.isArray(data)) && data.length > 1) {
                        var item = ""
                        for (var i=0; i < data.length; i++) {
                            if(typeof data[i] === "string") {
                                item +=  JSON.stringify(data[i]).white;
                                if(i < data.length -1) {
                                    item += ","
                                }
                            }
                            else {
                                item += "[ " + JSON.stringify(data[i]).white + " ]";
                                if(i < data.length -1) {
                                    item += ","
                                }
                            }
                        }
                        array.push([  index.toString().white, key.toString().cyan, "[ ".white + item.white + " ]" ]);  
                    }
                    else if(Tools.isObject(data)) {
                        array.push([  index.toString().white, key.toString().cyan, JSON.stringify(data).white ]);  
                    }
                    else {
                        array.push([  index.toString().white, key.toString().cyan, data.toString().white ]);
                    }
                    index+=1;
                }

                var t = table(array);
                Screen.table(t);
                Screen.print('');
                Screen.success('Organization information retrieved successfully.');
            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }

    createOrganization(name, option) {
        var that = this;

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);
            
        
            Screen.print("Request to create organization".white + " '".yellow + name.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._createOrganization(that._prefs.token, name, option);
            }).then(function(json) {
                status.stop();
                Screen.print('');
                Screen.success('Organization'.white + " '".yellow + name.yellow + "'".yellow + " has been successfully created.".white);
            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }
}

module.exports = COrganization;