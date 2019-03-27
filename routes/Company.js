"use strict";

var CCompany = require("../commands/CCompany");
var Logger = require("../common/Logger");
var Middleware = require("../common/Middleware");

class Company {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._company = new CCompany(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {}

    listOfCommands() {
        function list(val) {
            return val.split(",");
        }

        var that = this;

        this._program
            .command("company", "[id]")
            .description("Retrieve information about an existing company or my company")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company");
                console.log("    $ rbw company 57ea7475d78f3ba5aae98935");
                console.log("    $ rbw company 57ea7475d78f3ba5aae98935 --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the company to the console");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._company.getCompany(id, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company create", "<name>")
            .description("Create a new company")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--public", "Create a public company")
            .option("--organization", "Create a public company limited to the surrounding organization")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log('    $ rbw company create "A new company"');
                console.log('    $ rbw company create "A new company" --json');
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports the JSON object representing the company created to the console"
                );
                console.log("");
            })
            .action(function(name, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        let visibility = "private";
                        if (commands.public) {
                            visibility = "public";
                        } else if (commands.organization) {
                            visibility = "organization";
                        }

                        var options = {
                            noOutput: commands.json || false,
                            visibility: visibility,
                            name: name
                        };

                        Logger.isActive = commands.verbose || false;

                        that._company.createCompany(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company delete", "<id>")
            .description("Delete an existing company")
            .option("--nc", "Do not ask confirmation")
            .option("-f, --force", "Force to remove the company and the users if exist")
            .option("-l, --list <items>", "A list", function(val) {
                return val.split(",");
            })
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company delete 57ea7475d78f3ba5aae98935");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--nc` disables confirmation");
                console.log(
                    "    The option `--force` deletes the company even if users exist (in that case, users are deleted first)"
                );
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noconfirmation: commands.nc || false,
                            force: commands.force || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._company.deleteCompany(id, options);
                    })
                    .catch(() => {});
            });

        /*
        this._program.command('delete companies')
        .description("Delete several companies by their id")
        .option('-l, --list <items>', 'The list of companies to remove', function(val) {
            return val.split(',');})
        .option('--nc', 'Do not ask confirmation')
        .option('-f, --force', 'Force to remove the company and the users if exist')

        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw delete companies 57ea7475d78f3ba5aae98935,57ea7475d78f3ba5aae98564');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--nc` disables confirmation');
            console.log('    If there are users, they are removed first');
            console.log('');
        })
        .action(function (commands) {

            var options = {
                noconfirmation: commands.nc || false,
                list: commands.list || null,
                force: commands.force || false,
            };

            Logger.isActive = commands.verbose || false;

            that._company.deleteCompanies(options);
        });
        */

        this._program
            .command("company status", "[id]")
            .description("Give a status on a company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company status");
                console.log("    $ rbw company status 57ea7475d78f3ba5aae98935");
                console.log("");
                console.log("  Details:");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._company.statusCompany(id, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company metrics", "[id]")
            .description("Give metrics on a company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company metrics");
                console.log("    $ rbw company metrics 57ea7475d78f3ba5aae98935");
                console.log("");
                console.log("  Details:");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: id || null,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._company.metricsCompany(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company metrics daily", "[id]")
            .description("Give daily metrics on a company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company metrics daily");
                console.log("    $ rbw company metrics daily 57ea7475d78f3ba5aae98935");
                console.log("");
                console.log("  Details:");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: id || null,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._company.metricsCompanyDaily(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company link", "<id> [orgid]")
            .description("Link the company to an organization")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company link 57ea7475d78f3ba5aae98935");
                console.log("    $ rbw company link 57ea7475d78f3ba5aae98935 57ea7475d78f3ba5aae98935");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    This command requires at least `organization_admin` role");
                console.log("");
            })
            .action(function(id, orgid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;
                        that._company.linkCompany(id, orgid);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company set-public")
            .description("Set the visibility of the company to public")
            .option("-c, --company <companyId>", "Target a specific company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company set-public");
                console.log("    $ rbw company set-public -c 57ea7475d78f3ba5aae98935");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: commands.company || null,
                            visibility: "public",
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;
                        that._company.setVisibility(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company set-private")
            .description("Set the visibility of the company to private")
            .option("-c, --company <companyId>", "Target a specific company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company set-private -c 57ea7475d78f3ba5aae98935");
                console.log("    $ rbw company");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: commands.company || null,
                            visibility: "private",
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;
                        that._company.setVisibility(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company set-orgpublic")
            .description("Set the visibility of the company to public inside organization only")
            .option("-c, --company <companyId>", "Target a specific company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company set-orgpublic");
                console.log("    $ rbw company set-orgpublic -c 57ea7475d78f3ba5aae98935");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: commands.company || null,
                            visibility: "organization",
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;
                        that._company.setVisibility(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company set-active")
            .description("Set the status of company to active")
            .option("-c, --company <companyId>", "Target a specific company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company set-active");
                console.log("    $ rbw company set-active -c 57ea7475d78f3ba5aae98935");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: commands.company || null,
                            status: "active",
                            noOutput: commands.json || false
                        };
                        Logger.isActive = commands.verbose || false;
                        that._company.setStatus(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company set-inactive")
            .description("Set the status of company to inactive")
            .option("-c, --company <companyId>", "Target a specific company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company set-inactive");
                console.log("    $ rbw company set-inactive -c 57ea7475d78f3ba5aae98935");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: commands.company || null,
                            status: "hold",
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;
                        that._company.setStatus(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company set-name", "<name>")
            .description("Set the name of the company")
            .option("-c, --company <companyId>", "Target a specific company")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company set-name 'myCompanyName'");
                console.log("    $ rbw company set-name 'myCompanyName' -c 57ea7475d78f3ba5aae98935");
                console.log("");
            })
            .action(function(name, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: commands.company || null,
                            name: name,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;
                        that._company.setName(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("company unlink", "<id>")
            .description("unlink a company from its organization")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw company unlink 57ea7475d78f3ba5aae98935");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    This command requires at least `organization_admin` role");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;
                        that._company.unlinkCompany(id);
                    })
                    .catch(() => {});
            });

        this._program
            .command("companies")
            .description("List all existing companies")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-p, --page <number>", "Display a specific page")
            .option("-l, --limit <number>", "Limit to a number of instances per page (max=1000")
            .option("-m, --max", "Same as --limit 1000")
            .option("--bp", "Filter only bp companies")
            .option("-n, --name <name>", "Filter by company name")
            .option("-o, --org <id>", "Filter on an organization")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw companies");
                console.log("    $ rbw companies -p 3");
                console.log("    $ rbw companies --org 57ea7475d78f3ba5aae98935");
                console.log("    $ rbw companies --org 57ea7475d78f3ba5aae98935 --json");
                console.log('    $ rbw companies -n "Rainbow"');
                console.log("    $ rbw companies --file output.csv");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports the JSON object representing the company created to the console"
                );
                console.log("    The options `--page` and `limit` allow to navigate between paginated results");
                console.log(
                    "    The options `--file` exports only fields `id`, `loginEmail`, `firstName`, `lastName`, `displayName`, `isActive`, `jid_im`, `jid_tel`, `companyId`, `companyName`"
                );
                console.log("");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            bp: false,
                            org: "",
                            csv: "",
                            page: "1",
                            limit: "25"
                        };

                        if (typeof commands === "object") {
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
                                bp: commands.bp || false,
                                org: commands.org ? commands.org : "",
                                csv: commands.file || "",
                                page: page,
                                name: commands.name || null,
                                noOutput: commands.json || false,
                                limit: limit
                            };

                            if (commands.max) {
                                options.limit = 1000;
                            }
                        }

                        Logger.isActive = commands.verbose || false;

                        that._company.getCompanies(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("customers")
            .description("List all existing customers companies (managed) ")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-p, --page <number>", "Display a specific page")
            .option("-l, --limit <number>", "Limit to a number of instances per page (max=1000")
            .option("-n, --name <name>", "Filter by company name")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw customers");
                console.log("    $ rbw custmomers -p 3");
                console.log("    $ rbw customers --json");
                console.log('    $ rbw customers -n "Rainbow"');
                console.log("    $ rbw customers --file output.csv");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports the JSON object representing the company created to the console"
                );
                console.log("    The options `--page` and `limit` allow to navigate between paginated results");
                console.log("");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            csv: "",
                            page: "1",
                            limit: "25"
                        };

                        if (typeof commands === "object") {
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
                                csv: commands.file || "",
                                page: page,
                                name: commands.name || null,
                                noOutput: commands.json || false,
                                limit: limit
                            };
                        }

                        Logger.isActive = commands.verbose || false;

                        that._company.getCompanies(options, true);
                    })
                    .catch(() => {});
            });
    }
}

module.exports = Company;
