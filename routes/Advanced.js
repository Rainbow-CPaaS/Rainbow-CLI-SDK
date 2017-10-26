"use strict";

var CAdvanced = require('../commands/CAdvanced');
var Logger = require('../common/Logger');

class Advanced {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._advanced = new CAdvanced(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    
    listOfCommands() {
        var that = this;

        this._program.command('find', '<id>')
        .description("Retrieve information associated to an id (ie: user, company...")
        .option('--json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw find 593065822799299343b8501d');
            console.log('    $ rbw find 593065822799299343b8501d --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            var options= {
                noOutput: commands.json || false
            }

            Logger.isActive = commands.verbose || false;

            that._advanced.find(id, options);
        });

        this._program.command('newco')
        .description("Interactive creation of a company + a user")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw wizard');
            console.log('');
            console.log('  Details:');
            console.log('');
        })
        .action(function (commands) {

            var options= {
            }

            Logger.isActive = commands.verbose || false;

            that._advanced.newco(commands);
        });

    }
}

module.exports = Advanced;