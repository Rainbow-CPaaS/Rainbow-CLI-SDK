"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

const pkg = require('../package.json');
const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Tools = require('../common/Tools');
const Message = require('../common/Message');

var CUser = require('./CUser');

class CFree {

    constructor(prefs) {
        this._prefs = prefs;
        this._user = new CUser(this._prefs);
    }

    _removeAllUsersFromACompany(token, id) {

        var that = this;

        return new Promise(function(resolve, reject) {

            that._user._getUsers(token, -1, false, id, true).then(function(json) {

                var promises = []
                var nbDeleted = 0;

                if(json.total > 0) {
                    json.data.forEach(function(user) {
                        promises.push(that._user._delete(token, user.id).then(function() {
                            Screen.success("Deleted user '".white + user.id.yellow + "'".white);
                            nbDeleted++;
                        }).catch(function() {
                            Screen.error("Skipped user '".white + user.id.red + "'".white);
                        }));
                    });

                    Promise.all(promises).then(function() {
                        resolve({nbDeleted: nbDeleted});
                    }).catch(function(err) {
                        reject(err);
                    });
                }
                else {
                    resolve({nbDeleted: nbDeleted});
                }
                
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    removeAllUsersFromACompany(id) {
        var that = this;
        
        Message.welcome();
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);

            Screen.print("Free company:".white + " '".white + id.yellow + "'".white);
            Screen.print('');
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._removeAllUsersFromACompany(that._prefs.token, id);
            }).then(function(json) {
                Screen.print('');
                Screen.success(json.nbDeleted.toString().yellow + ' user(s) deleted.');
            }).catch(function(err) {
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }
}

module.exports = CFree;