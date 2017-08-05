"use strict";

var CStatus = require('../commands/CStatus');

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

        this._program.command('status')
        .description("Display status of API")
        .option('--json', 'Write the JSON result to standard stdout')
        .action(function (commands) {

            var options= {
                noOutput: commands.json || false
            }

            that._status.getStatus(options); 
        });
    }
}

module.exports = Status;