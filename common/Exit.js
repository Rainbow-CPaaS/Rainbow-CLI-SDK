"use strict";

const NodeSDK = require("./SDK");

class Exit {

    constructor() {
    }

    ok() {
        console.log("Exit::ok!");
        NodeSDK.stopAndExit();
        // process.exit(0);
    }

    error() {
        console.log("Exit::error!");
        NodeSDK.stopAndExit();
        // process.exit(1); 
    }
}

module.exports = new Exit();    
