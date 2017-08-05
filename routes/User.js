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
        .option('--json', 'Write the JSON result to standard stdout')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw user 593065822799299343b8501d');
            console.log('    $ rbw user 593065822799299343b8501d --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            var options= {
                noOutput: commands.json || false
            }

            that._user.getUser(id, options);
        });

        this._program.command('create user', '<username> <password> <firstname> <lastname>')
        .description("Create a new user")
        .option('-c, --company <id>', 'In company identified by an id')
        .option('-a, --admin', 'With a company_admin role')
        .option('--json', 'Write the JSON result to standard stdout')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw create user 'john.doe@mycompany.com' '********' 'John' 'Doe'");
            console.log("    $ rbw create user 'john.doe@mycompany.com' '********' 'John' 'Doe' -c 593065822799299343b8501d");
            console.log("    $ rbw create user 'john.doe@mycompany.com' '********' 'John' 'Doe' -c 593065822799299343b8501d --admin");
            console.log("    $ rbw create user 'john.doe@mycompany.com' '********' 'John' 'Doe' -c 593065822799299343b8501d --admin --json");
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports a JSON object representing the user created to the console');
            console.log('');
        })
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
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw delete user 593065822799299343b8501d");
            console.log("    $ rbw delete user 593065822799299343b8501d --nc");
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--nc` allows to delete the existing user without asking for a confirmation (can be used from a script)');
            console.log('');
        })
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
        .option('-t, --terminated', 'Filter terminated users only')
        .option('--cid <id>', 'Filter users from a company id only')
        .option('-c, --company <name>', 'Filter users from a company name only')
        .option('-n, --name <name>', 'Filter users with a name (firstname lastname)')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .option('--json', 'Write the JSON result to standard stdout')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw users --limit 1000");
            console.log("    $ rbw users -c 'my company'");
            console.log("    $ rbw users --cid 593065822799299343b8501d");
            console.log("    $ rbw users --name 'doe'");
            console.log("    $ rbw users --name 'doe' --json");
            console.log("    $ rbw users --name 'doe' -f doe.csv");
            console.log('');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports an array of JSON objects representing the users retrieved to the console');
            console.log('    The options `--page` and `limit` allow to navigate between paginated results');
            console.log('    The options `--file` exports only fields `id`, `loginEmail`, `firstName`, `lastName`, `displayName`, `isActive`, `jid_im`, `jid_tel`, `companyId`, `companyName`');
            console.log('');
        })
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
    }
}

module.exports = User;