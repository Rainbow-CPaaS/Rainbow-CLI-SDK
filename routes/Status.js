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
        .action(function () {
           that._status.getStatus(); 
        });
    }
}

module.exports = Status;