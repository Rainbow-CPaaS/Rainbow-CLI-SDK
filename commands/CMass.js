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

    _create(token, data) {

        return new Promise(function(resolve, reject) {
            NodeSDK.post('/api/rainbow/admin/v1.0/users', token, data).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getTemplate(token, options) {

        let filterToApply = "";

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

    template(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);

            if(!options.csv) {
                Message.action("Retrieve masspro template", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
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
            Message.loggedin(this._prefs.user, options);

            if(!options.csv) {
                Message.action("check masspro file", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
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

    import(filePath, options) {
        var that = this;

        Message.welcome(options);
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
            
            if(!fs.existsSync(filePath)) {
                Screen.error('File not found!');
                Exit.error();
            }
            else {
                Message.action("Import file", filePath, options);

                NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                    Message.log("execute action...");
                    return that._import(that._prefs.token, filePath);
                }).then(function(json) {
                    Message.log("action done...", json);
                    Message.printSuccess("Imported users", json.nbUsers);
                    Message.success();
                    Message.log("finished!");
                }).catch(function(err) {
                    Message.error(err, options);
                    Exit.error();
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