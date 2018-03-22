"use strict";

const NodeSDK   = require('../common/SDK');
const Message   = require('../common/Message');
const Exit      = require('../common/Exit');
const Helper    = require('../common/Helper');
const pkg       = require('../package.json');

const CCompany  = require('./CCompany');
const CUser     = require('./CUser');

class CAdvanced {

    constructor(prefs) {
        this._prefs = prefs;
        this._user = new CUser(this._prefs);
        this._company = new CCompany(this._prefs);
    }

    _newco(token, companyName, loginEmail, loginPassword, userFirstname, userLastname, hasAdminRight) {

        let that = this;

        return new Promise((resolve, reject) => {

            that._company._createCompany(token, companyName).then((company) => {

                let options = {
                    companyId: company.data.id,
                    isAdmin: hasAdminRight
                };

                that._user._createSimple(token, loginEmail, loginPassword, userFirstname, userLastname, options).then((user) => {

                    resolve({company: company.data, user: user.data});

                }).catch((errUser) => {

                    that._company._deleteCompany(token, company.data.id, options).then(() => {
                        reject(errUser);
                    }).catch((errCompany) => {
                        reject(errCompany);
                    });
                })

            }).catch((err) => {
                reject(err);
            });
        });
    }

    _find(token, id, options) {


        let makeRequest = (url, token) => {
            return new Promise( (resolve) => {

                NodeSDK.get(url, token).then(function(json) {
                    resolve(json);
                }).catch(function(err) {
                    resolve(err);
                });
            });
        };

        return new Promise(function(resolve, reject) {
            
            // Try to find a user
            makeRequest('/api/rainbow/enduser/v1.0/users/' + id, token).then( (json) => {
                if(!('code' in json)) {
                    resolve({type: "user", result: json});
                }
                else {
                    return makeRequest('/api/rainbow/admin/v1.0/companies/' + id, token).then((json) => {
                        if(!('code' in json)) {
                            resolve({type: "company", result: json});
                        }
                        else {
                            return makeRequest('/api/rainbow/admin/v1.0/sites/' + id, token).then((json) => {
                                if(!('code' in json)) {
                                    resolve({type: "sites", result: json});
                                }
                                else {
                                    return makeRequest('/api/rainbow/admin/v1.0/organisations/' + id, token).then((json) => {
                                if(!('code' in json)) {
                                    resolve({type: "organisations", result: json});
                                }
                                else {
                                    reject(json);
                                }
                            });
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    find(id, options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Find information for ", id, options);
            
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._find(that._prefs.token, id);
            }).then(function(json) {

                Message.unspin(spin);

                Message.log("action done...", json);

                Message.found(1, json.type, options);

                if(options.noOutput) {
                    Message.out(json.result.data);
                }
                else {
                    Message.lineFeed();
                    Message.table2D(json.result.data);
                    Message.lineFeed();
                    Message.success(options);
                }
                Message.log("finished!");

            }).catch(function(err) {
                Message.unspin(spin);

                console.log("ERR", err);
                err.details = 'No item found with that id in organizations, companies, sites and users tables.'

                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    newco(options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
            Message.action("Wizard for user & company", null, options);

            let companyName = "New Co";
            let loginEmail = "";
            let loginPassword = "";
            let userFirstname = "", userLastname = "";
            let hasAdminRight = true;

            Message.ask("Enter a company name").then((name) => {
                companyName = name;
                return Message.ask("Enter a user email address");
            }).then((email) => {
                loginEmail = email;
                return Message.askPassword("Enter a user password");
            }).then((password) => {
                loginPassword = password;
                return Message.ask("Enter a user first name");
            }).then((firstname) => {
                userFirstname = firstname;
                return Message.ask("Enter a user last name");
            }).then((lastname) => {
                userLastname = lastname;
                return Message.choices("Has user admin right", Helper.YesNo);
            }).then((isAdmin) => {
                hasAdminRight = isAdmin;

                let spin = Message.spin(options);

                NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                    Message.log("execute action...");
                    return that._newco(that._prefs.token, companyName, loginEmail, loginPassword, userFirstname, userLastname, hasAdminRight);
                }).then(function(json) {

                    Message.unspin(spin);

                    Message.log("action done...", json);

                    Message.lineFeed();
                    Message.printSuccess("Company created with Id", json.company.id, options);
                    Message.printSuccess("User created with Id", json.user.id, options)
                    Message.success(options);
                    Message.log("finished!");

                }).catch(function(err) {
                    Message.unspin(spin);

                    Message.error(err, options);
                    Exit.error();
                });
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }
}

module.exports = CAdvanced;