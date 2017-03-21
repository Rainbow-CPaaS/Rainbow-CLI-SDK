"use strict";

var Screen = require("./Print");

class Message {

    constructor() {
    }

    welcome() {
        Screen.print('Welcome to ' + 'Rainbow'.rainbow);
    }

    error(err) {
        Screen.print('');
        Screen.error("Can't execute the command".white);
        if(err.details) {
            if(typeof err.details === "string") {
                Screen.print(err.details.white + ' ('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
            }
            else {
                var param = "";
                err.details.forEach(function(detail) {
                    param += "'" + detail.param + "' ";
                });

                Screen.error("Incorrect value for ".white + param.white + '('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
            }
        }
        else {
            Screen.print("(".gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
        }
    }
}

module.exports = new Message();