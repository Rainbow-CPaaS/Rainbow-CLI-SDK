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
            .option('--host <hostname>', "Log-in to a specific host. 'hostname' can be 'official' or any hostname. If no --host, 'sandbox' is used")
            .option('--json', 'Write the JSON result to standard stdout')
            .option('-p, --proxy <address>', 'Proxy to use')
            .option('-v, --verbose', 'Use verbose console mode')
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345'");
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345' --host official");
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345' --host openrainbow.com");
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345' --host openrainbow.com --json");
                console.log("    $ rbw login 'johndoe@mycompany.com' 'Password_12345' --host openrainbow.com --proxy https://192.168.0.10:8080");
                console.log('');
                console.log('  Details:');
                console.log('');
                console.log('    The option `--json` exports the JSON object representing the connected user account to the console');
                console.log('    The option `--host` connects to a specific Rainbow instance. Possible values can be "sandbox" (default) , "official", or any other hostname or IP address');
                console.log('');
            })
            .action(function (email, password, commands) {

                let proxyJSON = null;
                let protocol = "", url = "", port= null;

                if(commands.proxy) {
                    let parts = commands.proxy.split('/');
                    protocol = (parts && parts.length > 0) ? parts[0].substr(0, 4) : "";
                    let partsUrl = (parts && parts.length>=2) ? parts[2].split(':') : null;
                    if(partsUrl) {
                        url = (partsUrl && partsUrl.length > 0) ? partsUrl[0] : "";
                        let portStr = (partsUrl && partsUrl.length >=2) ? partsUrl[1] : ""; 
                        try {
                            port = Number(portStr);
                        }
                        catch(err) {
                        }
                    }
                    if(protocol && url && port) {
                        proxyJSON = {
                            protocol: protocol,
                            host: url,
                            port: port
                        }
                    }
                }

                var options = {
                    noOutput: commands.json || false,
                    proxy: proxyJSON
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

        this._program.command('set developer')
            .description("Add developer account")
            .option('-v, --verbose', 'Use verbose console mode')
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log('    $ rbw set developer');
                console.log('');
            })
            .action(function (commands) {

                Logger.isActive = commands.verbose || false;

                let options = {

                };

                that._account.setDeveloper();
            });

            this._program.command('preferences')
            .description("List the preferences saved on this computer")
            .option('-v, --verbose', 'Use verbose console mode')
            .on('--help', function(){
                console.log('  Examples:');
                console.log('');
                console.log('    $ rbw preferences');
                console.log('');
            })
            .action(function (commands) {

                Logger.isActive = commands.verbose || false;

                let options = {

                };

                that._account.preferences(options);
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