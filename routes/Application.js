"use strict";

var CApplication = require("../commands/CApplication");
var Logger = require("../common/Logger");
var Middleware = require("../common/Middleware");

class Application {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._application = new CApplication(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {}

    listOfCommands() {
        var that = this;

        this._program
            .command("application", "<appid>")
            .description("Retrieve information about an existing application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application 593065822799299343b8501d");
                console.log("    $ rbw application 593065822799299343b8501d --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.getApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application create", "<name>")
            .description("Create a new web application")
            .option("-m, --mob", "Force the type to mobile")
            .option("-s, --srv", "Force the type to server")
            .option("-b, --bot", "Force the type to bot")
            .option("--owner <ownerid>", "Give ownership of the application to a specific user.")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application create 'A new app'");
                console.log("    $ rbw application create 'A new app' --bot");
                console.log("    $ rbw application create 'A new app' --bot --owner 603065822799299343b8503e");
                console.log("    $ rbw application create 'A new app' --bot --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(name, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            name: name,
                            noOutput: commands.json || false,
                            type: commands.srv ? "server" : commands.bot ? "bot" : commands.mob ? "mobile" : "web",
                            owner: commands.owner || null
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.createApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application link", "<appid> <userid>")
            .description("Link an application to a user (eg: Change the ownership)")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application link 603065822799299343b8503e 51e065822799299343b75e4");
                console.log("    $ rbw application link 603065822799299343b8503e 51e065822799299343b75e4 --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, userid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            ownerid: userid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.linkApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application renew", "<appid>")
            .description("Renew the application secret")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application renew 603065822799299343b8503e");
                console.log("    $ rbw application renew 603065822799299343b8503e --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.renewApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application delete", "<appid>")
            .description("Delete an existing application")
            .option("--nc", "Do not ask confirmation")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application delete 593065822799299343b8501d");
                console.log("    $ rbw application delete 593065822799299343b8501d --nc");
                console.log("    $ rbw application delete 593065822799299343b8501d --json");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noconfirmation: commands.nc || false,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.deleteApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application block", "<appid>")
            .description("Block an existing application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application block 593065822799299343b8501d");
                console.log("    $ rbw application block 593065822799299343b8501d --json");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.blockApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application unblock", "<appid>")
            .description("Unblock an existing application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application unblock 593065822799299343b8501d");
                console.log("    $ rbw application unblock 593065822799299343b8501d --json");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.unblockApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application deploy", "<appid>")
            .description("Request a deployment of an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application deploy 593065822799299343b8501d");
                console.log("    $ rbw application deploy 593065822799299343b8501d --json");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.deployApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application approve", "<appid>")
            .description("Approve a request of deployment of an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application approve 593065822799299343b8501d");
                console.log("    $ rbw application approve 593065822799299343b8501d --json");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.approveApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application decline", "<appid>")
            .description("Decline a request of deployment of an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application decline 593065822799299343b8501d");
                console.log("    $ rbw application decline 593065822799299343b8501d --json");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.dismissApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application stop", "<appid>")
            .description("Stop an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application stop 593065822799299343b8501d");
                console.log("    $ rbw application stop 593065822799299343b8501d --json");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.stopApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application restart", "<appid>")
            .description("Restart an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application restart 593065822799299343b8501d");
                console.log("    $ rbw application restart 593065822799299343b8501d --json");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.restartApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application usage", "<appid> <year> <month>")
            .description("Push application usage to business store - dev purpose only")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application usage 593065822799299343b8501d 2018 7");
                console.log("");
            })
            .action(function(appid, year, month, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            appid,
                            year,
                            month,
                            noOutput: false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.usageApplication(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application metrics", "<appid>")
            .description("Retrieve API usage metrics of an application for the current day per hour")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-d, --day <date>", "Get metrics for a specific day, hour by hour. Format is YYYMMDD")
            .option("-m, --month <month>", "Get metrics for a specific month, day by day. Format is YYYYMM")
            .option("-y, --year <year", "Get metrics for a specific year, month by month. Format is YYYY")
            .option("-g, --group", "Group metrics by categories")
            .option("-z, --dczones <dczones>", "Get metrics for the specified data center zones. Zones must be separated by comma.")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application metrics 593065822799299343b8501d");
                console.log("    $ rbw application metrics 593065822799299343b8501d -d 20180218");
                console.log("    $ rbw application metrics 593065822799299343b8501d -m 201802");
                console.log("    $ rbw application metrics 593065822799299343b8501d -y 2018");
                console.log("    $ rbw application metrics 593065822799299343b8501d -y 2018 --file metrics.csv");
                console.log("    $ rbw application metrics 593065822799299343b8501d --json");

                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        let options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            day: commands.day,
                            month: commands.month,
                            year: commands.year,
                            csv: commands.file,
                            group: commands.group,
                            dczones: commands.dczones
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.getMetrics(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application metrics groups")
            .description("Retrieve the list metrics available for any applications")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application metrics groups");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.getGroupsOfMetrics(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application thresholds", "<appid>")
            .description("Retrieve the thresholds for an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-g, --group <group>", "Get thresholds for an API group")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application thresholds 593065822799299343b8501d");
                console.log("    $ rbw application thresholds 593065822799299343b8501d --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the application thresholds to the console");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            group: commands.group || false,
                            appid: appid
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.getThresholds(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application threshold", "<appid> <group> <notification> <threshold>")
            .description("Create a usage threshold for an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application threshold 593065822799299343b8501d administration mail 300");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports a JSON object representing the user created to the console"
                );
                console.log("");
            })
            .action(function(appid, group, notification, threshold, commands) {
                Middleware.parseCommand(commands)
                .then(() => {
                    var options = {
                        noOutput: commands.json || false,
                        appid: appid
                    };

                    Logger.isActive = commands.verbose || false;

                    that._application.createThreshold(group, notification, threshold, options);
                })
                .catch(() => {});
            });

        this._program
            .command("application update threshold", "<appid> <type> <group> <notification> [threshold]")
            .description("Update a usage threshold for an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application update threshold 593065822799299343b8501d custom administration mail 300");
                console.log("    $ rbw application update threshold 593065822799299343b8501d free resources none");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports a JSON object representing the user created to the console"
                );
                console.log("");
            })
            .action(function(appid, type, group, notification, threshold, commands) {
                Middleware.parseCommand(commands)
                .then(() => {
                    var options = {
                        noOutput: commands.json || false,
                        appid: appid
                    };

                    Logger.isActive = commands.verbose || false;

                    that._application.updateThreshold(type, group, notification, threshold, options);
                })
                .catch(() => {});
            });

        this._program
            .command("application delete threshold", "<appid> <group>")
            .description("Delete a usage threshold for an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application delete threshold 593065822799299343b8501d administration");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports a JSON object representing the user created to the console"
                );
                console.log("");
            })
            .action(function(appid, group, commands) {
                Middleware.parseCommand(commands)
                .then(() => {
                    var options = {
                        noOutput: commands.json || false,
                        group: group,
                        appid: appid
                    };

                    Logger.isActive = commands.verbose || false;

                    that._application.deleteThreshold(group, options);
                })
                .catch(() => {});
            });

        this._program
            .command("application pns", "<appid>")
            .description("Retrieve the list of push notifications settings data for an application")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application pns 593065822799299343b8501d");
                console.log("    $ rbw application pns 593065822799299343b8501d --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.getApns(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application set-offer", "<appid> [kpi]")
            .description("Change the offer of an application (business, payasyougo, etc...")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application set-offer 593065822799299343b8501d");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, kpi, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            kpi: kpi || null
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.setOffer(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application set-redirecturi", "<appid> <uris>")
            .description("Set the list of OAuth redirect URIs")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log(
                    "    $ rbw application set-redirecturi 593065822799299343b8501d 'https://example.com/oauth2-redirect'"
                );
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    Use the comma separator to add multiple OAuth URIs");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, uris, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            uris: uris
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.setOauthUris(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application set-termsurl", "<appid> <url>")
            .description(
                "Set an optional url to the application terms of service. This URL will be displayed in the OAuth form"
            )
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log(
                    "    $ rbw application set-termsurl 593065822799299343b8501d 'https://myapp.domain.com/terms.pdf'"
                );
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, url, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            url: url
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.setOauthTerms(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application set-privacyurl", "<appid> <url>")
            .description(
                "Set an optional url to the application privacy policies. This URL will be displayed in the OAuth form"
            )
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log(
                    "    $ rbw application set-privacyurl 593065822799299343b8501d 'https://myapp.domain.com/privacy.pdf'"
                );
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, url, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            url: url
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.setOauthPrivacy(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application set-implicitgrant", "<appid>")
            .description("Allow the application to use OAuth 2.0 implicit grant")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application set-implicitGrant 593065822799299343b8501d");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            enableOAuthImplicitGrant: true,
                            appid: appid
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.setImplicitGrant(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application unset-implicitgrant", "<appid>")
            .description("Disallow the application to use OAuth 2.0 implicit grant")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application unset-implicitGrant 593065822799299343b8501d");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            enableOAuthImplicitGrant: false,
                            appid: appid
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.setImplicitGrant(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application pn", "<appid> <id>")
            .description("Retrieve information about an existing push notifications setting")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application pn 3893c8c00dae11e8b55f759655b0616d 5a882a56fd551af4da28c4bd");
                console.log(
                    "    $ rbw application pn 3893c8c00dae11e8b55f759655b0616d 5a882a56fd551af4da28c4bd --json"
                );
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            id: id
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.getPush(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application delete pn", "<appid> <id>")
            .description("Delete an existing push notifications setting")
            .option("--nc", "Do not ask confirmation")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log(
                    "    $ rbw application delete pn 53893c8c00dae11e8b55f759655b0616d 5a882a56fd551af4da28c4bd"
                );
                console.log(
                    "    $ rbw application delete pn 3893c8c00dae11e8b55f759655b0616d 5a882a56fd551af4da28c4bd --json"
                );
                console.log("");
            })
            .action(function(appid, id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: id,
                            appid: appid,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.deletePush(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application create fcm", "<appid> <key>")
            .description("Add an authorization key for Android Firebase Cloud Message")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application create fcm 593065822799299343b8501d AIzaSyZ-1u...0GBYzPu7Udno5aA");
                console.log(
                    "    $ rbw application create fcm 593065822799299343b8501d AIzaSyZ-1u...0GBYzPu7Udno5aA --json"
                );
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, key, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            key: key
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.createFCM(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application create voip", "<appid> <file>")
            .description("Add a VOIP certificate for Apple Push Notifications service")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application create voip 593065822799299343b8501d cert.file");
                console.log("    $ rbw application create voip 593065822799299343b8501d cert.file --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, file, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            file: file,
                            type: "voip"
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.createAPNS(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("application create im", "<appid> <file>")
            .description("Add an IM certificate for Apple Push Notifications service")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw application create im 593065822799299343b8501d cert.file");
                console.log("    $ rbw application create im 593065822799299343b8501d cert.file --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(appid, file, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            appid: appid,
                            file: file,
                            type: "im"
                        };

                        Logger.isActive = commands.verbose || false;

                        that._application.createAPNS(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("applications")
            .description("List the applications created")
            .option("-p, --page <number>", "Display a specific page")
            .option("-l, --limit <number>", "Limit to a number of instances per page (max=1000)")
            .option("-m, --max", "Same as --limit 1000")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-n, --notdeployed", "Filter applications not deployed only")
            .option("-i, --indeployment", "Filter applications in deployment only")
            .option("-d, --deployed", "Filter applications blocked only")
            .option("--active", "Filter applications active only")
            .option("--blocked", "Filter applications blocked only")
            .option("--notactive", "Filter applications not active only")
            .option("-s, --withsubscription", "Filter applications with subscription only")
            .option("--owner <userid>", "Filter applications by user")
            .option("--name <name>", "Filter applications by name")
            .option("--type <type>", "Filter applications by type (ie: web, mobile, desktop, server, bot, iot or admin)")
            .option("--offer <offer>", "Filter applications by offer (ie: business, payasyougo,...)")
            .option("--bydate", "Sort applications by date. Recent first.")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw applications --limit 1000");
                console.log("    $ rbw applications --json");
                console.log("    $ rbw applications -f doe.csv");
                console.log("    $ rbw applications -f doe.csv -d");
                console.log("");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports an array of JSON objects to the console");
                console.log("    The options `--page` and `limit` allow to navigate between paginated results");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var page = "1";
                        var limit = "25";
                        var format = "full";
                        var filter = null;
                        var state = null;

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

                        if (commands.deployed) {
                            filter = "deployed";
                        } else if (commands.indeployment) {
                            filter = "in_deployment";
                        } else if (commands.notdeployed) {
                            filter = "not_deployed";
                        } else {
                            filter = "";
                        }

                        if (commands.blocked) {
                            state = "blocked";
                        } else if (commands.active) {
                            state = "active";
                        } else if (commands.notactive) {
                            state = "notactive";
                        } else {
                            state = "";
                        }

                        if (commands.csv) {
                            format = "medium";
                        }

                        let options = {
                            noOutput: commands.json || false,
                            csv: commands.file || "",
                            format: commands.csv ? "medium" : format || "full",
                            byDate: commands.bydate || false,
                            owner: commands.owner || null,
                            subscription: commands.withsubscription || null,
                            name: commands.name || null,
                            type: commands.type || null,
                            kpi: commands.offer || null,
                            page,
                            limit,
                            filter,
                            state
                        };

                        if (commands.max) {
                            options.limit = 1000;
                        }

                        Logger.isActive = commands.verbose || false;

                        that._application.getApplications(options);
                    })
                    .catch(() => {});
            });
    }
}

module.exports = Application;
