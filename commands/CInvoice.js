"use strict";

const NodeSDK = require('../common/SDK');
const Message = require('../common/Message');
const Exit = require('../common/Exit');

let CCompany = require('./CCompany');

class CInvoice {

    constructor(prefs) {
        this._prefs = prefs;
        this._company = new CCompany(this._prefs);
    }

    _getInvoiceService(token, options) {
        return new Promise(function(resolve, reject) {
            
            var filterToApply = "";

            if (options.companyId) {
                filterToApply += "?companyId=" + options.companyId;
            }
            
            if (options.year) {
                filterToApply += filterToApply.length === 0 ? "?year=" + options.year : "&year=" + options.year;
            }

            if (options.month) {
                filterToApply += filterToApply.length === 0 ? "?month=" + options.month : "&month=" + options.month;
            }

            let invoices = null;

            NodeSDK.get('/api/rainbow/invoicing/v1.0/invoices/services' + filterToApply, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getInvoiceConference(token, options) {
        return new Promise(function(resolve, reject) {
            
            var filterToApply = "";

            if (options.companyId) {
                filterToApply += "?companyId=" + options.companyId;
            }
            
            if (options.year) {
                filterToApply += filterToApply.length === 0 ? "?year=" + options.year : "&year=" + options.year;
            }

            if (options.month) {
                filterToApply += filterToApply.length === 0 ? "?month=" + options.month : "&month=" + options.month;
            }

            let invoices = null;

            NodeSDK.get('/api/rainbow/invoicing/v1.0/invoices/conference' + filterToApply, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getInvoice(token, options) {
        return new Promise(function(resolve, reject) {
            
            NodeSDK.get('/api/rainbow/invoicing/v1.0/invoices/' + options.path, token, true).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    _getInvoices(token, options) {
        
        let that = this;
        let companies = {};

        var getCompanyName = (invoice) => {
            return new Promise((resolve, reject) => {

                if(invoice.companyId in companies) {
                    invoice.companyName = companies[invoice.companyId];
                    resolve();
                }
                else {
                    that._company._getCompany(token, invoice.companyId).then((company) => {
                        invoice.companyName = company.data.name;
                        companies[invoice.companyId] = company.data.name;
                        resolve();
                    });
                }
            });
        }

        return new Promise(function(resolve, reject) {

            var filterToApply = "";

            if (options.companyId) {
                filterToApply += "?companyId=" + options.companyId;
            }

            if(options.period) {
                filterToApply += filterToApply.length === 0 ? "?billingPeriod=" + options.period : "&billingPeriod=" + options.period;
            }

            if (options.conference) {
                filterToApply += filterToApply.length === 0 ? "?invoiceType=conference" : "&invoiceType=conference";
            } else if (options.services) {
                filterToApply += filterToApply.length === 0 ? "?invoiceType=services" : "&invoiceType=services";
            }

            if (options.inv) {
                filterToApply += filterToApply.length === 0 ? "?fileType=INV" : "&fileType=INV";
            } else if (options.cdr) {
                filterToApply += filterToApply.length === 0 ? "?fileType=CDR" : "&fileType=CDR";
            }

            let invoices = null;

            NodeSDK.get('/api/rainbow/invoicing/v1.0/invoices' + filterToApply, token).then(function(json) {

                invoices = json;

                let promises = [];

                invoices.forEach((invoice) => {
                    promises.push(getCompanyName(invoice));
                });

                Promise.all(promises).then(() => {
                    resolve(invoices);
                });

            }).catch(function(err) {
                reject(err);
            });
        });
    }

    getInvoiceService(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("Get detailed invoice for services", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._getInvoiceService(that._prefs.token, options);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.csv) {
                    Message.csv(options.csv, json, true).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else {
                    Message.outCSV(json);
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

    getInvoiceConference(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("Get detailed invoice for conference", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._getInvoiceConference(that._prefs.token, options);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.csv) {
                    Message.csv(options.csv, json, true).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else {
                    Message.outCSV(json);
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

    getInvoice(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("Get invoice " + options.path, null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._getInvoice(that._prefs.token, options);
            }).then(function(json) {

                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.csv) {
                    Message.csv(options.csv, json, true).then(() => {
                    }).catch((err) => {
                        Exit.error();
                    });
                }
                else {
                    Message.outCSV(json);
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

    getInvoices(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            if(!options.csv) {
                Message.action("List invoices", null, options);
            }
            
            let spin = Message.spin(options);
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy, this._prefs.appid, this._prefs.appsecret).then(function() {
                Message.log("execute action...");
                return that._getInvoices(that._prefs.token, options, that._prefs);
            }).then(function(json) {
                
                Message.unspin(spin);
                Message.log("action done...", json);

                if(options.noOutput) {
                    Message.out(json);
                }
                else {
                    Message.tableInvoices(json, options);
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
}

module.exports = CInvoice;