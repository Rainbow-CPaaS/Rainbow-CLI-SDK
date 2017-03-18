"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

var pkg = require('./package.json')
var Screen = require("./Print");
var NodeSDK = require('./SDK');
const Tools = require('./Tools');

class User {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
    }

    start() {
        this.listOfCommands()
    }

    stop() {

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

    listOfCommands() {

        var that = this;

        this._program.command('whoami')
            .description("Display information about the connected user")
            .action(function () {
            
            Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
            
            if(that._prefs.token && that._prefs.user) {
                Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
                Screen.print('');
                Screen.print("Current account information:".white);
                Screen.print('');
                
                var status = new Spinner('In progress, please wait...');
                status.start();
                NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
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
                    Screen.print('');
                    Screen.error("Can't execute the command".white);
                    if(err.code === 401) {
                        Screen.print("Error ".red + err.code.toString().gray + " - Your session has expired. You need to log-in again".gray);
                    }
                    else {
                        if(err.details) {
                            Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray + ": " + err.details.gray);
                        }
                        else {
                            Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray);
                        }
                    }
                    
                });
            }
            
        });

        this._program.command('login')
            .description("Log in to Rainbow")
            .option('-u, --username [value]', 'The username (email) to log in with.')
            .option('-p, --password [value]', 'The password to use when logging in.')
            .option('-o, --official', 'Use the Rainbow official environment.')
            .action(function (command) {

            var email = command.username || "";
            var password = command.password || "";
            var platform = command.official ? "official" : "sandbox";

            Screen.print('Welcome to ' + 'Rainbow'.magenta);
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
                Screen.error("Can't login to Rainbow!".grey);
                if(err.details) {
                    Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray + ": " + err.details.gray);
                }
                else {
                    Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray);
                }
            });
            
        });

        
    }
}

module.exports = User;