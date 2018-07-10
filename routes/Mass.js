"use strict";

var CMass = require('../commands/CMass');
var Logger = require('../common/Logger');
var Middleware = require('../common/Middleware');

class Mass {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._masspro = new CMass(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    listOfCommands() {
        var that = this;

        this._program.command('masspro template user', '[filename]')
        .description("Download the csv template for importing users")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro template");
            console.log("    $ rbw masspro template template.csv");
            console.log('');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    If no filename is provided, a default template.csv file is created in the current directory.');
        })
        .action(function(filename, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    "csv": filename || 'template.csv',
                    "type": "user"
                };

                Logger.isActive = commands.verbose || false;
                that._masspro.template(options);
            }).catch( () => {

            });
        });

        this._program.command('masspro template device', '[filename]')
        .description("Download the csv template for importing devices")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro template");
            console.log("    $ rbw masspro template template.csv");
            console.log('');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    If no filename is provided, a default template.csv file is created in the current directory.');
        })
        .action(function(filename, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    "csv": filename || 'template.csv',
                    "type": "device"
                };

                Logger.isActive = commands.verbose || false;
                that._masspro.template(options);
            }).catch( () => {

            });
        });

        this._program.command('masspro check', '<filename>')
        .description("Check a csv file before uploading it")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro check users.csv");
            console.log('');
            console.log('');
        })
        .action(function(filename, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    file: filename
                };

                Logger.isActive = commands.verbose || false;
                that._masspro.check(options);
            }).catch( () => {

            });
        });

        this._program.command('masspro import', '<filename>')
        .description("Import a csv file to Rainbow")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro import users.csv");
            console.log('');
            console.log('');
        })
        .action(function(filename, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    file: filename
                };

                Logger.isActive = commands.verbose || false;
                that._masspro.import(options);
            }).catch( () => {

            });
        });

        this._program.command('masspro status', '<reqid>')
        .description("Get a status on an import done")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro status d44dd0ba8d1f7f4bce08b7e909f23a55b422c65ebdcb67ccfc9ada99438902cc");
            console.log('');
            console.log('');
        })
        .action(function(reqid, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    reqid: reqid
                };

                Logger.isActive = commands.verbose || false;
                that._masspro.status(options);
            }).catch( () => {

            });
        });

        this._program.command('masspro delete status', '<reqid>')
        .description("Delete a status on an import done")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro delete status d44dd0ba8d1f7f4bce08b7e909f23a55b422c65ebdcb67ccfc9ada99438902cc");
            console.log('');
            console.log('');
        })
        .action(function(reqid, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    reqid: reqid
                };

                Logger.isActive = commands.verbose || false;
                that._masspro.deleteStatus(options);
            }).catch( () => {

            });
        });

        this._program.command('masspro status company', '[companyId]')
        .description("Get a status of all imports done on a company")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro status company");
            console.log("    $ rbw masspro status company 57ea7475d78f3ba5aae98935");
            console.log('');
            console.log('');
        })
        .action(function(companyId, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    companyId: companyId || null
                };

                Logger.isActive = commands.verbose || false;
                that._masspro.statusCompany(options);
            }).catch( () => {

            });
        });
    }
}

module.exports = Mass;