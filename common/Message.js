"use strict";

var inquirer = require('inquirer');

var Screen = require("./Print");

class Message {

    constructor() {
    }

    _shouldDisplayOutput(options) {
        if (options && ("noOutput" in options)) {
            return !options.noOutput
        }

        return true;
    }

    welcome(options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print('Welcome to '.white + 'Rainbow CLI'.rainbow);
    }

    loggedin(user, options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print('You are logged in as'.grey + " " + user.loginEmail.magenta);
        Screen.print('With the roles of'.grey + " " + user.roles.join(' | ').cyan);
        Screen.print('');
    }

    notLoggedIn(options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.error('Please, you have to log-in before executing other commands');
    }

    canceled(options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print('Your command has been canceled');
        Screen.print('');
    }

    error(err, options) {
        if(!this._shouldDisplayOutput(options)) {
            var out = new Buffer.from(JSON.stringify(err));
            process.stdout.write(out);
            return;
        }

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

    choices(message, choices) {
        return new Promise(function(resolve, reject) {

            var question = {
                type: 'list',
                message: message,
                choices: choices,
                name: 'confirmation'
            };

            inquirer.prompt([question]).then(function (answer) {
                resolve(answer.confirmation);        
            });

        });
    }

    confirm(message) {
        return new Promise(function(resolve, reject) {

            var question = {
                type: 'list',
                message: message,
                choices: [{name: 'Yes', value:true}, {name: 'Damned!, forget my command...', value: false}],
                name: 'confirmation'
            };

            inquirer.prompt([question]).then(function (answer) {
                resolve(answer.confirmation);        
            });

        });
    }
}

module.exports = new Message();