"use strict";

var CAccount = require('../commands/CAccount');

class Account {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._account = new CAccount(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    listOfCommands() {

        var that = this;

        this._program.command('login')
            .description("Log in to Rainbow")
            .option('-u, --username <email>', 'The username (email) to log in with.')
            .option('-p, --password <value>', 'The password to use when logging in.')
            .option('-o, --official', 'Use the Rainbow official environment.')
            .action(function (command) {

            var email = command.username || "";
            var password = command.password || "";
            var platform = command.official ? "official" : "sandbox";

            that._account.login(email, password, platform);
        });
        
        this._program.command('whoami')
            .description("Display information about the connected user")
            .action(function (command) {

            that._account.getConnectedUserInformation();
        });
    }
}

module.exports = Account;