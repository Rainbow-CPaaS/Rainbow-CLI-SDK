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

            if(!options.csv) {
                Message.action("List commands", null, options);
            }
            
            var json = {
                "data": [
                    {
                        "level": "company_admin", 
                        "theme": "General", 
                        "command": "whoami", 
                        "details": "Display information about the connected user"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "General", 
                        "command": "login <email> <pwd>", 
                        "details": "Log-in to Rainbow"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "General", 
                        "command": "logout", 
                        "details": "Log-out from Rainbow"
                    },
                    {
                        "level": "company_admin", 
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
                        "details": "List information on a user"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "Users", 
                        "command": "users", 
                        "details": "List users"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "----------", 
                        "command": "----------", 
                        "details": "----------"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "Company", 
                        "command": "company", 
                        "details": "List information on your company"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "Company", 
                        "command": "status company", 
                        "details": "List status on your company"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "----------", 
                        "command": "----------", 
                        "details": "----------"
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
                        "details": "List information on a site"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "Site", 
                        "command": "sites", 
                        "details": "List sites"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "----------", 
                        "command": "----------", 
                        "details": "----------"
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
                        "details": "List information on a system"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "System", 
                        "command": "systems", 
                        "details": "List systems"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "----------", 
                        "command": "----------", 
                        "details": "----------"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "Phone", 
                        "command": "phone <id> <systemId", 
                        "details": "List information on a phone"
                    },
                    {
                        "level": "company_admin", 
                        "theme": "Phone", 
                        "command": "phones <systemId", 
                        "details": "List phone on a system"
                    },

                ]
            };

            Message.lineFeed();
            Message.tableCommands(json, options);
            Message.log("finished!");

        }
        else {
            Message.notLoggedIn(options);
            Exit.error();
        }
    }
    
}

module.exports = CAccount;