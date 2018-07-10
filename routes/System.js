"use strict";

var CSystem = require('../commands/CSystem');
var Logger = require('../common/Logger');
var Middleware = require('../common/Middleware');

class System {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._system = new CSystem(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        this._program.command('system', '<id>')
        .description("Retrieve information about an existing system")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw system 58920fdd0bbe4b2f703bd386');
            console.log('    $ rbw system 58920fdd0bbe4b2f703bd386 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    noOutput: commands.json || false
                }

                Logger.isActive = commands.verbose || false;

                that._system.getSystem(id, options);
            }).catch( () => {

            });
        });

        this._program.command('create system', '<name>, <siteId>')
        .description("Create a new system")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw create system PBX-1 58920e130bbe4b2f703bd382');
            console.log('    $ rbw create system PBX-1 58920e130bbe4b2f703bd382 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
        })
        .action(function (name, siteId, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noOutput: commands.json || false
                };

                Logger.isActive = commands.verbose || false;

                that._system.createSystem(name, siteId, options);
            }).catch( () => {

            });
        });

        this._program.command('delete system', '<id>')
        .description("Delete an existing system")
        .option('--nc', 'Do not ask confirmation')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw delete system 58920e130bbe4b2f703bd382');
            console.log('');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noconfirmation: commands.nc || false
                };

                Logger.isActive = commands.verbose || false;

                that._system.deleteSystem(id, options);
            }).catch( () => {

            });
        });

        this._program.command('link system', '<systemid>, <siteId>')
        .description("Link a system to an other site")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw link system 58920e130bbe4b2f703bd382 58920e130bbe4b2f703b523');
            console.log('');
        })
        .action(function (systemid, siteId, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                };

                Logger.isActive = commands.verbose || false;

                that._system.linkSystem(systemid, siteId, options);
            }).catch( () => {

            });
        });

        this._program.command('unlink system', '<systemid>, <siteId>')
        .description("Unlink a system from a site")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw unlink system 58920e130bbe4b2f703bd382 58920e130bbe4b2f703b523');
            console.log('');
        })
        .action(function (systemid, siteId, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                };

                Logger.isActive = commands.verbose || false;

                that._system.unlinkSystem(systemid, siteId, options);
            }).catch( () => {

            });
        });

        this._program.command('systems')
        .description("List all existing systems")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000')
        .option('-s, --site <siteid>', 'Limit to a site')
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw systems');
            console.log('    $ rbw systems --max');
            console.log('    $ rbw systems --site 58920e130bbe4b2f703bd546');
            console.log('    $ rbw systems --site 58920e130bbe4b2f703bd546 --json');
            console.log('    $ rbw systems --file output.csv');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
        })
        .action(function (commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    csv: "",
                    siteid: "",
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
                        siteid: commands.site || "",
                        page: page,
                        noOutput: commands.json || false,
                        limit: limit
                    };
                }

                Logger.isActive = commands.verbose || false;

                that._system.getSystems(options);
            }).catch( () => {

            });
        });
    }
}

module.exports = System;