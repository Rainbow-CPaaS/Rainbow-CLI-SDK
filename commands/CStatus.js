"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

const pkg = require('../package.json');
const Screen = require("../common/Print");
const NodeSDK = require('../common/SDK');
const Tools = require('../common/Tools');
const Message = require('../common/Message');

class CStatus {

    constructor(prefs) {
        this._prefs = prefs;
    }

    _getAPIStatus(token) {

        return new Promise(function(resolve, reject) {

            var portals = [];

            NodeSDK.get('/api/rainbow/ping', token).then(function(json) {
                var status = {"name": "Admin", "status": json.status, "ttl": "-"};
                if("data" in json) {
                    status.ttl = json.data.eventLoopLagMilliseconds.toString();
                }
                portals.push(status);
                resolve(portals);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    getStatus() {
        var that = this;
        
        Message.welcome();
                
        if(this._prefs.token && this._prefs.user) {
            Message.loggedin(this._prefs.user);

            Screen.print("Current API status information:".white);
            Screen.print('');
            
            var status = new Spinner('In progress, please wait...');
            status.start();
            NodeSDK.start(this._prefs.account.email, this._prefs.account.password, this._prefs.rainbow).then(function() {
                return that._getAPIStatus(that._prefs.token);
            }).then(function(portals) {
                status.stop();  
                
                var array = [];
                array.push([ "#".gray, "API".gray, "Status".gray, "Time".gray]);
                array.push([ "-".gray, "---".gray, "------".gray, "----".gray]);  

                for(var i=0; i < portals.length; i++) {
                    var portalStatus = "-";
                    if(portals[i].status === "OK") {
                        portalStatus = "running".green;
                    }
                    else {
                        portalStatus = "stopped".red;
                    }
                    array.push([(i+1).toString().white, portals[i].name.white, portalStatus, (portals[i].ttl + "ms").white ]);
                }

                var t = table(array);
                Screen.table(t);
                Screen.print('');
                Screen.success('status successfully executed.');

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

module.exports = CStatus;