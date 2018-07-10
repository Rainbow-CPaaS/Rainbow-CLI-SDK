"use strict";

var CInvoice = require('../commands/CInvoice');
var Logger = require('../common/Logger');
var Middleware = require('../common/Middleware');

class Invoice {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._invoice = new CInvoice(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    listOfCommands() {
        var that = this;

        this._program.command('invoices')
        .description("List the invoices")
        .option('-i, --cid <id>', 'Filter invoices by a company id only')
        .option('-p, --period <period>', 'Filter invoices by a period')
        .option('--conference', 'Filter by invoice of type conference')
        .option('--services', 'Filter by invoice of type services')
        .option('--inv', 'Filter by invoice with file type INV')
        .option('--cdr', 'Filter by invoice with file type CDR')
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log("    $ rbw invoices");
            console.log("    $ rbw invoices -i 593065822799299343b8501d");
            console.log("    $ rbw invoices -p 2017-12 --services --cdr");
            console.log("    $ rbw invoices --json");
            console.log('');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports an array of JSON objects representing the users retrieved to the console');
            console.log('');
        })
        .action(function (commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noOutput: commands.json ? true : false,
                    companyId: commands.cid || "",
                    period: commands.period || "",
                    conference: commands.conference ? true : false,
                    services: commands.services ? true: false,
                    cdr: commands.cdr ? true : false,
                    inv: commands.inv ? true : false
                };

                Logger.isActive = commands.verbose || false;

                that._invoice.getInvoices(options);
            }).catch( () => {

            });
        });

        this._program.command('download cdr services', '[toFile]')
        .description("Retrieve information about an existing invoice for services")
        .option('-i, --company <company>', 'Filter by a company')
        .option('-y, --year <year>', 'Filter by a year')
        .option('-m, --month <month>', 'Filter by a year')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw download cdr services');
            console.log('    $ rbw download cdr services -i 57ea7475d78f3ba5aae98935');
            console.log('');
        })
        .action(function (toFile, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noOutput: commands.json || false,
                    companyId: commands.company,
                    csv: toFile,
                    year: commands.year || "",
                    month: commands.month || ""
                }

                Logger.isActive = commands.verbose || false;

                that._invoice.getInvoiceService(options);
            }).catch( () => {

            });
        });

        this._program.command('download cdr conference', '[toFile]')
        .description("Retrieve information about an existing invoice for conference")
        .option('-i, --company <company>', 'Filter by a company')
        .option('-y, --year <year>', 'Filter by a year')
        .option('-m, --month <month>', 'Filter by a year')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw download cdr conference');
            console.log('    $ rbw download cdr conference -i 57ea7475d78f3ba5aae98935');
            console.log('');
        })
        .action(function (toFile, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noOutput: commands.json || false,
                    companyId: commands.company,
                    csv: toFile,
                    year: commands.year || "",
                    month: commands.month || ""
                }

                Logger.isActive = commands.verbose || false;

                that._invoice.getInvoiceConference(options);
            }).catch( () => {

            });
        });

        this._program.command('download invoice', '<downloadFile> [toFile]')
        .description("Retrieve information about an existing invoice")
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw invoice 58cc15ff8a69092b8ac07143/2017-10/services/CDR_SERV_2017-10-13_mycompany.csv /path/to/my/file.csv');
            console.log('');
        })
        .action(function (downloadFile, toFile, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options = {
                    noOutput: commands.json || false,
                    path: downloadFile,
                    csv: toFile
                }

                Logger.isActive = commands.verbose || false;

                that._invoice.getInvoice(options);
            }).catch( () => {

            });
        });
    }
}

module.exports = Invoice;