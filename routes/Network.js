"use strict";

var CNetwork = require("../commands/CNetwork");
var Logger = require("../common/Logger");
var Helper = require("../common/Helper");
var Middleware = require("../common/Middleware");

class Network {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._network = new CNetwork(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {}

    listOfCommands() {
        var that = this;

        this._program
            .command("network")
            .description("List contacts of the network")
            //.option("-p, --page <number>", "Display a specific page")
            //.option("-l, --limit <number>", "Limit to a number of instances per page (max=1000)")
            //.option("-m, --max", "Same as --limit 1000")

            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        var options = {
                            format: "full",
                            page: "1",
                            limit: "25"
                        };

                        var page = "1";
                        var limit = "25";
                        var format = "full";

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

                        options = {
                            noOutput: commands.json || false,
                            format: format,
                            page: page,
                            limit: limit
                        };

                        if (commands.max) {
                            options.limit = 1000;
                        }

                        that._network.list(options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });
    }
}

module.exports = Network;
