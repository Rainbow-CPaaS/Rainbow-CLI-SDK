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
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw site 58920e130bbe4b2f703bd382');
            console.log('');
        })
        .action(function (id) {
            that._site.getSite(id);
        });
        
        this._program.command('create site', '<name>, <companyId>')
        .description("Create a new site")
        //.option('-p, --public', 'Create a public site')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw create site 58920e130bbe4b2f703bd382 589dc6ba0bbe4b2f703bd67d');
            console.log('');
        })
        .action(function (name, companyId) {

            var options = {
            };

            that._site.createSite(name, companyId, options);
        });

        this._program.command('delete site', '<id>')
        .description("Delete an existing site")
        .option('--nc', 'Do not ask confirmation')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw delete site 58920e130bbe4b2f703bd382');
            console.log('');
        })
        .action(function (id, commands) {

            var options = {
                noconfirmation: commands.nc || false
            };

            that._site.deleteSite(id, options);
        });

        this._program.command('sites')
        .description("List all existing sites")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000')
        .option('-c, --company <companyid>', 'Limit to a company')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw sites');
            console.log('    $ rbw sites --max');
            console.log('    $ rbw sites --company 589dc6ba0bbe4b2f703bd67d');
            console.log('    $ rbw sites --company 589dc6ba0bbe4b2f703bd67d --file output.csv');
            console.log('');
        })
        .action(function (commands) {
            var options = {
                csv: "",
                company: "",
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
                    company: commands.company || "",
                    csv: commands.file || "",
                    page: page,
                    limit: limit
                };
            }

            that._site.getSites(options);
        });
    }
}

module.exports = Site;