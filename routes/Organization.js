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

        this._program.command('org')
        .description("List all existing organizations")
        .option('-p, --page [number]', 'Display a specific page')
        .option('-m, --max', 'Display up to max result per page (max=1000)')
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
            };

            that._organization.getOrganizations(page, filter);
        });
    }
}

module.exports = Organization;