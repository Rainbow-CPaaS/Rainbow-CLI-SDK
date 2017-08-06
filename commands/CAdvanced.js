"use strict";

const NodeSDK   = require('../common/SDK');
const Message   = require('../common/Message');
const Exit      = require('../common/Exit');
const pkg       = require('../package.json');

class CAdvanced {

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

    find(id, options) {
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
}

module.exports = CAdvanced;