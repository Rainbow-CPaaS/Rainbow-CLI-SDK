"use strict";

var COrganization = require('../commands/COrganization');

class Organization {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._organization = new COrganization(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        this._program.command('org', '<id>')
        .description("Retrieve information about an existing organization")
        .option('--json', 'Write the JSON result to standard stdout')
        .action(function (id, commands) {

            var options= {
                noOutput: commands.json || false
            }

            that._organization.getOrganization(id, options);
        });

        this._program.command('create org', '<name>')
        .description("Create a new organization")
        .option('-p, --public', 'Create a public organization')
        .option('--json', 'Write the JSON result to standard stdout')
        .action(function (name, commands) {

            var options = {
                public: commands.public || false,
                noOutput: commands.json || false
            };

            that._organization.createOrganization(name, options);
        });

        this._program.command('delete org', '<id>')
        .description("Delete an existing organization")
        .option('--nc', 'Do not ask confirmation')
        .action(function (id, commands) {

            var options = {
                noconfirmation: commands.nc || false
            };

            that._organization.deleteOrganization(id, options);
        });

        this._program.command('orgs')
        .description("List all existing organizations")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000')
        .option('--json', 'Write the JSON result to standard stdout')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .action(function (commands) {

            var options = {
                csv: "",
                page: "1",
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

                options = {
                    csv: commands.file || "",
                    noOutput: commands.json || false,
                    page: page,
                    limit: limit
                };
            }

            that._organization.getOrganizations(options);
        });
    }
}

module.exports = Organization;