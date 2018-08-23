"use strict";
const fs        = require('fs');

const NodeSDK   = require('../common/SDK');
const Message   = require('../common/Message');
const Exit      = require('../common/Exit');
const moment        = require('moment');

class CApplication {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _formatCSVMetrics(json, groups, categories, options) {

        let csvJSON = {
            "data":[]
        };

        let metrics = json.data;
        let period = json.aggregationPeriod || "hour";

        metrics.forEach((metric) => {

            let metricsGroups = metric.groupCounters;
            let startDate = metric.aggregationStartDate;

            switch (period) {
                case "hour":
                startDate = moment(startDate).format('lll');
                break;
                case "day":
                startDate = moment(startDate).format('ll');
                break;
                case "month":
                startDate = moment(startDate).format('MMM YYYY');
                break;
                default:
                startDate = moment(startDate).format('lll');
                break;
            }

            let line = {
                "date": startDate
            }

            // Prepare CSV
            if(options.group) {
                for(var category in categories) {
                    line[category] = 0;
                }
            } else {
                groups.forEach((group) => {
                    line[group] = 0;
                });
            }

            metricsGroups.forEach( (group) => {
                if(options.group) {
                    for(category in categories) {
                        if(categories[category].includes(group.group)) {
                            line[category] += group.count;
                        }
                    }
                } else {
                    line[group.group] = group.count;
                }

            });
            csvJSON["data"].push(line);
        });

        return csvJSON;
    }

    _getGroupMetrics(token) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/metrics/v1.0/cpaasmetrics/apiGroupsMapping', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getMetrics(token, options) {
        return new Promise(function(resolve, reject) {

            let day = options.day,
                month = options.month,
                year = options.year;

            let param = "?";

            let period = "hour";
            let fromDate = moment().startOf('day');
            let toDate = moment().endOf('day');

            if(day) {
                fromDate = moment(day, 'YYYYMMDD').startOf('day');
                toDate = moment(day, 'YYYYMMDD').endOf('day');
            } else if(month) {
                fromDate = moment(month, 'YYYYMM').startOf('month');
                toDate = moment(month, 'YYYYMM').endOf('month');
                period = "day";
            } else if(year) {
                fromDate = moment(year, 'YYYY').startOf('year');
                toDate = moment(year, 'YYYY').endOf('year');
                period = "month";
            }

            param += "fromDate=" + fromDate.toISOString();
            param += "&toDate=" + toDate.toISOString();

            param += "&period=" + period;

            NodeSDK.get('/api/rainbow/metrics/v1.0/cpaasmetrics/' + options.appid + param, token).then(function(json) {
                json.start = fromDate;
                json.end = toDate;
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
                
                if(json.data.ownerId) {
                    NodeSDK.get('/api/rainbow/enduser/v1.0/users/' + json.data.ownerId, token).then(function(userJson) {
                        json.data.owner = userJson.data;
                        resolve(json);
                    });                    
                } else {
                    resolve(json);
                }
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

            if(options.filter) {
                filterToApply += `&env=${options.filter}`;
            }

            if(options.state) {
                if(options.state === "notactive") {
                    filterToApply += `&state=blocked,stopped,new`;
                } else {
                    filterToApply += `&state=${options.state}`;
                }
            }

            if(options.byDate) {
                switch(options.filter) {
                    case "blocked":
                    case "deployed":
                        filterToApply +="&sortField=dateOfDeployment&sortOrder=-1";
                        break;
                    case "in_deployment":
                        filterToApply +="&sortField=dateOfDeploymentRequest&sortOrder=-1";
                        break;
                    default:
                        filterToApply +="&sortField=dateOfCreation&sortOrder=-1";
                        break;
                }
            }

            if(options.owner) {
                filterToApply += "&ownerId=" + options.owner;
            }

            if(options.subscription) {
                filterToApply += "&subscriptionStatus=creating,active,alerting";
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
            };

            if(options.owner) {
                application.ownerId = options.owner;
            }

            NodeSDK.post('/api/rainbow/applications/v1.0/applications', token, application).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _linkApplication(token, options) {

        return new Promise(function(resolve, reject) {

            let data = {
                ownerId: options.ownerid
            };

            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid, token, data).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _renewApplication(token, options) {

        return new Promise(function(resolve, reject) {

            let data = {
                refreshAppSecret: true
            };

            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid, token, data).then(function(json) {
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
                "authorizationKey": options.key,
                "isEnabled": true
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
                    "certificateFile": data,
                    "isEnabled": true
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

    _block(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid + '/block', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _unblock(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid + '/unblock', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _deploy(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid + '/request-deploy', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _approve(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid + '/deploy', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _stop(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid + '/stop', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _restart(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid + '/restart', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _dismiss(token, options) {

        return new Promise(function(resolve, reject) {
            NodeSDK.put('/api/rainbow/applications/v1.0/applications/' + options.appid + '/decline', token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _usage(token, options) {

        let param = {
            "year": options.year,
            "month": options.month,
        };

        return new Promise(function(resolve, reject) {
            NodeSDK.post('/api/rainbow/invoicing/v1.0/cpaas/zuora/' + options.appid + "?year=" + options.year + "&month=" + options.month, token).then(function(json) {
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
                NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
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

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
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

    linkApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Link application to user", options.ownerid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._linkApplication(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application successfully linked to user', options.ownerid, options);
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

    renewApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Renew application secret for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._renewApplication(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application secret successfully renewed for application', options.appid, options);
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
                return that._delete(that._prefs.token, options);
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
                Message.confirm('Are-you sure ? It will remove it completely').then(function(confirm) {
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

    blockApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Block an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._block(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application blocked', json.data.id, options);
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

    unblockApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Unblock an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._unblock(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application unblocked', json.data.id, options);
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

    deployApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Request to deploy application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._deploy(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application deployment request done', json.data.id, options);
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

    approveApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Deploy an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._approve(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application deployed', json.data.id, options);
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

    dismissApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Decline a request of deployment of application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._dismiss(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application deployment declined', json.data.id, options);
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

    stopApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Stop an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._stop(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application stopped', json.data.id, options);
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

    restartApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Restart an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._restart(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Application restarted', json.data.id, options);
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

    usageApplication(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Update application usage", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._usage(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Result:', json.status, options);
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


    getApplications(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("List applications", null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
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

        var groups = [];
        var categories = [];

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("List metrics for application " + options.appid, null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._getGroupMetrics(that._prefs.token);
            }).then(function(json) {
                Message.log("action group metrics done...", json);
                if(json.data) {
                    for(var group in json.data) {
                        json.data[group].forEach(function(metric) {
                            groups.push(metric);
                        });
                    }
                    categories = json.data;
                }

                return that._getMetrics(that._prefs.token, options);
            }).then(function(json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.csv) {

                    let jsonCSV = that._formatCSVMetrics(json, groups, categories, options);

                    Message.csv(options.csv, jsonCSV.data).then(() => {
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
                    Message.tableMetrics(json, options, categories);
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
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
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

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
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

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
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
                NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
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
                Message.confirm('Are-you sure ? It will remove it completely').then(function(confirm) {
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

    getGroupsOfMetrics(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("List available metrics", null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._getGroupMetrics(that._prefs.token, options);
            }).then(function(json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.table2D(json.data, options);
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

module.exports = CApplication;