"use strict";

var CBotsService = require("../commands/CBotsService");
var Logger = require("../common/Logger");
var Middleware = require("../common/Middleware");

class BotsService {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._botsservice = new CBotsService(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {

    }

    listOfCommands() {
        var that = this;

        this._program
            .command("bot services" ,"[cid]")
            .description("Get all bot services for a company")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-f, --format <format>", "Format small, medium or full (default small)")
            .option("-l, --limit <number>", "Limit to a number of instances per page")
            .option("-p, --page <number>", "Display a specific page")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw bot services");
                console.log("");
            })
            .action(function(cid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var page = "1";
                        var limit = "25";
                        var format = "small";

                        if ("page" in commands) {
                            if (commands.page > 1) {
                                page = commands.page;
                            }
                        }

                        if ("limit" in commands && commands.limit) {
                            if (commands.limit > 0) {
                                limit = commands.limit;
                            }
                        }

                        let options = {
                            noOutput: commands.json || false,
                            format: format || "full",
                            cid: cid || null,
                            page,
                            limit
                        };

                        Logger.isActive = commands.verbose || false;

                        that._botsservice.getBotServices(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("bot service", "<serviceid> [cid]")
            .description("Get a bot service data for a company")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw bot service 57e9145c271842ca2e12c0c5");
                console.log("");
            })
            .action(function(serviceid, cid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        let options = {
                            noOutput: commands.json || false,
                            cid: cid || null,
                            serviceid: serviceid
                        };

                        Logger.isActive = commands.verbose || false;

                        that._botsservice.getBotService(options);
                    })
                    .catch(() => {});
            });
    }
}

module.exports = BotsService;