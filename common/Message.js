"use strict";

var Screen = require("./Print");

class Message {

    constructor() {
    }

    welcome() {
        Screen.print('Welcome to '.white + 'Rainbow CLI'.rainbow);
    }

    loggedin(username) {
        username = username || "unknown";
        Screen.print('You are logged in as'.grey + " " + username.magenta);
        Screen.print('');
    }

    notLoggedIn() {
        Screen.error('Please, you have to log-in before executing other commands');
    }

    error(err) {
        Screen.print('');
        Screen.error("Can't execute the command".white);
        if(!err) {
            Screen.print("No details.");
        }
        else {
            if(err.details) {
                if(typeof err.details === "string") {
                    Screen.print(err.details.white + ' ('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                }
                else {
                    var param = "";
                    err.details.forEach(function(detail) {
                        param += "'" + detail.param + "' ";
                    });

                    Screen.print("Incorrect value for ".white + param.yellow + '('.gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                }
            }
            else {
                Screen.print("(".gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
            }
        }
    }
}

module.exports = new Message();