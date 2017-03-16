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
        this.print('[' + 'Error'.red + '] ' + text);
    }

    table(text) {
        this.print(text);
    }
}

module.exports = new Print();