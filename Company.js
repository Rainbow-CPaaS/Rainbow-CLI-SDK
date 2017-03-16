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

    _getListOfCompaniges(id, token, page) {

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
            });
        });
    }

    listOfCommands() {

        var that = this;

        this._program.command('company')
            .usage('list')
            .option('-p, --page <n>', 'Display a specific page')
            .option('-a, --all', 'Display all companies in a single page')
            .action(function (action, program) {

            var page = 0;
            if("page" in program) {
                if(program.page > 1) {
                    page = program.page;
                }
            }
        
            if("all" in program && program.all) {
                page = -1
            }
            
            Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
            
            if(that._prefs.token && that._prefs.user) {
                Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
                Screen.print('');
                Screen.print("Current Companies:".white);
                
                
                var status = new Spinner('In progress, please wait...');
                status.start();
                NodeSDK.start(that._prefs.account.email, that._prefs.account.password).then(function() {
                    return that._getListOfCompaniges(that._prefs.user.id, that._prefs.token, page);
                }).then(function(json) {
                    status.stop();  

                    if(json.companies.total > json.companies.limit) {
                        var page = Math.floor(json.companies.offset / json.companies.limit) + 1
                        var totalPage = Math.floor(json.companies.total / json.companies.limit) + 1;
                        
                        Screen.print('Displaying Page '.white + page.toString().magenta + " on ".white + totalPage.toString().magenta);
                    }
                    Screen.print('');

                    var array = [];

                    array.push([ "#".gray, "Company name".gray, "Type".gray, "Visibility".gray, "Active".gray, "Organization".gray, "Identifier".gray]);
                    array.push([ "-".gray, "------------".gray, "----".gray, "----------".gray, "------".gray, "-----------".gray, "----------".gray]);  

                    for (var i = 0; i < json.companies.data.length; i++) {
                        var company = json.companies.data[i];
                        
                        var visibility = "private".white;
                        if(company.visibility === "public") {
                            visibility = "public".magenta;
                        }

                        var offerType = "freemium".white;
                        if(company.offerType === "premium") {
                            offerType = "premium".magenta;
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
                                    organisation = org.name.magenta;
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
                    
                    
                });
            }
            
        });

        
    }
}

module.exports = Company;