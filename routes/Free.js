"use strict";

var CFree = require('../commands/CFree');

class Free {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._free = new CFree(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        this._program.command('free company', '<id>')
        .description("Remove all users from a company")
        .action(function (id) {
            that._free.removeAllUsersFromACompany(id);
        });
    }
}

module.exports = Free;