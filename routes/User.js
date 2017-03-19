"use strict";

var CUser = require('../commands/CUser');

class User {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._user = new CUser(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        this._program.command('create', '<username> <password>')
        .description("Create a new user")
        .option('-c, --company [id]', 'Create the user in an existing company')
        .option('-f, --firstname [value]', 'Add a firstname')
        .option('-l, --lastname [value]', 'Add a lastname')
        .option('-a, --admin', 'Add an administrator role')
        .action(function (email, password, commands) {
            var company = commands.company || "";
            var firstname = commands.firstname || "";
            var lastname = commands.lastname || "";
            var isAdmin = commands.admin || false;
            that._user.create(email, password, firstname, lastname, company, isAdmin); 
        });
    }
}

module.exports = User;