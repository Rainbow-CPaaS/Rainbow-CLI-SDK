const Logger    = require('./Logger');

const complete = null;

const initialize = () => {

    Logger.logs("CLI/Autocomplete - (initialize) add auto-completion...");

    complete = require('tabtab')({
        name: 'rbw'
    });
    
    // General handler. Gets called on `program <tab>` and `program stuff ... <tab>`
    complete.on('rbw', function(data, done) {
        // General handler
        done(null, ['configure', 'login', 'logout', 'preferences', 'remove', 'set', 'whoami']);
    });

    complete.on('set', function(data, done) {
        done(null, ['email', 'host', 'keys', 'password', 'proxy']);
    });

    complete.on('remove', function(data, done) {
        done(null, ['keys', 'preferences', 'proxy']);
    });

    complete.start();
};

module.exports = {
    initialize,
};