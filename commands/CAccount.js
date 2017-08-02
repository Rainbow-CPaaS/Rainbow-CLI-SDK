"use strict";

const NodeSDK   = require('../common/SDK');
const Message   = require('../common/Message');
const Exit      = require('../common/Exit');
const pkg       = require('../package.json');

class CAccount {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getUserInfo(id, token) {

        return new Promise(function(resolve, reject) {
            NodeSDK.get('/api/rainbow/enduser/v1.0/users/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    getConnectedUserInformation(options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
            Message.action("Connected user information", null, options);
            
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._getUserInfo(that._prefs.user.id, that._prefs.token);
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

    login(email, password, platform, options) {
        var that = this;

        Message.welcome(options);
        Message.version(pkg.version, options);
        
        if(email.length === 0 || password.length === 0) {
            email = that._prefs.email;
            password = that._prefs.password;
            platform = that._prefs.host;
        }

        let spin = Message.spin(options);

        NodeSDK.start(email, password, platform).then(function() {
            return NodeSDK.signin();
        }).then(function(json) {

            Message.unspin(spin);

            if(options.noOutput) {
                Message.out(json);
            }
            else {
                Message.success(options);
                Message.printSuccess('Signed in as', email, options);
            }

            that._prefs.save({
                    email: email,
                    password: password
                },
                json.token,
                json.loggedInUser,
                platform
            );

        }).catch(function(err) {
            Message.unspin(spin);
            Message.error(err, options);
            Exit.error();
        });
    }

    logout() {
        Message.welcome();
        Message.version(pkg.version);
        var email = "";
        if(this._prefs.user) {
            email = this._prefs.user.loginEmail;
        }

        this._prefs.reset();

        if(email) {
            Message.success();
            Message.printSuccess('You have signed out from', email);
        }
        else {
            Message.error({details: 'You are not signed-in'});
            Exit.error();
        }
    }
    
}

module.exports = CAccount;