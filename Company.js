"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

var pkg = require('./package.json')
var Screen = require("./Print");
var NodeSDK = require('./SDK');
const Tools = require('./Tools');

class Company {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
    }

    start() {
        this.listOfCommands()
    }

    stop() {

    }

    _getListOfCompanies(token, page) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/admin/v1.0/organisations?format=small', token).then(function(jsonO) {
                var organisations = jsonO;

                var offset = "";
                if(page > -1) {
                    offset = "&offset=";
                    if(page > 1) {
                        offset += (25 * (page - 1));
                    }
                    else {
                        offset +=0;
                    }
                }

                var limit = "";
                if(page > -1) {
                    limit = "&limit=25";
                }

                NodeSDK.get('/api/rainbow/admin/v1.0/companies?format=full' + offset + limit, token).then(function(jsonC) {
                    var companies = jsonC;
                    resolve({organisations: organisations, companies: companies});
                }).catch(function(err) {
                    reject(err);
                });
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _createCompany(token, name) {

        return new Promise(function(resolve, reject) {

            NodeSDK.post('/api/rainbow/admin/v1.0/companies', token, {name: name}).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getUsersFromCompany(token, id, page) {
        return new Promise(function(resolve, reject) {

            var offset = "";
            if(page > -1) {
                offset = "&offset=";
                if(page > 1) {
                    offset += (25 * (page - 1));
                }
                else {
                    offset +=0;
                }
            }

            var limit = "";
            if(page > -1) {
                limit = "&limit=25";
            }

            NodeSDK.get('/api/rainbow/admin/v1.0/users?format=full' + offset + limit + '&companyId=' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getCompany(token, id) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/admin/v1.0/companies/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _deleteCompany(token, id) {

        var that = this;

        return new Promise(function(resolve, reject) {

            that._getCompany(token, id).then(function(company) {
                
                if(company.data.numberUsers > 0) {
                    reject({
                        code: 401,
                        msg: 'At least one user exists in that company',
                        details: ''
                    });
                }
                else {
                    NodeSDK.delete('/api/rainbow/admin/v1.0/companies/' + id, token).then(function(json) {
                        resolve(json);
                    }).catch(function(err) {
                        reject(err);
                    });
                    resolve();
                }
            }).catch(function(err){
                reject(err);
            });
            
        });
    }

    listOfCommands() {

        var that = this;

        var company = null;
        var users = null;

        this._program.command('company', '<id>')
            
            .description("Retrieve information about an existing company")
            .action(function (id) {
                
                Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
            
                if(that._prefs.token && that._prefs.user) {
                    Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
                    Screen.print('');
                
                    if ((typeof id !== 'string') || (id.length === 0)) {
                        Screen.error('An ID name of a company is required');
                    }
                    else {
                        Screen.print("Request informaton for company".white + " '".yellow + id.yellow + "'".yellow);
                        var status = new Spinner('In progress, please wait...');
                        status.start();
                        NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
                            return that._getCompany(that._prefs.token, id);
                        }).then(function(json) {

                            status.stop();
                            Screen.print('');

                            var array = [];
                            array.push([ "#".gray, "Attribute".gray, "Value".gray]);
                            array.push([ "-".gray, "---------".gray, "-----".gray]);  
                            var index = 1;
                            for (var key in json.data) {
                                var data = json.data[key];
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

                            var t = table(array);
                            Screen.table(t);
                            Screen.print('');
                            Screen.success('Company information retrieved successfully.');
                        }).catch(function(err) {
                            status.stop();
                            Screen.print('');
                            Screen.error("Can't delete the company".white + " '" + id.yellow);
                            if(err.details) {
                                Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray + ": " + err.details.gray);
                            }
                            else {
                                Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray);
                            }
                        });
                    }
                }
            }
        );

        this._program.command('users company', '<id>')
        .description("List the users of a company")
        .option('-p, --page <n>', 'Display a specific page')
        .option('-a, --all', 'Display all companies in a single page')
        .action(function (id) {

            var page = 0;
            if("page" in that._program) {
                if(that._program.page > 1) {
                    page = that._program.page;
                }
            }
        
            if("all" in that._program && that._program.all) {
                page = -1
            }

            Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
        
            if(that._prefs.token && that._prefs.user) {
                Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
                Screen.print('');
            
                if ((typeof id !== 'string') || (id.length === 0)) {
                    Screen.error("An 'id' of a company is required");
                }
                else {
                    Screen.print("Current users from company".white + " '".yellow + id.yellow + "'".yellow);
                    var status = new Spinner('In progress, please wait...');
                    status.start();
                    NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
                        return that._getUsersFromCompany(that._prefs.token, id);
                    }).then(function(json) {

                        status.stop();
                        
                        if(json.total > json.limit) {
                            var page = Math.floor(json.offset / json.limit) + 1
                            var totalPage = Math.floor(json.total / json.limit) + 1;
                            
                            Screen.print('Displaying Page '.white + page.toString().yellow + " on ".white + totalPage.toString().yellow);
                        }
                        Screen.print('');

                        var array = [];
                        array.push([ "#".gray, "Name".gray, "Account".gray, "Roles".gray, "Active".gray, "ID".gray]);
                        array.push([ "-".gray, "----".gray, "-------".gray, "-----".gray, "------".gray, "--".gray]);  

                        var users = json.data;

                        for(var i = 0; i < users.length; i++) {

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
                                active = "false".red;
                            }

                            array.push([ (i+1).toString().white, users[i].displayName.white, accountType, roles.white, active, users[i].id.white]);  
                        }

                        var t = table(array);
                        Screen.table(t);
                        Screen.print('');
                        Screen.success(json.total + ' users found.');

                    }).catch(function(err) {
                        status.stop();
                        Screen.print('');
                        Screen.error("Can't list the users".white + " '" + id.yellow);
                        if(err.details) {
                            Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray + ": " + err.details.gray);
                        }
                        else {
                            Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray);
                        }
                    });
                }
            }

        });

        this._program.command('company delete', '<id>')
            .description("Delete an existing company")
            .action(function (id) {

                Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
            
                if(that._prefs.token && that._prefs.user) {
                    Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
                    Screen.print('');
                
                    if ((typeof id !== 'string') || (id.length === 0)) {
                        Screen.error('An ID name of a company is required');
                    }
                    else {
                        Screen.print("Request to delete company".white + " '".yellow + id.yellow + "'".yellow);
                        var status = new Spinner('In progress, please wait...');
                        status.start();
                        NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
                            return that._deleteCompany(that._prefs.token, id);
                        }).then(function(json) {
                            status.stop();
                            Screen.print('');
                        Screen.success('Company'.white + " '".yellow + id.yellow + "'".yellow + " has been successfully deleted.".white);
                    }).catch(function(err) {
                            status.stop();
                            Screen.print('');
                            Screen.error("Can't delete the company".white + " '" + id.yellow);
                            if(err.details) {
                                Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray + ": " + err.details.gray);
                            }
                            else {
                                Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray);
                            }
                        });
                    }
                }
            }
        );

        this._program.command('company create', '<name>')
            .description("Create a new company")
            .action(function (name) {

                Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
            
                if(that._prefs.token && that._prefs.user) {
                    Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
                    Screen.print('');
                    
                
                    if ((typeof name !== 'string') || (name.length === 0)) {
                        Screen.error('A company name is required');
                    }
                    else {
                        Screen.print("Request to create company".white + " '".yellow + name.yellow + "'".yellow);
                        var status = new Spinner('In progress, please wait...');
                        status.start();
                        NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
                            return that._createCompany(that._prefs.token, name);
                        }).then(function(json) {
                            status.stop();
                            Screen.print('');
                        Screen.success('Company'.white + " '".yellow + name.yellow + "'".yellow + " has been successfully created.".white);
                    }).catch(function(err) {
                            status.stop();
                            Screen.print('');
                            Screen.error("Can't create the company".white + " '" + name.yellow);
                            if(err.details) {
                                Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray + ": " + err.details.gray);
                            }
                            else {
                                Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray);
                            }
                        });
                    }
                }
            }
        );

        this._program.command('company list')
            .description("List all existing companies")
            .option('-p, --page <n>', 'Display a specific page')
            .option('-a, --all', 'Display all companies in a single page')
            .action(function (action) {

            var page = 0;
            if("page" in action) {
                if(action.page > 1) {
                    page = action.page;
                }
            }
        
            if("all" in action && action.all) {
                page = -1
            }
            
            Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
            
            if(that._prefs.token && that._prefs.user) {
                Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
                Screen.print('');
                Screen.print("Current Companies:".white);
                
                var status = new Spinner('In progress, please wait...');
                status.start();
                NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
                    return that._getListOfCompanies(that._prefs.token, page);
                }).then(function(json) {
                    status.stop();  

                    if(json.companies.total > json.companies.limit) {
                        var page = Math.floor(json.companies.offset / json.companies.limit) + 1
                        var totalPage = Math.floor(json.companies.total / json.companies.limit) + 1;
                        
                        Screen.print('Displaying Page '.white + page.toString().yellow + " on ".white + totalPage.toString().yellow);
                    }
                    Screen.print('');

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
                        
                        var number = i+1+json.companies.offset;

                        array.push([ number.toString().white, company.name.cyan, offerType, visibility, active ,organisation, company.id.white]); 
                    }

                    var t = table(array);
                    Screen.table(t);
                    Screen.print('');
                    Screen.success(json.companies.total + ' companies found.');
                }).catch(function(err) {
                    status.stop();
                    Screen.print('');
                    Screen.error("Can't list the companies".white);
                    if(err.details) {
                        Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray + ": " + err.details.gray);
                    }
                    else {
                        Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray);
                    }
                });
            }
        });
    }
}

module.exports = Company;