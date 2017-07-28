"use strict";

const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const table       = require('text-table');
const colors      = require('colors');

const csv = require('csv');
const fs = require('fs');

const pkg = require('../package.json');
const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Tools = require('../common/Tools');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

class CUser {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getUsers(token, options) {
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

            var company = "";
            if(options.companyId) {
                company = "&companyId=" + options.companyId;
            }

            var format = "full";
            if(options.format) {
                format = options.format;
            }

            NodeSDK.get('/api/rainbow/admin/v1.0/users?format=' + format + '&isTerminated=' + options.onlyTerminated + company + offset + limit, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _create(token, data) {

        return new Promise(function(resolve, reject) {
            NodeSDK.post('/api/rainbow/admin/v1.0/users', token, data).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _delete(token, id) {

        return new Promise(function(resolve, reject) {
            NodeSDK.delete('/api/rainbow/admin/v1.0/users/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getUser(token, id) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/admin/v1.0/users/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
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
            accountType: "free",
        };

        if(options.companyId) {
            user.companyId = options.companyId;
        }

        if(options.isAdmin) {
            user.roles.push("admin")
            user.adminType = ["company_admin"];
        }

        return this._create(token, user);
    }

    _import(token, filePath) {

        var that = this;

        return new Promise(function(resolve, reject) {

            let parse = csv.parse;
            let stream = fs.createReadStream(filePath).pipe(parse({ delimiter : ';', columns: true }));

            var promises = [];
            var nbSuccess = 0;

            var firstLine = true;

            stream.on('data', function (data) {

                var roles = ["user"];
                if(data.roles && data.roles.includes('admin')) {
                    roles.push("admin");
                    data.adminType = "company_admin";
                }
                data.roles = roles;

                data.isActive= true;
                data.isInitialized= false;

                // remove empty value (that )
                for (var key in data) {
                    if(!data[key]) {
                        delete data[key];
                    }
                }

                promises.push(that._create(token, data).then(function(res) {
                    Screen.success("Imported ".white + data.loginEmail.yellow);
                    nbSuccess++;
                }).catch(function(err) {

                    var email = data.loginEmail || "Unknown";

                    if(typeof err.details === "string") {
                        Screen.error("Skipped ".white + email.red + ' ('.white + err.details.white + ')'.white);
                    }
                    else {
                        var param = "";
                        err.details.forEach(function(detail) {
                            if(!param.includes(detail.param)) {
                                param += "'" + detail.param + "' ";
                            }
                            
                        });

                        Screen.error("Skipped ".white + email.red  + " (Incorrect parameters: ".white + param.yellow + ')'.white);
                    }
                }));
            })
            .on("end", function () {
                Promise.all(promises).then(function(results) {
                    resolve({nbUsers: nbSuccess});
                }).catch(function(err) {
                    reject(err);
                });
            });
                
        });
    }

    getUsers(options) {
        var that = this;

        Message.welcome();

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user);

            if(!options.csv) {
                Screen.print("Current users:".white);
            }
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getUsers(that._prefs.token, options);
            }).then(function(json) {
                status.stop();
                if(options.csv) {
                    let stringify = csv.stringify;
                    var writeStream = fs.createWriteStream(options.csv, { flags : 'w' });

                    stringify(json.data, {
                        formatters: {
                            date: function(value) {
                                return moment(value).format('YYYY-MM-DD');
                            }
                        },
                        delimiter: ";",
                        header: true
                    }).pipe(writeStream);
                    writeStream.on('close', function () {
                        Screen.success("Successfully saved".white + " " + json.total.toString().magenta + " user(s) to".white + " '".white + options.csv.yellow + "'".white);
                    });
                    writeStream.on('error', function (err) {
                        Exit.error();
                    });
                }
                else {

                    if(json.total > json.limit) {
                        var page = Math.floor(json.offset / json.limit) + 1
                        var totalPage = Math.floor(json.total / json.limit) + 1;
                        
                        Screen.print('Displaying Page '.white + page.toString().yellow + " on ".white + totalPage.toString().yellow);
                    }
                    Screen.print('');

                    var array = [];
                    array.push([ "#".gray, "Name".gray, "LoginEmail".gray, "Company".gray, "Account".gray, "Roles".gray, "Active".gray, "ID".gray]);
                    array.push([ "-".gray, "----".gray, "----------".gray, "-------".gray, "-------".gray, "-----".gray, "------".gray, "--".gray]);  

                    var users = json.data;

                    for(var i = 0; i < users.length; i++) {

                        var accountType = users[i].accountType;
                        if(accountType === "free") {
                            accountType = accountType.white;
                        }
                        else {
                            accountType = accountType.yellow;
                        }

                        var roles = users[i].roles.join();

                        var active = "true".white;
                        if(!users[i].isActive) {
                            active = "false".yellow;
                        }

                        var name = "";
                        name = users[i].displayName;
                        if(!name) {
                            name = users[i].firstName + " " +users[i].lastName;
                        }

                        var number = (i+1);
                        if(options.page > 0) {
                            number = ((options.page-1) * json.limit) + (i+1);
                        }

                        var companyName = users[i].companyName || "";

                        array.push([ number.toString().white, name.cyan, users[i].loginEmail.white, companyName.white, accountType, roles.white, active, users[i].id.white]);  
                    }

                    var t = table(array);
                    Screen.table(t);
                    Screen.print('');
                    Screen.success(json.total + ' users found.');
                }

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

    create(email, password, firstname, lastname, options) {
        var that = this;
        
        Message.welcome();
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user);
            
            Screen.print("Request to create user".white + " '".yellow + email.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._createSimple(that._prefs.token, email, password, firstname, lastname, options);
            }).then(function(json) {
                status.stop();
                Screen.print('');
                Screen.success('User'.white + " '".yellow + email.yellow + "'".yellow + " has been successfully created and assigned to ID ".white + json.data.id.cyan);
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

    delete(id, options) {
        var that = this;

        var doDelete = function(id) {
            Screen.print("Request to delete user".white + " '".yellow + id.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
                return that._delete(that._prefs.token, id);
            }).then(function(json) {
                status.stop();
                Screen.print('');
                Screen.success('User'.white + " '".yellow + id.yellow + "'".yellow + " has been successfully deleted.".white);
            }).catch(function(err) {
                status.stop();
                Message.error(err);
                Exit.error();
            });
        }
        
        Message.welcome();
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user);

            if(options.noconfirmation) {
                doDelete(id);
            }
            else {
                Message.confirm('Are-you sure ? It will remote it completely').then(function(confirm) {
                    if(confirm) {
                        doDelete(id);
                    }
                    else {
                        Message.canceled();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn();
            Exit.error();
        }
    }

    getUser(id) {
        var that = this;

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user);
        
            Screen.print("Request informaton for user".white + " '".yellow + id.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getUser(that._prefs.token, id);
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
                Screen.success('User information retrieved successfully.');
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

    import(filePath) {
        var that = this;

        Message.welcome();
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user);
            
            if(!fs.existsSync(filePath)) {
                Screen.error('File not found!');
                Exit.error();
            }
            else {
                Screen.print("Request to import".white + " '".yellow + filePath.yellow + "'".yellow);
                NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                    return that._import(that._prefs.token, filePath);
                }).then(function(json) {
                    Screen.print('');
                    Screen.success(json.nbUsers.toString().yellow + " users imported successfully.".white);
                }).catch(function(err) {
                    Message.error(err);
                    Exit.error();
                });
            }
        }
        else {
            Message.notLoggedIn();
            Exit.error();
        }
    }
}

module.exports = CUser;