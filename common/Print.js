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

    table2D(data) {
        this.table(data,true)
    }

    table(data, maximizeColumn) {

        let config = {
            border: getBorderCharacters('void'),
            columnDefault: {
                paddingLeft: 0,
                paddingRight: 2
            },
            drawHorizontalLine: () => {
                return false
            }
        };

        if(maximizeColumn) {
            config.columns = {
                2: {
                    width: 80
                }
            }
        }

        this.print(table(data, config));
    }
}

module.exports = new Print();