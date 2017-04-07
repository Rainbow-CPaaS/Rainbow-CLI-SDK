"use strict";

class Exit {

    constructor() {
    }

    ok() {
        process.exit(0);
    }

    error() {
        process.exit(1); 
    }
}

module.exports = new Exit();    