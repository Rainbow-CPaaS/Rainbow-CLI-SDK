"use strict";

const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const CApplication = require('../commands/CApplication');
const Exit = require('../common/Exit');

class CInternal {

    constructor(prefs) {
        this._prefs = prefs;
        this._applications = new CApplication(this._prefs);
    }

    _getUser(token, id) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/enduser/v1.0/users/' + id, token).then(function(json) {
                resolve(json);
            });  
        });
    }

    _dashboardMetrics(token, options) {

        var groups = [];
        var categories = [];

        var that = this;

        let apps = [];
        
        let filterToApply = "format=small&env=deployed&limit=1000";

        if(!options.all) {
            filterToApply += "&subscriptionStatus=creating,active,alerting,hold,terminating";
        }

        return new Promise((resolve, reject) => {

            this._applications._getGroupMetrics(token).then( (jsonGroups) => {

                if(jsonGroups.data) {
                    for(var group in jsonGroups.data) {
                        jsonGroups.data[group].forEach(function(metric) {
                            groups.push(metric);
                        });
                    }
                    categories = jsonGroups.data;
                }

                return NodeSDK.get('/api/rainbow/applications/v1.0/applications?' + filterToApply, token);
                
            }).then((jsonApps) => {

                apps = jsonApps.data;

                let promisesUser = [];

                apps.forEach( (application) => {
                    promisesUser.push(this._getUser(token, application.ownerId));
                });

                return Promise.all(promisesUser);

            }).then((jsonUsers) => {

                jsonUsers.forEach((user, index) => {
                    apps[index].user = user.data;
                });

                let promises = [];

                apps.forEach( (application) => {
                   let appOptions = Object.assign({}, options);
                   appOptions.appid = application.id;
                   appOptions.forcePeriod = "month";
                   promises.push(this._applications._getMetrics(token, appOptions));
                });

                return Promise.all(promises);

            }).then((jsonMetrics) => {

                let seconds = ["audio", "video", "webrtc_minutes"];

                jsonMetrics.forEach((metrics, index) => {

                    var aggregatedApp = [];

                    metrics.data.forEach((metric) => {
                        let groups = metric.groupCounters;

                        // Put webrtc trafic in minutes (received in s)
                        groups.forEach( (group) => {
                            if(seconds.includes(group.group)) {
                                group.count = Math.round(group.count / 60);
                            }
                        });

                        for(var category in categories) {
                            aggregatedApp.push({
                                "group": category,
                                "count": 0
                            });
                        }
        
                        groups.forEach( (group) => {
                            for(var category in categories) {
                                if(categories[category].includes(group.group)) {
                                    aggregatedApp.forEach( (aggregated, index) => {
                                        if(aggregated.group === category) {
                                            aggregatedApp[index].count += group.count;
                                        }
                                    });
                                }
                            }
                        });

                        apps[index].metrics = aggregatedApp; 
                    });
                });

                resolve(apps);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    dashboardMetrics(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("Dashboard Metrics", null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._dashboardMetrics(that._prefs.token, options);
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
                    Message.tableDashboardMetrics(json, options);
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
}

module.exports = CInternal;