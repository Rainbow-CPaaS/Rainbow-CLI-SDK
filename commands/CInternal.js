"use strict";

const NodeSDK = require("../common/SDK");
const Message = require("../common/Message");
const CApplication = require("../commands/CApplication");
const Exit = require("../common/Exit");
const moment = require("moment");

class CInternal {
    constructor(prefs) {
        this._prefs = prefs;
        this._applications = new CApplication(this._prefs);
    }

    _formatCSVDevelopers(json, options) {
        let csvJSON = {
            data: []
        };

        let users = json.data;

        let fromDate = null,
            toDate = null;

        if (options.month) {
            fromDate = moment(options.month, "YYYYMM").startOf("month");
            toDate = moment(options.month, "YYYYMM").endOf("month");
        } else {
            fromDate = moment().startOf("month");
            toDate = moment().endOf("month");
        }

        for (var i = 0; i < users.length; i++) {
            let user = users[i];

            let developerSince = "in error";
            let payAsYouGoSince = "";
            let sandboxSince = "not created";
            let hasBeenRegisteredInMonth = false;

            let statsToProvide = options.pay
                ? "registrationPayAsYouGo"
                : options.sandbox
                ? "registrationSandbox"
                : "registrationDevelopers";

            if (user.developer && user.developer.account && user.developer.account.status === "confirmed") {
                if (statsToProvide === "registrationDevelopers") {
                    let date = moment(user.developer.account.lastUpdateDate);
                    if (date.isBetween(fromDate, toDate)) {
                        hasBeenRegisteredInMonth = true;
                    }
                } else if (statsToProvide === "registrationPayAsYouGo") {
                    if (user.developer.bsAccountId) {
                        let date = moment(user.developer.accountCreationDate);
                        if (date.isBetween(fromDate, toDate)) {
                            hasBeenRegisteredInMonth = true;
                        }
                    }
                }
                developerSince = moment(user.developer.account.lastUpdateDate).format("LL");
                if (user.developer.accountCreationDate) {
                    payAsYouGoSince = moment(user.developer.accountCreationDate).format("LL");
                }
            }
            if (user.developer && user.developer.sandbox && user.developer.sandbox.status === "succeeded") {
                let date = moment(user.developer.sandbox.lastUpdateDate);
                if (statsToProvide === "registrationSandbox") {
                    if (date.isBetween(fromDate, toDate)) {
                        hasBeenRegisteredInMonth = true;
                    }
                }
                sandboxSince = date.format("LL");
            }

            if (hasBeenRegisteredInMonth) {
                let line = [];
                line.push(user.lastName);
                line.push(user.firstName);
                line.push(user.country);
                line.push(user.loginEmail);
                line.push(user.companyName);
                line.push(user.company.country);
                line.push(user.company.isBP ? "yes" : "no");
                line.push(developerSince);
                line.push(sandboxSince);
                line.push(payAsYouGoSince);
                csvJSON["data"].push(line);
            }
        }

        return csvJSON;
    }

    _formatCSVMetrics(json, options) {
        let csvJSON = {
            data: []
        };

        let apps = json.data;

        apps.forEach(app => {
            let line = [];
            let isBusiness = true;
            line.push(app.name);
            line.push(app.id);
            line.push(app.kpi);
            line.push(app.type);
            line.push(app.activity);
            line.push(app.user.firstName + " " + app.user.lastName);
            line.push(app.user.country);
            line.push(app.user.loginEmail);
            line.push(app.user.companyName);
            line.push(app.dateOfCreation);
            line.push(app.dateOfDeployment);
            if (options.kpi === "business") {
                line.push(app.deployReason || "");
            }
            line.push(app.state);
            let data = app.metrics;
            let res = 0;
            let admin = 0;
            let webrtc = 0;
            let file = 0;
            let cost = 0;

            if (data) {
                data.forEach(metric => {
                    switch (metric.group) {
                        case "administration":
                            admin = metric.count;
                            if (admin > 2000) {
                                cost += (admin - 2000) * 0.005;
                            }
                            break;
                        case "resources":
                            res = metric.count;
                            if (res > 5000) {
                                cost += (res - 5000) * 0.001;
                            }
                            break;
                        case "webrtc_minutes":
                            webrtc = metric.count;
                            if (webrtc > 500) {
                                cost += (webrtc - 500) * 0.005;
                            }
                            break;
                        case "storage":
                            file = metric.count;
                            if (file > 5) {
                                cost += (file - 5) * 0.1;
                            }
                            break;
                    }
                });
            }

            line.push(res);
            line.push(admin);
            line.push(webrtc);
            line.push(file);
            if (isBusiness) {
                line.push(0);
            } else {
                line.push(cost.toFixed(2));
            }

            csvJSON["data"].push(line);
        });

        return csvJSON;
    }

    _getUser(token, id) {
        return new Promise(function(resolve, reject) {
            let random = Math.floor(Math.random() * 500) + 1;

            setTimeout(() => {
                NodeSDK.get("/api/rainbow/admin/v1.0/users/" + id, token)
                    .then(function(json) {
                        resolve(json);
                    })
                    .catch(err => {
                        NodeSDK.get("/api/rainbow/enduser/v1.0/users/" + id, token)
                            .then(function(json) {
                                resolve(json);
                            })
                            .catch(err => {
                                resolve({
                                    data: {
                                        loginEmail: "unknown",
                                        firstName: "-",
                                        lastName: "-"
                                    }
                                });
                            });
                    });
            }, random);
        });
    }

    _dashboardApplications(token, options) {
        var groups = [];
        var categories = [];

        let apps = [];

        let filterToApply = "format=full&env=deployed&limit=1000";

        filterToApply += "&kpi=" + options.kpi;

        if (options.owner) {
            filterToApply += "&ownerId=" + options.owner;
        }

        filterToApply += "&sortField=ownerId";

        return new Promise((resolve, reject) => {
            this._applications
                ._getGroupMetrics(token)
                .then(jsonGroups => {
                    if (jsonGroups.data) {
                        for (var group in jsonGroups.data) {
                            jsonGroups.data[group].forEach(function(metric) {
                                groups.push(metric);
                            });
                        }
                        categories = jsonGroups.data;
                    }

                    return NodeSDK.get("/api/rainbow/applications/v1.0/applications?" + filterToApply, token);
                })
                .then(jsonApps => {
                    apps = jsonApps.data;

                    let promisesUser = [];

                    apps.forEach(application => {
                        promisesUser.push(this._getUser(token, application.ownerId));
                    });

                    return Promise.all(promisesUser);
                })
                .then(jsonUsers => {
                    jsonUsers.forEach((user, index) => {
                        apps[index].user = user.data;
                    });

                    let promises = [];

                    apps.forEach(application => {
                        let appOptions = Object.assign({}, options);
                        appOptions.appid = application.id;
                        appOptions.forcePeriod = "month";
                        promises.push(this._applications._getMetrics(token, appOptions));
                    });

                    return Promise.all(promises);
                })
                .then(jsonMetrics => {
                    let seconds = ["audio", "video", "webrtc_minutes"];

                    jsonMetrics.forEach((metrics, index) => {
                        var aggregatedApp = [];

                        metrics.data.forEach(metric => {
                            let groups = metric.groupCounters;

                            // Put webrtc trafic in minutes (received in s)
                            groups.forEach(group => {
                                if (seconds.includes(group.group)) {
                                    group.count = Math.round(group.count / 60);
                                }
                            });

                            for (var category in categories) {
                                aggregatedApp.push({
                                    group: category,
                                    count: 0
                                });
                            }

                            groups.forEach(group => {
                                for (var category in categories) {
                                    if (categories[category].includes(group.group)) {
                                        aggregatedApp.forEach((aggregated, index) => {
                                            if (aggregated.group === category) {
                                                aggregatedApp[index].count += group.count;
                                            }
                                        });
                                    }
                                }
                            });

                            apps[index].metrics = aggregatedApp;
                        });
                    });

                    resolve({ data: apps });
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    _dashboardDevelopers(token, options) {
        var filterToApply = "format=full&roles=app_admin&sortField=companyId";

        filterToApply += "&limit=1000";

        let random = Math.floor(Math.random() * 500) + 1;

        let getCompanyInfo = function(id) {
            return new Promise(resolve => {
                setTimeout(() => {
                    NodeSDK.get(`/api/rainbow/admin/v1.0/companies/${id}?format=full`, token)
                        .then(json => {
                            resolve(json.data);
                        })
                        .catch(err => {
                            resolve(null);
                        });
                }, random);
            });
        };

        return new Promise((resolve, reject) => {
            NodeSDK.get("/api/rainbow/admin/v1.0/users?" + filterToApply, token)
                .then(json => {
                    let promises = [];
                    let companies = [];

                    let users = json;

                    users.data.forEach(user => {
                        if (!companies.includes(user.companyId)) {
                            companies.push(user.companyId);
                        }
                    });

                    companies.forEach(id => {
                        promises.push(getCompanyInfo(id));
                    });

                    Promise.all(promises).then(listOfCompanies => {
                        for (let i = 0; i < users.data.length; i++) {
                            let company = listOfCompanies.find(c => {
                                return c.id === users.data[i].companyId;
                            });

                            users.data[i].company = company;
                        }
                        resolve(users);
                    });
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    dashboardApplications(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("Dashboard applications metrics", options.kpi, options);
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
                    return that._dashboardApplications(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.csv) {
                        let columns = [
                            "Name",
                            "Id",
                            "Offer",
                            "Type",
                            "Activity",
                            "Owner name",
                            "Owner country",
                            "Owner email",
                            "Company name",
                            "Creation date",
                            "Deployed date"
                        ];
                        if (options.kpi === "business") {
                            columns.push("Deployed reason");
                        }
                        columns.push(
                            "Current state",
                            "API resources",
                            "API administration",
                            "WebRTC minutes",
                            "File storage",
                            "Fees"
                        );

                        let jsonCSV = that._formatCSVMetrics(json, options);

                        Message.csv(options.csv, jsonCSV.data, false, columns)
                            .then(() => {})
                            .catch(err => {
                                Exit.error();
                            });
                    } else if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.tableDashboardMetrics(json.data, options);
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

    dashboardDevelopers(options) {
        var that = this;

        Message.welcome(options);

        if (this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if (!options.csv) {
                Message.action("Dashboard developers metrics", null, options);
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
                    return that._dashboardDevelopers(that._prefs.token, options);
                })
                .then(function(json) {
                    Message.unspin(spin);
                    Message.log("action done...", json);

                    if (options.csv) {
                        let columns = [
                            "Name",
                            "Firstname",
                            "Country",
                            "Email",
                            "Company name",
                            "Company country",
                            "is BP",
                            "Registration date",
                            "Sandbox registration date",
                            "Payment Method"
                        ];

                        let jsonCSV = that._formatCSVDevelopers(json, options);

                        Message.csv(options.csv, jsonCSV.data, false, columns)
                            .then(() => {})
                            .catch(err => {
                                Exit.error();
                            });
                    } else if (options.noOutput) {
                        Message.out(json.data);
                    } else {
                        Message.tableDashboardDevelopers(json, options);
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

module.exports = CInternal;
