"use strict";

let {table, getBorderCharacters} = require('table');

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

    table(data) {

        let config2 = {
            border: getBorderCharacters('void'),
            columnDefault: {
                paddingLeft: 0,
                paddingRight: 2
            },
            drawHorizontalLine: () => {
                return false
            },
            columns: {
                2: {
                    width: 80
                }
            }
        };

        this.print(table(data, config2));
    }
}

module.exports = new Print();