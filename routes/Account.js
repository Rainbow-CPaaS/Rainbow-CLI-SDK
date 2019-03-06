"use strict";

var CAccount = require("../commands/CAccount");
var Logger = require("../common/Logger");
var Helper = require("../common/Helper");
var Middleware = require("../common/Middleware");

class Account {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._account = new CAccount(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {}

    listOfCommands() {
        var that = this;

        this._program
            .command("login", "[email] [password]")
            .description("Log-in to Rainbow")
            .option(
                "--host <hostname>",
                "Log-in to a specific host. 'hostname' can be 'official' or any hostname. If no --host, 'sandbox' is used"
            )
            .option("-p, --proxy <address>", "Proxy to use")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345'");
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345' --host official");
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345' --host openrainbow.com");
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345' --host openrainbow.com --json");
                console.log(
                    "    $ rbw login 'johndoe@mycompany.com' 'Password_12345' --host openrainbow.com --proxy https://192.168.0.10:8080"
                );
                console.log("");
                console.log("  Details:");
                console.log("");
                console.log(
                    "    The option `--json` exports the JSON object representing the connected user account to the console"
                );
                console.log(
                    '    The option `--host` connects to a specific Rainbow instance. Possible values can be "sandbox" (default) , "official", or any other hostname or IP address'
                );
                console.log("");
            })
            .action(function(email, password, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        let proxyJSON = null;

                        if (commands.proxy) {
                            proxyJSON = Helper.getProxyFromString(commands.proxy);
                        }

                        var platform = commands.host ? commands.host : "sandbox";

                        var options = {
                            noOutput: commands.json || false,
                            proxy: proxyJSON,
                            email: email || null,
                            password: password || null,
                            host: commands.host || null
                        };

                        Logger.isActive = commands.verbose || false;

                        that._account.login(options);

                        // Check for a new version
                        if (!commands.json) {
                            require("../common/Common").checkNewVersion();
                        }
                    })
                    .catch(() => {});
            });

        this._program
            .command("logout")
            .description("Log-out to Rainbow")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw logout");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        var options = {
                            noOutput: commands.json || false
                        };

                        that._account.logout(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("set developer")
            .description("Add developer account")
            .option("-i, --interactive", "Use interactive mode")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw set developer");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            noOutput: commands.json || false,
                            interactive: commands.interactive || false
                        };

                        that._account.setDeveloper(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("set admin", "<name>")
            .description("Create a company and give admin right")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw set company");
                console.log("");
            })
            .action(function(name, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            noOutput: commands.json || false,
                            companyName: name || ""
                        };

                        that._account.setCompany(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("preferences")
            .description("List the preferences saved on this computer")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw preferences");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            noOutput: commands.json || false
                        };

                        that._account.preferences(options);

                        // Check for a new version
                        if (!commands.json) {
                            require("../common/Common").checkNewVersion();
                        }
                    })
                    .catch(() => {});
            });

        this._program
            .command("remove preferences")
            .description("Remove all preferences saved on this computer")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw remove preferences");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            noOutput: commands.json || false
                        };

                        that._account.removePreferences(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("whoami")
            .description("Display information about the connected user")
            .option("--json", "Write the JSON result to standard stdout")
            .option("-v, --verbose", "Use verbose console mode")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw whoami");
                console.log("    $ rbw whoami --json");
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

                        that._account.getConnectedUserInformation(options);

                        // Check for a new version
                        if (!commands.json) {
                            require("../common/Common").checkNewVersion();
                        }
                    })
                    .catch(() => {});
            });

        this._program
            .command("set keys", "<appid> <appsecret>")
            .description("Set the application id and application secret to your preferences")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log(
                    "    $ rbw set keys ece540802b5234e8b514e9067ae48fad TSIDA5LXbk1M10x...ZwxC70flexmPkok6OvE9xeXIa"
                );
                console.log("");
            })
            .action(function(appid, appsecret, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            appid: appid,
                            appsecret: appsecret,
                            noOutput: commands.json || false
                        };

                        that._account.setKeys(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("set password", "<password>")
            .description("Set your password to your preferences")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw set password 4p8hGf6ie4f_P!");
                console.log("");
            })
            .action(function(password, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            password: password,
                            noOutput: commands.json || false
                        };

                        that._account.setPassword(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("change password")
            .description("Change the password associated to your account")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw change password");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            noOutput: commands.json || false
                        };

                        that._account.changePassword(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("set email", "<email>")
            .description("Set your login email to your preferences")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw set email 'johndoe@mycompany.com'");
                console.log("");
            })
            .action(function(email, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            email: email,
                            noOutput: commands.json || false
                        };

                        that._account.setEmail(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("set host", "<host>")
            .description("Set your host to your preferences")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw set host sandbox");
                console.log("");
            })
            .action(function(host, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            host: host,
                            noOutput: commands.json || false
                        };

                        that._account.setHost(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("set proxy", "<proxy>")
            .description("Set your proxy to your preferences")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw set proxy https://192.168.0.10:8080");
                console.log("");
            })
            .action(function(proxy, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            proxy: Helper.getProxyFromString(proxy),
                            noOutput: commands.json || false
                        };

                        that._account.setProxy(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("remove proxy")
            .description("Remove the proxy from your preferences")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw remove proxy");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            noOutput: commands.json || false
                        };

                        that._account.removeProxy(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("remove keys")
            .description("Remove the application id and application secret from your preferences")
            .option("-v, --verbose", "Use verbose console mode")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("  Examples:");
                console.log("");
                console.log("    $ rbw remove keys");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        Logger.isActive = commands.verbose || false;

                        let options = {
                            noOutput: commands.json || false
                        };

                        that._account.removeKeys(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("commands")
            .description("List commands depending the user profile")
            .option("-v, --verbose", "Use verbose console mode")
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {};

                        Logger.isActive = commands.verbose || false;

                        that._account.getCommands(options);
                    })
                    .catch(() => {});
            });

        this._program
            .command("configure")
            .description("Configure the account to user and log-in to Rainbow")
            .option("-v, --verbose", "Use verbose console mode")
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {};

                        Logger.isActive = commands.verbose || false;

                        that._account.configure(options);

                        // Check for a new version
                        require("../common/Common").checkNewVersion();
                    })
                    .catch(() => {});
            });
    }
}

module.exports = Account;
