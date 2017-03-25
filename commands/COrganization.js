"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

const pkg = require('../package.json');
const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Tools = require('../common/Tools');
const Message = require('../common/Message');

class COrganization {

    constructor(prefs) {
        this._prefs = prefs;
        //this._user = new CUser(this._prefs);
    }

   

    _getListOfOrganizations(token, page, filter) {

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
            else {
                limit = "&limit=1000";
            }

            NodeSDK.get('/api/rainbow/admin/v1.0/organisations?format=full' + offset + limit, token).then(function(json) {
                resolve(json);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    getOrganizations(page, filter) {
        var that = this;

        Message.welcome();
        
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.account.email);

            Screen.print("Current Organizations:".white);
            
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getListOfOrganizations(that._prefs.token, page, filter);
            }).then(function(json) {
                status.stop(); 

                if(json.total > json.limit) {
                    var page = Math.floor(json.offset / json.limit) + 1
                    var totalPage = Math.floor(json.total / json.limit) + 1;
                    
                    Screen.print('Displaying Page '.white + page.toString().yellow + " on ".white + totalPage.toString().yellow);
                }
                Screen.print('');

                var array = [];

                array.push([ "#".gray, "Organization name".gray, "Visibility".gray, "Identifier".gray]);
                array.push([ "-".gray, "-----------------".gray, "----------".gray, "----------".gray]);  

                for (var i = 0; i < json.data.length; i++) {
                    var org = json.data[i];
                    
                    var visibility = "private".white;
                    if(org.visibility === "public") {
                        visibility = "public".yellow;
                    }

                    
                    var number = i+1+json.offset;

                    array.push([ number.toString().white, org.name.cyan, visibility, org.id.white]); 
                }

                var t = table(array);
                Screen.table(t);
                Screen.print('');
                Screen.success(json.companies.total + ' organizations found.');
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

module.exports = COrganization;