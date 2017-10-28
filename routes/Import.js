"use strict";

var CImport = require('../commands/CImport');
var Logger = require('../common/Logger');

class Import {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._import = new CImport(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    listOfCommands() {
        var that = this;

        this._program.command('import file', '<filename>')
        .description("Import a list of users from a file")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('-h, --help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw import file users.csv");
            console.log('');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The csv file should contain a header with the following fields:');
            console.log('    loginEmail;password;firstName;lastName;roles;companyId;jobTitle;country;timezone;accountType;language');
            console.log('    eg: john.doe@company.com;Password_123;John;Doe;user,admin;5978e048f8abe8ad97357f06;Chief Officer;;;;en-US')
            console.log('');
        })
        .action(function (filePath) {
            Logger.isActive = commands.verbose || false;
            that._import.import(filePath); 
        });
    }
}

module.exports = Import;