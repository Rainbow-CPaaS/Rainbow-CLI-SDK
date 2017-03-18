"use strict";

var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var table       = require('text-table');

var pkg = require('../package.json')
var Screen = require("../Print");
var NodeSDK = require('../SDK');
const Tools = require('../Tools');

class Status {

    constructor(program, prefs) {
        this._program = program;
        this._prefs = prefs;
    }

    start() {
        this.listOfCommands()
    }

    stop() {

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

    listOfCommands() {

        var that = this;

        this._program.command('status')
            .description("Display status of API")
            .action(function () {
            
            Screen.print('Welcome to '.grey + 'Rainbow'.magenta);
            
            if(that._prefs.token && that._prefs.user) {
                Screen.print('You are logged in as'.grey + " " + that._prefs.account.email.magenta);
                Screen.print('');
                Screen.print("Current API status information:".white);
                Screen.print('');
                
                var status = new Spinner('In progress, please wait...');
                status.start();
                NodeSDK.start(that._prefs.account.email, that._prefs.account.password, that._prefs.rainbow).then(function() {
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
                    Screen.print('');
                    Screen.error("Can't execute the command".white);
                    if(err.code === 401) {
                        Screen.print("Error ".red + err.code.toString().gray + " - Your session has expired. You need to log-in again".gray);
                    }
                    else {
                        if(err.details) {
                            Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray + ": " + err.details.gray);
                        }
                        else {
                            Screen.print("Error ".red + err.code.toString().gray + " - ".white + err.msg.gray);
                        }
                    }
                });
            }
            
        });
    }
}

module.exports = Status;