"use strict";
const fs        = require('fs');

const NodeSDK   = require('../common/SDK');
const Message   = require('../common/Message');
const Exit      = require('../common/Exit');
const Helper    = require('../common/Helper');
const pkg       = require('../package.json');
const moment        = require('moment');

class CApplication {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getMetrics(token, options) {
        return new Promise(function(resolve, reject) {

            let day = options.day;

            let param = "?";

            let fromDate = moment().startOf('day');
            let toDate = moment().endOf('day');

            if(day) {
                fromDate = moment(day, 'YYYYMMDD').startOf('day');
                toDate = moment(day, 'YYYYMMDD').endOf('day');
            }

            param += "fromDate=" + fromDate.toISOString();
            param += "&toDate=" + toDate.toISOString();
            
            NodeSDK.get('/api/rainbow/metrics/v1.0/cpaasmetrics/' + options.appid + param, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getApns(token, options) {
        return new Promise(function(resolve, reject) {
            
            NodeSDK.get('/api/rainbow/applications/v1.0/applications/' + options.appid + '/push-settings', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getApplication(token, options) {
        
        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/applications/v1.0/applications/' + options.appid, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getPush(token, options) {
        
        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/applications/v1.0/applications/' + options.appid + '/push-settings/' + options.id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getApplications(token, options) {
        
        let that = this;

        return new Promise(function(resolve, reject) {

            var filterToApply = "format=full";

            if(options.format) {
                filterToApply = "format=" + options.format;
            }

            if(options.page > 0) {
                filterToApply += "&offset=";
                if(options.page > 1) {
                    filterToApply += (options.limit * (options.page - 1));
                }
                else {
                    filterToApply +=0;
                }
            }

            filterToApply += "&limit=" + Math.min(options.limit, 1000);

            NodeSDK.get('/api/rainbow/applications/v1.0/applications?' + filterToApply, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _createApplication(token, options) {

        return new Promise(function(resolve, reject) {

            let application = {
                "name": options.name,
                "origin": "",
                "type": options.type,
                "activity": "J"
            }

            NodeSDK.post('/api/rainbow/applications/v1.0/applications', token, application).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _createFCM(token, options) {

        return new Promise(function(resolve, reject) {

            let fcm = {
                "type": "fcm",
                "authorizationKey": options.key
            };

            NodeSDK.post('/api/rainbow/applications/v1.0/applications/' + options.appid + '/push-settings', token, fcm).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _createAPNS(token, options) {

        return new Promise(function(resolve, reject) {

            fs.readFile(options.file, 'utf8', (err, data) => {

                let apns = {
                    "type": "apns",
                    "certificateType": options.type,
                    "certificateFile": data
                };

                if (err) {
                    console.log("EERR", err);
                    reject(err);
                } else {
                    NodeSDK.post('/api/rainbow/applications/v1.0/applications/' + options.appid + '/push-settings', token, apns).then(function(json) {
                        resolve(json);
                    }).catch(function(err) {
                        reject(err);
                    });
                }
            });
        });
    }

    _delete(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.delete('/api/rainbow/applications/v1.0/applications/' + options.appid, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _deletePush(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.delete('/api/rainbow/applications/v1.0/applications/' + options.appid + '/push-settings/' + options.id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    getApplication(options) {
        var that = this;

        try {

            Message.welcome(options);

            if(this._prefs.token && this._prefs.user) {
                Message.loggedin(this._prefs, options);
                Message.action("Get information for application" , options.appid, options);
                
                let spin = Message.spin(options);
                NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
                    Message.log("execute action...");
                    return that._getApplication(that._prefs.token, options);
                }).then(function(json) {

                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if(options.noOutput) {
                        Message.out(json.data);
                    }
                    else {
                        Message.lineFeed();
                        Message.table2D(json.data);
                        Message.lineFeed();
                        Message.success(options);
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
        catch(err) {
            Message.error(err, options);
            Exit.error();
        }
    }

    createApplication(options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
        
            Message.action("Create new application", options.name, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
                Message.log("execute action...");
                return that._createApplication(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application created with Id', json.data.id, options);    
                    Message.success(options);
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

    deleteApplication(options) {
        var that = this;

        var doDelete = function(options) {
            

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                Message.log("execute action...");
                return that._delete(that._prefs.token, options.appid);
            }).then(function(json) {
                Message.unspin(spin);
                Message.log("action done...", json);
                Message.lineFeed();
                Message.success(options);
                Message.log("finished!");
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        
        Message.welcome(options);
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Delete application", options.appid, options);
            if(options.noconfirmation) {
                doDelete(options);
            }
            else {
                Message.confirm('Are-you sure ? It will remote it completely').then(function(confirm) {
                    if(confirm) {
                        doDelete(options);
                    }
                    else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getApplications(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("List applications", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
                Message.log("execute action...");
                return that._getApplications(that._prefs.token, options, that._prefs);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.csv) {
                    Message.csv(options.csv, json.data).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else if(options.noOutput) {
                    Message.out(json.data);
                }
                else {

                    if(json.total > json.limit) {
                        Message.tablePage(json, options);
                    }
                    Message.lineFeed();
                    Message.tableApplications(json, options);
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

    getMetrics(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("List metrics for application " + options.appid, null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
                Message.log("execute action...");
                return that._getMetrics(that._prefs.token, options);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.csv) {
                    Message.csv(options.csv, json.data).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else if(options.noOutput) {
                    Message.out(json.data);
                }
                else {

                    if(json.total > json.limit) {
                        Message.tablePage(json, options);
                    }
                    Message.lineFeed();
                    Message.tableMetrics(json, options);
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

    getApns(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("List apns for application " + options.appid, null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
                Message.log("execute action...");
                return that._getApns(that._prefs.token, options);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.tableApns(json, options);
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

    createFCM(options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
        
            Message.action("Create Android FCM authorization key for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
                Message.log("execute action...");
                return that._createFCM(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application FCM created with Id', json.data.id, options);    
                    Message.success(options);
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

    createAPNS(options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);
        
            Message.action("Create IOS APNS for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
                Message.log("execute action...");
                return that._createAPNS(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application APNS created with Id', json.data.id, options);    
                    Message.success(options);
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

    getPush(options) {
        var that = this;

        try {

            Message.welcome(options);

            if(this._prefs.token && this._prefs.user) {
                Message.loggedin(this._prefs, options);
                Message.action("Get information for push notification" , options.appid, options);
                
                let spin = Message.spin(options);
                NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
                    Message.log("execute action...");
                    return that._getPush(that._prefs.token, options);
                }).then(function(json) {

                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if(options.noOutput) {
                        Message.out(json.data);
                    }
                    else {
                        Message.lineFeed();
                        Message.table2D(json.data);
                        Message.lineFeed();
                        Message.success(options);
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
        catch(err) {
            Message.error(err, options);
            Exit.error();
        }
    }

    deletePush(options) {
        var that = this;

        var doDelete = function(id) {
            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                Message.log("execute action...");
                return that._deletePush(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);
                Message.log("action done...", json);
                Message.lineFeed();
                Message.success(options);
                Message.log("finished!");
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        
        Message.welcome(options);
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Delete push notification setting", options.appid, options);
            if(options.noconfirmation) {
                doDelete(options.id);
            }
            else {
                Message.confirm('Are-you sure ? It will remote it completely').then(function(confirm) {
                    if(confirm) {
                        doDelete(options.id);
                    }
                    else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }
}

module.exports = CApplication;