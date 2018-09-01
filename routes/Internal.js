"use strict";

let CInternal = require('../commands/CInternal');
const Logger = require('../common/Logger');
const Middleware = require('../common/Middleware');
const Message = require('../common/Message');

class Internal {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
        this._internal = new CInternal(this._prefs);
    }

    start() {
        this.listOfCommands();
    }

    stop() {

    }
    listOfCommands() {
        var that = this;

        this._program.command('dashboard metrics')
        .description("Display applications metrics for application with subscription")
        .option('-m, --month <month>', 'Get metrics for a specific month. Format is YYYYMM')
        .option('-a, --all', 'Get metrics for all applications including business applications')
        .option('-f, --file <filename>', 'Print result to a file in CSV')
        .option('-v, --verbose', 'Use verbose console mode')
        .action(function (commands) {
            Middleware.parseCommand(commands).then( () => {
                Logger.isActive = commands.verbose || false;

                var options = {
                    month: commands.month,
                    group: true,
                    csv: commands.file,
                    all: commands.all,
                };

                that._internal.dashboardMetrics(options);
            }).catch( (err) => {
                Message.error(err, {});
            });
        });
    }
}

module.exports = Internal;