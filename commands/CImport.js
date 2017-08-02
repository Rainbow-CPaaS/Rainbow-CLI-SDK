"use strict";

const csv = require('csv');
const fs = require('fs');

const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

class CImport {

    constructor(prefs) {
        this._prefs = prefs;
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
                NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
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

module.exports = CImport;