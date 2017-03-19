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
            that._company.GetCompany(id);
        });

        this._program.command('company delete', '<id>')
        .description("Delete an existing company")
        .action(function (id) {
            that._company.deleteCompany(id);
        });

        this._program.command('company create', '<name>')
        .description("Create a new company")
        .action(function (name) {
            that._company.createCompany(name);
        });

        this._program.command('companies')
        .description("List all existing companies")
        .option('-p, --page [number]', 'Display a specific page')
        .option('-a, --all', 'Display all companies in a single page')
        .action(function (commands) {

            var page = 0;
            if("page" in commands) {
                if(commands.page > 1) {
                    page = commands.page;
                }
            }
        
            if("all" in commands && commands.all) {
                page = -1
            }

            that._company.getCompanies(page);
        });
    }
}

module.exports = Company;