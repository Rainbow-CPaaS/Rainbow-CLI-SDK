"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

var pkg = require('../package.json')
var Screen = require("../Print");
var NodeSDK = require('../SDK');
const Tools = require('../Tools');


class CUser {

    constructor(prefs) {
        this._prefs = prefs;
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
                    if(err.code === 401) {
                        Screen.print("Your session has expired. You need to log-in again".white + ' ('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                    }
                    else {
                        if(err.details) {
                            Screen.print(err.details.white + ' ('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                        }
                        else {
                            Screen.print("(".gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                        }
                    }
                });
            }
        }
    }
}

module.exports = CUser;