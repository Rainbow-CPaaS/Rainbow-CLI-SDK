"use strict";

var CStatus = require('../commands/CStatus');
var Logger = require('../common/Logger');
var Middleware = require('../common/Middleware');

class Status {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._status = new CStatus(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        this._program.command('status api')
        .description("Display status of API")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw status api');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
        })
        .action(function (commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    noOutput: commands.json || false
                }

                Logger.isActive = commands.verbose || false;

                that._status.getStatus(options);
            }).catch( () => {

            });
        });

        this._program.command('status platform')
        .description("Display current platform status")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw status platform');
            console.log('    $ rbw status platform --host openrainbow.com');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
        })
        .action(function (commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._status.getPlatformStatus(options);
            }).catch( () => {

            });
        });
    }
}

module.exports = Status;