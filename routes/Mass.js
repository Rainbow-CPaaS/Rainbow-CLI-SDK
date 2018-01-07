"use strict";

var CMass = require('../commands/CMass');
var Logger = require('../common/Logger');

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

        this._program.command('masspro template', '[filename]')
        .description("Download the csv template for importing users")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
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

            var options = {
                csv: filename || 'template.csv'
            };

            Logger.isActive = commands.verbose || false;
            that._masspro.template(options); 
        });

        this._program.command('masspro check', '<filename>')
        .description("Check a csv file before uploading it")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro check users.csv");
            console.log('');
            console.log('');
        })
        .action(function(filename, commands) {

            var options = {
                file: filename
            };

            Logger.isActive = commands.verbose || false;
            that._masspro.check(options); 
        });

        this._program.command('masspro import', '<filename>')
        .description("Import a csv file to Rainbow")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro import users.csv");
            console.log('');
            console.log('');
        })
        .action(function(filename, commands) {

            var options = {
                file: filename
            };

            Logger.isActive = commands.verbose || false;
            that._masspro.import(options); 
        });

        this._program.command('masspro status', '<reqid>')
        .description("Get a status on an import done")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro template users.csv");
            console.log('');
            console.log('');
        })
        .action(function(reqid, commands) {

            var options = {
                reqid: reqid
            };

            Logger.isActive = commands.verbose || false;
            that._masspro.status(options); 
        });

        this._program.command('masspro status company', '[companyId]')
        .description("Get a status of all imports done on a company")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw masspro status company");
            console.log("    $ rbw masspro status company 57ea7475d78f3ba5aae98935");
            console.log('');
            console.log('');
        })
        .action(function(companyId, commands) {

            var options = {
                companyId: companyId || null
            };

            Logger.isActive = commands.verbose || false;
            that._masspro.statusCompany(options); 
        });
    }
}

module.exports = Mass;