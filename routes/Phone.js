"use strict";

var CPhone = require('../commands/CPhone');
var Logger = require('../common/Logger');
var Middleware = require('../common/Middleware');

class Phone {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._phone = new CPhone(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;


        this._program.command('phone', '<id> <systemid>')
        .description("Retrieve information about an existing phone")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw phone 58920e130bbe4b2f703bd382 589dc6ba0bbe4b2f703bd67d');
            console.log('    $ rbw phone 58920e130bbe4b2f703bd382 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, systemid, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    noOutput: commands.json || false
                }

                Logger.isActive = commands.verbose || false;

                that._phone.getPhone(id, systemid, options);
            }).catch( () => {

            });
        });

        this._program.command('phones', '<systemid>')
        .description("List all existing phones on a system")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000')
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw phones 589dc6ba0bbe4b2f703bd67d');
            console.log('    $ rbw phones 589dc6ba0bbe4b2f703bd67d --json');
            console.log('    $ rbw phones 589dc6ba0bbe4b2f703bd67d --limit 100');
            console.log('    $ rbw phones 589dc6ba0bbe4b2f703bd67d --limit 100 --file output.csv');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports an array of JSON objects representing the users retrieved to the console');
            console.log('    The options `--page` and `limit` allow to navigate between paginated results');

        })
        .action(function (systemid, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    csv: "",
                    page: "1",
                    limit: "25"
                };

                if(typeof commands === "object") {

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
                        noOutput: commands.json || false,
                        page: page,
                        limit: limit
                    };

                }

                Logger.isActive = commands.verbose || false;

                that._phone.getPhones(systemid, options);
            }).catch( () => {

            });
        });
    }
}

module.exports = Phone;