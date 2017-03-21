"use strict";

class Tools {

    constructor() {
    }

    isArray(a) {
        return (!!a) && (a.constructor === Array);
    };

    isObject(a) {
        return (!!a) && (a.constructor === Object);
    };

}

module.exports = new Tools();



