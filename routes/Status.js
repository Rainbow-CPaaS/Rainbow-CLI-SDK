"use strict";

var CStatus = require('../commands/CStatus');
var Logger = require('../common/Logger');

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
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw status api');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
        })
        .action(function (commands) {

            var options= {
                noOutput: commands.json || false
            }

            Logger.isActive = commands.verbose || false;

            that._status.getStatus(options); 
        });
    }
}

module.exports = Status;