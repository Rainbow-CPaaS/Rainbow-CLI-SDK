"use strict";

const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const table       = require('text-table');

const csv = require('csv');
const fs = require('fs');

var pkg = require('../package.json')
var Screen = require("../Print");
var NodeSDK = require('../SDK');
const Tools = require('../Tools');


class CUser {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getUsers(token, page, restrictToTerminated, companyId) {
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

            var company = "";
            if(companyId) {
                company = "&companyId=" + companyId;
            }

            NodeSDK.get('/api/rainbow/admin/v1.0/users?format=full&isTerminated=' + restrictToTerminated + company + offset + limit, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                console.log(err);
                reject(err);
            });
        });
    }

    _create(token, email, password, firstname, lastname, companyId, isAdmin) {

        return new Promise(function(resolve, reject) {

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
        
            if(companyId) {
                user.companyId = companyId;
            }

            if(isAdmin) {
                user.roles.push("admin")
                user.adminType = ["company_admin"];
            }

            NodeSDK.post('/api/rainbow/admin/v1.0/users', token, user).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _import(token, filePath, format, companyId, companyName) {

        var that = this;

        return new Promise(function(resolve, reject) {

            let parse = csv.parse;
            let stream = fs.createReadStream(filePath).pipe(parse({ delimiter : ';' }));

            var promises = [];
            var nbSuccess = 0;

            stream.on('data', function (data) {
                let username = data[0];
                let password = data[1];
                let firstname = data[2];
                let lastname = data[3];
                let rolesString = data[4];
                let isAdmin = false
                if(rolesString.includes("admin")) {
                    isAdmin = true;
                }

                promises.push(that._create(token, username, password, firstname, lastname, companyId, isAdmin).then(function(res) {
                    Screen.success(username.yellow + " imported");
                    nbSuccess++;
                }).catch(function(err) {
                    Screen.error(username.red + " not imported " + err.details.white);
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

        Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
    
        if(this._prefs.token && this._prefs.user) {
            Screen.print('You are logged in as'.grey + " " + this._prefs.account.email.magenta);
            Screen.print('');
        
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
                        active = "false".red;
                    }

                    var name = ""
                    if(users[i].lastName && users[i].firstName) {
                        name = users[i].lastName + " " + users[i].firstName
                    }

                    array.push([ (i+1).toString().white, name.white, users[i].companyName, accountType, roles.white, active, users[i].id.white]);  
                }

                var t = table(array);
                Screen.table(t);
                Screen.print('');
                Screen.success(json.total + ' users found.');

            }).catch(function(err) {
                status.stop();
                Screen.print('');
                if(err.details) {
                    Screen.print(err.details.white + ' ('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                }
                else {
                    Screen.print("(".gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                }
            });
        }
    }

    create(email, password, firstname, lastname, companyId, isAdmin) {
        var that = this;
        Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
                
        if(this._prefs.token && this._prefs.user) {
            Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
            Screen.print('');
            
            if ((typeof email !== 'string') || (email.length === 0)) {
                Screen.error('A username (email) is required');
            }
            else {
                Screen.print("Request to create user".white + " '".yellow + email.yellow + "'".yellow);
                var status = new Spinner('In progress, please wait...');
                status.start();
                NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                    return that._create(that._prefs.token, email, password, firstname, lastname, companyId, isAdmin);
                }).then(function(json) {
                    status.stop();
                    Screen.print('');
                    Screen.success('User'.white + " '".yellow + email.yellow + "'".yellow + " has been successfully created.".white);
                }).catch(function(err) {
                    status.stop();
                    Screen.print('');
                    Screen.error("Error".red);
                    if(err.details) {
                        Screen.print(err.details.white + ' ('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                    }
                    else {
                        Screen.print("(".gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                    }
                });
            }
        }
    }

    import(filePath, format, companyId, companyName) {
        var that = this;
        Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
                
        if(this._prefs.token && this._prefs.user) {
            Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
            Screen.print('');
            
            if ((typeof filePath !== 'string') || (filePath.length === 0)) {
                Screen.error('A path to a file is required');
            }
            else if(!fs.existsSync(filePath)) {
                Screen.error('File not found!');
            }
            else {
                Screen.print("Request to import".white + " '".yellow + filePath.yellow + "'".yellow);
                //var status = new Spinner('In progress, please wait...');
                //status.start();
                NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                    return that._import(that._prefs.token, filePath, format, companyId, companyName);
                }).then(function(json) {
                    //status.stop();
                    Screen.print('');
                    Screen.success(json.nbUsers.toString().yellow + " users imported successfully.".white);
                }).catch(function(err) {
                    //status.stop();
                    Screen.print('');
                    Screen.error("Error".red);
                    if(err.details) {
                        Screen.print(err.details.white + ' ('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                    }
                    else {
                        Screen.print("(".gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                    }
                });
            }
        }
    }
}

module.exports = CUser;