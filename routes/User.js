"use strict";

var CUser = require("../commands/CUser");
var Logger = require("../common/Logger");
var Middleware = require("../common/Middleware");

class User {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._user = new CUser(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {}
    listOfCommands() {
        var that = this;

        this._program
            .command("user", "<id>")
            .description("Retrieve information about an existing user")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw user 593065822799299343b8501d");
                console.log("    $ rbw user 593065822799299343b8501d --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log("    The option `--json` exports the JSON object representing the user to the console");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._user.getUser(id, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("create user", "<email> <password> <firstname> <lastname>")
            .description("Create a new user")
            .option("-c, --company <id>", "In company identified by an id")
            .option("-a, --admin", "With a company_admin role")
            .option("-o, --org <orgid>", "With a org_admin role for an organisation identified by an orgid")
            .option("--public", "Create a public user")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw create user 'john.doe@mycompany.com' '********' 'John' 'Doe'");
                console.log(
                    "    $ rbw create user 'john.doe@mycompany.com' '********' 'John' 'Doe' -c 593065822799299343b8501d"
                );
                console.log(
                    "    $ rbw create user 'john.doe@mycompany.com' '********' 'John' 'Doe' -c 593065822799299343b8501d --admin"
                );
                console.log(
                    "    $ rbw create user 'john.doe@mycompany.com' '********' 'John' 'Doe' -c 593065822799299343b8501d --admin --json"
                );
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports a JSON object representing the user created to the console"
                );
                console.log("");
            })
            .action(function(email, password, firstname, lastname, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            companyId: commands.company || "",
                            isAdmin: commands.admin || false,
                            orgId: commands.org || false,
                            public: commands.public || null
                        };

                        Logger.isActive = commands.verbose || false;

                        that._user.create(email, password, firstname, lastname, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("delete user", "<id>")
            .description("Delete an existing user")
            .option("--nc", "Do not ask confirmation")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw delete user 593065822799299343b8501d");
                console.log("    $ rbw delete user 593065822799299343b8501d --nc");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--nc` allows to delete the existing user without asking for a confirmation (can be used from a script)"
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

                        that._user.delete(id, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("changelogin user", "<id> <login>")
            .description("Change login of a user")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw changelogin user 'alogin@acompany.com'");
                console.log("");
            })
            .action(function(id, login, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {};

                        Logger.isActive = commands.verbose || false;

                        that._user.changelogin(id, login, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("changepwd user", "<id> <password>")
            .description("Change password of a user")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw changepwd user 593065822799299343b8501d 'myPassword123!");
                console.log("");
            })
            .action(function(id, password, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {};

                        Logger.isActive = commands.verbose || false;

                        that._user.changepwd(id, password, options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("initialize user", "<id>")
            .description("Initialize a user if not set")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw initialize user '593065822799299343b8501d'");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: id,
                            toInitialize: true,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._user.initializedOrUninitialize(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("uninitialize user", "<id>")
            .description("Uninitialize a user that was already initialized")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw uninitialize user '593065822799299343b8501d'");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: id,
                            toInitialize: false,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._user.initializedOrUninitialize(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("deactivate user", "<id>")
            .description("Deactivate a user to avoid him connecting to Rainbow")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw deactivate user '593065822799299343b8501d'");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: id,
                            toBlock: true,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._user.blockOrUnblock(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("activate user", "<id>")
            .description("Activate a user and authorize him to connect to Rainbow")
            .option("-v, --verbose", "Use verbose console mode")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw activate user '593065822799299343b8501d'");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            id: id,
                            toBlock: false,
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._user.blockOrUnblock(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("user add-network", "<id> <userToAddId>")
            .description("Add a user to the network of other user without sharing the presence by default")
            .option("-p, --presence", "Share the presence between users")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw user join 593065822799299343b8501d 57ea7475d78f3ba5aae98935");
                console.log("    $ rbw user join 593065822799299343b8501d 57ea7475d78f3ba5aae98935 -p --json");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports a JSON object representing the user created to the console"
                );
                console.log("");
            })
            .action(function(id, userToAddId, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            id: id,
                            userToAddId: userToAddId,
                            presence: commands.presence
                        };

                        Logger.isActive = commands.verbose || false;

                        that._user.join(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("users")
            .description("List the users")
            .option("-p, --page <number>", "Display a specific page")
            .option("-l, --limit <number>", "Limit to a number of instances per page (max=1000)")
            .option("-m, --max", "Same as --limit 1000")
            .option("-t, --terminated", "Filter terminated users only")
            .option("-i, --cid <id>", "Filter users by a company id only")
            .option("-c, --company <name>", "Filter users by a company name only")
            .option("-n, --name <name>", "Filter users by a name (firstname lastname)")
            .option("-r, --role <role>", "Filter users by role")
            .option("-e, --email <loginEmail>", "Filter users by login email")
            .option("-f, --file <filename>", "Print result to a file in CSV")
            .option("-j, --json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw users --limit 1000");
                console.log("    $ rbw users -c 'my company'");
                console.log("    $ rbw users --cid 593065822799299343b8501d");
                console.log("    $ rbw users --name 'doe'");
                console.log("    $ rbw users --email 'john.doe@acompany.com'");
                console.log("    $ rbw users --name 'doe' --json");
                console.log("    $ rbw users --name 'doe' -f doe.csv");
                console.log("    $ rbw users --role 'app_admin'");
                console.log("");
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports an array of JSON objects representing the users retrieved to the console"
                );
                console.log("    The options `--page` and `limit` allow to navigate between paginated results");
                console.log(
                    "    The options `--file` exports only fields `id`, `loginEmail`, `firstName`, `lastName`, `displayName`, `isActive`, `jid_im`, `jid_tel`, `companyId`, `companyName`"
                );
                console.log("");
            })
            .action(function(commands) {
                let parse = commands;

                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            companyId: "",
                            onlyTerminated: false,
                            csv: "",
                            format: "full",
                            page: "1",
                            name: null,
                            email: null,
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

                        if (commands.csv) {
                            format = "medium";
                        }

                        options = {
                            noOutput: commands.json || false,
                            companyId: commands.cid || "",
                            company: commands.company || null,
                            onlyTerminated: commands.terminated || false,
                            csv: commands.file || "",
                            format: format,
                            name: commands.name || null,
                            email: commands.email || null,
                            role: commands.role || null,
                            page: page,
                            limit: limit
                        };

                        if (commands.max) {
                            options.limit = 1000;
                        }

                        Logger.isActive = commands.verbose || false;

                        that._user.getUsers(options);
                    })
                    .catch(() => {});
            });
    }
}

module.exports = User;
