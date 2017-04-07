"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

const pkg = require('../package.json');
const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Tools = require('../common/Tools');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

class CAccount {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getUserInfo(id, token) {

        return new Promise(function(resolve, reject) {
            NodeSDK.get('/api/rainbow/enduser/v1.0/users/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    getConnectedUserInformation() {
        var that = this;

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user);

            Screen.print("Current account information:".white);
            Screen.print('');
            
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getUserInfo(that._prefs.user.id, that._prefs.token);
            }).then(function(json) {
                status.stop();  
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
                Screen.success('whoami successfully executed.');
            }).catch(function(err) {
                status.stop();
                Message.error(err);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn();
            Exit.error();
        }
    }

    login(email, password, platform) {
        var that = this;

        Message.welcome();
        Screen.print('Version ' + pkg.version.yellow);
        
        if(email.length === 0 || password.length === 0) {
            if(that._prefs.account) {
                email = that._prefs.account.email;
                password = that._prefs.account.password;
                platform = that._prefs.rainbow;
            } 
        }

        var status = new Spinner('Authenticating you, please wait...');
        status.start();

        NodeSDK.start(email, password, platform).then(function() {
            return NodeSDK.signin();
        }).then(function(json) {
            status.stop();
            Screen.success('Signed in as'.grey + " " + email.cyan);
            that._prefs.account= {
                email: email,
                password: password
            }
            that._prefs.token = json.token;
            that._prefs.user =  json.loggedInUser;
            that._prefs.rainbow = platform;

        }).catch(function(err) {
            status.stop();
            Message.error(err);
            Exit.error();
        });
    }

    logout() {
        Message.welcome();
        Screen.print('Version ' + pkg.version.yellow);
        var email = "";
        if(this._prefs.user) {
            email = this._prefs.user.loginEmail;
        }

        this._prefs.account = null;
        this._prefs.token = null;
        this._prefs.user =  null;
        this._prefs.rainbow = null;

        if(email) {
            Screen.success('You have signed out from '.grey + email.cyan);
        }
        else {
            Screen.error('You are not signed-in');
            Exit.error();
        }
    }
    
}

module.exports = CAccount;