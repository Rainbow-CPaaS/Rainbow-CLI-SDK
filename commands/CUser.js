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

            var filterToApply = "format=full";

            if(options.format) {
                filterToApply = "format=" + options.format;
            }

            if(options.page > 0) {
                filterToApply += "&offset=";
                if(options.page > 1) {
                    filterToApply += (options.limit * (options.page - 1));
                }
                else {
                    filterToApply +=0;
                }
            }

            filterToApply += "&limit=" + Math.min(options.limit, 1000);

            if(options.companyId) {
                filterToApply += "&companyId=" + options.companyId;
            }

            if(options.name) {
                filterToApply += "&displayName=" + options.name;
            }

            if(options.company) {
                filterToApply += "&companyName=" + options.company;
            }

            if(options.onlyTerminated) {
                filterToApply += "&isTerminated=true";
            }
            else {
                filterToApply += "&isTerminated=false";
            }

            NodeSDK.get('/api/rainbow/admin/v1.0/users?' + filterToApply, token).then(function(json) {
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

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);

            if(!options.csv) {
                Message.action("List users", null, options);
            }
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._getUsers(that._prefs.token, options);
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

                    if(json.total > json.limit) {
                        Message.tablePage(json, options);
                    }
                    Message.lineFeed();
                    Message.tableUsers(json, options);
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

    create(email, password, firstname, lastname, options) {
        var that = this;
        
        Message.welcome(options);
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
            Message.action("Create new user", email, options);

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._createSimple(that._prefs.token, email, password, firstname, lastname, options);
            }).then(function(json) {
                Message.unspin(spin);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('User has been assigned to ID', json.data.id, options);    
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

    delete(id, options) {
        var that = this;

        var doDelete = function(id) {
            Message.action("Delete user", id, options);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                return that._delete(that._prefs.token, id);
            }).then(function(json) {
                Message.unspin(spin);
                Message.lineFeed();
                Message.success(options);
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err);
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
                Message.confirm('Are-you sure ? It will remote it completely').then(function(confirm) {
                    if(confirm) {
                        doDelete(id);
                    }
                    else {
                        Message.canceled(options);
                    }
                });
            }
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getUser(id, options) {
        var that = this;

        try {

            Message.welcome(options);

            if(this._prefs.token && this._prefs.user) {
                Message.loggedin(this._prefs.user, options);
                Message.action("Get information for user" , id, options);
                
                let spin = Message.spin(options);

                NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                    return that._getUser(that._prefs.token, id);
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
                    status.stop();
                    Message.error(err, options);
                    Exit.error();
                });
            }
            else {
                Message.notLoggedIn(options);
                Exit.error();
            }
        }
        catch(err) {
            Message.error(err, options);
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