"use strict";

var CPhone = require('../commands/CPhone');

class Phone {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._phone = new CPhone(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        
        this._program.command('phone', '<id> <systemid>')
        .description("Retrieve information about an existing phone")
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw phone 58920e130bbe4b2f703bd382 589dc6ba0bbe4b2f703bd67d');
            console.log('');
        })
        .action(function (id, systemid) {
            that._phone.getPhone(id, systemid);
        });

        this._program.command('phones', '<systemid>')
        .description("List all existing phones on a system")
        .option('-p, --page <number>', 'Display a specific page')
        .option('-l, --limit <number>', 'Limit to a number of instances per page (max=1000')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw phones 589dc6ba0bbe4b2f703bd67d');
            console.log('    $ rbw phones 589dc6ba0bbe4b2f703bd67d --max');
            console.log('    $ rbw phones 589dc6ba0bbe4b2f703bd67d --max --file output.csv');
            console.log('');
        })
        .action(function (systemid, commands) {

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
                    page: page,
                    limit: limit
                };

            }

            that._phone.getPhones(systemid, options);
        });
    }
}

module.exports = Phone;