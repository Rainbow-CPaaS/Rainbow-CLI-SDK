"use strict";

var CSystem = require('../commands/CSystem');

class System {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._system = new CSystem(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;
        
        this._program.command('system', '<id>')
        .description("Retrieve information about an existing system")
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw system 58920fdd0bbe4b2f703bd386');
            console.log('');
        })
        .action(function (id) {
            that._system.getSystem(id);
        });
        
        this._program.command('create system', '<name>, <siteId>')
        .description("Create a new system")
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw create system PBX-1 58920e130bbe4b2f703bd382');
            console.log('');
        })
        .action(function (name, siteId) {

            var options = {
            };

            that._system.createSystem(name, siteId, options);
        });

        this._program.command('delete system', '<id>')
        .description("Delete an existing system")
        .option('--nc', 'Do not ask confirmation')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw delete system 58920e130bbe4b2f703bd382');
            console.log('');
        })
        .action(function (id, commands) {

            var options = {
                noconfirmation: commands.nc || false
            };

            that._system.deleteSystem(id, options);
        });

        this._program.command('systems')
        .description("List all existing systems")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-m, --max', 'Display up to max result per page (max=1000)')
        //.option('-c, --company <companyid>', 'Limit to a company')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw systems');
            console.log('    $ rbw systems --max');
            console.log('    $ rbw systems --file output.csv');
            console.log('');
        })
        .action(function (commands) {
            var page = 0;
            if("page" in commands) {
                if(commands.page > 1) {
                    page = commands.page;
                }
            }
        
            if("max" in commands && commands.max) {
                page = -1
            }

            var options = {
                page: page,
                csv: commands.file || ""
            };

            that._system.getSystems(options);
        });
    }
}

module.exports = System;