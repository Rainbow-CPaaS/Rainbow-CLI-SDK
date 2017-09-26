"use strict";

var CCompany = require('../commands/CCompany');
var Logger = require('../common/Logger');

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
        .option('--json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw company 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw company 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the company to the console');
            console.log('');
        })
        .action(function (id, commands) {

            var options = {
                noOutput: commands.json || false
            }

            Logger.isActive = commands.verbose || false;

            that._company.getCompany(id, options);
        });

        this._program.command('create company', '<name>')
        .description("Create a new company")
        .option('--json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw create company "A new company"');
            console.log('    $ rbw create company "A new company" --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the company created to the console');
            console.log('');
        })
        .action(function (name, commands) {

            var options = {
                noOutput: commands.json || false
            }

            Logger.isActive = commands.verbose || false;

            that._company.createCompany(name, options);
        });

        this._program.command('delete company', '<id>')
        .description("Delete an existing company")
        .option('--nc', 'Do not ask confirmation')
        .option('-f, --force', 'Force to remove the company and the users if exist')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw delete company 57ea7475d78f3ba5aae98935');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--nc` disables confirmation');
            console.log('    The option `--force` deletes the company even if users exist (in that case, users are deleted first)');
            console.log('');
        })
        .action(function (id, commands) {

            var options = {
                noconfirmation: commands.nc || false,
                force: commands.force || false
            };

            Logger.isActive = commands.verbose || false;

            that._company.deleteCompany(id, options);
        });

        this._program.command('status company', '<id>')
        .description("Give a status on a company")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw status company 57ea7475d78f3ba5aae98935');
            console.log('');
            console.log('  Details:');
            console.log('');
        })
        .action(function (id, commands) {

            var options = {
            };

            Logger.isActive = commands.verbose || false;

            that._company.statusCompany(id, options);
        });


        this._program.command('link company', '<id> <orgid>')
        .description("Link the company to an organization")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw link company 57ea7475d78f3ba5aae98935 57ea7475d78f3ba5aae98935');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    This command requires at least `organization_admin` role');
            console.log('');
        })
        .action(function (id, orgid, commands) {

            Logger.isActive = commands.verbose || false;
            that._company.linkCompany(id, orgid);
        });

        this._program.command('unlink company', '<id>')
        .description("unlink a company from its organization")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw unlink company 57ea7475d78f3ba5aae98935');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    This command requires at least `organization_admin` role');
            console.log('');
        })
        .action(function (id, commands) {

            Logger.isActive = commands.verbose || false;
            that._company.unlinkCompany(id);
        });

        this._program.command('companies')
        .description("List all existing companies")
        .option('-v, --verbose', 'Use verbose console mode')
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000')
        .option('--bp', 'Filter only bp companies')
        .option('--name <name>', 'Filter by company name')
        .option('-o, --org <id>', 'Filter on an organization')
        .option('--json', 'Write the JSON result to standard stdout')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw companies');
            console.log('    $ rbw companies -p 3');
            console.log('    $ rbw companies --org 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw companies --org 57ea7475d78f3ba5aae98935 --json');
            console.log('    $ rbw companies --name "Rainbow"');
            console.log('    $ rbw companies --file output.csv');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the company created to the console');
            console.log('    The options `--page` and `limit` allow to navigate between paginated results');
            console.log('    The options `--file` exports only fields `id`, `loginEmail`, `firstName`, `lastName`, `displayName`, `isActive`, `jid_im`, `jid_tel`, `companyId`, `companyName`');
            console.log('');
            console.log('');
        })
        .action(function (commands) {

            var options = {
                bp: false,
                org: "",
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
                    bp: commands.bp || false,
                    org: commands.org ? commands.org : "",
                    csv: commands.file || "",
                    page: page,
                    name: commands.name || null,
                    noOutput: commands.json || false,
                    limit: limit
                };
            }

            Logger.isActive = commands.verbose || false;

            that._company.getCompanies(options);
        });
    }
}

module.exports = Company;