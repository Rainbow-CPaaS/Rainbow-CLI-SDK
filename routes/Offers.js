"use strict";

var COffers = require('../commands/COffers');
var Logger = require('../common/Logger');
var Middleware = require('../common/Middleware');

class Offers {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._offers = new COffers(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    listOfCommands() {
        var that = this;

        this._program.command('offer', '<id>')
        .description("Retrieve information about an existing offer")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw offer 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw offer 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object to the console');
            console.log('');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noOutput: commands.json || false
                }

                Logger.isActive = commands.verbose || false;

                that._offers.getOffer(id, options);
            }).catch( () => {

            });
        });

        this._program.command('offers')
        .description("List all existing offers")
        .option('-v, --verbose', 'Use verbose console mode')
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000')
        .option('-n, --name <name>', 'Filter by name')
        .option('--json', 'Write the JSON result to standard stdout')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw offers');
            console.log('    $ rbw offers -p 3');
            console.log('    $ rbw offers -n "Essential"');
            console.log('    $ rbw companies --file output.csv');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object to the console');
            console.log('    The options `--page` and `limit` allow to navigate between paginated results');
            console.log('');
            console.log('');
        })
        .action(function (commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    csv: "",
                    page: "1",
                    limit: "25"
                };


                var page = "1";
                if("page" in commands) {
                    if(commands.page > 1) {
                        page = commands.page;
                    }
                }

                var limit = "25";
                if("limit" in commands && commands.limit) {
                    if(commands.limit > 0) {
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

                Logger.isActive = commands.verbose || false;

                that._offers.getOffers(options);
            }).catch( () => {

            });
        });
        this._program.command('catalog', '<id>')
        .description("Retrieve information about an existing catalog")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw catalog 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw catalog 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object to the console');
            console.log('');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noOutput: commands.json || false
                }

                Logger.isActive = commands.verbose || false;

                that._offers.getCatalog(id, options);
            }).catch( () => {

            });
        });

        this._program.command('catalogs')
        .description("List all existing catalogs")
        .option('-v, --verbose', 'Use verbose console mode')
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000')
        .option('-n, --name <name>', 'Filter by name')
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw catalogs');
            console.log('    $ rbw catalogs -p 3');
            console.log('    $ rbw catalogs -n "Rainbow"');
            console.log('    $ rbw catalogs --file output.csv');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object to the console');
            console.log('    The options `--page` and `limit` allow to navigate between paginated results');
            console.log('');
            console.log('');
        })
        .action(function (commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    csv: "",
                    page: "1",
                    limit: "25"
                };


                var page = "1";
                if("page" in commands) {
                    if(commands.page > 1) {
                        page = commands.page;
                    }
                }

                var limit = "25";
                if("limit" in commands && commands.limit) {
                    if(commands.limit > 0) {
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

                Logger.isActive = commands.verbose || false;

                that._offers.getCatalogs(options);
            }).catch( () => {

            });
        });

        this._program.command('create catalog', '<name> [description]')
        .description("Create a new catalog")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw create catalog "aCatalog"');
            console.log('    $ rbw create catalog "aCatalog" "aDescription" --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the company created to the console');
            console.log('');
        })
        .action(function (name, description, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noOutput: commands.json || false
                }

                Logger.isActive = commands.verbose || false;

                that._offers.createCatalog(name, description, options);
            }).catch( () => {

            });
        });

        this._program.command('delete catalog', '<id>')
        .description("Delete an existing catalog")
        .option('--nc', 'Do not ask confirmation')
        .option('-l, --list <items>', 'A list', function(val) {
            return val.split(',');})
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw delete catalog 57ea7475d78f3ba5aae98935');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--nc` disables confirmation');
            console.log('');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noconfirmation: commands.nc || false
                };

                Logger.isActive = commands.verbose || false;

                that._offers.deleteCatalog(id, options);
            }).catch( () => {

            });
        });
    }
}

module.exports = Offers;