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
        .action(function (id) {
            that._company.getCompany(id);
        });

        this._program.command('delete company', '<id>')
        .description("Delete an existing company")
        .action(function (id) {
            that._company.deleteCompany(id);
        });

        this._program.command('create company', '<name>')
        .description("Create a new company")
        .action(function (name) {
            that._company.createCompany(name);
        });

        this._program.command('companies')
        .description("List all existing companies")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-m, --max', 'Display up to max result per page (max=1000)')
        .option('--bp', 'Filter only bp companies')
        .option('-o, --org <id>', 'Filter on an organization')
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

            var filter = {
                bp: commands.bp || false,
                org: commands.org ? commands.org : ""
            };

            that._company.getCompanies(page, filter);
        });
    }
}

module.exports = Company;