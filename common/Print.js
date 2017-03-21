"use strict";

const LOG_ID = 'PRINT - ';

class Print {

    constructor() {
    }

    print(text) {
        console.log(text.white);
    }

    success(text) {
        this.print('✓'.green + ' ' + text.white);
    }

    error(text) {
        this.print('x'.red + ' ' + text.white);
    }

    table(text) {
        this.print(text);
    }
}

module.exports = new Print();