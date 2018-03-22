"use strict";

const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

var CUser = require('./CUser');

class CFree {

    constructor(prefs) {
        this._prefs = prefs;
        this._user = new CUser(this._prefs);
    }

    _removeAllUsersFromACompany(token, id) {

        var that = this;

        return new Promise(function(resolve, reject) {

            var options = {
                page: 1,
                limit: 1000,
                onlyTerminated: false,
                companyId: id,
                format: 'small'
            };

            that._user._getUsers(token, options).then(function(json) {

                var promises = []
                var nbDeleted = 0;

                if(json.total > 0) {
                    json.data.forEach(function(user) {

                        promises.push(that._user._delete(token, user.id).then(function() {
                            Message.printSuccess("Deleted user", user.loginEmail);
                            nbDeleted++;
                        }).catch(function() {
                            Message.error("Skipped user",  + user.id, options);
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

    removeAllUsersFromACompany(id, options) {
        var that = this;
        
        Message.welcome(options);
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Free company", id, options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._removeAllUsersFromACompany(that._prefs.token, id);
            }).then(function(json) {
                Message.log("action done...", json);
                Message.lineFeed();
                Message.success(options);
                Message.printSuccess("Users deleted", json.nbDeleted.toString());
                Message.log("finished!");
            }).catch(function(err) {
                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
        }
    }
}

module.exports = CFree;