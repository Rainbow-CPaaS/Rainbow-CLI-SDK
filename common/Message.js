"use strict";

const table       = require('text-table');
const inquirer      = require('inquirer');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;

const Screen = require("./Print");
const Tools = require('./Tools');

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

    action(command, param, options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print("Request ".grey + command.white + " `".yellow + param.yellow + "'".yellow);
    }

    out(json) {
        console.log(JSON.stringify(json));
    }

    lineFeed() {
        Screen.print('');
    }

    spin(options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }
            
        let status = new Spinner('In progress, please wait...');
        status.start();
        return status;
    }

    unspin(status) {
        if(status) {
            status.stop();
        }
    }

    table2D(json) {

        var array = [];
        array.push([ "#".gray, "Attribute".gray, "Value".gray]);
        array.push([ "-".gray, "---------".gray, "-----".gray]);  
        var index = 1;
        for (var key in json) {
            var data = json[key];
            if(data === null) {
                array.push([ index.toString().white, key.toString().cyan, 'null'.white ]);  
            } 
            else if(typeof data === "string" && data.length === 0) {
                array.push([  index.toString().white, key.toString().cyan, "''".white ]);  
            }
            else if(Tools.isArray(data) && data.length === 0) {
                array.push([  index.toString().white, key.toString().cyan, "[ ]".white ]);  
            }
            else if((Tools.isArray(data)) && data.length === 1) {
                array.push([  index.toString().white, key.toString().cyan, "[ ".white + JSON.stringify(data[0]).white + " ]".white]);  
            }
            else if((Tools.isArray(data)) && data.length > 1) {
                var item = ""
                for (var i=0; i < data.length; i++) {
                    if(typeof data[i] === "string") {
                        item +=  JSON.stringify(data[i]).white;
                        if(i < data.length -1) {
                            item += ","
                        }
                    }
                    else {
                        item += "[ " + JSON.stringify(data[i]).white + " ]";
                        if(i < data.length -1) {
                            item += ","
                        }
                    }
                }
                array.push([  index.toString().white, key.toString().cyan, "[ ".white + item.white + " ]" ]);  
            }
            else if(Tools.isObject(data)) {
                array.push([  index.toString().white, key.toString().cyan, JSON.stringify(data).white ]);  
            }
            else {
                array.push([  index.toString().white, key.toString().cyan, data.toString().white ]);
            }
            index+=1;

        }

        let t = table(array);
        Screen.table(t);
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

    success(options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.success('Command successfully completed');
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
            process.stdout.write("\r\n");
            return;
        }

        Screen.print('');
        Screen.error("Can't execute the command".white);
        if(!err) {
            Screen.print("No details");
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
                if(err.msg && err.code) {
                    Screen.print("(".gray + err.msg.gray + '/'.gray + err.code.toString().gray + ')'.gray);
                }
                else {
                    Screen.print("No details");
                }
                
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