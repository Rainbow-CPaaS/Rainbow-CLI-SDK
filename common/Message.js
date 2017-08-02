"use strict";

const table         = require('text-table');
const inquirer      = require('inquirer');
const CLI           = require('clui');
const Spinner       = CLI.Spinner;
const csv           = require('csv');
const fs            = require('fs');

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

    version(v, options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print('Version ' + v.yellow);
    }

    action(command, param, options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        if(param) {
            Screen.print("Request ".grey + command.white + " `".yellow + param.yellow + "'".yellow);
        }
        else {
            Screen.print("Request ".grey + command.white);
        }
    }

    out(json) {
        console.log(JSON.stringify(json));
    }

    csv(file, json) {

        return new Promise((resolve, reject) => {

            let stringify = csv.stringify;
            let writeStream = fs.createWriteStream(file, { flags : 'w' });

            stringify(json, {
                formatters: {
                    date: function(value) {
                        return moment(value).format('YYYY-MM-DD');
                    }
                },
                delimiter: ";",
                header: true
            }).pipe(writeStream);
            writeStream.on('close', function () {
                Screen.success("Successfully saved".white + " " + json.total.toString().magenta + " user(s) to".white + " '".white + options.csv.yellow + "'".white);
                resolve();
            });
            writeStream.on('error', function (err) {
                reject(err);
            });

        });

        
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

    tablePage(json, options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        let page = Math.floor(json.offset / json.limit) + 1
        let totalPage = Math.floor(json.total / json.limit) + 1;
                        
        Screen.print('Displaying Page '.white + page.toString().yellow + " on ".white + totalPage.toString().yellow);
    }

    tableUsers(json, options) {

        var array = [];
        array.push([ "#".gray, "Name".gray, "LoginEmail".gray, "Company".gray, "Account".gray, "Roles".gray, "Active".gray, "ID".gray]);
        array.push([ "-".gray, "----".gray, "----------".gray, "-------".gray, "-------".gray, "-----".gray, "------".gray, "--".gray]);  

        var users = json.data;

        var companyId = "";

        for(var i = 0; i < users.length; i++) {

            if(options.company || options.companyId) {
                companyId = users[i].companyId;
            }

            var accountType = users[i].accountType;
            if(accountType === "free") {
                accountType = accountType.white;
            }
            else {
                accountType = accountType.yellow;
            }

            var roles = users[i].roles.join();

            var active = "true".white;
            if(!users[i].isActive) {
                active = "false".yellow;
            }

            var name = "";
            name = users[i].displayName;
            if(!name) {
                name = users[i].firstName + " " +users[i].lastName;
            }

            var number = (i+1);
            if(options.page > 0) {
                number = ((options.page-1) * json.limit) + (i+1);
            }

            var companyName = users[i].companyName || "";

            array.push([ number.toString().white, name.cyan, users[i].loginEmail.white, companyName.white, accountType, roles.white, active, users[i].id.white]);  
        }

        var t = table(array);
        Screen.table(t);

        Screen.print('');

        if(options.company) {
            Screen.success(json.total + ' users found in company ' + options.company);
        } else if(options.companyId) {
            Screen.success(json.total + ' users found in company ' + options.companyId);
        } else {
            Screen.success(json.total + ' users found');
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

    printSuccess(text, value, options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print(text.white + " '".cyan + value.toString().cyan + "'".cyan);
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
                else if (typeof err.details === "object") {
                    Screen.print(err.details.details.white + ' ('.gray + err.details.msg.gray + '/'.gray + err.details.code.toString().gray + ')'.gray);
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