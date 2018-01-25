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

        this._program.command('application', '<id>')
        .description("Retrieve information about an existing application")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
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
        .action(function (id, commands) {

            var options= {
                noOutput: commands.json || false
            }

            Logger.isActive = commands.verbose || false;

            that._application.getApplication(id, options);
        });

        this._program.command('create application', '<name>')
        .description("Create a new web application")
        .option('-m, --mob', 'Force the type to mobile')
        .option('-s, --srv', 'Force the type to server')
        .option('-b, --bot', 'Force the type to bot')
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
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

        this._program.command('delete application', '<id>')
        .description("Delete an existingapplication")
        .option('--nc', 'Do not ask confirmation')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw delete application 593065822799299343b8501d");
            console.log("    $ rbw delete application 593065822799299343b8501d --json");
            console.log('');
        })
        .action(function (id, commands) {

            var options= {
                id: id,
                noOutput: commands.json || false,
            }

            Logger.isActive = commands.verbose || false;

            that._application.deleteApplication(options);
        });

        this._program.command('metrics application', '<id>')
        .description("Retrieve API usage metrics about an existing application")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw application metrics 593065822799299343b8501d');
            console.log('    $ rbw application metrics 593065822799299343b8501d --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            var options= {
                noOutput: commands.json || false
            }

            Logger.isActive = commands.verbose || false;

            that._application.getMetrics(id, options);
        });

        this._program.command('applications')
        .description("List the applications created")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000)')
        .option('-m, --max', 'Same as --limit 1000')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw applications --limit 1000");
            console.log("    $ rbw applications --json");
            console.log("    $ rbw applications -f doe.csv");
            console.log('');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports an array of JSON objects to the console');
            console.log('    The options `--page` and `limit` allow to navigate between paginated results');
            console.log('');
        })
        .action(function (commands) {

            var options = {
                csv: "",
                format: "full",
                page: "1",
                limit: "25"
            };

            var page = "1";
            var limit = "25";
            var format = "full";
           
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
            
            if(commands.csv) {
                format = "medium";
            }

            options = {
                noOutput: commands.json || false,
                csv: commands.file || "",
                format: format,
                page: page,
                limit: limit
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