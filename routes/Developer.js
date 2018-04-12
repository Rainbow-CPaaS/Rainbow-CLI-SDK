"use strict";

var CDeveloper = require('../commands/CDeveloper');
var Logger = require('../common/Logger');

class Developer {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._developer = new CDeveloper(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    
    listOfCommands() {
        var that = this;

        this._program.command('developers payment', '[id]')
        .description("Retrieve developer payment account if exists")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers payment 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers payment 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            var options= {
                id: id || null,
                noOutput: commands.json || false,
            };

            Logger.isActive = commands.verbose || false;

            that._developer.getPayments(options);
        });

        this._program.command('developers methods', '[id]')
        .description("Retrieve developer payment methods if exists")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers methods 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers methods 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            var options= {
                id: id || null,
                noOutput: commands.json || false,
            };

            Logger.isActive = commands.verbose || false;

            that._developer.getMethods(options);
        });

        this._program.command('developers subscriptions', '[id]')
        .description("Retrieve developer subscriptions if exists")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers subscriptions 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers subscriptions 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            var options= {
                id: id || null,
                noOutput: commands.json || false,
            };

            Logger.isActive = commands.verbose || false;

            that._developer.getSubscriptions(options);
        });
    }
}

module.exports = Developer;