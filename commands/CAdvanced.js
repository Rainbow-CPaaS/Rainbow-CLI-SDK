"use strict";

const NodeSDK   = require('../common/SDK');
const Message   = require('../common/Message');
const Exit      = require('../common/Exit');
const pkg       = require('../package.json');

class CAdvanced {

    constructor(prefs) {
        this._prefs = prefs;
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
            Message.loggedin(this._prefs.user, options);
            Message.action("Find information for ", id, options);
            
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                return that._find(that._prefs.token, id);
            }).then(function(json) {

                Message.unspin(spin);

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