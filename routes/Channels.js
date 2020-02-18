"use strict";

var CChannels = require("../commands/CChannels");
var Logger = require("../common/Logger");
var Middleware = require("../common/Middleware");
var Message = require("../common/Message");

class Channels {
    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._channels = new CChannels(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {}

    listOfCommands() {
        var that = this;

        this._program
            .command("channels browse")
            .description("Browse channels")
            .option("-c, --category <category>", "Browse channels for a specific category.")
            .option("-e, --exclude-category <excluded-category>", "Browse channels excluding a category.")
            .option("-s, --subscribed", "Browse subscribed channels.")
            .option("-u, --unsubscribed", "Browse unsubscribed channels.")
            .option("-N, --sortbyname", "Sort by name.")
            .option("-T, --sortbytopic", "Sort by topic.")
            .option("-C, --sortbysubscount", "Sort by subscriber count.")
            .option("-D, --sortbycreationdate", "Sort by creation date.")
            .option("-r, --reverse", "Reverse sort order.")
            .option("-l, --limit <number>", "Limit to a number of instances per page (max=1000).")
            .option("-p, --page <number>", "Display a specific page")
            .option("-v, --verbose", "Use verbose console mode.")
            .option("--json", "Write the JSON result to standard stdout")
            .on("--help", function() {
                console.log("   Examples:");
                console.log("");
                console.log("   $ rbw channels browse -c business");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        if (commands.category && commands.excludedCategory) {
                            throw { error: { errorDetails: "-c/--category and -e/--excluded-category are exclusive."} };
                        }
                        if (commands.subscribed && commands.unsubscribed) {
                            throw { error: { errorDetails: "-s/--subscribed and -u/--unsubscribed are exclusive."} };
                        }
                        if ( (commands.sn? 1:0) + (commands.st? 1:0) + (commands.sc? 1:0) + (commands.sd? 1:0) > 1) {
                            throw { error: { errorDetails: "-sn / -st / -sc / -sd are exclusive"} };
                        }

                        Logger.isActive = commands.verbose || false;

                        var options = {
                            category: commands.category,
                            excludedCategory: commands.excludedCategory,
                            subscribed: commands.subscribed,
                            unsubscribed: commands.unsubscribed,
                            sortbyname: commands.sortbyname,
                            sortbytopic: commands.sortbytopic,
                            sortbysubscount: commands.sortbysubscount,
                            sortbycreationdate: commands.sortbycreationdate,
                            reverse: commands.reverse,
                            noOutput: commands.json || false,
                            limit: commands.limit || 100,
                            page: commands.page || 1
                        };

                        that._channels.browseChannels(options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });

        this._program
            .command("channel", "<id>")
            .description("Retrieve information about a channel")
            .option("-j, --json", "Write the JSON result to standard stdout.")
            .option("-v, --verbose", "Use verbose console mode.")
            .on("--help", function() {
                console.log("   Examples:");
                console.log("");
                console.log("   $ rbw channel 5bbb16512412ea451767dd3b");
                console.log("   $ rbw channel 5bbb16512412ea451767dd3b --json");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false
                        };

                        Logger.isActive = commands.verbose || false;

                        that._channels.getChannel(id, options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });

        this._program
            .command("channel search")
            .description("Search a channel")
            .option("-j, --json", "Write the JSON result to standard stdout.")
            .option("-v, --verbose", "Use verbose console mode.")
            .option("-n, --name <name>", "Search channel by name.")
            .option("-t, --topic <topic>", "Search channel by topic.")
            .option("-c, --category <category>", "Search channel by category.")
            .option("-e, --exclude-category <excluded-category>", "Search channel excluding a category.")
            .option("-s, --subscribed", "Search subscribed channel.")
            .option("-u, --unsubscribed", "Search unsubscribed channel.")
            .option("-N, --sortbyname", "Sort by name.")
            .option("-T, --sortbytopic", "Sort by topic.")
            .option("-C, --sortbysubscount", "Sort by subscriber count.")
            .option("-D, --sortbycreationdate", "Sort by creation date.")
            .option("-r, --reverse", "Reverse sort order.")
            .option("-l, --limit <number>", "Limit to a number of instances per parge (max=1000).")
            .option("-p, --page <number>", "Display a specific page")
            .on("--help", function() {
                console.log("   Examples:");
                console.log("");
                console.log("   $ rbw channel search -n MyChannel");
                console.log("");
            })
            .action(function(commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        if (commands.category && commands.excludedCategory) {
                            throw { error: { errorDetails: "-c/--category and -e/--excluded-category are exclusive."} };
                        }
                        if (commands.subscribed && commands.unsubscribed) {
                            throw { error: { errorDetails: "-s/--subscribed and -u/--unsubscribed are exclusive."} };
                        }

                        Logger.isActive = commands.verbose || false;

                        var options = {
                            name: commands.name,
                            topic: commands.topic,
                            category: commands.category,
                            subscribed: commands.subscribed,
                            unsubscribed: commands.unsubscribed,
                            excludedCategory: commands.excludedCategory,
                            sortbyname: commands.sortbyname,
                            sortbytopic: commands.sortbytopic,
                            sortbysubscount: commands.sortbysubscount,
                            sortbycreationdate: commands.sortbycreationdate,
                            reverse: commands.reverse,
                            noOutput: commands.json || false,
                            limit: commands.limit || 100,
                            page: commands.page || 1
                        };

                        that._channels.searchChannel(options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });

        this._program
            .command("channel users", "<id>")
            .description("Retrieve list of users subscribed to a channel")
            .option("-j, --json", "Write the JSON result to standard stdout.")
            .option("-l, --limit <number>", "Limit to a number of instances per parge (max=1000).")
            .option("-p, --page <number>", "Display a specific page")
            .option("-v, --verbose", "Use verbose console mode.")
            .on("--help", function() {
                console.log("   Examples:");
                console.log("");
                console.log("   $ rbw channel users 5bbb16512412ea451767dd3b");
                console.log("   $ rbw channel users 5bbb16512412ea451767dd3b --json");
                console.log("");
            })
            .action(function(id, commands) {
                Middleware.parseCommand(commands)
                    .then(() => {
                        var options = {
                            noOutput: commands.json || false,
                            limit: commands.limit || 100,
                            page: commands.page || 1
                        };

                        Logger.isActive = commands.verbose || false;

                        that._channels.getChannelUsers(id, options);
                    })
                    .catch(err => {
                        Message.error(err, {});
                    });
            });

    }
}

module.exports = Channels;