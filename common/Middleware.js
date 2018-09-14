const Message = require('./Message');
const Screen = require("./Print"); 

const parseCommand = (args) => {
    return new Promise( (resolve, reject) => {

        if(typeof args != 'object') {
            Message.welcome();
            Message.errorCommand();
            Screen.print('');
            return reject();
        }
        return resolve();

    });
};

module.exports = {
    parseCommand,
};