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

        this._program.command('user', '<id>')
        .description("Retrieve information about an existing user")
        .option('-o, --json', 'Write the JSON result to standard stdout')
        .action(function (id, commands) {

            var options= {
                noOutput: commands.json || false
            }

            that._user.getUser(id, options);
        });

        this._program.command('create user', '<username> <password> <firstname> <lastname>')
        .description("Create a new user")
        .option('-c, --company <id>', 'Create the user in an existing company')
        .option('-a, --admin', 'Add an administrator role')
        .option('-o, --json', 'Write the JSON result to standard stdout')
        .action(function (email, password, firstname, lastname, commands) {

            var options = {
                noOutput: commands.json || false,
                companyId: commands.company || "",
                isAdmin: commands.admin || false
            }

            that._user.create(email, password, firstname, lastname, options); 
        });

        this._program.command('delete user', '<id>')
        .description("Delete an existing user")
        .option('--nc', 'Do not ask confirmation')
        .action(function (id, commands) {

            var options = {
                noconfirmation: commands.nc || false
            };

            that._user.delete(id, options); 
        });

        this._program.command('users')
        .description("List the users")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000)')
        .option('-t, --terminated', 'Filter to terminated users')
        .option('--cid <id>', 'Filter to users from a company id')
        .option('-c, --company <name>', 'Filter to users from a company with a given name')
        .option('-n, --name <name>', 'Filter to users with a given name (firstname lastname)')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .option('-o, --json', 'Write the JSON result to standard stdout')
        .action(function (commands) {

            var options = {
                companyId:"",
                onlyTerminated: false,
                csv: "",
                format: "full",
                page: "1",
                name: null,
                limit: "25"
            };

            if(typeof commands === "object") {

                var page = "1";
                if("page" in commands) {
                    if(commands.page > 1) {
                        page = commands.page;
                    }
                }
            
                var limit = "25";
                if("limit" in commands && commands.limit) {
                    if(commands.limit > 0) {
                        limit = commands.limit;
                    }
                }

                var format = "full";
                if(commands.csv) {
                    format = "medium";
                }

                options = {
                    noOutput: commands.json || false,
                    companyId: commands.cid || "",
                    company: commands.company || null,
                    onlyTerminated: commands.terminated || false,
                    csv: commands.file || "",
                    format: format,
                    name: commands.name || null,
                    page: page,
                    limit: limit
                };
            }

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