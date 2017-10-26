"use strict";

const moment = require('moment');

const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

const CFree = require('./CFree');

class CCompany {

    constructor(prefs) {
        this._prefs = prefs;
        this._free = new CFree(this._prefs);
    }

    _getListOfCompanies(token, options, onlyCustomers) {

        var that = this;
        
        return new Promise(function(resolve, reject) {

            var filterToApply = "";

            if(options.bp) {
                filterToApply += "&isBP=true";
            }

            if(options.name) {
                filterToApply += "&name=" + options.name;
            }

            var offset = "";
            if(options.page > 0) {
                offset = "&offset=";
                if(options.page > 1) {
                    offset += (options.limit * (options.page - 1));
                }
                else {
                    offset +=0;
                }
            }

            var limit = "&limit=" + Math.min(options.limit, 1000);

            var getMyCompany = () => {
                
                return new Promise((resolve, reject) => {

                    if(that._prefs.user.roles.includes("bp_admin") && onlyCustomers) {
                        NodeSDK.get('/api/rainbow/admin/v1.0/companies/' + that._prefs.user.companyId, token).then(function(json) {
                            resolve(json);
                        }).catch(function(err) {
                            reject(err);
                        });
                    }
                    else {
                        resolve();
                    }
                });
            };

            getMyCompany().then((company) => {

                if (options.org) {
                    NodeSDK.get('/api/rainbow/admin/v1.0/organisations/' + options.org + '/companies?format=full' + filterToApply + offset + limit, token).then(function(jsonC) {
                        var companies = jsonC;
                        resolve({companies: companies});
                    }).catch(function(err) {
                        reject(err);
                    });
                } else {

                    if(that._prefs.user.roles.includes("bp_admin") && onlyCustomers) {
                        filterToApply += "&bpId=" + company.data.id;
                    }
                    NodeSDK.get('/api/rainbow/admin/v1.0/companies?format=full' + filterToApply + offset + limit, token).then(function(jsonC) {
                        var companies = jsonC;
                        resolve({companies: companies});
                    }).catch(function(err) {
                        reject(err);
                    });
                }

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

        let that = this;

        return new Promise(function(resolve, reject) {

            if(!id) {
                id = that._prefs.user.companyId;
            }

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

    _statusCompany(token, id) {

        var that = this;

        return new Promise(function(resolve, reject) {

            if(!id) {
                id = that._prefs.user.companyId;
            }

            let filterToApply = "format=full&limit=1000&companyId=" + id;

            NodeSDK.get('/api/rainbow/admin/v1.0/users?' + filterToApply, token).then(function(json) {

                let nbTerminated = 0, nbActive = 0, nbInitialized = 0;
                let lastActivityDate = null, firstActivityDate = null;
                json.data.forEach((user) => {

                    nbTerminated += Number(user.isTerminated);
                    nbActive += Number(user.isActive);
                    nbInitialized += Number(user.isInitialized);

                    // Compute last Activity
                    if(!lastActivityDate) {
                        lastActivityDate = user.lastLoginDate;
                    }
                    else {
                        if(moment(user.lastLoginDate).isAfter(moment(lastActivityDate))) {
                            lastActivityDate = user.lastLoginDate;
                        }
                    }

                    // Compute first activity
                    if(!firstActivityDate) {
                        firstActivityDate = user.firstLoginDate;
                    }
                    else {
                        if(moment(user.firstLoginDate).isBefore(moment(firstActivityDate))) {
                            firstActivityDate = user.firstLoginDate;
                        }
                    }
                });

                let result = {
                    "Created on" : "-",
                    "Status": "-",
                    "Visibility": "-",
                    "Number of users": json.total,
                    "Active users": nbActive,
                    "Initialized users": nbInitialized,
                    "Terminated users": nbTerminated,
                    "Last activity": lastActivityDate ? moment(lastActivityDate).format("LLLL") : "No activity yet",
                    "First activity": firstActivityDate ? moment(firstActivityDate).format("LLLL") : "No activity yet"
                };

                NodeSDK.get('/api/rainbow/admin/v1.0/companies/' + id, token).then(function (cJson) {

                    result["Created on"] = moment(cJson.data.creationDate).format("LLLL");
                    result["Status"] = cJson.data.status;
                    result["Visibility"] = cJson.data.visibility;

                    resolve(result);
                });
                
                
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _linkCompany(token, id, orgid) {

        var that = this;

        return new Promise(function(resolve, reject) {

            if(!orgid) {
                orgid = that._prefs.user.organisationId;
            }

            NodeSDK.post('/api/rainbow/admin/v1.0/organisations/' + orgid + '/companies', token, {companyId: id}).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
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

    getCompanies(options, onlyCustomers) {
        var that = this;

        Message.welcome(options);
        
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);

            if(!options.csv) {
                Message.action("List Companies:", null, options);
            }

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.log("execute action...");
                return that._getListOfCompanies(that._prefs.token, options, onlyCustomers);
            }).then(function(json) {

                Message.unspin(spin);
                
                Message.log("action done...", json);

                if(options.csv) {
                    Message.csv(options.csv, json.companies.data).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else if(options.noOutput) {
                    Message.out(json.companies.data);
                }
                else {

                    if(json.companies.total > json.companies.limit) {
                        Message.tablePage(json.companies, options);
                    }
                    Message.lineFeed();
                    Message.tableCompanies(json, options);
                }
                Message.log("finished!");

            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    createCompany(name, options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
        
            Message.action("Create new company", name, options);
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.log("execute action...");
                return that._createCompany(that._prefs.token, name);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.printSuccess('Company created with Id', json.data.id, options);    
                    Message.success(options);
                }
                Message.log("finished!");
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    /*
    deleteCompanies(options) {
        var that = this;

        Message.welcome(options);

        let doDeletes = function() {
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                Message.log("execute action...");

                let prom = function(companyId) {
                    return new Promise((resolve, reject) => {
                        that._deleteCompany(that._prefs.token, companyId, options).then((json) => {
                            Message.printSuccess("Company deleted", companyId, options);
                            resolve(json);
                        }).catch((err) => {
                            Message.errorList(err, options, companyId);
                            reject(err);
                        });
                    });
                }

                let promises = [];
                if(!options.list) {
                    Message.warn("task is aborded. There is no companies to delete", "eg: rbw delete company <id>,<id>,<id>", options);
                    return;
                }
                
                options.list.forEach((companyId) => {
                    promises.push(prom(companyId));
                });

                Promise.all(promises).then((json) => {
                    Message.log("action done...", json);
                    Message.lineFeed();
                    Message.success(options);
                    Message.log("finished!");
                }).catch((err) => {
                    Message.error(err, options);
                });

            }).catch(function(err) {
                Message.error(err, options);
                Exit.error();
            });
        }
        
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);

            if(options.noconfirmation) {
                doDeletes();
            }
            else {
                Message.confirm('Are-you sure ? It will remote them completely').then(function(confirm) {
                    if(confirm) {
                        doDeletes();
                    }
                    else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }
    */

    deleteCompany(id, options) {
        var that = this;

        var doDelete = function(id) {
            Message.action("Delete company", id, options);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                Message.log("execute action...");
                return that._deleteCompany(that._prefs.token, id, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("action done...", json);

                Message.lineFeed();
                Message.success(options);
                Message.log("finished!");
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
           Message.loggedin(this._prefs.user, options);

            if(options.noconfirmation) {
                doDelete(id);
            }
            else {
                Message.confirm('Are-you sure ? It will remote it completely').then(function(confirm) {
                    if(confirm) {
                        doDelete(id);
                    }
                    else {
                        Message.canceled(options);
                        Exit.error();
                    }
                });
            }
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    statusCompany(id, options) {

        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
           Message.loggedin(this._prefs.user, options);
        
            Message.action("Status of company",id, options);

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.log("execute action...");
                return that._statusCompany(that._prefs.token, id);
            }).then(function(json) {
                Message.unspin(spin);
                Message.log("action done...", json);
                Message.lineFeed();
                Message.table2D(json);
                Message.success(options);
                Message.log("finished!");
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    linkCompany(id, orgid, options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
           Message.loggedin(this._prefs.user, options);
        
            Message.action("Link company",id, options);

            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.log("execute action...");
                return that._linkCompany(that._prefs.token, id, orgid);
            }).then(function(json) {
                Message.unspin(spin);
                Message.log("action done...", json);
                Message.lineFeed();
                Message.success(options);
                Message.log("finished!");
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    unlinkCompany(id, options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
           Message.loggedin(this._prefs.user, options);
        
            Message.action("Unlink company", id, options);
           
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.log("execute action...");
                return that._unlinkCompany(that._prefs.token, id);
            }).then(function(json) {
                Message.unspin(spin);
                Message.log("action done...", json);
                Message.lineFeed();
                Message.success(options);
                Message.log("finished!");
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }

    getCompany(id, options) {
        var that = this;

        Message.welcome(options);
            
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
        
            Message.action("Get information for company", id, options);
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.log("execute action...");
                return that._getCompany(that._prefs.token, id);
            }).then(function(json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.table2D(json.data);
                    Message.lineFeed();
                    Message.success(options);
                    Message.log("finished!");
                }
            }).catch(function(err) {
                Message.unspin(spin);
                Message.error(err, options);
                Exit.error();
            });
        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }
}

module.exports = CCompany;