"use strict";

var CAccount = require('../commands/CAccount');
var Logger = require('../common/Logger');

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
            .option('--json', 'Write the JSON result to standard stdout')
            .option('-v, --verbose', 'Use verbose console mode')
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log('    $ rbw login johndoe@mycompany.com Password_12345');
                console.log('    $ rbw login johndoe@mycompany.com Password_12345 --host official');
                console.log('    $ rbw login johndoe@mycompany.com Password_12345 --host openrainbow.com');
                console.log('    $ rbw login johndoe@mycompany.com Password_12345 --host openrainbow.com --json');
                console.log('');
                console.log('  Details:');
                console.log('');
                console.log('    The option `--json` exports the JSON object representing the connected user account to the console');
                console.log('    The option `--host` connects to a specific Rainbow instance. Possible values can be "sandbox" (default) , "official", or any other hostname or IP address');
                console.log('');
            })
            .action(function (email, password, commands) {

                var options = {
                    noOutput: commands.json || false
                }

                var platform = commands.host ? commands.host : "sandbox";

                Logger.isActive = commands.verbose || false;

                that._account.login(email, password, platform, options);
            });

        this._program.command('logout')
            .description("Log-out to Rainbow")
            .option('-v, --verbose', 'Use verbose console mode')
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log('    $ rbw logout');
                console.log('');
            })
            .action(function (commands) {

                Logger.isActive = commands.verbose || false;

                that._account.logout();
            });
        
        this._program.command('whoami')
            .description("Display information about the connected user")
            .option('--json', 'Write the JSON result to standard stdout')
            .option('-v, --verbose', 'Use verbose console mode')
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log('    $ rbw whoami');
                console.log('    $ rbw whoami --json');
                console.log('');
                console.log('  Details:');
                console.log('');
                console.log('    The option `--json` exports the JSON object representing the user to the console');
                console.log('');
            })
            .action(function (commands) {

                var options = {
                    noOutput: commands.json || false
                }

                Logger.isActive = commands.verbose || false;

                that._account.getConnectedUserInformation(options);
            });
        
        this._program.command('commands')
            .description("List commands depending the user profile")
            .option('-v, --verbose', 'Use verbose console mode')
            .action(function (commands) {
            
                var options = {
                }

                Logger.isActive = commands.verbose || false;

                that._account.getCommands(options);
            });
    }
}

module.exports = Account;