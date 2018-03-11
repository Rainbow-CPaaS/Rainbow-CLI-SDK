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

    _setDeveloper(token, options) {
        return new Promise(function(resolve, reject) {
            NodeSDK.post('/api/rainbow/applications/v1.0/developers/register?withoutConfirmationEmail', token).then(function(json) {
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
            Message.loggedin(this._prefs, options);
            Message.action("Connected user information", null, options);
            
            let spin = Message.spin(options);

            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
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

        NodeSDK.start(email, password, platform, options.proxy).then(function() {
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

            that._prefs.save(
                {
                    email: email,
                    password: password
                },
                json.token,
                json.loggedInUser,
                platform,
                options.proxy
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

    preferences(options) {
        var that = this;

        Message.welcome(options);
            
        Message.loggedin(this._prefs, options);
    
        Message.action("List preferences", "", options);
        
        Message.log("execute action...");

        Message.log("action done...");

        let json = {
            "email": that._prefs.email,
            "password": that._prefs.password ? "******" : "",
            "data": that._prefs.user,
            "host": that._prefs.host,
            "proxy": that._prefs.proxy,
            "token": that._prefs.token ? that._prefs.token.substr(0, 20) + "..." : ""
        };

        if(options.noOutput) {
            Message.out(json);
        }
        else {
            Message.lineFeed();
            Message.table2D(json);
            Message.lineFeed();
            Message.success(options);
            Message.log("finished!");
        }
    }

    setDeveloper(options) {
        var that = this;

        var doAddDeveloperRole = function(options) {
            Message.action("Add developer role", options);

            let spin = Message.spin(options);
            NodeSDK.start(that._prefs.email, that._prefs.password, that._prefs.host).then(function() {
                Message.log("execute action...");
                return that._setDeveloper(that._prefs.token, options);
            }).then(function(json) {
                Message.unspin(spin);

                Message.log("save credentials...");

                that._prefs.save({
                        email: that._prefs.email,
                        password: that._prefs.password
                    },
                    that._prefs.token,
                    json.data,
                    that._prefs.host,
                    that._prefs.proxy
                );
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
            Message.loggedin(this._prefs, options);

            if(this._prefs.user.roles.includes("app_admin")) {
                Message.warn("You already have the role", 'app_admin', options);
            } else {
                Message.print("You need to accept the developer agreement to continue.", options);

                Message.confirm('I accept the developer aggreement?').then(function(confirm) {
                    if(confirm) {
                        doAddDeveloperRole(options);
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

    getCommands(options) {
        var that = this;
        
        Message.welcome(options);

        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs, options);

            let spin = Message.spin(options);
            
            NodeSDK.start(this._prefs.email, this._prefs.password, this._prefs.host, this._prefs.proxy).then(function() {
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
                            "command": "preferences", 
                            "details": "List preferences stored"
                        },
                        {
                            "level": "user", 
                            "theme": " ", 
                            "command": " ", 
                            "details": " "
                        },
                        {
                            "level": "user", 
                            "theme": "Rainbow", 
                            "command": "status api", 
                            "details": "List Rainbow portals status"
                        },
                        {
                            "level": "user", 
                            "theme": "Rainbow", 
                            "command": "status platform", 
                            "details": "List Rainbow platform status"
                        },
                        {
                            "level": "user", 
                            "theme": " ", 
                            "command": " ", 
                            "details": " "
                        },
                        {
                            "level": "user", 
                            "theme": "Developer", 
                            "command": "set developer", 
                            "details": "Add role developer to account"
                        }
                    ];

                    json.data = json.data.concat(data_user);
                }
                

                if (that._prefs.user.roles.includes("app_admin") ||  that._prefs.user.roles.includes("app_superadmin")) {
                    var data_dev = [

                        {
                            "level": "----------", 
                            "theme": "----------", 
                            "command": "----------", 
                            "details": "----------"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Applications", 
                            "command": "create application <name>", 
                            "details": "Create a new application"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Applications", 
                            "command": "delete application <appid>", 
                            "details": "Delete an existing application"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Applications", 
                            "command": "metrics application <appid>", 
                            "details": "List metrics of an existing application"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Applications", 
                            "command": "application <appid>", 
                            "details": "List application's information"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Applications", 
                            "command": "applications", 
                            "details": "List applications"
                        },
                        
                        {
                            "level": "app_admin", 
                            "theme": " ", 
                            "command": " ", 
                            "details": " "
                        },
                        
                        {
                            "level": "app_admin", 
                            "theme": "Notifications", 
                            "command": "application create fcm <appid> <key>", 
                            "details": "Create a push notifications setting for Android FCM"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Notifications", 
                            "command": "application create im <appid> <file>", 
                            "details": "Create a push notifications setting IM for IOS APNS"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Notifications", 
                            "command": "application create voip <appid> <file>", 
                            "details": "Create a push notifications setting VOIP for IOS APNS"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Notifications", 
                            "command": "application delete pn <appid> <file>", 
                            "details": "Delete an existing push notification setting"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Notifications", 
                            "command": "application pn <appid> <id>", 
                            "details": "List information of a push notifications setting"
                        },
                        {
                            "level": "app_admin", 
                            "theme": "Notifications", 
                            "command": "application pns <appid>", 
                            "details": "List application push notifications settings"
                        },
                        {
                            "level": "app_admin", 
                            "theme": " ", 
                            "command": " ", 
                            "details": " "
                        },
                        
                        {
                            "level": "app_admin", 
                            "theme": "Metrics", 
                            "command": "application metrics <appid>", 
                            "details": "List application's metrics"
                        }
                    ];

                    json.data = json.data.concat(data_dev);
                }

                if (that._prefs.user.roles.includes("app_superadmin")) {
                    var data_dev = [

                        {
                            "level": "----------", 
                            "theme": "----------", 
                            "command": "----------", 
                            "details": "----------"
                        },
                        {
                            "level": "app_superadmin", 
                            "theme": "Applications", 
                            "command": "block application <appid>", 
                            "details": "Block an existing application"
                        },
                        {
                            "level": "app_superadmin", 
                            "theme": "Applications", 
                            "command": "unblock application <appid>", 
                            "details": "Unblock an existing application"
                        },
                        {
                            "level": "app_superadmin", 
                            "theme": "Applications", 
                            "command": "deploy application <appid>", 
                            "details": "Accept a request of deployment"
                        },
                        {
                            "level": "app_superadmin", 
                            "theme": "Applications", 
                            "command": "dismiss application <appid>", 
                            "details": "Decline a request of deployment"
                        }
                    ];

                    json.data = json.data.concat(data_dev);
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
                            "theme": "Users", 
                            "command": "changelogin user <id> <loginEmail>", 
                            "details": "Change the login email of a user"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Users", 
                            "command": "block user <id>", 
                            "details": "Block a user from connecting to Rainbow"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Users", 
                            "command": "unblock user <id>", 
                            "details": "Unblock a user"
                        },
                        {
                            "level": "company_admin", 
                            "theme": " ", 
                            "command": " ", 
                            "details": " "
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Company", 
                            "command": "company [companyId]", 
                            "details": "List company's information"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Company", 
                            "command": "setpublic [companyId]", 
                            "details": "Change the visibility of a company to public"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Company", 
                            "command": "setprivate [companyId]", 
                            "details": "Change the visibility of a company to private"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Company", 
                            "command": "setorgpublic [companyId]", 
                            "details": "Change the visibility of a company to public inside an organization"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Company", 
                            "command": "status company", 
                            "details": "Status on a company"
                        },
                        {
                            "level": "company_admin", 
                            "theme": " ", 
                            "command": " ",
                            "details": " "
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
                            "theme": " ", 
                            "command": " ", 
                            "details": " "
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
                            "theme": " ",
                            "command": " ", 
                            "details": " "
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
                        },
                        {
                            "level": "company_admin", 
                            "theme": " ", 
                            "command": " ", 
                            "details": " "
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Mass-Provisioning", 
                            "command": "masspro template user [filename]", 
                            "details": "Download the csv template for users"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Mass-Provisioning", 
                            "command": "masspro template device [filename]", 
                            "details": "Download the csv template for devices"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Mass-Provisioning", 
                            "command": "masspro check <filename>", 
                            "details": "Check that a CSV file is correct"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Mass-Provisioning", 
                            "command": "masspro import <filename>", 
                            "details": "Import a CSV file containing users"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Mass-Provisioning", 
                            "command": "masspro status company [companyId]", 
                            "details": "List imports status done for a company"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Mass-Provisioning", 
                            "command": "masspro status <reqId>", 
                            "details": "List an import details"
                        },
                        {
                            "level": "company_admin", 
                            "theme": "Mass-Provisioning", 
                            "command": "masspro delete status <reqId>", 
                            "details": "Delete an import details"
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
                                "theme": " ", 
                                "command": " ", 
                                "details": " "
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
                            },
                            {
                                "level": "bp_admin", 
                                "theme":  " ",
                                "command":  " ",
                                "details": " "
                            },
                            {
                                "level": "bp_admin", 
                                "theme": "Invoices", 
                                "command": "invoices", 
                                "details": "List customers invoices"
                            },
                            {
                                "level": "bp_admin", 
                                "theme": "Invoices", 
                                "command": "download invoice <invoicePath> [filename]", 
                                "details": "Download an invoice (CSV format)"
                            },
                            {
                                "level": "bp_admin", 
                                "theme": "Invoices", 
                                "command": "download cdr services [filename]", 
                                "details": "Download detailed invoice for services (CSV format)"
                            },
                            {
                                "level": "bp_admin", 
                                "theme": "Invoices", 
                                "command": "download cdr conference [filename]", 
                                "details": "Download detailed invoice for conference (CSV format)"
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
                                "theme":  " ",
                                "command":  " ",
                                "details": " "
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