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

        this._program.command('login', '<email> <password>')
            .description("Log-in to Rainbow")
            .option('-h, --host <hostname>', "Log-in to a specific host. 'hostname' can be 'official' or any hostname. If no --host, 'sandbox' is used")
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log('    $ rbw login johndoe@mycompany.com Password_12345');
                console.log('    $ rbw login johndoe@mycompany.com Password_12345 --host official');
                console.log('    $ rbw login johndoe@mycompany.com Password_12345 --host openrainbow.com');
                console.log('');
            })
            .action(function (email, password, commands) {

            var platform = commands.host ? commands.host : "sandbox";

            that._account.login(email, password, platform);
        });

        this._program.command('logout')
            .description("Log-out to Rainbow")
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log('    $ rbw logout');
                console.log('');
            })
            .action(function () {

            that._account.logout();
        });
        
        this._program.command('whoami')
            .description("Display information about the connected user")
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log('    $ rbw whoami');
                console.log('');
            })
            .action(function (command) {

            that._account.getConnectedUserInformation();
        });
    }
}

module.exports = Account;