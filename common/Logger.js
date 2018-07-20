"use strict";

//const winston = require("winston");
const winston = require('winston');
const fs = require("fs");

const tsFormat = () => {

    let date = new Date();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString() + " [" + date.valueOf() + "]";
};

class Logger {

    constructor(config) {

        const myFormat = winston.format.printf(info => {
            return `${info.timestamp} [${info.label}] - ${info.level}: ${info.message} ${JSON.stringify(info.data)}`;
        });

        this._logger = winston.createLogger({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.label({ label: 'rbw-cli' }),
                winston.format.timestamp(),
                myFormat,
            ),
            
            transports:[new winston.transports.Console()]
        });

        this._isActive = false;
    }

    set isActive(isActivated) {
        this._isActive = isActivated;
    }

    get isActive() {
        return this._isActive;
    }

    logs(message, value) {
        if(this._isActive) {
            this._logger.log("debug", message, value);
        }
    }

    error(message, value) {
        if(this._isActive) {
            this._logger.log("error", message, value);
        }
    }
}

module.exports = new Logger();