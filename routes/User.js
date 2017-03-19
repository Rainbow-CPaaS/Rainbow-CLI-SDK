"use strict";

var CUser = require('../commands/CUser');

class User {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._user = new CUser(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        this._program.command('users')
        .description("List the users")
        .option('-p, --page [number]', 'Display a specific page')
        .option('-m, --max', 'Display up to max result per page (1000)')
        .option('-t, --terminated', 'Limit to terminated users')
        .option('-c, --company [id]', 'limit to company')
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

            var companyId = commands.company || "";

            var restrictToTerminated = commands.terminated || false;

            that._user.getUsers(page, restrictToTerminated, companyId);
        });

        this._program.command('create', '<username> <password>')
        .description("Create a new user")
        .option('-c, --company [id]', 'Create the user in an existing company')
        .option('-f, --firstname [value]', 'Add a firstname')
        .option('-l, --lastname [value]', 'Add a lastname')
        .option('-a, --admin', 'Add an administrator role')
        .action(function (email, password, commands) {
            var company = commands.company || "";
            var firstname = commands.firstname || "";
            var lastname = commands.lastname || "";
            var isAdmin = commands.admin || false;
            that._user.create(email, password, firstname, lastname, company, isAdmin); 
        });

        this._program.command('import')
        .description("Import a list of users from a file")
        .option('--csv [path]', 'Import from a CSV file')
        .option('-c, --company [id]', 'Import to a specific company')
        //.option('-n, --new [name]', 'Import to a new company')
        .action(function (commands) {
            var filePath = commands.csv || "";
            var companyId = commands.company || "";
            var companyName = commands.new || "";
            var format = commands.csv ? "csv" : "";
            that._user.import(filePath, format, companyId, companyName); 
        });
    }
}

module.exports = User;