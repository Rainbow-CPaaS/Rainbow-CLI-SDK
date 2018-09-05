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

    _formatCSVMetrics(json, options) {

        let csvJSON = {
            "data":[]
        };

        let apps = json.data;
        csvJSON.data.push(["appid", "application name", "ownerid", "ownername", "API resources", "API adminstrations", "WEBRTC minutes", "File storage", "Cost"]);

        apps.forEach((app) => {

            let line = [];
            line.push(app.id);
            line.push(app.name);
            line.push(app.ownerId);
            line.push(app.user.firstName + " " + app.user.lastName);

            let data = app.metrics;
            let res = 0;
            let admin = 0;
            let webrtc = 0;
            let file = 0;
            let cost = 0;

            if (data) {
                data.forEach((metric) => {
                    switch (metric.group) {
                        case "administration":
                            admin = metric.count;
                            if(admin > 2000) {
                                cost += (admin - 2000) * 0.005;
                            }
                        break;
                        case "resources":
                            res = metric.count;
                            if(res > 5000) {
                                cost += (res - 5000) * 0.001;
                            }
                        break;
                        case "webrtc_minutes":
                            webrtc = metric.count;
                            if(webrtc > 500) {
                                cost += (webrtc - 500) * 0.005;
                            }
                        break;
                        case "storage":
                            file = metric.count;
                            if(file > 5) {
                                cost += (file - 5) * 0.1;
                            }
                        break;
                    }
                });    
            } 

            line.push(res)
            line.push(admin);
            line.push(webrtc);
            line.push(file);
            line.push(cost);

            csvJSON["data"].push(line);
        });

        return csvJSON;
    }

    _getUser(token, id) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/enduser/v1.0/users/' + id, token).then(function(json) {
                resolve(json);
            });  
        });
    }

    _dashboardApplications(token, options) {

        var groups = [];
        var categories = [];

        var that = this;

        let apps = [];
        
        let filterToApply = "format=small&env=deployed&limit=1000";

        if(!options.all) {
            filterToApply += "&subscriptionStatus=creating,active,alerting,hold,terminating";
        }

        if(options.owner) {
            filterToApply += "&ownerId=" + options.owner;
        }

        filterToApply += "&sortField=ownerId";

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

                resolve({data: apps});
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _dashboardDevelopers(token, options) {

        var groups = [];
        var categories = [];

        var that = this;

        let developers = [];
        
        var filterToApply = "format=full&roles=app_admin,app_superadmin&sortField=companyId";

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

        return new Promise((resolve, reject) => {

            NodeSDK.get('/api/rainbow/admin/v1.0/users?' + filterToApply, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    dashboardApplications(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("Dashboard applications metrics", null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._dashboardApplications(that._prefs.token, options);
            }).then(function(json) {

                Message.unspin(spin);
                Message.log("action done...", json);
                
                if(options.csv) {
                    let jsonCSV = that._formatCSVMetrics(json, options);

                    Message.csv(options.csv, jsonCSV.data).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.tableDashboardMetrics(json.data, options);
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

    dashboardDevelopers(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("Dashboard developers metrics", null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._dashboardDevelopers(that._prefs.token, options);
            }).then(function(json) {

                Message.unspin(spin);
                Message.log("action done...", json);
                
                if(options.csv) {
                    let jsonCSV = that._formatCSVMetrics(json, options);

                    Message.csv(options.csv, jsonCSV.data).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.tableDashboardMetrics(json.data, options);
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