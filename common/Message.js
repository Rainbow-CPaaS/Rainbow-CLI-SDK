"use strict";

const inquirer = require("inquirer");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const csv = require("csv");
const fs = require("fs");
const Logger = require("./Logger");
const moment = require("moment");

const Screen = require("./Print");
const Tools = require("./Tools");

class Message {
    constructor() { }

    _shouldDisplayOutput(options) {
        if (options && "noOutput" in options) {
            return !options.noOutput;
        }

        return true;
    }

    log(message, value) {
        Logger.logs(message, value);
    }

    logError(message, value) {
        Logger.error(message, value);
    }

    welcome(options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }
        Screen.print("");
        Screen.print("Welcome to Alcatel-Lucent Enterprise ".white + "Rainbow CLI".rainbow);
        this.log("CLI/MESSAGE - (welcome) command options", options);
    }

    version(v, options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print("Version installed " + v.yellow);
    }

    action(command, param, options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.action(command, param);
    }

    out(json) {
        console.log(JSON.stringify(json));
    }

    outCSV(csv) {
        console.log(csv);
    }

    csv(file, json, isAlreadyCSV, col) {
        return new Promise((resolve, reject) => {
            if (isAlreadyCSV) {
                fs.writeFile(file, json, "utf8", err => {
                    if (err) {
                        reject(err);
                    } else {
                        Screen.success("Successfully saved to".white + " '".white + file.yellow + "'".white);
                        resolve();
                    }
                });
            } else {
                let columns = col;
                let hasData = json.length > 0;

                if (!columns && hasData) {
                    columns = [];

                    json.map( item =>  {
                        for (var key in item) {
                            if (!columns.include(key)) {
                                columns.push(key);
                            }
                        }
                    });
                    columns = columns.sort();
                }

                let stringify = csv.stringify;
                let writeStream = fs.createWriteStream(file, { flags: "w" });

                stringify(json, {
                    cast: {
                        date: function (value) {
                            return moment(value).format("YYYY-MM-DD");
                        }
                    },
                    delimiter: ";",
                    header: hasData,
                    columns: columns || []
                }).pipe(writeStream);
                writeStream.on("close", function () {
                    Screen.success(
                        "Successfully saved".white +
                        " " +
                        json.length.toString().magenta +
                        " information to".white +
                        " '".white +
                        file.yellow +
                        "'".white
                    );
                    resolve();
                });
                writeStream.on("error", function (err) {
                    reject(err);
                });
            }
        });
    }

    lineFeed() {
        Screen.print("");
    }

    spin(options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        let status = new Spinner("In progress, please wait...");
        status.start();
        return status;
    }

    unspin(spin) {
        if (spin) {
            spin.stop();
        }
    }

    tablePage(json, options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        let page = Math.floor(json.offset / json.limit) + 1;
        let totalPage = Math.floor(json.total / json.limit) + 1;

        Screen.print("Displaying Page ".white + page.toString().yellow + " on ".white + totalPage.toString().yellow);
    }

    tableCompanies(json, options) {
        var array = [];

        array.push([
            "#".gray,
            "Company name".gray,
            "Type".gray,
            "Visibility".gray,
            "Active".gray,
            "Organization".gray,
            "Identifier".gray
        ]);
        array.push([
            "-".gray,
            "------------".gray,
            "----".gray,
            "----------".gray,
            "------".gray,
            "-----------".gray,
            "----------".gray
        ]);

        for (var i = 0; i < json.companies.data.length; i++) {
            var company = json.companies.data[i];

            var visibility = "private".white;
            if (company.visibility === "public") {
                visibility = "public".yellow;
            }

            var offerType = "freemium".white;
            if (company.offerType === "premium") {
                offerType = "premium".yellow;
            }

            var active = "true".white;
            if (company.status !== "active") {
                active = "false".red;
            }

            var organisation = "".white;
            if (company.organisationId) {
                organisation = company.organisationId.yellow;
            }

            var number = i + 1;
            if (Number(options.page) > 0) {
                number = (Number(options.page) - 1) * json.companies.limit + (i + 1);
            }

            array.push([
                number.toString().white,
                company.name.cyan,
                offerType,
                visibility,
                active,
                organisation,
                company.id.white
            ]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.companies.total + " companies found.");
        Screen.print("");
    }

    tableOrganizations(json, options) {
        var array = [];

        array.push(["#".gray, "Organization name".gray, "Visibility".gray, "Identifier".gray]);
        array.push(["-".gray, "-----------------".gray, "----------".gray, "----------".gray]);

        for (var i = 0; i < json.data.length; i++) {
            var org = json.data[i];

            var visibility = "private".white;
            if (org.visibility === "public") {
                visibility = "public".yellow;
            }

            var number = i + 1;
            if (options.page > 0) {
                number = (options.page - 1) * json.limit + (i + 1);
            }

            array.push([number.toString().white, org.name.cyan, visibility, org.id.white]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.total + " organizations found.");
        Screen.print("");
    }

    tablePhones(json, options) {
        var array = [];

        array.push([
            "#".gray,
            "Short number".gray,
            "From System".gray,
            "Voice Mail number".gray,
            "Number".gray,
            "Monitored".gray,
            "ID".gray
        ]);
        array.push([
            "-".gray,
            "------------".gray,
            "-----------".gray,
            "-----------------".gray,
            "------".gray,
            "---------".gray,
            "--".gray
        ]);

        for (var i = 0; i < json.data.length; i++) {
            var phone = json.data[i];

            var number = i + 1;
            if (options.page > 0) {
                number = (options.page - 1) * json.limit + (i + 1);
            }

            var fromSystem = "No".white;
            if (phone.isFromSystem) {
                fromSystem = "Yes".yellow;
            }

            var isMonitored = "No".white;
            if (phone.isMonitored) {
                isMonitored = "True".yellow;
            }

            var longNumber = phone.numberE164 || phone.number || "";
            var vm = phone.voiceMailNumber || "";
            var sn = phone.shortNumber || "";

            array.push([
                number.toString().white,
                sn.cyan,
                fromSystem,
                vm.white,
                longNumber.white,
                isMonitored,
                phone.id.white
            ]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.total + " systems found.");
        Screen.print("");
    }

    tableSystems(json, options) {
        var array = [];

        array.push([
            "#".gray,
            "System name".gray,
            "Version".gray,
            "Status".gray,
            "Type".gray,
            "ID".gray,
            "PBX ID".gray
        ]);
        array.push([
            "-".gray,
            "-----------".gray,
            "-------".gray,
            "------".gray,
            "----".gray,
            "--".gray,
            "------".gray
        ]);

        for (var i = 0; i < json.data.length; i++) {
            var system = json.data[i];

            var number = i + 1;
            if (options.page > 0) {
                number = (options.page - 1) * json.limit + (i + 1);
            }

            var type = system.type || "";
            var version = system.version || "";
            var name = system.name || "";
            var stats = system.status || "";
            if (stats !== "created") {
                stats = stats.yellow;
            } else {
                stats = stats.white;
            }
            var pbxId = system.pbxId.yellow || "";

            array.push([number.toString().white, name.cyan, version.white, stats, type.white, system.id.white, pbxId]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.total + " systems found.");
        Screen.print("");
    }

    tableAPI(json, options) {
        var array = [];
        array.push(["#".gray, "API".gray, "State".gray, "Version".gray]);
        array.push(["-".gray, "---".gray, "-----".gray, "_______".gray]);

        for (var i = 0; i < json.length; i++) {
            let strVersion = "".white;
            let strState = "Not started".red;
            if (json[i].version !== "Not started") {
                strState = "Running".green;
                strVersion = json[i].version.yellow;
            }

            array.push([(i + 1).toString().white, json[i].name.white, strState, strVersion]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success("status successfully executed.");
        Screen.print("");
    }

    tablePlatform(json, options) {
        var array = [];
        array.push(["#".gray, "Rainbow".gray, "Status".gray, "RTT".gray, "EventLoop".gray]);
        array.push(["-".gray, "-------".gray, "------".gray, "---".gray, "---------".gray]);

        for (var i = 0; i < json.length; i++) {
            let eventLoop = json[i].eventloop;
            if (eventLoop === 0) {
                eventLoop = 5;
            }

            let rtt = json[i].rtt;
            let rttStr = rtt.toString() + " ms";
            let eventLoopStr = eventLoop.toString() + " ms";

            array.push([
                (i + 1).toString().white,
                json[i].name.white,
                json[i].status.cyan,
                rtt > 300 ? rttStr.red : rttStr.white,
                eventLoop > 300 ? eventLoopStr.red : eventLoopStr.white
            ]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success("status successfully executed.");
        Screen.print("");
    }

    tableInvoiceCSV(json, options) {
        var invoice = json;
        Screen.print("");
        Screen.print(json);
        Screen.success("Invoice " + options.path + "retrieved");
        Screen.print("");
    }

    tableInvoices(json, options) {
        var array = [];
        array.push([
            "#".gray,
            "Company".gray,
            "Company ID".gray,
            "Type".gray,
            "Period".gray,
            "Initiated".gray,
            "Path".gray
        ]);
        array.push([
            "-".gray,
            "-------".gray,
            "----------".gray,
            "----".gray,
            "------".gray,
            "---------".gray,
            "----".gray
        ]);

        var invoices = json;

        for (var i = 0; i < invoices.length; i++) {
            var companyId = invoices[i].companyId || "";
            var companyName = invoices[i].companyName || "";
            var period = invoices[i].billingPeriod || "";
            var type = invoices[i].invoiceType || "";
            var initiated = invoices[i].invoiceCreationDate || "";
            var path = invoices[i].filepath || "";
            var number = i + 1;

            array.push([
                number.toString().white,
                companyName.cyan,
                companyId.white,
                type.magenta,
                period.white,
                initiated.white,
                path.white
            ]);
        }

        Screen.table(array);
        Screen.print("");

        if (options.companyId) {
            Screen.success(invoices.length + " invoices found for company " + options.companyId);
        } else {
            Screen.success(invoices.length + " invoices found");
        }
        Screen.print("");
    }

    tableApplications(json, options, columns) {
        var array = [];
        var firstLine = [];

        columns.forEach(item => {
            firstLine.push(item.gray);
        });
        array.push(firstLine);
        array.push([
            "-".gray,
            "----".gray,
            "----".gray,
            "-----------".gray,
            "-----".gray,
            "-------".gray,
            "-------".gray,
            "----------".gray,
            "--------".gray,
            "-----".gray,
            "--".gray
        ]);

        var apps = json.data;

        let number = 0;

        apps.forEach(app => {
            let name = app.name || "";

            let type = app.type || "";

            let offer = app.kpi;
            if (offer) {
                offer = offer === "payasyougo" ? offer.green : offer.red;
            }
            if (!offer) {
                offer = "-".white;
            }

            let env = app.env;
            if (env === "sandbox") {
                env = env.white;
            } else {
                env = env.yellow;
            }

            let state = app.state;
            if (state === "blocked" || state == "stopped") {
                state = state.red;
            } else {
                state = state.white;
            }

            let date = moment(app.dateOfCreation).format("ll");

            let dateOfDeploymentRequest = "-".white;
            if (app.dateOfDeploymentRequest) {
                dateOfDeploymentRequest = moment(app.dateOfDeploymentRequest).format("ll").yellow;
            }

            let dateOfDeployment = "-".white;
            if (app.dateOfDeployment) {
                dateOfDeployment = moment(app.dateOfDeployment).format("ll").magenta;
            }

            let ownerId = app.ownerId || "";

            let id = app.id || "";

            array.push([
                (number + 1).toString().white,
                name.white,
                type.cyan,
                env,
                state,
                ownerId.white,
                date.white,
                dateOfDeploymentRequest,
                dateOfDeployment,
                offer,
                id.white
            ]);

            number++;
        });

        Screen.table(array);
        Screen.print("");

        Screen.success(json.total + " applications found");
        Screen.print("");
    }

    tableMetrics(json, options, categories) {
        let array = [];
        array.push(["#".gray, "Period".gray, "Group".gray, "Value".gray]);
        array.push(["-".gray, "------".gray, "-----".gray, "-----".gray]);

        let metrics = json.data;
        let period = json.aggregationPeriod || "hour";
        let start = moment(json.start).format("ll") || "";
        let end = moment(json.end).format("ll") || "";

        let number = 0;

        let grandTotalData = [];
        let seconds = ["audio", "video", "webrtc_minutes"];

        for (var category in categories) {
            grandTotalData.push({
                group: category,
                count: 0
            });
        }

        metrics.forEach(metric => {
            let groups = metric.groupCounters;
            let startDate = metric.aggregationStartDate;

            let firstLine = true;

            if (groups) {
                // Put webrtc trafic in minutes (received in s)
                groups.forEach(group => {
                    if (seconds.includes(group.group)) {
                        group.count = Math.round(group.count / 60);
                    }
                });

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

                var aggregatedData = [];

                if (options.group) {
                    for (var category in categories) {
                        aggregatedData.push({
                            group: category,
                            count: 0
                        });
                    }

                    groups.forEach(group => {
                        for (var category in categories) {
                            if (categories[category].includes(group.group)) {
                                aggregatedData.forEach((aggregated, index) => {
                                    if (aggregated.group === category) {
                                        aggregatedData[index].count += group.count;
                                        grandTotalData[index].count += group.count;
                                    }
                                });
                            }
                        }
                    });
                } else {
                    aggregatedData = groups;
                }

                aggregatedData.forEach(group => {
                    if (firstLine) {
                        array.push([
                            (number + 1).toString().white,
                            startDate.white,
                            group.group.white,
                            group.count.toString().cyan
                        ]);
                        firstLine = false;
                    } else {
                        array.push(["", "", group.group.white, group.count.toString().cyan]);
                    }
                });
                number++;
            }
        });

        if (options.group) {
            let firstLineTotal = true;

            if (number > 0) {
                array.push(["".gray, "".gray, "-----".gray, "-----".gray]);
            }
            grandTotalData.forEach(group => {
                if (firstLineTotal) {
                    array.push([
                        "",
                        start.cyan + " to ".cyan + end.cyan,
                        "GRAND TOTAL " + group.group.toUpperCase(),
                        group.count.toString().bgMagenta
                    ]);
                    firstLineTotal = false;
                } else {
                    array.push(["", "", "GRAND TOTAL " + group.group.toUpperCase(), group.count.toString().bgMagenta]);
                }
            });
        }

        Screen.print("");
        Screen.table(array);
        Screen.print("");
        Screen.print("Interval used".gray + " " + period.yellow + " per ".gray + period.yellow);
        Screen.print("");
        Screen.success(number + " metrics found");
        Screen.print("");
    }

    tableDashboardDevelopers(json, options) {
        var array = [];
        array.push([
            "#".gray,
            "Name".gray,
            "Company".gray,
            "Country".gray,
            "BP".gray,
            "Developer since".gray,
            "Sandbox since".gray,
            "Payment method".gray,
            "ID".gray
        ]);
        array.push([
            "-".gray,
            "----".gray,
            "-------".gray,
            "-------".gray,
            "--".gray,
            "---------------".gray,
            "-------------".gray,
            "--------------".gray,
            "--".gray
        ]);

        var users = json.data;

        var number = 0;

        users.forEach(user => {
            var name = "";
            name = user.displayName;
            if (!name) {
                name = user.firstName + " " + user.lastName;
            }

            number += 1;

            var companyName = user.companyName || "";
            if (companyName.length > 40) {
                companyName = companyName.substr(0, 35) + "...";
            }

            let country = "".white;
            let isBP = "-".white;
            if (user.company) {
                country = user.company.country.white;
                isBP = user.company.isBP
                    ? "YES".magenta
                    : user.company.bpId && user.company.bpId.length > 0
                        ? "AFFILIATE".magenta
                        : "NO".white;
            }

            let developerSince = "in error".red;
            let payAsYouGoSince = "-".white;
            let sandboxSince = "-".white;

            let hasASandboxAccount = user => {
                return user.developer && user.developer.sandbox;
            };

            let hasADeveloperSandboxAccountSucceed = user => {
                return user.developer && user.developer.sandbox && user.developer.sandbox.status === "succeeded";
            };

            let hasAPaymentMethod = user => {
                return Boolean(user.developer.bsAccountId);
            };

            developerSince = moment(user.developer.account.lastUpdateDate).format("LL").white;

            if (hasASandboxAccount(user)) {
                if (hasADeveloperSandboxAccountSucceed(user)) {
                    sandboxSince = moment(user.developer.sandbox.lastUpdateDate).format("LL").white;
                } else {
                    sandboxSince = "in error".red;
                }
            }

            if (hasAPaymentMethod(user)) {
                payAsYouGoSince = moment(user.developer.accountCreationDate).format("LL").yellow;
            }

            array.push([
                number.toString().white,
                name.cyan,
                companyName.white,
                country,
                isBP,
                developerSince,
                sandboxSince,
                payAsYouGoSince,
                user.id.white
            ]);
        });

        Screen.table(array);
        Screen.print("");

        Screen.success(users.length + " developers found / " + json.total);
        Screen.print("");
    }

    tableDashboardInDeployment(json, options) {
        var array = [];
        array.push([
            "#".gray,
            "Name".gray,
            "Id".gray,
            "Environment".gray,
            "Creation date".gray,
            "Request date".gray,
            "Owner name".gray,
            "Owner country".gray,
            "Owner id".gray,
            "Company name".gray,
            "Company country".gray,
            "Is BP/Affiliate".gray
        ]);
        array.push([
            "-".gray,
            "----".gray,
            "--".gray,
            "-----------".gray,
            "-------------".gray,
            "------------".gray,
            "----------".gray,
            "-------------".gray,
            "---------".gray,
            "------------".gray,
            "----------------".gray,
            "---------------".gray
        ]);

        var apps = json.data;

        let increment = 0;

        for (var i = 0; i < apps.length; i++) {
            let app = apps[i];
            let user = app.user;
            let company = app.user.company;
            let number = increment + 1;

            /* Application */
            let appName = app.name || "";
            let appId = app.id || "";
            let appEnv = app.env || "";
            let dateOfCreation = moment(app.dateOfCreation).format("ll");
            let dateOfDeployment = moment(app.dateOfDeploymentRequest).format("ll");

            /* User */
            let userName = "";
            let userCountry = user.country || "";
            let userId = user.id || "";
            userName = user.displayName;
            if (!userName) {
                userName = user.firstName + " " + user.lastName;
            }

            /* Company */
            let isBP = "-".white;
            let companyName = user.companyName || "";
            let companyCountry = company.country || "";
            if (companyName.length > 40) {
                companyName = companyName.substr(0, 35) + "...";
            }
            if (company.isBP) {
                isBP = "YES".yellow;
            } else if (company.bpId && company.bpId.length > 0) {
                isBP = "AFFILIATE".yellow;
            } else {
                isBP = "NO".white;
            }

            array.push([
                number.toString().white,
                appName.cyan,
                appId.white,
                appEnv.white,
                dateOfCreation.white,
                dateOfDeployment.yellow,
                userName.green,
                userCountry.white,
                userId.white,
                companyName.magenta,
                companyCountry.white,
                isBP
            ]);
            increment += 1;
        }

        Screen.table(array);
        Screen.print("");

        Screen.success(increment + " applications found / " + apps.length);
        Screen.print("");
    }

    tableDashboardMetrics(json, options) {
        let getTruncatedData = (data, length) => {
            if (!data) {
                return "";
            }

            if (data.length < length) {
                return data;
            }

            return data.substr(0, length) + "...";
        };

        let array = [];

        if (options.kpi === "business") {
            array.push([
                "#".gray,
                "Name".gray,
                "Owner".gray,
                "External".gray,
                "Deployed".gray,
                "Reason".gray,
                "ID".gray,
                "API Resources".gray,
                "API Admin".gray,
                "WebRTC Minutes".gray,
                "File Storage".gray,
                "Estimated cost".gray
            ]);
            array.push([
                "-".gray,
                "----".gray,
                "-----".gray,
                "--------".gray,
                "--------".gray,
                "------".gray,
                "--".gray,
                "-------------".gray,
                "---------".gray,
                "--------------".gray,
                "------------".gray,
                "--------------".gray
            ]);
        } else {
            array.push([
                "#".gray,
                "Name".gray,
                "Owner".gray,
                "External".gray,
                "Deployed".gray,
                "ID".gray,
                "API Resources".gray,
                "API Admin".gray,
                "WebRTC Minutes".gray,
                "File Storage".gray,
                "Estimated cost".gray
            ]);
            array.push([
                "-".gray,
                "----".gray,
                "-----".gray,
                "--------".gray,
                "--------".gray,
                "--".gray,
                "-------------".gray,
                "---------".gray,
                "--------------".gray,
                "------------".gray,
                "--------------".gray
            ]);
        }

        let number = 0;

        json.forEach(app => {
            let appid = app.id;
            let name = getTruncatedData(app.name, 20);
            let reason = getTruncatedData(app.deployReason, 30);

            let data = app.metrics;
            let user = app.user;
            let username = getTruncatedData(user.firstName + " " + user.lastName, 25);
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

            let internalPatterns = ["al-enterprise.com", "al-mydemo.com", "cpaas.applicationid@provisoire.com"];

            let dateOfDeployment = "-";
            if (app.dateOfDeployment) {
                dateOfDeployment = moment(app.dateOfDeployment).format("ll");
            }

            let isInternal = internalPatterns.some(pattern => {
                return user.loginEmail.includes(pattern);
            });

            if (options.kpi === "business") {
                array.push([
                    (number + 1).toString().white,
                    name.white,
                    username.white,
                    isInternal ? "NO".white : "YES".yellow,
                    dateOfDeployment.white,
                    reason.white,
                    appid.white,
                    res > 0 ? res.toString().cyan : res.toString().white,
                    admin > 0 ? admin.toString().cyan : admin.toString().white,
                    webrtc > 0 ? webrtc.toString().cyan : webrtc.toString().white,
                    file > 0 ? file.toString().cyan : file.toString().white,
                    cost > 0 ? cost.toFixed(3).toString().yellow : cost.toFixed(3).toString().white
                ]);
            } else {
                array.push([
                    (number + 1).toString().white,
                    name.white,
                    username.white,
                    isInternal ? "NO".white : "YES".yellow,
                    dateOfDeployment.white,
                    appid.white,
                    res > 0 ? res.toString().cyan : res.toString().white,
                    admin > 0 ? admin.toString().cyan : admin.toString().white,
                    webrtc > 0 ? webrtc.toString().cyan : webrtc.toString().white,
                    file > 0 ? file.toString().cyan : file.toString().white,
                    cost > 0 ? cost.toFixed(3).toString().yellow : cost.toFixed(3).toString().white
                ]);
            }

            number += 1;
        });

        Screen.print("");

        let configBusiness = {
            1: {
                alignment: "left",
                width: 30,
                truncate: 25
            },
            2: {
                alignment: "left",
                width: 30,
                truncate: 25
            },
            5: {
                alignment: "left",
                width: 30,
                truncate: 25
            }
        };

        Screen.table(array);
        Screen.print("");
        Screen.print("");
        Screen.success(number + " metrics found");
        Screen.print("");
    }

    tableThresholdsGroup(json, options) {
        var array = [];
        array.push([
            "#".gray,
            "Unit".gray,
            "Threshold".gray,
            "Notification".gray,
            "Type".gray
        ]);
        array.push([
            "-".gray,
            "----".gray,
            "---------".gray,
            "------------".gray,
            "----".gray
        ]);

        let number = 0;

        var thresholdsForGroup = json.thresholds;

        thresholdsForGroup.forEach(threshold => {
            array.push([
                (number + 1).toString().white,
                json.unit,
                threshold.threshold,
                threshold.notification,
                threshold.type
            ]);
            number++;
        });

        Screen.table(array);
        Screen.print("");

        Screen.success(thresholdsForGroup.length + " thresholds found for API group " + json.groupName);
        Screen.print("");
    }

    tableThresholds(json, options) {
        var array = [];
        array.push([
            "#".gray,
            "Group Name".gray,
            "Unit".gray,
            "Threshold".gray,
            "Notification".gray,
            "Type".gray
        ]);
        array.push([
            "-".gray,
            "----------".gray,
            "----".gray,
            "---------".gray,
            "------------".gray,
            "----".gray
        ]);

        var thresholdsList = json.data;

        let number = 0;

        thresholdsList.forEach(thresholdsGroup => {
            var thresholdsForGroup = thresholdsGroup.thresholds;

            thresholdsForGroup.forEach(threshold => {
                array.push([
                    (number + 1).toString().white,
                    thresholdsGroup.groupName,
                    thresholdsGroup.unit,
                    threshold.threshold,
                    threshold.notification,
                    threshold.type
                ]);
                number++;
            });
        });

        Screen.table(array);
        Screen.print("");

        Screen.success(thresholdsList.length + " thresholds found");
        Screen.print("");
    }

    tableApns(json, options) {
        var array = [];
        array.push([
            "#".gray,
            "OS".gray,
            "Type".gray,
            "Created on".gray,
            "Last Update".gray,
            "Enabled".gray,
            "Id".gray
        ]);
        array.push([
            "-".gray,
            "--".gray,
            "----".gray,
            "----------".gray,
            "-----------".gray,
            "-------".gray,
            "--".gray
        ]);

        var apnsList = json.data;

        let number = 0;

        apnsList.forEach(apns => {
            let os = apns.type === "apns" ? "IOS".cyan : "Android".magenta;

            let type = apns.type === "apns" ? apns.certificateType : apns.type;

            let id = apns.id || "";

            let lastUpdate = apns.lastUpdateDate ? apns.lastUpdateDate : apns.dateOfCreation;

            let lastUpdateStr = moment(lastUpdate).format("lll");

            let dateOfCreation = apns.dateOfCreation;

            let dateOfCreationStr = moment(dateOfCreation).format("lll");

            let isEnabled = apns.isEnabled ? "YES".green : "NO".red;

            array.push([
                (number + 1).toString().white,
                os,
                type.white,
                dateOfCreationStr.white,
                lastUpdateStr.white,
                isEnabled,
                id.yellow
            ]);

            number++;
        });

        Screen.table(array);
        Screen.print("");

        Screen.success(apnsList.length + " push notification settings found");
        Screen.print("");
    }

    tableUsers(json, options) {
        var array = [];
        array.push([
            "#".gray,
            "Name".gray,
            "LoginEmail".gray,
            "Company".gray,
            "Account".gray,
            "Roles".gray,
            "Active".gray,
            "ID".gray
        ]);
        array.push([
            "-".gray,
            "----".gray,
            "----------".gray,
            "-------".gray,
            "-------".gray,
            "-----".gray,
            "------".gray,
            "--".gray
        ]);

        var users = json.data;

        var companyId = "";

        for (var i = 0; i < users.length; i++) {
            if (options.company || options.companyId) {
                companyId = users[i].companyId;
            }

            var accountType = users[i].accountType;
            if (accountType === "free") {
                accountType = accountType.white;
            } else {
                accountType = accountType.yellow;
            }

            var roles = users[i].roles.join();

            var active = "true".white;
            if (!users[i].isActive) {
                active = "false".yellow;
            }

            var name = "";
            name = users[i].displayName;
            if (!name) {
                name = users[i].firstName + " " + users[i].lastName;
            }

            var number = i + 1;
            if (options.page > 0) {
                number = (options.page - 1) * json.limit + (i + 1);
            }

            var companyName = users[i].companyName || "";

            array.push([
                number.toString().white,
                name.cyan,
                users[i].loginEmail.white,
                companyName.white,
                accountType,
                roles.white,
                active,
                users[i].id.white
            ]);
        }

        Screen.table(array);
        Screen.print("");

        if (options.company) {
            Screen.success(json.total + " users found in company " + options.company);
        } else if (options.companyId) {
            Screen.success(json.total + " users found in company " + options.companyId);
        } else {
            Screen.success(json.total + " users found");
        }
        Screen.print("");
    }

    tableNetwork(json, options) {
        var array = [];
        array.push([
            "#".gray,
            "Name".gray,
            "LoginEmail".gray,
            "Company".gray,
            "Presence".gray,
            "Active".gray,
            "ID".gray
        ]);
        array.push([
            "-".gray,
            "----".gray,
            "----------".gray,
            "-------".gray,
            "-------_".gray,
            "-----".gray,
            "--".gray
        ]);

        var users = json.data;
        var number = 0;

        users.forEach(user => {
            var active = "YES".white;
            if (user.isTerminated) {
                active = "NO".yellow;
            }

            var presence = "NO".white;
            if (user.showPresence) {
                presence = "YES".yellow;
            }

            var name = "";
            name = user.displayName;
            if (!name) {
                name = user.firstName + " " + user.lastName;
            }

            number += 1;
            if (options.page > 0) {
                number = (options.page - 1) * 1000 + number;
            }

            var companyName = user.companyName || "";

            array.push([
                number.toString(),
                name.cyan,
                user.loginEmail.white,
                companyName.white,
                presence,
                active,
                user.id.white
            ]);
        });

        Screen.table(array);
        Screen.print("");

        Screen.success(json.total + " users found");
        Screen.print("");
    }

    tableSites(json, options) {
        var array = [];

        array.push(["#".gray, "Site name".gray, "Status".gray, "ID".gray, "Company ID".gray]);
        array.push(["-".gray, "---------".gray, "------".gray, "--".gray, "----------".gray]);

        for (var i = 0; i < json.data.length; i++) {
            var site = json.data[i];

            var active = "true".white;
            if (site.status !== "active") {
                active = "false".red;
            }

            var number = i + 1;
            if (options.page > 0) {
                number = (options.page - 1) * json.limit + (i + 1);
            }

            array.push([number.toString().white, site.name.cyan, active, site.id.white, site.companyId.white]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.total + " sites found.");
        Screen.print("");
    }

    tableOffers(json, options) {
        var array = [];

        array.push([
            "#".gray,
            "Name".gray,
            "Business Model".gray,
            "Can be sold".gray,
            "Profile Id".gray,
            "ID".gray,
            "Description".gray
        ]);
        array.push([
            "-".gray,
            "----".gray,
            "--------------".gray,
            "-----------".gray,
            "-----------".gray,
            "--".gray,
            "-----------".gray
        ]);

        for (var i = 0; i < json.data.length; i++) {
            var offer = json.data[i];

            var canBeSold = "false".white;
            if (offer.canBeSold) {
                canBeSold = "true".yellow;
            }

            var business = "";
            if (offer.businessModel) {
                business = offer.businessModel;
            }

            var number = i + 1;
            if (options.page > 0) {
                number = (options.page - 1) * json.limit + (i + 1);
            }

            array.push([
                number.toString().white,
                offer.name.cyan,
                business.white,
                canBeSold,
                offer.profileId.white,
                offer.id.white,
                offer.description.white
            ]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.total + " offers found.");
        Screen.print("");
    }

    tableCatalogs(json, options, offers) {
        var array = [];

        array.push(["#".gray, "Name".gray, "ID".gray, "Offer Id".gray, "Offer name".gray]);
        array.push(["-".gray, "----".gray, "--".gray, "--------".gray, "-----------".gray]);

        for (var i = 0; i < json.data.length; i++) {
            var catalog = json.data[i];

            var number = i + 1;
            if (options.page > 0) {
                number = (options.page - 1) * json.limit + (i + 1);
            }

            var nbOffer = catalog.offersList.length;
            var offer = "";
            if (nbOffer === 0) {
                offer = "No offers".red;
            } else if (nbOffer == 1) {
                offer = "1 offer".green;
            } else {
                offer = nbOffer.toString().yellow + " offers".yellow;
            }

            var details = "";
            if (nbOffer > 0) {
                details = "";
            }

            array.push([number.toString().white, catalog.name.cyan, catalog.id.white, offer, details]);

            catalog.offersList.forEach(offerId => {
                var offer = offers.find(offerItem => {
                    return offerItem.id === offerId;
                });

                if (offer) {
                    array.push([" ".white, " ".cyan, " ".white, offerId.white, offer.name]);
                } else {
                }
            });
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.total + " catalogs found.");
        Screen.print("");
    }

    table2D(json) {
        function isObject(value) {
            return value && typeof value === "object" && value.constructor === Object;
        }

        var array = [];
        array.push(["#".gray, "Attribute".gray, "Content".gray]);
        array.push(["-".gray, "---------".gray, "-------".gray]);
        var index = 1;
        for (var key in json) {
            var data = json[key];
            if (isObject(data)) {
                array.push([index.toString().white, key.toString().cyan, ""]);
                for (key in data) {
                    if (data[key] == null) {
                        array.push(["", "", key.yellow + ": ".white + JSON.stringify(data[key]).blue]);
                    } else if (typeof data[key] === "boolean") {
                        array.push(["", "", key.yellow + ": ".white + JSON.stringify(data[key]).magenta]);
                    } else {
                        array.push(["", "", key.yellow + ": ".white + JSON.stringify(data[key]).white]);
                    }
                }
            } else {
                if (key === "id") {
                    key = key.white.bgCyan;
                    data = JSON.stringify(data).white.bgCyan;
                } else {
                    key = key.cyan;
                    if (data == null) {
                        data = JSON.stringify(data).blue;
                    } else if (typeof data === "boolean") {
                        data = JSON.stringify(data).magenta;
                    } else {
                        data = JSON.stringify(data).white;
                    }
                }

                array.push([index.toString().white, key, data]);
            }

            index += 1;
        }

        Screen.table2D(array);
        Screen.print("");
    }

    tableImports(json, options) {
        var array = [];

        array.push([
            "#".gray,
            "ReqId".gray,
            "Status".gray,
            "Success".gray,
            "Warning".gray,
            "Failed".gray,
            "Company".gray,
            "From".gray,
            "Date".gray
        ]);
        array.push([
            "-".gray,
            "-------".gray,
            "------".gray,
            "-------".gray,
            "-------".gray,
            "------".gray,
            "-------".gray,
            "----".gray,
            "----".gray
        ]);

        for (var i = 0; i < json.length; i++) {
            let imports = json[i];
            var number = (i + 1).toString();
            let request = imports.reqId.toString() || "";
            let status = imports.status || "";
            let success = imports.counters.succeeded.toString() || "-";
            let failed = imports.counters.failed.toString() || "-";
            let warning = imports.counters.warnings.toString() || "-";
            let company = imports.companyId || "";
            let from = imports.userId || "";
            let date = imports.startTime.toString() || "";

            array.push([
                number.white,
                request.white,
                status.yellow,
                success.green,
                failed.red,
                warning.red,
                company.white,
                from.white,
                date.white
            ]);
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.length + " import(s) found.");
        Screen.print("");
    }

    tableCommands(json, options) {
        var array = [];

        array.push(["Level".gray, "Theme".gray, "Commands".gray, "Details".gray]);
        array.push(["-----".gray, "-----".gray, "--------".gray, "-------".gray]);

        var previousLevel = "";
        var previousTheme = "";

        for (var i = 0; i < json.data.length; i++) {
            var command = json.data[i];

            var active = "true".white;

            var level = command.level !== previousLevel ? command.level : "";
            previousLevel = command.level;

            var theme = command.theme !== previousTheme ? command.theme : "";
            previousTheme = command.theme;

            if (theme === "----------") {
                array.push([level.gray, theme.gray, command.command.gray, command.details.gray]);
            } else {
                array.push([level.cyan, theme.white, command.command.yellow, command.details.white]);
            }
        }

        Screen.table(array);
        Screen.print("");
        Screen.success("Available commands listed successfully.");
        Screen.print("");
    }

    tableMethods(json, options) {
        var array = [];

        array.push([
            "#".gray,
            "Id".gray,
            "Exp".gray,
            "Holder".gray,
            "Active".gray,
            "Type".gray,
            "Mask".gray,
            "Bank".gray,
            "Date".gray
        ]);
        array.push([
            "-".gray,
            "---".gray,
            "--".gray,
            "------".gray,
            "------".gray,
            "----".gray,
            "----".gray,
            "----".gray,
            "----".gray
        ]);

        // ack detect default payment
        let defaultPayment = null;

        json.data.forEach(method => {
            if (!defaultPayment) {
                defaultPayment = method;
            } else {
                if (moment(defaultPayment.CreatedDate).isBefore(moment(method.CreatedDate))) {
                    defaultPayment = method;
                }
            }
        });

        for (var i = 0; i < json.data.length; i++) {
            let method = json.data[i];

            var number = (i + 1).toString();
            let id = method.Id.toString() || "";
            let exp = method.CreditCardExpirationMonth.toString() + "/" + method.CreditCardExpirationYear.toString();
            let holder = method.CreditCardHolderName.toString() || "-";
            let active = method.Active.toString() || "-";
            let type = method.Type.toString() + "/" + method.CreditCardType.toString() || "-";
            let mask = method.CreditCardMaskNumber.toString() || "";
            let bank = method.BankIdentificationNumber.toString() || "";
            let date = moment(method.UpdatedDate.toString()).format("LLL") || "";

            if (defaultPayment.Id === method.Id) {
                array.push([
                    number.bgYellow,
                    id.bgYellow,
                    exp.bgYellow,
                    holder.bgYellow,
                    "true".bgYellow,
                    type.bgYellow,
                    mask.bgYellow,
                    bank.bgYellow,
                    date.bgYellow
                ]);
            } else {
                array.push([
                    number.white,
                    id.white,
                    exp.white,
                    holder.green,
                    "false".white,
                    type.white,
                    mask.white,
                    bank.white,
                    date.white
                ]);
            }
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(json.data.length + " method(s) found.");
        Screen.print("");
    }

    tableSubscriptions(json, options) {
        var array = [];

        array.push(["#".gray, "Application ID".gray, "Name".gray, "Id".gray, "Date".gray]);
        array.push(["-".gray, "--------------".gray, "----".gray, "--".gray, "----".gray]);

        let total = 0;

        for (var i = 0; i < json.length; i++) {
            let subscriptions = json[i].subscriptions;
            let applicationid = json[i].applicationId ? json[i].applicationId.toString() : json[i].id.toString() || "";

            if (subscriptions.length === 0) {
                array.push(["", applicationid.cyan, "No subscription", "", ""]);
            } else {
                for (var j = 0; j < subscriptions.length; j++) {
                    total++;
                    var number = (j + 1).toString();
                    let name = subscriptions[j].offerName || "";
                    let id = subscriptions[j].offerId || "";
                    let date = moment(subscriptions[j].creationDate).format("LLL") || "";

                    if (number === 1) {
                        array.push([number.white, applicationid.magenta, name.white, id.yelow, date.white]);
                    } else {
                        array.push([number.white, "", name.white, id.yelow, date.white]);
                    }
                }
            }
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(total + " subscription(s) found.");
        Screen.print("");
    }

    tableInvoicesDeveloper(json, options) {
        var array = [];

        array.push(["#".gray, "Name".gray, "Period".gray, "Amount".gray, "id".gray]);
        array.push(["-".gray, "----".gray, "------".gray, "------".gray, "--".gray]);

        let total = 0;

        for (var i = 0; i < json.length; i++) {
            let invoices = json[i].invoices;

            if (invoices.length === 0) {
                array.push(["", "No invoices", "", "", ""]);
            } else {
                /*
                for (var j = 0; j < invoices.length; j++) {
                    total++;
                    var number = (j+1).toString();
                    let name = subscriptions[j].offerName || "";
                    let id = subscriptions[j].offerId || "";
                    let date = moment(subscriptions[j].creationDate).format("LLL") || "";

                    if(number === 1) {
                        array.push([ number.white, applicationid.magenta, name.white, id.yelow, date.white ]);
                    } else {
                        array.push([ number.white, "", name.white, id.yelow, date.white ]);
                    }
                }
                */
            }
        }

        Screen.table(array);
        Screen.print("");
        Screen.success(total + " invoice(s) found.");
        Screen.print("");
    }

    loggedin(prefs, options) {
        let user = prefs.user;
        let host = prefs.host;

        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        let email = null;
        let roles = null;
        let adminType = "";
        if (user && user.loginEmail) {
            email = user.loginEmail;
        }
        if (user && user.roles) {
            roles = user.roles.join(" + ");
        }

        if (user && user.roles) {
            if (user.roles.includes("user")) {
                if (adminType.length === 0) {
                    adminType = "user";
                }
            }

            if (user.roles.includes("app_admin")) {
                if (adminType.length > 0) {
                    adminType = "app_admin > " + adminType;
                } else {
                    adminType = "app_admin > user";
                }
            }

            if (user.roles.includes("app_admin_internal")) {
                if (adminType.length > 0) {
                    adminType = "app_admin_internal > " + adminType;
                } else {
                    adminType = "app_admin_internal > user";
                }
            }

            if (user.roles.includes("app_superadmin")) {
                if (adminType.length > 0) {
                    adminType = "app_superadmin > " + adminType;
                } else {
                    adminType = "app_superadmin > app_admin > user";
                }
            }

            switch (user.adminType) {
                case "company_admin":
                    adminType = "company_admin" + " > " + adminType;
                    break;
                case "organization_admin":
                    adminType = "organization_admin" + " > " + adminType;
                    break;
            }

            if (user.roles.includes("bp_admin")) {
                if (adminType.length > 0) {
                    adminType = "bp_admin > " + adminType;
                } else {
                    adminType = "bp_admin > organization_admin (*) > company_admin > user";
                }
            }

            if (user.roles.includes("superadmin")) {
                if (adminType.length > 0) {
                    adminType = "superadmin > " + adminType;
                } else {
                    adminType = "superadmin > organization_admin (*) > company_admin > user";
                }
            }
        }

        if (email && roles && adminType) {
            Screen.print("You are logged in as".grey + " " + email.yellow + " on platform ".grey + host.yellow);
            Screen.print("Your roles".grey + " " + roles.magenta);
            Screen.print("Your level".grey + " " + adminType.cyan);
        } else {
            Screen.print("You are ".grey + "not logged in".yellow + " to Rainbow".grey);
        }

        Screen.print("");
    }

    notLoggedIn(options) {
        if (!this._shouldDisplayOutput(options)) {
            let error = {
                code: -2,
                label: "UNAUTHORIZED",
                msg: "Not logged",
                details: {
                    code: 401,
                    msg: "Unauthorized",
                    details: "Invalid session, expected to be logged-in."
                }
            };
            console.log(JSON.stringify(error));
            return;
        }

        Screen.error("Please, you have to log-in before executing other commands");
    }

    success(options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.success("Command successfully completed");
    }

    print(text, options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print(text.white);
    }

    printSuccess(text, value, options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print(text.white + " '".cyan + value.toString().cyan + "'".cyan);
    }

    canceled(options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print("Your command has been canceled");
        Screen.print("");
    }

    notFound() {
        Screen.error("Command not found");
        Screen.print("Type ".white + "rbw commands".yellow + " for the list of available commands".white);
        Screen.print("Type ".white + "rbw <command> --help".yellow + " for the list of command's options".white);
        Screen.print("");
    }

    found(number, type, options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }
        Screen.print("");
        Screen.print(number.toString().yellow + " " + type.yellow + " match".white);
    }

    warn(text, value, options) {
        if (!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print("Warning, ".red + text.white + " '".cyan + value.cyan + "'".cyan);
    }

    errorCommand() {
        let msg =
            "Invalid command. Type option ".white + "--help".yellow + " to get the list of available options".white;
        Screen.error(msg);
        Screen.print("");
    }

    errorList(err, options, itemId) {
        if (!this._shouldDisplayOutput(options)) {
            var out = new Buffer.from(JSON.stringify(err));
            process.stdout.write(out);
            process.stdout.write("\r\n");
            return;
        }

        let msg = "Can't execute the command for ".white + itemId.red;
        msg += " - ".gray + err.msg.gray + "/".gray + err.code.toString().gray;

        Screen.error(msg);
    }

    error(err, options) {
        if (!this._shouldDisplayOutput(options)) {
            var out = new Buffer.from(JSON.stringify(err));
            process.stdout.write(out);
            process.stdout.write("\r\n");
            return;
        }

        Screen.print("");
        Screen.error("Can't execute the command".white);

        if (!err) {
            Screen.print("  No additional information");
        } else if (err.error && err.error.errorDetails) {
            if (typeof err.error.errorDetails === "string") {
                Screen.print(" " + err.error.errorDetails.white);
            }
            else if (Array.isArray(err.error.errorDetails)) {
                Screen.print("At least one parameter is incorrect:");
                err.error.errorDetails.forEach(function (detail) {
                    Screen.print(" - ".white + detail.param.yellow + ": ".gray + detail.msg.white);
                });
                Screen.print("");
                Screen.print("Add option -h to display examples");
            }
            else if (Tools.isObject(err.error.errorDetails)) {
                let details = err.error.errorDetails.details || err.msg || "Bad request";
                let msg = err.details.msg || "-";
                Screen.print(
                    " " + details.white + " (".gray + msg.gray + ")".gray
                );
            } else {
                Screen.print("At least one parameter is incorrect.");
                Screen.print("Add option -h to display examples.");
            }
        }
        else if (err.msg && err.details) {
            Screen.print(err.msg.white + ": " + err.details);
        }
        else if (err.msg && err.code) {
            let code = err.code | "-";
            Screen.print("  (".gray + err.msg.gray + "/".gray + code.toString().gray + ")".gray);
        } 
        else if (err.name && err.message) {
            Screen.print(`  Error of type ${err.name} - ${err.message}`);
            if (err.fileName) {
                Screen.print(`  In file ${err.fileName}, ${err.lineNumber}:${err.columnNumber}`);
            }
            if (err.stack) {
                Screen.print(err.stack);
            }
        }
        else if (err.details) {
            Screen.print("  " + err.details.white);
        }
        Screen.print("");
    }

    choices(message, choices, selectedValue) {
        return new Promise(function (resolve) {
            if (selectedValue) {
                resolve(selectedValue);
                return;
            }

            var question = {
                type: "list",
                message: message,
                choices: choices,
                name: "confirmation"
            };

            inquirer.prompt([question]).then(function (answer) {
                resolve(answer.confirmation);
            });
        });
    }

    confirm(message) {
        return new Promise(function (resolve) {
            var question = {
                type: "list",
                message: message,
                choices: [{ name: "Yes", value: true }, { name: "Damned!, forget my command...", value: false }],
                name: "confirmation"
            };

            inquirer.prompt([question]).then(function (answer) {
                resolve(answer.confirmation);
            });
        });
    }

    ask(message, defaultValue) {
        return new Promise(function (resolve) {
            var question = {
                type: "input",
                message: message,
                name: "query"
            };

            if (defaultValue !== undefined) {
                question.default = defaultValue;
            }

            inquirer.prompt([question]).then(function (answer) {
                resolve(answer.query);
            });
        });
    }

    askPassword(message, name) {
        return new Promise(function (resolve) {
            var question = {
                type: "password",
                message: message,
                name: "query",
                default: "Password_123"
            };

            inquirer.prompt([question]).then(function (answer) {
                resolve(answer.query);
            });
        });
    }
}

module.exports = new Message();
