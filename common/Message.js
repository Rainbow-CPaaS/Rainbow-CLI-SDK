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

    unspin(spin) {
        if(spin) {
            spin.stop();
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

    tableCompanies(json, options) {

        var array = [];

        array.push([ "#".gray, "Company name".gray, "Type".gray, "Visibility".gray, "Active".gray, "Organization".gray, "Identifier".gray]);
        array.push([ "-".gray, "------------".gray, "----".gray, "----------".gray, "------".gray, "-----------".gray, "----------".gray]);  

        for (var i = 0; i < json.companies.data.length; i++) {
            var company = json.companies.data[i];
            
            var visibility = "private".white;
            if(company.visibility === "public") {
                visibility = "public".yellow;
            }

            var offerType = "freemium".white;
            if(company.offerType === "premium") {
                offerType = "premium".yellow;
            }

            var active = "true".white;
            if(company.status !== "active") {
                active = "false".red;
            }

            var organisation = "".white;
            if(company.organisationId !== null) {
                for(var j = 0; j < json.organisations.data.length; j++) {
                    var org = json.organisations.data[j];
                    if(org.id === company.organisationId) {
                        organisation = org.id.white;
                        break;
                    }
                }
            }
            
            var number = (i+1);
            if(Number(options.page) > 0) {
                number = ((Number(options.page)-1) * json.companies.limit) + (i+1);
            }

            array.push([ number.toString().white, company.name.cyan, offerType, visibility, active ,organisation, company.id.white]); 
        }

        var t = table(array);
        Screen.table(t);
        Screen.print('');
        Screen.success(json.companies.total + ' companies found.');
    }

    tableOrganizations(json, options) {
        var array = [];

        array.push([ "#".gray, "Organization name".gray, "Visibility".gray, "Identifier".gray]);
        array.push([ "-".gray, "-----------------".gray, "----------".gray, "----------".gray]);  

        for (var i = 0; i < json.data.length; i++) {
            var org = json.data[i];
            
            var visibility = "private".white;
            if(org.visibility === "public") {
                visibility = "public".yellow;
            }
            
            var number = (i+1);
            if(options.page > 0) {
                number = ((options.page-1) * json.limit) + (i+1);
            }

            array.push([ number.toString().white, org.name.cyan, visibility, org.id.white]); 
        }

        var t = table(array);
        Screen.table(t);
        Screen.print('');
        Screen.success(json.total + ' organizations found.');
    }

    tablePhones(json, options) {
        var array = [];

        array.push([ "#".gray, "Short number".gray, "From System".gray, "Voice Mail number".gray, "Number".gray, "Monitored".gray, "ID".gray]);
        array.push([ "-".gray, "------------".gray, "-----------".gray, "-----------------".gray, "------".gray, "---------".gray, "--".gray]);  

        for (var i = 0; i < json.data.length; i++) {

            var phone = json.data[i];
            
            var number = (i+1);
            if(options.page > 0) {
                number = ((options.page-1) * json.limit) + (i+1);
            }

            var fromSystem = "No".white;
            if(phone.isFromSystem) {
                fromSystem = "Yes".yellow;
            }

            var isMonitored = "No".white;
            if(phone.isMonitored) {
                isMonitored = "True".yellow;
            }

            var longNumber = phone.numberE164 || phone.number || "";
            var vm = phone.voiceMailNumber || "";
            var sn = phone.shortNumber || "";

            array.push([ number.toString().white, sn.cyan, fromSystem, vm.white, longNumber.white, isMonitored, phone.id.white]); 
        }

        var t = table(array);
        Screen.table(t);
        Screen.print('');
        Screen.success(json.total + ' systems found.');
    }

    tableSystems(json, options) {
        var array = [];

        array.push([ "#".gray, "System name".gray, "Version".gray, "Status".gray, "Type".gray, "ID".gray]);
        array.push([ "-".gray, "-----------".gray, "-------".gray, "------".gray, "----".gray, "--".gray]);  

        for (var i = 0; i < json.data.length; i++) {

            var system = json.data[i];

            var number = (i+1);
            if(options.page > 0) {
                number = ((options.page-1) * json.limit) + (i+1);
            }

            var type = system.type || "";
            var version = system.version || "";
            var name = system.name || ""
            var stats = system.status || "";
            if(stats !== "created") {
                stats = stats.yellow;
            }
            else {
                stats = stats.white;
            }

            array.push([ number.toString().white, name.cyan, version.white, stats, type.white, system.id.white]); 
        }

        var t = table(array);
        Screen.table(t);
        Screen.print('');
        Screen.success(json.total + ' systems found.');
    }

    tableAPI(json, options) {
        var array = [];
        array.push([ "#".gray, "API".gray, "Version".gray]);
        array.push([ "-".gray, "---".gray, "------".gray]);  

        for(var i=0; i < json.length; i++) {
            array.push([(i+1).toString().white, json[i].name.white, json[i].version.cyan ]);
        }

        var t = table(array);
        Screen.table(t);
        Screen.print('');
        Screen.success('status successfully executed.');
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

    tableSites(json, options) {

        var array = [];

        array.push([ "#".gray, "Site name".gray, "Status".gray, "ID".gray, "Company ID".gray]);
        array.push([ "-".gray, "---------".gray, "------".gray, "--".gray]);  

        for (var i = 0; i < json.data.length; i++) {
            var site = json.data[i];

            var active = "true".white;
            if(site.status !== "active") {
                active = "false".red;
            }
            
            var number = (i+1);
            if(options.page > 0) {
                number = ((options.page-1) * json.limit) + (i+1);
            }

            array.push([ number.toString().white, site.name.cyan, active, site.id.white, site.companyId.white]); 
        }

        var t = table(array);
        Screen.table(t);
        Screen.print('');
        Screen.success(json.total + ' sites found.');
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

    notFound() {
        Screen.error("Command not found");
        Screen.print("Type `rbw --help` for the list of available commands");
    }

    found(number, type, options) {
         if(!this._shouldDisplayOutput(options)) {
            return;
        }
        Screen.print('');
        Screen.print(number.toString().yellow + " " + type.yellow + " match".white);
    }

    warn(text, value, options) {
        if(!this._shouldDisplayOutput(options)) {
            return;
        }

        Screen.print("Warning, ".red + text.white  + " '".cyan + value.cyan + "'".cyan);
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
                else if (Tools.isObject(err.details)) {
                    let details = err.details.details || err.msg || "Bad request";
                    Screen.print(details.white + ' ('.gray + err.details.msg.gray + '/'.gray + err.details.code.toString().gray + ')'.gray);
                }
                else {
                    var param = "";
                    err.details.forEach(function(detail) {
                        Screen.print("Incorrect value for ".white + detail.param.yellow + ' ('.gray + detail.msg.gray + ')'.gray);
                    });
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