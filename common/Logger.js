const Winston = require('winston');
const fs = require("fs");
const util = require("util");
const stripAnsi = require('strip-ansi');

const tsFormat = () => {
    let date = new Date();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString() + " [" + date.valueOf() + "]";
};

const myFormat = Winston.format.printf(info => {
    return `${tsFormat()}` + ' - ' + stripAnsi(info.level) + ':' + stripAnsi(info.message);
});

const argumentsToString = (v)=>{
    // convert arguments object to real array
    var args = Array.prototype.slice.call(v, 1);
    for(var k in args){
        if (typeof args[k] === "object"){
            //args[k] = util.inspect(args[k], false, null, true);
            args[k] = util.inspect(args[k], { showHidden: false, depth: 5, colors: false, customInspect: false });
        }
    }
    var str = args.join(" ");
    return str;
}

const logLevel = "debug";
let winston = null;

class Logger {

    constructor(config) {

        let logFormat = myFormat;

        this._logger = {};
        this._logger.info = () => {
            winston.log("info", argumentsToString(arguments));
        };

        this._logger.error = () => {
            winston.log("error", argumentsToString(arguments));
        };

        this._logger.warn = () => {
            winston.log("warn", argumentsToString(arguments));
        };

        this._logger.debug = function(level) {
            winston.log(level, argumentsToString(arguments));
        };

        winston = Winston.createLogger({
            format: Winston.format.combine(
                Winston.format.simple(),
                Winston.format.timestamp(),
                logFormat
            ),
            transports: [
                new (Winston.transports.Console)({
                    level: logLevel
                })
            ]
        });

        if (this._logger) {
            this._logger.colors = this.colors ;
        }

        this._isActive = false;
    }

    set isActive(isActivated) {
        this._isActive = isActivated;
    }

    get isActive() {
        return this._isActive;
    }

    logs(message, value) {
        try {
            if(this._isActive) {
                this._logger.debug(logLevel, message, value);
            }
        }
        catch(err) {
            console.error("CLI Parsing issue>>>", err);
        }
    }

    error(message, value) {
        if(this._isActive) {
            this._logger.error("error", message, value);
        }
    }
}

module.exports = new Logger();