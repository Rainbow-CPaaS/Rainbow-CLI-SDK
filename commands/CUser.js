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

class CUser {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getUsers(token, page, restrictToTerminated, companyId, _isSmall) {
        return new Promise(function(resolve, reject) {

            var isSmall = _isSmall || false;

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

            var company = "";
            if(companyId) {
                company = "&companyId=" + companyId;
            }

            var format = "full";
            if(isSmall) {
                format = "small"
            }

            NodeSDK.get('/api/rainbow/admin/v1.0/users?format=' + format + '&isTerminated=' + restrictToTerminated + company + offset + limit, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                console.log(err);
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

    _createSimple(token, email, password, firstname, lastname, companyId, isAdmin) {

        var user = {
            loginEmail: email,
            password: password,
            isActive: true,
            isInitialized: false,
            language: "en",
            adminType: "undefined",
            roles: ["user"],
            accountType: "free",
        };

        if(firstname) {
            user.firstName = firstname;
        }

        if(lastname) {
            user.lastName = lastname;
        }
    
        if(companyId) {
            user.companyId = companyId;
        }

        if(isAdmin) {
            user.roles.push("admin")
            user.adminType = ["company_admin"];
        }

        return this._create(token, user);
    }

    _import(token, filePath, format, companyName) {

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
                        Screen.error("Skipped ".white + email.red + err.details);
                    }
                    else {
                        var param = "";
                        err.details.forEach(function(detail) {
                            param += "'" + detail.param + "' ";
                        });

                        Screen.error("Skipped +.white " + email.red  + " - Incorrect parameters: " + param.yellow);
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

    getUsers(page, restrictToTerminated, companyId) {
        var that = this;

        Message.welcome();
    
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);
        
            Screen.print("Current users:".white);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getUsers(that._prefs.token, page, restrictToTerminated, companyId);
            }).then(function(json) {

                status.stop();
                
                if(json.total > json.limit) {
                    var page = Math.floor(json.offset / json.limit) + 1
                    var totalPage = Math.floor(json.total / json.limit) + 1;
                    
                    Screen.print('Displaying Page '.white + page.toString().yellow + " on ".white + totalPage.toString().yellow);
                }
                Screen.print('');

                var array = [];
                array.push([ "#".gray, "Name".gray, "Company".gray, "Account".gray, "Roles".gray, "Active".gray, "ID".gray]);
                array.push([ "-".gray, "----".gray, "-------".gray, "-------".gray, "-----".gray, "------".gray, "--".gray]);  

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
                    if(users[i].lastName && users[i].firstName) {
                        name = users[i].lastName + " " + users[i].firstName;
                    }

                    array.push([ (i+1).toString().white, name.cyan, users[i].companyName.white, accountType, roles.white, active, users[i].id.white]);  
                }

                var t = table(array);
                Screen.table(t);
                Screen.print('');
                Screen.success(json.total + ' users found.');

            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }

    create(email, password, firstname, lastname, companyId, isAdmin) {
        var that = this;
        
        Message.welcome();
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);
            
            if ((typeof password !== 'string') || (password.length === 0)) {
                Screen.error("Error: missing required argument '--password'");
            }
            else if ((typeof firstname !== 'string') || (firstname.length === 0)) {
                Screen.error("Error: missing required argument '--firstname'");
            }
            else if ((typeof lastname !== 'string') || (lastname.length === 0)) {
                Screen.error("Error: missing required argument '--lastname'");
            }
            else {
                Screen.print("Request to create user".white + " '".yellow + email.yellow + "'".yellow);
                var status = new Spinner('In progress, please wait...');
                status.start();
                NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                    return that._createSimple(that._prefs.token, email, password, firstname, lastname, companyId, isAdmin);
                }).then(function(json) {
                    status.stop();
                    Screen.print('');
                    Screen.success('User'.white + " '".yellow + email.yellow + "'".yellow + " has been successfully created.".white);
                }).catch(function(err) {
                    status.stop();
                    Message.error(err);
                });
            }
        }
        else {
            Message.notLoggedIn();
        }
    }

    delete(id) {
        var that = this;
        
        Message.welcome();
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);
            
            Screen.print("Request to delete user".white + " '".yellow + id.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._delete(that._prefs.token, id);
            }).then(function(json) {
                status.stop();
                Screen.print('');
                Screen.success('User'.white + " '".yellow + id.yellow + "'".yellow + " has been successfully deleted.".white);
            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }



    import(filePath, format, companyName) {
        var that = this;
        
        Message.welcome();
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);
            
            if ((typeof filePath !== 'string') || (filePath.length === 0)) {
                Screen.error('A path to a file is required');
            }
            else if(!fs.existsSync(filePath)) {
                Screen.error('File not found!');
            }
            else {
                Screen.print("Request to import".white + " '".yellow + filePath.yellow + "'".yellow);
                NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                    return that._import(that._prefs.token, filePath, format, companyName);
                }).then(function(json) {
                    Screen.print('');
                    Screen.success(json.nbUsers.toString().yellow + " users imported successfully.".white);
                }).catch(function(err) {
                    Message.error(err);
                });
            }
        }
        else {
            Message.notLoggedIn();
        }
    }
}

module.exports = CUser;