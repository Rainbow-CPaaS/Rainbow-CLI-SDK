"use strict";

var CDeveloper = require('../commands/CDeveloper');
var Logger = require('../common/Logger');
var Middleware = require('../common/Middleware');

class Developer {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._developer = new CDeveloper(this._prefs);
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    listOfCommands() {
        var that = this;

        this._program.command('developers payment', '[id]')
        .description("Retrieve developer payment account if exists")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers payment 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers payment 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    id: id || null,
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._developer.getPayments(options);
            }).catch( () => {

            });
        });

        this._program.command('developers delete payment', '[id]')
        .description("Delete a developer payment account if exists. Only works when no active subscription")
        .option('--nc', 'Do not ask confirmation')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers delete payment 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers delete payment 57ea7475d78f3ba5aae98935 -nc');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    id: id || null,
                    noconfirmation: commands.nc || false
                };

                Logger.isActive = commands.verbose || false;

                that._developer.deletePayment(options);
            }).catch( () => {

            });
        });

        this._program.command('developers methods', '[id]')
        .description("Retrieve developer payment methods if exists")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers methods 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers methods 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    id: id || null,
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._developer.getMethods(options);
            }).catch( () => {

            });
        });

        this._program.command('developers method', '<methodid> [id]')
        .description("Retrieve information of a developer payment method")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers method 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers method 57ea7475d78f3ba5aae98935 64ba6453E4563ba5bce98534 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (methodid, id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    id: id || null,
                    methodid: methodid,
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._developer.getMethod(options);
            }).catch( () => {

            });
        });

        this._program.command('developers delete method', '<methodid> [id]')
        .description("Delete a developer payment method")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers delete method 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers delete method 57ea7475d78f3ba5aae98935 64ba6453E4563ba5bce98534');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (methodid, id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    id: id || null,
                    methodid: methodid,
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._developer.deleteMethod(options);
            }).catch( () => {

            });
        });

        this._program.command('developers subscriptions', '[id]')
        .description("Retrieve developer subscriptions if exist")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers subscriptions 57ea7475d78f3ba5aae98935');
            console.log('    $ rbw developers subscriptions 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (id, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    id: id || null,
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._developer.getSubscriptions(options);
            }).catch( () => {

            });
        });

        this._program.command('developers invoices', '[userid]')
        .description("Retrieve developer invoices if exist")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers invoices');
            console.log('    $ rbw developers invoices 57ea7475d78f3ba5aae98935 --json');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (userid, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    id: userid || null,
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._developer.getInvoices(options);
            }).catch( () => {

            });
        });

        this._program.command('developers add role', '<userId> <role>')
        .description("Add a developer's role to a developer")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers add role 57ea7475d78f3ba5aae98935 app_admin_internal');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (userId, role, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    userId: userId || null,
                    role: role,
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._developer.addRole(options);
            }).catch( () => {
                console.log("exception");
            });
        });

        this._program.command('developers remove role', '<userId> <role>')
        .description("Remove a developer's role to a developer")
        .option('-j, --json', 'Write the JSON result to standard stdout')
        .option('-v, --verbose', 'Use verbose console mode')
        .on('--help', function(){
            console.log('  Examples:');
            console.log('');
            console.log('    $ rbw developers remove role 57ea7475d78f3ba5aae98935 app_admin_internal');
            console.log('');
            console.log('  Details:');
            console.log('');
            console.log('    The option `--json` exports the JSON object representing the user to the console');
            console.log('');
        })
        .action(function (userId, role, commands) {

            Middleware.parseCommand(commands).then( () => {
                var options= {
                    userId: userId || null,
                    role: role,
                    noOutput: commands.json || false,
                };

                Logger.isActive = commands.verbose || false;

                that._developer.removeRole(options);
            }).catch( () => {

            });
        });
    }
}

module.exports = Developer;