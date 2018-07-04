"use strict";

var CApplication = require('../commands/CApplication');
var Logger = require('../common/Logger');

class Application {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._application = new CApplication(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    listOfCommands() {
        var that = this;

        this._program.command('application', '<appid>')
        .description("Retrieve information about an existing application")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw application 593065822799299343b8501d');
            console.log('    $ rbw application 593065822799299343b8501d --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (appid, commands) {

            var options= {
                noOutput: commands.json || false,
                appid: appid
            }

            Logger.isActive = commands.verbose || false;

            that._application.getApplication(options);
        });

        this._program.command('create application', '<name>')
        .description("Create a new web application")
        .option('-m, --mob', 'Force the type to mobile')
        .option('-s, --srv', 'Force the type to server')
        .option('-b, --bot', 'Force the type to bot')
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw create application 'A new app'");
            console.log("    $ rbw create application 'A new app' --bot");
            console.log("    $ rbw create application 'A new app' --bot --json");
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (name, commands) {

            var options= {
                name: name,
                noOutput: commands.json || false,
                type: commands.srv ? "server" : commands.bot ? "bot" : commands.mob ? "mobile" : "web"
            }

            Logger.isActive = commands.verbose || false;

            that._application.createApplication(options);
        });

        this._program.command('delete application', '<appid>')
        .description("Delete an existing application")
        .option('--nc', 'Do not ask confirmation')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw delete application 593065822799299343b8501d");
            console.log("    $ rbw delete application 593065822799299343b8501d --json");
            console.log('');
        })
        .action(function (appid, commands) {

            var options= {
                appid: appid,
                noconfirmation: commands.nc || false,
                noOutput: commands.json || false,
            }

            Logger.isActive = commands.verbose || false;

            that._application.deleteApplication(options);
        });

        this._program.command('block application', '<appid>')
        .description("Block an existing application")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw block application 593065822799299343b8501d");
            console.log("    $ rbw block application 593065822799299343b8501d --json");
            console.log('');
        })
        .action(function (appid, commands) {

            var options= {
                appid: appid,
                noOutput: commands.json || false,
            }

            Logger.isActive = commands.verbose || false;

            that._application.blockApplication(options);
        });

        this._program.command('unblock application', '<appid>')
        .description("Unblock an existing application")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw unblock application 593065822799299343b8501d");
            console.log("    $ rbw unblock application 593065822799299343b8501d --json");
            console.log('');
        })
        .action(function (appid, commands) {

            var options= {
                appid: appid,
                noOutput: commands.json || false,
            }

            Logger.isActive = commands.verbose || false;

            that._application.unblockApplication(options);
        });

        this._program.command('deploy application', '<appid>')
        .description("Accept a request of deployment of an application")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw deploy application 593065822799299343b8501d");
            console.log("    $ rbw deploy application 593065822799299343b8501d --json");
            console.log('');
        })
        .action(function (appid, commands) {

            var options= {
                appid: appid,
                noOutput: commands.json || false,
            }

            Logger.isActive = commands.verbose || false;

            that._application.deployApplication(options);
        });

        this._program.command('dismiss application', '<appid>')
        .description("Decline a request of deployment of an application")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw dismiss application 593065822799299343b8501d");
            console.log("    $ rbw dismiss application 593065822799299343b8501d --json");
            console.log('');
        })
        .action(function (appid, commands) {

            var options= {
                appid: appid,
                noOutput: commands.json || false,
            }

            Logger.isActive = commands.verbose || false;

            that._application.dismissApplication(options);
        });

        this._program.command('metrics application', '<appid>')
        .description("Retrieve API usage metrics of an application for the current day per hour")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-d, --day <date>', 'Get metrics for a specific day, hour by hour. Format is YYYMMDD')
        .option('-m, --month <month>', 'Get metrics for a specific month, day by day. Format is YYYYMM')
        .option('-y, --year <year', 'Get metrics for a specific year, month by month. Format is YYYY')
        .option('-g, --group', 'Group metrics by categories')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw application metrics 593065822799299343b8501d');
            console.log('    $ rbw application metrics 593065822799299343b8501d -d 20180218');
            console.log('    $ rbw application metrics 593065822799299343b8501d -m 201802');
            console.log('    $ rbw application metrics 593065822799299343b8501d -y 2018');
            console.log('    $ rbw application metrics 593065822799299343b8501d -y 2018 --file metrics.csv');
            console.log('    $ rbw application metrics 593065822799299343b8501d --json');

            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (appid, commands) {

            let options= {
                noOutput: commands.json || false,
                appid: appid,
                day: commands.day,
                month: commands.month,
                year: commands.year,
                csv: commands.file,
                group: commands.group
            };

            Logger.isActive = commands.verbose || false;

            that._application.getMetrics(options);
        });

        this._program.command('metrics groups')
        .description("Retrieve the list metrics available for any applications")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw metrics groups');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (commands) {

            var options= {
                noOutput: commands.json || false,
            }

            Logger.isActive = commands.verbose || false;

            that._application.getGroupsOfMetrics(options);
        });

        this._program.command('application pns', '<appid>')
        .description("Retrieve the list of push notifications settings data for an application")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw application push 593065822799299343b8501d');
            console.log('    $ rbw application push 593065822799299343b8501d --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (appid, commands) {

            var options= {
                noOutput: commands.json || false,
                appid: appid
            }

            Logger.isActive = commands.verbose || false;

            that._application.getApns(options);
        });

        this._program.command('application pn', '<appid> <id>')
        .description("Retrieve information about an existing push notifications setting")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw push 3893c8c00dae11e8b55f759655b0616d 5a882a56fd551af4da28c4bd');
            console.log('    $ rbw push 3893c8c00dae11e8b55f759655b0616d 5a882a56fd551af4da28c4bd --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (appid, id, commands) {

            var options= {
                noOutput: commands.json || false,
                appid: appid,
                id: id
            }

            Logger.isActive = commands.verbose || false;

            that._application.getPush(options);
        });

        this._program.command('application delete pn', '<appid> <id>')
        .description("Delete an existing push notifications setting")
        .option('--nc', 'Do not ask confirmation')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw application delete push 53893c8c00dae11e8b55f759655b0616d 5a882a56fd551af4da28c4bd");
            console.log("    $ rbw application delete push 3893c8c00dae11e8b55f759655b0616d 5a882a56fd551af4da28c4bd --json");
            console.log('');
        })
        .action(function (appid, id, commands) {

            var options= {
                id: id,
                appid: appid,
                noOutput: commands.json || false,
            }

            Logger.isActive = commands.verbose || false;

            that._application.deletePush(options);
        });

        this._program.command('application create fcm', '<appid> <key>')
        .description("Add an authorization key for Android Firebase Cloud Message")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw application create fcm 593065822799299343b8501d AIzaSyZ-1u...0GBYzPu7Udno5aA');
            console.log('    $ rbw application create fcm 593065822799299343b8501d AIzaSyZ-1u...0GBYzPu7Udno5aA --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (appid, key, commands) {

            var options= {
                noOutput: commands.json || false,
                appid: appid,
                key: key
            }

            Logger.isActive = commands.verbose || false;

            that._application.createFCM(options);
        });

        this._program.command('application create voip', '<appid> <file>')
        .description("Add a VOIP certificate for Apple Push Notifications service")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw application create apns voip 593065822799299343b8501d cert.file');
            console.log('    $ rbw application create apns voip 593065822799299343b8501d cert.file --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (appid, file, commands) {

            var options= {
                noOutput: commands.json || false,
                appid: appid,
                file: file,
                type: "voip"
            }

            Logger.isActive = commands.verbose || false;

            that._application.createAPNS(options);
        });

        this._program.command('application create im', '<appid> <file>')
        .description("Add an IM certificate for Apple Push Notifications service")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw application create apns voip 593065822799299343b8501d cert.file');
            console.log('    $ rbw application create apns voip 593065822799299343b8501d cert.file --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (appid, file, commands) {

            var options= {
                noOutput: commands.json || false,
                appid: appid,
                file: file,
                type: "im"
            }

            Logger.isActive = commands.verbose || false;

            that._application.createAPNS(options);
        });

        this._program.command('applications')
        .description("List the applications created")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000)')
        .option('-m, --max', 'Same as --limit 1000')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .option('-n, --notdeployed', 'Filter applications not deployed only')
        .option('-b, --blocked', 'Filter applications blocked only')
        .option('-i, --indeployment', 'Filter applications in deployment only')
        .option('-d, --deployed', 'Filter applications blocked only')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw applications --limit 1000");
            console.log("    $ rbw applications --json");
            console.log("    $ rbw applications -f doe.csv");
            console.log("    $ rbw applications -f doe.csv -d");
            console.log('');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports an array of JSON objects to the console');
            console.log('    The options `--page` and `limit` allow to navigate between paginated results');
            console.log('');
        })
        .action(function (commands) {

            var page = "1";
            var limit = "25";
            var format = "full";
            var filter = null;

            if("page" in commands) {
                if(commands.page > 1) {
                    page = commands.page;
                }
            }

            if("limit" in commands && commands.limit) {
                if(commands.limit > 0) {
                    limit = commands.limit;
                }
            }

            if(commands.deployed) {
                filter = "deployed";
            } else if(commands.indeployment) {
                filter = "in_deployment";
            } else if(commands.notdeployed) {
                filter = "not_deployed";
            } else if(commands.blocked) {
                filter = "blocked";
            }

            if(commands.csv) {
                format = "medium";
            }

            let options = {
                noOutput: commands.json || false,
                csv: commands.file || "",
                format: commands.csv ? "medium" : format || "full",
                page: page,
                limit: limit,
                filter: filter
            };

            if(commands.max) {
                options.limit = 1000;
            }

            Logger.isActive = commands.verbose || false;

            that._application.getApplications(options);
        });
    }
}

module.exports = Application;