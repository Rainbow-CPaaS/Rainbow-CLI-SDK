"use strict";
const fs = require("fs");

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const Exit = require("../common/Exit");
const moment = require("moment");
const timezone = require("moment-timezone");
const Helper = require("../common/Helper");

class CApplication {
    constructor(prefs) {
        this._prefs = prefs;
    }

    _formatCSVMetrics(json, groups, categories, options) {
        let csvJSON = {
            data: []
        };

        let metrics = json.data;
        let period = json.aggregationPeriod || "hour";

        metrics.forEach(metric => {
            let metricsGroups = metric.groupCounters;
            let startDate = metric.aggregationStartDate;

            switch (period) {
                case "hour":
                    startDate = moment(startDate).format("lll");
                    break;
                case "day":
                    startDate = moment(startDate).format("ll");
                    break;
                case "month":
                    startDate = moment(startDate).format("MMM YYYY");
                    break;
                default:
                    startDate = moment(startDate).format("lll");
                    break;
            }

            let line = {
                date: startDate
            };

            // Prepare CSV
            if (options.group) {
                for (var category in categories) {
                    line[category] = 0;
                }
            } else {
                groups.forEach(group => {
                    line[group] = 0;
                });
            }

            metricsGroups.forEach(group => {
                if (options.group) {
                    for (category in categories) {
                        if (categories[category].includes(group.group)) {
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
            NodeSDK.get("/api/rainbow/metrics/v1.0/cpaasmetrics/apiGroupsMapping", token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
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
            let fromDate = moment().startOf("day");
            let toDate = moment().endOf("day");

            if (day) {
                fromDate = moment(day, "YYYYMMDD").startOf("day");
                toDate = moment(day, "YYYYMMDD").endOf("day");
            } else if (month) {
                fromDate = moment(month, "YYYYMM").startOf("month");
                toDate = moment(month, "YYYYMM").endOf("month");
                period = "day";
            } else if (year) {
                fromDate = moment(year, "YYYY").startOf("year");
                toDate = moment(year, "YYYY").endOf("year");
                period = "month";
            } else {
                fromDate = moment().startOf("month");
                toDate = moment().endOf("month");
                period = "day";
            }

            if (options.forcePeriod) {
                period = options.forcePeriod;
            }

            param += "fromDate=" + fromDate.toISOString();
            param += "&toDate=" + toDate.toISOString();

            let zone_name = moment.tz.guess();

            param += "&timezone=" + zone_name;

            param += "&period=" + period;

            if (options.dczones) {
                param += "&dcZones=" + options.dczones;
            }

            NodeSDK.get("/api/rainbow/metrics/v1.0/cpaasmetrics/" + options.appid + param, token)
                .then(function(json) {
                    json.start = fromDate.toDate();
                    json.end = toDate.toDate();
                    json.appid = options.appid;
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _createThreshold(token, group, notification, threshold, options) {
        return new Promise(function(resolve, reject) {
            let thresholdPayload = {
                type: "custom",
                notification: notification,
                threshold: threshold
            };

            NodeSDK.post("/api/rainbow/applications/v1.0/applications/" + options.appid + "/thresholds/" + group, token, thresholdPayload)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _updateThreshold(token, type, group, notification, threshold, options) {
        return new Promise(function(resolve, reject) {
            let thresholdPayload = {
                type: "custom",
                notification: notification,
                threshold: threshold
            };

            NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + options.appid + "/thresholds/" + group + "/" + type, token, thresholdPayload)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _deleteThreshold(token, group, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.delete("/api/rainbow/applications/v1.0/applications/" + options.appid + "/thresholds/" + group + "/custom", token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getThresholds(token,options) {
        let groupName = "";
        if (options.group) {
            groupName = "/" + options.group;
        }

        return new Promise(function(resolve, reject) {
            NodeSDK.get("/api/rainbow/applications/v1.0/applications/" + options.appid + "/thresholds" + groupName, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        }); 
    }

    _getApns(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.get("/api/rainbow/applications/v1.0/applications/" + options.appid + "/push-settings", token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getApplication(token, options) {
        let that = this;

        return new Promise(function(resolve, reject) {
            NodeSDK.get("/api/rainbow/applications/v1.0/applications/" + options.appid, token)
                .then(function(json) {
                    let url = "/api/rainbow/enduser/v1.0/users/";
                    if (that._prefs.user.roles.includes("support") || that._prefs.user.roles.includes("superadmin")) {
                        url = "/api/rainbow/admin/v1.0/users/";
                    }

                    if (json.data.ownerId) {
                        NodeSDK.get(url + json.data.ownerId, token)
                            .then(function(userJson) {
                                json.data.owner = userJson.data;
                                resolve(json);
                            })
                            .catch(err => {
                                json.data.owner = null;
                                resolve(json);
                            });
                    } else {
                        resolve(json);
                    }
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getPush(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.get(
                "/api/rainbow/applications/v1.0/applications/" + options.appid + "/push-settings/" + options.id,
                token
            )
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _getApplications(token, options) {
        let that = this;

        return new Promise(function(resolve, reject) {
            var filterToApply = "format=full";

            if (options.format) {
                filterToApply = "format=" + options.format;
            }

            if (options.filter) {
                filterToApply += `&env=${options.filter}`;
            }

            if (options.state) {
                if (options.state === "notactive") {
                    filterToApply += `&state=blocked,stopped,new`;
                } else {
                    filterToApply += `&state=${options.state}`;
                }
            }

            if (options.byDate) {
                switch (options.filter) {
                    case "blocked":
                    case "deployed":
                        filterToApply += "&sortField=dateOfDeployment&sortOrder=-1";
                        break;
                    case "in_deployment":
                        filterToApply += "&sortField=dateOfDeploymentRequest&sortOrder=-1";
                        break;
                    default:
                        filterToApply += "&sortField=dateOfCreation&sortOrder=-1";
                        break;
                }
            }

            if (options.owner) {
                filterToApply += "&ownerId=" + options.owner;
            }

            if (options.subscription) {
                filterToApply += "&subscriptionStatus=creating,active,alerting";
            }

            if (options.name) {
                filterToApply += "&name=" + options.name;
            }

            if (options.type) {
                filterToApply += "&type=" + options.type;
            }

            if (options.kpi) {
                filterToApply += "&kpi=" + options.kpi;
            }

            if (options.page > 0) {
                filterToApply += "&offset=";
                if (options.page > 1) {
                    filterToApply += options.limit * (options.page - 1);
                } else {
                    filterToApply += 0;
                }
            }

            filterToApply += "&limit=" + Math.min(options.limit, 1000);

            NodeSDK.get("/api/rainbow/applications/v1.0/applications?" + filterToApply, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _createApplication(token, options) {
        return new Promise(function(resolve, reject) {
            let application = {
                name: options.name,
                origin: "",
                type: options.type,
                activity: "J"
            };

            if (options.owner) {
                application.ownerId = options.owner;
            }

            NodeSDK.post("/api/rainbow/applications/v1.0/applications", token, application)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _updateApplication(token, options, data) {
        return new Promise(function(resolve, reject) {
            NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + options.appid, token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _createFCM(token, options) {
        return new Promise(function(resolve, reject) {
            let fcm = {
                type: "fcm",
                authorizationKey: options.key,
                isEnabled: true
            };

            NodeSDK.post("/api/rainbow/applications/v1.0/applications/" + options.appid + "/push-settings", token, fcm)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _createAPNS(token, options) {
        return new Promise(function(resolve, reject) {
            fs.readFile(options.file, "utf8", (err, data) => {
                let apns = {
                    type: "apns",
                    certificateType: options.type,
                    certificateFile: data,
                    isEnabled: true
                };

                if (err) {
                    console.log("ERR", err);
                    reject(err);
                } else {
                    NodeSDK.post(
                        "/api/rainbow/applications/v1.0/applications/" + options.appid + "/push-settings",
                        token,
                        apns
                    )
                        .then(function(json) {
                            resolve(json);
                        })
                        .catch(function(err) {
                            reject(err);
                        });
                }
            });
        });
    }

    _delete(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.delete("/api/rainbow/applications/v1.0/applications/" + options.appid, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _block(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + options.appid + "/block", token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _unblock(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + options.appid + "/unblock", token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _deploy(token, options) {
        let getApplication = function(id, token) {
            return new Promise(function(resolve, reject) {
                NodeSDK.get("/api/rainbow/applications/v1.0/applications/" + id, token)
                    .then(function(json) {
                        resolve(json.data);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            });
        };

        let wait = function() {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    resolve();
                }, 2000);
            });
        };

        let waitForApplication = function(id, token) {
            return new Promise(function(resolve, reject) {
                NodeSDK.get("/api/rainbow/applications/v1.0/applications/" + id, token)
                    .then(function(json) {
                        let app = json.data;
                        if (app.kpi === "business" || app.kpi === "internal") {
                            resolve(json.data);
                            return;
                        }

                        if (app.subscriptions && app.subscriptions.length > 0 && !app.subscriptions[0].syncOngoing) {
                            resolve(json.data);
                            return;
                        }

                        wait().then(function() {
                            return waitForApplication(id, token).then(function(application) {
                                resolve(application);
                            });
                        });
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            });
        };

        let addSubscription = function(application, token) {
            return new Promise(function(resolve, reject) {
                // Si pay as you go and no subscriptions
                if (
                    application.kpi === "business" || application.kpi === "internal" || 
                    (application.kpi === "payasyougo" && application.subscriptions && application.subscriptions.length > 0)
                ) {
                    resolve(application);
                    return;
                }

                NodeSDK.post(
                    "/api/rainbow/subscription/v1.0/developers/" + application.ownerId + "/subscriptions",
                    token,
                    { applicationId: application.id }
                )
                    .then(function(json) {
                        resolve(json);
                    })
                    .catch(function(err) {
                        if (err.code === 403) {
                            err.details =
                                "Can't deploy application. Error with payment method. Check if payment method exists.";
                        }
                        reject(err);
                    });
            });
        };

        let requestDeploy = function(application) {
            return new Promise(function(resolve, reject) {
                if (application.kpi !== "business" && application.kpi !== "internal") {
                    resolve(application);
                    return;
                }

                NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + application.id + "/request-deploy", token)
                    .then(function(json) {
                        resolve(json.data);
                    })
                    .catch(function(err) {
                        reject(err);
                    });
            });
        };

        return new Promise(function(resolve, reject) {
            let application = null;

            getApplication(options.appid, token)
                .then(function(json) {
                    application = json;

                    if (application.env === "deployed") {
                        reject({
                            details: "Can't deploy application. Application is already deployed."
                        });
                        return;
                    }

                    return addSubscription(application, token);
                })
                .then(function() {
                    return waitForApplication(options.appid, token);
                })
                .then(function() {
                    return requestDeploy(application);
                })
                .then(function(application) {
                    resolve(application);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _approve(token, options) {
        return new Promise(function(resolve, reject) {
            let data = {
                deployReason: options.reason || ""
            };

            NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + options.appid + "/deploy", token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _stop(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + options.appid + "/stop", token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _restart(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + options.appid + "/restart", token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _dismiss(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.put("/api/rainbow/applications/v1.0/applications/" + options.appid + "/decline", token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _usage(token, options) {
        let param = {
            year: options.year,
            month: options.month
        };

        return new Promise(function(resolve, reject) {
            NodeSDK.post(
                "/api/rainbow/invoicing/v1.0/cpaas/zuora/" +
                    options.appid +
                    "?year=" +
                    options.year +
                    "&month=" +
                    options.month,
                token
            )
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _deletePush(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.delete(
                "/api/rainbow/applications/v1.0/applications/" + options.appid + "/push-settings/" + options.id,
                token
            )
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    getApplication(options) {
        var that = this;

        try {
            Message.welcome(options);

            if (this._prefs.token && this._prefs.user) {
                Message.loggedin(this._prefs, options);
                Message.action("Get information for application", options.appid, options);

                let spin = Message.spin(options);
                NodeSDK.start(
                    this._prefs.email,
                    this._prefs.password,
                    this._prefs.host,
                    this._prefs.proxy,
                    this._prefs.appid,
                    this._prefs.appsecret
                )
                    .then(function() {
                        Message.log("execute action...");
                        return that._getApplication(that._prefs.token, options);
                    })
                    .then(function(json) {
                        Message.unspin(spin);
                        Message.log("action done...", json);

                        if (options.noOutput) {
                            Message.out(json.data);
                        } else {
                            Message.lineFeed();
                            Message.table2D(json.data);
                            Message.lineFeed();
                            Message.success(options);
                        }
                        Message.log("finished!");
                    })
                    .catch(function(err) {
                        Message.unspin(spin);
                        Message.error(err, options);
                        Exit.error();
                    });
            } else {
                Message.notLoggedIn(options);
                Exit.error();
            }
        } catch (err) {
            Message.error(err, options);
            Exit.error();
        }
    }

    createApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Create new application", options.name, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._createApplication(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application created with Id", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    linkApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Link application to user", options.ownerid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._updateApplication(that._prefs.token, options, {
                        ownerId: options.ownerid
                    });
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application successfully linked to user", options.ownerid, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    renewApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Renew application secret for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._updateApplication(that._prefs.token, options, {
                        refreshAppSecret: true
                    });
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess(
                            "Application secret successfully renewed for application",
                            options.appid,
                            options
                        );
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    deleteApplication(options) {
        var that = this;

        var doDelete = function(options) {
            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host)
                .then(function() {
                    Message.log("execute action...");
                    return that._delete(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);
                    if (options.noOutput) {
                        Message.out(json);
                    } else {
                        Message.lineFeed();
                        Message.success(options);
                        Message.log("finished!");
                    }
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        };

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Delete application", options.appid, options);
            if (options.noconfirmation) {
                doDelete(options);
            } else {
                Message.confirm("Are-you sure ? It will remove it completely").then(function(confirm) {
                    if (confirm) {
                        doDelete(options);
                    } else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    blockApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Block an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._block(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application blocked", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    unblockApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Unblock an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._unblock(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application unblocked", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    deployApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Request to deploy application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._deploy(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application deployment request done", json.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    approveApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Deploy an application", options.appid, options);

            let spin = null;

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return Message.ask("Deployment reason", "");
                })
                .then(function(reason) {
                    options.reason = reason;
                    spin = Message.spin(options);
                    return that._approve(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application deployed", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    dismissApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Decline a request of deployment of application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._dismiss(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application deployment declined", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    stopApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Stop an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._stop(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application stopped", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    restartApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Restart an application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._restart(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application restarted", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    setOffer(options) {
        var that = this;

        let spin = null;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Set offer for application", options.appid, options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");

                    return Message.choices("Select the offer to set", Helper.Offers, options.kpi);
                })
                .then(function(offer) {
                    options.offer = offer;

                    spin = Message.spin(options);

                    return that._updateApplication(that._prefs.token, options, {
                        kpi: options.offer
                    });
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Offer successfully set", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    setOauthUris(options) {
        var that = this;

        let spin = null;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Set Oauth Redirect Uris for application", options.appid, options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");

                    spin = Message.spin(options);

                    let filtered = options.uris.split(";").filter(function(el) {
                        return el != null && el.length > 0;
                    });

                    return that._updateApplication(that._prefs.token, options, { oauthRedirectUris: filtered });
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("OAuth Redirect URI successfully set", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    setOauthTerms(options) {
        var that = this;

        let spin = null;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Set Oauth Terms of Service URL for application", options.appid, options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");

                    spin = Message.spin(options);

                    return that._updateApplication(that._prefs.token, options, { termsOfServiceUrl: options.url });
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("OAuth Terms of service URL successfully set", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    setOauthPrivacy(options) {
        var that = this;

        let spin = null;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Set Oauth Privacy Policies URL for application", options.appid, options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");

                    spin = Message.spin(options);

                    return that._updateApplication(that._prefs.token, options, { privacyPoliciesUrl: options.url });
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("OAuth Privacy policies URL successfully set", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    setImplicitGrant(options) {
        var that = this;

        let spin = null;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (options.enableOAuthImplicitGrant) {
                Message.action("Set Oauth implicit grant for application", options.appid, options);
            } else {
                Message.action("Unset Oauth implicit grant for application", options.appid, options);
            }

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");

                    spin = Message.spin(options);

                    return that._updateApplication(that._prefs.token, options, {
                        enableOAuthImplicitGrant: options.enableOAuthImplicitGrant
                    });
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        if (options.enableOAuthImplicitGrant) {
                            Message.printSuccess("OAuth implicit grant successfully set", json.data.id, options);
                        } else {
                            Message.printSuccess("OAuth implicit grant successfully unset", json.data.id, options);
                        }
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    usageApplication(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Update application usage", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._usage(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Result:", json.status, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getApplications(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List applications", null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._getApplications(that._prefs.token, options, that._prefs);
                })
                .then(function(json) {
                    var columns = [
                        "#",
                        "Name",
                        "Type",
                        "Environment",
                        "State",
                        "OwnerId",
                        "Created date",
                        "Request date",
                        "Deployed date",
                        "Offer",
                        "Id"
                    ];

                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.csv) {
                        Message.csv(options.csv, json.data, false)
                            .then(() => {})
                            .catch(err => {
                                Exit.error();
                            });
                    } else if (options.noOutput) {
                        Message.out(json);
                    } else {
                        if (json.total > json.limit) {
                            Message.tablePage(json, options);
                        }
                        Message.lineFeed();
                        Message.tableApplications(json, options, columns);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getMetrics(options) {
        var that = this;

        var groups = [];
        var categories = [];

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List metrics for application " + options.appid, null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._getGroupMetrics(that._prefs.token);
                })
                .then(function(json) {
                    Message.log("action group metrics done...", json);
                    if (json.data) {
                        for (var group in json.data) {
                            json.data[group].forEach(function(metric) {
                                groups.push(metric);
                            });
                        }
                        categories = json.data;
                    }

                    return that._getMetrics(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.csv) {
                        let jsonCSV = that._formatCSVMetrics(json, groups, categories, options);

                        Message.csv(options.csv, jsonCSV.data, false)
                            .then(() => {})
                            .catch(err => {
                                Exit.error();
                            });
                    } else if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        if (json.total > json.limit) {
                            Message.tablePage(json, options);
                        }
                        Message.lineFeed();
                        Message.tableMetrics(json, options, categories);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    createThreshold(group, notification, threshold, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Create a usage threshold for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._createThreshold(that._prefs.token, group, notification, threshold, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application threshold created", options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    updateThreshold(type, group, notification, threshold, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Update a usage threshold for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._updateThreshold(that._prefs.token, type, group, notification, threshold, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application threshold updated", options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    deleteThreshold(group, options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Delete a usage threshold for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._deleteThreshold(that._prefs.token, group, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application threshold deleted", options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    } 

    getThresholds(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List thresholds for application " + options.appid + (options.group?" for API group " + options.group:""), null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._getThresholds(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        if (options.group) {
                            Message.tableThresholdsGroup(json, options);
                        }
                        else {
                            Message.tableThresholds(json, options);
                        }
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }        
    }

    getApns(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List apns for application " + options.appid, null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._getApns(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.tableApns(json, options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    createFCM(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Create Android FCM authorization key for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._createFCM(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application FCM created with Id", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    createAPNS(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Create IOS APNS for application", options.appid, options);
            let spin = Message.spin(options);

            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._createAPNS(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);

                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.printSuccess("Application APNS created with Id", json.data.id, options);
                        Message.success(options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getPush(options) {
        var that = this;

        try {
            Message.welcome(options);

            if (this._prefs.token && this._prefs.user) {
                Message.loggedin(this._prefs, options);
                Message.action("Get information for push notification", options.appid, options);

                let spin = Message.spin(options);
                NodeSDK.start(
                    this._prefs.email,
                    this._prefs.password,
                    this._prefs.host,
                    this._prefs.proxy,
                    this._prefs.appid,
                    this._prefs.appsecret
                )
                    .then(function() {
                        Message.log("execute action...");
                        return that._getPush(that._prefs.token, options);
                    })
                    .then(function(json) {
                        Message.unspin(spin);
                        Message.log("action done...", json);

                        if (options.noOutput) {
                            Message.out(json.data);
                        } else {
                            Message.lineFeed();
                            Message.table2D(json.data);
                            Message.lineFeed();
                            Message.success(options);
                        }
                        Message.log("finished!");
                    })
                    .catch(function(err) {
                        Message.unspin(spin);
                        Message.error(err, options);
                        Exit.error();
                    });
            } else {
                Message.notLoggedIn(options);
                Exit.error();
            }
        } catch (err) {
            Message.error(err, options);
            Exit.error();
        }
    }

    deletePush(options) {
        var that = this;

        var doDelete = function(id) {
            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host)
                .then(function() {
                    Message.log("execute action...");
                    return that._deletePush(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);
                    Message.lineFeed();
                    Message.success(options);
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        };

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            Message.action("Delete push notification setting", options.appid, options);
            if (options.noconfirmation) {
                doDelete(options.id);
            } else {
                Message.confirm("Are-you sure ? It will remove it completely").then(function(confirm) {
                    if (confirm) {
                        doDelete(options.id);
                    } else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getGroupsOfMetrics(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("List available metrics", null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(
                this._prefs.email,
                this._prefs.password,
                this._prefs.host,
                this._prefs.proxy,
                this._prefs.appid,
                this._prefs.appsecret
            )
                .then(function() {
                    Message.log("execute action...");
                    return that._getGroupMetrics(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.lineFeed();
                        Message.table2D(json.data, options);
                    }
                    Message.log("finished!");
                })
                .catch(function(err) {
                    Message.unspin(spin);
                    Message.error(err, options);
                    Exit.error();
                });
        } else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }
}

module.exports = CApplication;
