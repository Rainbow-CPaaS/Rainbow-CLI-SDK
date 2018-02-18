"use strict";

class Tools {

    constructor() {
    }

    isArray(a) {
        return (Array.isArray(a));
    };

    isObject(a) {
        return (!!a) && (a.constructor === Object);
    };

}

module.exports = new Tools();