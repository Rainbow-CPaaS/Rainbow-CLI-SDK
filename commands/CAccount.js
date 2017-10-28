"use strict";

const NodeSDK   = require('../common/SDK');
const Message   = require('../common/Message');
const Exit      = require('../common/Exit');
const pkg       = require('../package.json');

class CAccount {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getUserInfo(id, token) {

        return new Promise(function(resolve, reject) {
            NodeSDK.get('/api/rainbow/enduser/v1.0/users/' + id, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    getConnectedUserInformation(options) {
        var that = this;

        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);
            Message.action("Connected user information", null, options);
            
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.log("execute action...");
                return that._getUserInfo(that._prefs.user.id, that._prefs.token);
            }).then(function(json) {

                Message.log("action done...", json);

                Message.unspin(spin);
                
                if(options.noOutput) {
                    Message.out(json.data);
                }
                else {
                    Message.lineFeed();
                    Message.table2D(json.data);
                    Message.lineFeed();
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

    login(email, password, platform, options) {
        var that = this;

        Message.welcome(options);
        Message.version(pkg.version, options);
        
        if(email.length === 0 || password.length === 0) {
            email = that._prefs.email;
            password = that._prefs.password;
            platform = that._prefs.host;
        }

        Message.log("signin with", email);
        Message.log("signin on", platform);

        let spin = Message.spin(options);

        NodeSDK.start(email, password, platform).then(function() {
            Message.log("execute action...");
            return NodeSDK.signin();
        }).then(function(json) {

            Message.unspin(spin);

            Message.log("action done...", json);

            if(options.noOutput) {
                Message.out(json);
            }
            else {
                Message.success(options);
                Message.printSuccess('Signed in as', email, options);
            }

            Message.log("save credentials...");

            that._prefs.save({
                    email: email,
                    password: password
                },
                json.token,
                json.loggedInUser,
                platform
            );
            Message.log("credentials saved!");
            Message.log("finished!");

        }).catch(function(err) {
            Message.unspin(spin);
            Message.log("action failed...", err);
            Message.error(err, options);
            Exit.error();
        });
    }

    logout(options) {
        Message.welcome(options);
        Message.version(pkg.version);
        var email = "";
        if(this._prefs.user) {
            email = this._prefs.user.loginEmail;
        }

        Message.log("logout from account", email);
        this._prefs.reset();
        Message.log("preferences removed done");

        if(email) {
            Message.success();
            Message.printSuccess('You have signed out from', email);
            Message.log("finished!");
        }
        else {
            Message.error({details: 'You are not signed-in'});
            Exit.error();
        }
    }

    getCommands(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user, options);

            let spin = Message.spin(options);
            
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host).then(function() {
                Message.unspin(spin);
                Message.log("execute action...");
                Message.action("List commands", null, options);
            
                var json = {
                    "data": []
                };

                if (that._prefs.user.roles.includes("user")) {
                    var data_user = [
                        {
                            "level": "user", 
                            "theme": "General", 
                            "command": "whoami", 
                            "details": "Display information about the connected user"
                        },
                        {
                            "level": "user", 
                            "theme": "General", 
                            "command": "login <email> <pwd>", 
                            "details": "Log-in to Rainbow"
                        },
                        {
                            "level": "user", 
                            "theme": "General", 
                            "command": "logout", 
                            "details": "Log-out from Rainbow"
                        },
                        {
                            "level": "user", 
                            "theme": "General", 
                            "command": "status api", 
                            "details": "List Rainbow portals status"
                        }
                    ];

                    json.data = json.data.concat(data_user);
                }

                if (that._prefs.user.roles.includes("admin") || that._prefs.user.roles.includes("bp_admin") ||  that._prefs.user.roles.includes("superadmin")) {
                    var data_company = [
                        {
                            "level": "----------", 
                            "theme": "----------", 
                            "command": "----------", 
                            "details": "----------"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Users", 
                            "command": "create user <email> <pwd> <firstname> <lastname>", 
                            "details": "Create a new Rainbow user in your company"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Users", 
                            "command": "delete user <id>", 
                            "details": "Delete an existing user in your company"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Users", 
                            "command": "user <id>", 
                            "details": "List user's information"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Users", 
                            "command": "users", 
                            "details": "List users"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Users", 
                            "command": "changepwd user <id> <pwd>", 
                            "details": "Change the password of a user"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "", 
                            "command": "", 
                            "details": ""
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Company", 
                            "command": "company", 
                            "details": "List company's information"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Company", 
                            "command": "status company", 
                            "details": "Status on a company"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "", 
                            "command": "",
                            "details": ""
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Site", 
                            "command": "create site <name>", 
                            "details": "Create a new site"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Site", 
                            "command": "delete site <id>", 
                            "details": "Delete an existing site"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Site", 
                            "command": "site <id>", 
                            "details": "List site's information"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Site", 
                            "command": "sites", 
                            "details": "List sites"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "", 
                            "command": "", 
                            "details": ""
                        },
                        {
                            "level": "company_admin", 
                            "theme": "System", 
                            "command": "create system <name> <siteId>", 
                            "details": "Create a new system for a site"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "System", 
                            "command": "delete system <id>", 
                            "details": "Delete an existing system"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "System", 
                            "command": "link system <systemId> <siteId>", 
                            "details": "Link a system to a site"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "System", 
                            "command": "unlink system <systemId> <siteId>", 
                            "details": "Unlink a system from a site"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "System", 
                            "command": "system <id>", 
                            "details": "List system's information"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "System", 
                            "command": "systems", 
                            "details": "List systems"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "",
                            "command": "", 
                            "details": ""
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Phone", 
                            "command": "phone <id> <systemId>", 
                            "details": "List phone's information"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Phone", 
                            "command": "phones <systemId>", 
                            "details": "List phones"
                        }
                    ];

                    json.data = json.data.concat(data_company);

                }
                        

                if(that._prefs.user.adminType === "organization_admin" || that._prefs.user.roles.includes("bp_admin") || that._prefs.user.roles.includes("superadmin")) {
                    
                    var data_organization_bp = [
                        {
                            "level": "----------", 
                            "theme": "----------", 
                            "command": "----------", 
                            "details": "----------"
                        },
                        {
                            "level": "organization_admin", 
                            "theme": "Company", 
                            "command": "create company <name>", 
                            "details": "Create a new company"
                        },
                        {
                            "level": "organization_admin", 
                            "theme": "Company", 
                            "command": "delete company <id>", 
                            "details": "Delete an existing company"
                        },
                        {
                            "level": "organization_admin", 
                            "theme": "Company", 
                            "command": "link company <companyId>", 
                            "details": "Link a company to organization"
                        },
                        {
                            "level": "organization_admin", 
                            "theme": "Company", 
                            "command": "unlink company <companyId>", 
                            "details": "Unlink a company from organization"
                        },
                        {
                            "level": "organization_admin", 
                            "theme": "Company", 
                            "command": "free company <companyId>", 
                            "details": "Remove all users from a company"
                        },
                        {
                            "level": "organization_admin", 
                            "theme": "Company", 
                            "command": "company <id>", 
                            "details": "List company's information"
                        },
                        {
                            "level": "organization_admin", 
                            "theme": "Company", 
                            "command": "companies", 
                            "details": "List companies"
                        }
                    ];

                    json.data = json.data.concat(data_organization_bp);

                    if(that._prefs.user.adminType === "organization_admin" || that._prefs.user.roles.includes("superadmin")) {
                        var data_orga_only = [
                            {
                                "level": "organization_admin", 
                                "theme": "", 
                                "command": "", 
                                "details": ""
                            },
                            {
                                "level": "organization_admin", 
                                "theme": "Organization", 
                                "command": "org", 
                                "details": "List organization's information"
                            }
                        ];

                        json.data = json.data.concat(data_orga_only);
                    }

                    if(that._prefs.user.roles.includes("bp_admin")) {
                        var data_bp_only = [
                            {
                                "level": "----------", 
                                "theme": "----------", 
                                "command": "----------", 
                                "details": "----------"
                            },
                            {
                                "level": "bp_admin", 
                                "theme": "Company", 
                                "command": "customers", 
                                "details": "List customers companies"
                            }
                        ];

                        json.data = json.data.concat(data_bp_only);
                    }

                    if(that._prefs.user.roles.includes("superadmin")) {
                        var data_superadmin = [
                            {
                                "level": "----------", 
                                "theme": "----------", 
                                "command": "----------", 
                                "details": "----------"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Organization", 
                                "command": "create org <name>", 
                                "details": "Create a new organization"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Organization", 
                                "command": "delete org <id>", 
                                "details": "Delete an existing organization"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Organization", 
                                "command": "find <id>", 
                                "details": "List information corresponding to an Id"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Organization", 
                                "command": "org <id>", 
                                "details": "List organization's information"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Organization", 
                                "command": "orgs", 
                                "details": "List organizations"
                            },
                            {
                                "level": "superadmin", 
                                "theme":  "",
                                "command":  "",
                                "details": ""
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Business", 
                                "command": "offer <id>", 
                                "details": "List offer's information"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Business", 
                                "command": "offers", 
                                "details": "List offers"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Business", 
                                "command": "create catalog <name>", 
                                "details": "Create a new catalog"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Business", 
                                "command": "delete catalog <id>", 
                                "details": "Delete existing catalog"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Business", 
                                "command": "catalog <id>", 
                                "details": "List catalog's information"
                            },
                            {
                                "level": "superadmin", 
                                "theme": "Business", 
                                "command": "catalogs", 
                                "details": "List catalogs"
                            }
                        ];

                        json.data = json.data.concat(data_superadmin);
                    }
                }

                Message.lineFeed();
                Message.tableCommands(json, options);
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

module.exports = CAccount;