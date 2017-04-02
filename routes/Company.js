"use strict";

var CCompany = require('../commands/CCompany');

class Company {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._company = new CCompany(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    listOfCommands() {

        var that = this;

        this._program.command('company', '<id>')
        .description("Retrieve information about an existing company")
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw company 57ea7475d78f3ba5aae98935');
            console.log('');
        })
        .action(function (id) {
            that._company.getCompany(id);
        });

        this._program.command('create company', '<name>')
        .description("Create a new company")
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw create company "A new company"');
            console.log('');
        })
        .action(function (name) {
            that._company.createCompany(name);
        });

        this._program.command('delete company', '<id>')
        .description("Delete an existing company")
        .option('--nc', 'Do not ask confirmation')
        .option('-f, --force', 'Do not ask confirmation')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw delete company 57ea7475d78f3ba5aae98935');
            console.log('');
        })
        .action(function (id, commands) {

            var options = {
                noconfirmation: commands.nc || false,
                force: commands.force || false
            };

            that._company.deleteCompany(id, options);
        });

        this._program.command('link company', '<id> <orgid>')
        .description("Link the company to an organization")
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw link company 57ea7475d78f3ba5aae98935 57ea7475d78f3ba5aae98935');
            console.log('');
        })
        .action(function (id, orgid) {
            that._company.linkCompany(id, orgid);
        });

        this._program.command('unlink company', '<id>')
        .description("unlink a company from its organization")
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw unlink company 57ea7475d78f3ba5aae98935');
            console.log('');
        })
        .action(function (id, orgid) {
            that._company.unlinkCompany(id);
        });

        this._program.command('companies')
        .description("List all existing companies")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-m, --max', 'Display up to max result per page (max=1000)')
        .option('--bp', 'Filter only bp companies')
        .option('-o, --org <id>', 'Filter on an organization')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw companies');
            console.log('    $ rbw companies -p 3');
            console.log('    $ rbw companies --org 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw companies --file output.csv');
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
                bp: commands.bp || false,
                org: commands.org ? commands.org : "",
                csv: commands.file || "",
                page: page
            };

            that._company.getCompanies(options);
        });
    }
}

module.exports = Company;