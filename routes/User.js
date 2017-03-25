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

        this._program.command('create', '<username> <password> <firstname> <lastname>')
        .description("Create a new user")
        .option('-c, --company <id>', 'Create the user in an existing company')
        .option('-a, --admin', 'Add an administrator role')
        .action(function (email, password, firstname, lastname, listOfCommands) {

            var options = {
                company: commands.company || "",
                isAdmin: commands.admin || false
            }

            that._user.create(email, password, firstname, lastname, options); 
        });

        this._program.command('delete', '<id>')
        .description("Delete an existing user")
        .option('-f, --force', 'Do not ask confirmation')
        .action(function (id) {

            var options = {
                force: commands.force || false
            };

            that._user.delete(id, options); 
        });

        this._program.command('users')
        .description("List the users")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-m, --max', 'Display up to max result per page (1000)')
        .option('-t, --terminated', 'Limit to terminated users')
        .option('-c, --company <id>', 'limit to company')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
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
                companyId: commands.company || "",
                onlyTerminated: commands.terminated || false,
                csv: commands.file || "",
                page: page
            };

            that._user.getUsers(options);
        });

        this._program.command('import file', '<filename>')
        .description("Import a list of users from a file")
        .action(function (filePath) {
            that._user.import(filePath); 
        });
    }
}

module.exports = User;