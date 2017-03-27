"use strict";

var CSite = require('../commands/CSite');

class Site {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._site = new CSite(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        /*
        this._program.command('site', '<id>')
        .description("Retrieve information about an existing site")
        .action(function (id) {
            that._site.getSite(id);
        });
        */

        this._program.command('sites')
        .description("List all existing organizations")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-m, --max', 'Display up to max result per page (max=1000)')
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
                page: page,
                csv: commands.file || "",
            };

            that._site.getSites(options);
        });

        /*
        this._program.command('create site', '<name>')
        .description("Create a new organization")
        .option('-p, --public', 'Create a public organization')
        .action(function (name, commands) {

            var options = {
                public: commands.public || false
            };

            that._organization.createOrganization(name, options);
        });

        this._program.command('delete org', '<id>')
        .description("Delete an existing organization")
        .option('-f, --force', 'Do not ask confirmation')
        .action(function (id, commands) {

            var options = {
                force: commands.force || false
            };

            that._organization.deleteOrganization(id, options);
        });
        */
    }
}

module.exports = Site;