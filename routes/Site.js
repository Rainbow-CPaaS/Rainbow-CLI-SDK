"use strict";

var CSite = require("../commands/CSite");
var Logger = require("../common/Logger");
var Middleware = require("../common/Middleware");

class Site {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._site = new CSite(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {}
    listOfCommands() {
        var that = this;

        this._program
            .command("site", "<id>")
            .description("Retrieve information about an existing site")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw site 58920e130bbe4b2f703bd382");
                console.log("    $ rbw site 58920e130bbe4b2f703bd382 --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the site to the console");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._site.getSite(id, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("create site", "<name> [companyId]")
            .description("Create a new site")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw create site aSite");
                console.log("    $ rbw create site aSite 589dc6ba0bbe4b2f703bd67d");
                console.log("    $ rbw create site aSite 589dc6ba0bbe4b2f703bd67d --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports the JSON object representing the site created to the console"
                );
            })
            .action(function(name, companyId, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._site.createSite(name, companyId, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("delete site", "<id>")
            .description("Delete an existing site")
            .option("--nc", "Do not ask confirmation")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw delete site 58920e130bbe4b2f703bd382");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--nc` allows to delete the existing site without asking for a confirmation (can be used from a script)"
                );
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noconfirmation: commands.nc || false,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._site.deleteSite(id, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("sites")
            .description("List all existing sites")
            .option("-p, --page <number>", "Display a specific page")
            .option("-l, --limit <number>", "Limit to a number of instances per page (max=1000")
            .option("-m, --max", "Same as --limit 1000")
            .option("-c, --company <companyid>", "Filter by company")
            .option("-n, --name <name>", "Filter by name")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw sites");
                console.log("    $ rbw sites --max");
                console.log("    $ rbw sites --company 589dc6ba0bbe4b2f703bd67d");
                console.log("    $ rbw sites --company 589dc6ba0bbe4b2f703bd67d --json");
                console.log("    $ rbw sites --company 589dc6ba0bbe4b2f703bd67d --file output.csv");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports the JSON object representing the site created to the console"
                );
                console.log("    The options `--page` and `limit` allow to navigate between paginated results");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            csv: "",
                            company: "",
                            page: "1",
                            limit: "25"
                        };

                        var page = "1";
                        if ("page" in commands) {
                            if (commands.page > 1) {
                                page = commands.page;
                            }
                        }

                        var limit = "25";
                        if ("limit" in commands && commands.limit) {
                            if (commands.limit > 0) {
                                limit = commands.limit;
                            }
                        }

                        options = {
                            company: commands.company || "",
                            name: commands.name || "",
                            noOutput: commands.json || false,
                            csv: commands.file || "",
                            page: page,
                            limit: limit
                        };

                        if (commands.max) {
                            options.limit = 1000;
                        }

                        Logger.isActive = commands.verbose || false;

                        that._site.getSites(options);
                    })
                    .catch(() => {});
            });
    }
}

module.exports = Site;
