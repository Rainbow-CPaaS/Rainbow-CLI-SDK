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

        
        this._program.command('site', '<id>')
        .description("Retrieve information about an existing site")
        .action(function (id) {
            that._site.getSite(id);
        });

        this._program.command('sites')
        .description("List all existing sites")
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

        
        this._program.command('create site', '<name>, <companyId>')
        .description("Create a new site")
        .option('-p, --public', 'Create a public site')
        .action(function (name, companyId) {

            console.log("param", name, companyId);

            var options = {
            };

            that._site.createSite(name, companyId, options);
        });

        this._program.command('delete site', '<id>')
        .description("Delete an existing site")
        .option('--nc', 'Do not ask confirmation')
        .action(function (id, commands) {

            var options = {
                noconfirmation: commands.nc || false
            };

            that._site.deleteSite(id, options);
        });
    }
}

module.exports = Site;