"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

const csv = require('csv');
const fs = require('fs');

const pkg = require('../package.json');
const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Tools = require('../common/Tools');
const Message = require('../common/Message');

const CFree = require('./CFree');

class CCompany {

    constructor(prefs) {
        this._prefs = prefs;
        this._free = new CFree(this._prefs);
    }

    _getListOfCompanies(token, options) {

        return new Promise(function(resolve, reject) {

            var filterToApply = "";

            if(options.bp) {
                filterToApply += "&isBP=true";
            }

            NodeSDK.get('/api/rainbow/admin/v1.0/organisations?format=small', token).then(function(jsonO) {
                var organisations = jsonO;

                var offset = "";
                if(options.page > -1) {
                    offset = "&offset=";
                    if(options.page > 1) {
                        offset += (25 * (options.page - 1));
                    }
                    else {
                        offset +=0;
                    }
                }

                var limit = "";
                if(options.page > -1) {
                    limit = "&limit=25";
                }
                else {
                    limit = "&limit=1000";
                }

                if(options.org) {
                    NodeSDK.get('/api/rainbow/admin/v1.0/organisations/' + options.org + '/companies?format=full' + filterToApply + offset + limit, token).then(function(jsonC) {
                        var companies = jsonC;
                        resolve({organisations: organisations, companies: companies});
                    }).catch(function(err) {
                        reject(err);
                    });
                } else {
                    NodeSDK.get('/api/rainbow/admin/v1.0/companies?format=full' + filterToApply + offset + limit, token).then(function(jsonC) {
                        var companies = jsonC;
                        resolve({organisations: organisations, companies: companies});
                    }).catch(function(err) {
                        reject(err);
                    });
                }

                
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

    _getCompany(token, id) {

        return new Promise(function(resolve, reject) {

            NodeSDK.get('/api/rainbow/admin/v1.0/companies/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _deleteCompany(token, id, options) {

        var that = this;

        return new Promise(function(resolve, reject) {

            if(options.force) {

                that._free._removeAllUsersFromACompany(token, id).then(function() {
                    NodeSDK.delete('/api/rainbow/admin/v1.0/companies/' + id, token).then(function(json) {
                        resolve(json);
                    }).catch(function(err) {
                        reject(err);
                    });
                }).catch(function(err) {
                    reject(err)
                });
            }
            else {
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
                    }
                }).catch(function(err){
                    reject(err);
                });
            }
            
        });
    }

    _linkCompany(token, id, orgid) {

        var that = this;

        return new Promise(function(resolve, reject) {

            NodeSDK.post('/api/rainbow/admin/v1.0/organisations/' + orgid + '/companies', token, {companyId: id}).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
            resolve();
        });
    }

    _unlinkCompany(token, id) {

        var that = this;

        return new Promise(function(resolve, reject) {

            that._getCompany(token, id).then(function(company) {

                var organisationId = company.data.organisationId;
                
                NodeSDK.delete('/api/rainbow/admin/v1.0/organisations/' + organisationId + '/companies/' + id, token).then(function(json) {
                    resolve(json);
                }).catch(function(err) {
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        });
    }

    getCompanies(options) {
        var that = this;

        Message.welcome();
        
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);

            if(!options.csv) {
                Screen.print("Current Companies:".white);
            }
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getListOfCompanies(that._prefs.token, options);
            }).then(function(json) {
                status.stop();  

                if(options.csv) {
                    let stringify = csv.stringify;
                    var writeStream = fs.createWriteStream(options.csv, { flags : 'w' });

                    stringify(json.companies.data, {
                        formatters: {
                            date: function(value) {
                                return moment(value).format('YYYY-MM-DD');
                            }
                        },
                        delimiter: ";",
                        header: true
                    }).pipe(writeStream);
                    writeStream.on('close', function () {
                        Screen.success("Successfully saved".white + " " + json.companies.total.toString().magenta + " companie(s) to".white + " '".white + options.csv.yellow + "'".white);
                    });
                    writeStream.on('error', function (err) {
                        console.log('Error!', err);
                    });
                }
                else {
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
                        
                        var number = (i+1);
                        if(options.page > 0) {
                            number = ((options.page-1) * json.limit) + (i+1);
                        }

                        array.push([ number.toString().white, company.name.cyan, offerType, visibility, active ,organisation, company.id.white]); 
                    }

                    var t = table(array);
                    Screen.table(t);
                    Screen.print('');
                    Screen.success(json.companies.total + ' companies found.');
                }
            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }

    createCompany(name) {
        var that = this;

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);
        
            if ((typeof name !== 'string') || (name.length === 0)) {
                Screen.error('A company name is required');
            }
            else {
                Screen.print("Request to create company".white + " '".yellow + name.yellow + "'".yellow);
                var status = new Spinner('In progress, please wait...');
                status.start();
                NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                    return that._createCompany(that._prefs.token, name);
                }).then(function(json) {
                    status.stop();
                    Screen.print('');
                    Screen.success('Company'.white + " '".yellow + name.yellow + "'".yellow + " has been successfully created and associated to ID ".white + json.data.id.cyan);
                }).catch(function(err) {
                    status.stop();
                    Message.error(err);
                });
            }
        }
        else {
            Message.notLoggedIn();
        }
    }

    deleteCompany(id, options) {
        var that = this;

        var doDelete = function(id) {
            Screen.print("Request to delete company".white + " '".yellow + id.yellow + "'".yellow);
            NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
                return that._deleteCompany(that._prefs.token, id, options);
            }).then(function(json) {
                Screen.print('');
                Screen.success('Company'.white + " '".yellow + id.yellow + "'".yellow + " has been successfully deleted.".white);
            }).catch(function(err) {
                Message.error(err);
            });
        }

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
           Message.loggedin(this._prefs.account.email);

            if(options.noconfirmation) {
                doDelete(id);
            }
            else {
                Message.confirm('Are-you sure ? It will remote it completely').then(function(confirm) {
                    if(confirm) {
                        doDelete(id);
                    }
                    else {
                        Message.canceled();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn();
        }
    }

    linkCompany(id, orgid) {
        var that = this;

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
           Message.loggedin(this._prefs.account.email);
        
            Screen.print("Request to link company".white + " '".yellow + id.yellow + "'".yellow + " to organization".white + " '".yellow + orgid.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._linkCompany(that._prefs.token, id, orgid);
            }).then(function(json) {
                status.stop();
                Screen.print('');
                Screen.success('Company'.white + " '".yellow + id.yellow + "'".yellow + " has been successfully linked to organization".white + " '".yellow + orgid.yellow + "'".yellow);
            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }

    unlinkCompany(id) {
        var that = this;

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
           Message.loggedin(this._prefs.account.email);
        
            Screen.print("Request to unlink company".white + " '".yellow + id.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._unlinkCompany(that._prefs.token, id);
            }).then(function(json) {
                status.stop();
                Screen.print('');
                Screen.success('Company'.white + " '".yellow + id.yellow + "'".yellow + " has been successfully unlinked");
            }).catch(function(err) {
                status.stop();
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }

    getCompany(id) {
        var that = this;

        Message.welcome();
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);
        
            Screen.print("Request informaton for company".white + " '".yellow + id.yellow + "'".yellow);
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
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
                Message.error(err);
            });
        }
        else {
            Message.notLoggedIn();
        }
    }
}

module.exports = CCompany;