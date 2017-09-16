"use strict";

const winston = require("winston");
const fs = require("fs");

const tsFormat = () => {

    let date = new Date();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString() + " [" + date.valueOf() + "]";
};

class Logger {

    constructor(config) {

        this._logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({ 
                    colorize: true, 
                    timestamp: tsFormat, 
                    level: "debug" 
                })
            ]
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