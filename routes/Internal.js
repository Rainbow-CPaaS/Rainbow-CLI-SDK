"use strict";

let CInternal = require("../commands/CInternal");
const Logger = require("../common/Logger");
const Middleware = require("../common/Middleware");
const Message = require("../common/Message");

class Internal {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._internal = new CInternal(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() { }
    listOfCommands() {
        var that = this;

        this._program
            .command("dashboard payasyougo")
            .description("Display pay-as-you-go applications metrics for current month")
            .option("-m, --month <month>", "Get metrics for a specific month. Format is YYYYMM")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-o, --owner <ownerid>", "Filter by owner of applications")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .action(function (commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        var options = {
                            month: commands.month,
                            group: true,
                            csv: commands.file,
                            owner: commands.owner,
                            kpi: "payasyougo"
                        };

                        that._internal.dashboardApplications(options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });

        this._program
            .command("dashboard business")
            .description("Display business applications metrics for current month")
            .option("-m, --month <month>", "Get metrics for a specific month. Format is YYYYMM")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-o, --owner <ownerid>", "Filter by owner of applications")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .action(function (commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        var options = {
                            month: commands.month,
                            group: true,
                            csv: commands.file,
                            owner: commands.owner,
                            kpi: "business"
                        };

                        that._internal.dashboardApplications(options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });

        this._program
            .command("dashboard internal")
            .description("Display internal applications metrics for current month")
            .option("-m, --month <month>", "Get metrics for a specific month. Format is YYYYMM")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-o, --owner <ownerid>", "Filter by owner of applications")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .action(function (commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        var options = {
                            month: commands.month,
                            group: true,
                            csv: commands.file,
                            owner: commands.owner,
                            kpi: "internal"
                        };

                        that._internal.dashboardApplications(options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });

        this._program
            .command("dashboard indeployment")
            .description("Display indeployment applications")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .action(function (commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        var options = {
                            noOutput: commands.json || false,
                            csv: commands.file
                        };

                        that._internal.dashboardInDeployment(options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });

        this._program
            .command("dashboard developers")
            .description("Display developers metrics for current month")
            .option("-m, --month <month>", "Get metrics for a specific month. Format is YYYYMM")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-s, --sandbox", "Get developers sandbox metrics instead")
            .option("-p, --pay", "Get developers pay as you go metrics instead")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .action(function (commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        var options = {
                            noOutput: commands.json || false,
                            month: commands.month,
                            csv: commands.file || "",
                            sandbox: commands.sandbox || false,
                            pay: commands.pay || false,
                            format: "full"
                        };

                        that._internal.dashboardDevelopers(options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });
    }
}

module.exports = Internal;
