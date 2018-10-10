const Logger = require("./Logger");

let complete = null;

const initialize = () => {
    /*

    tabtab = require("tabtab");

    tabtab
        .install({
            name: "rbw",
            completer: "rbw"
        })
        .then(() => Logger.logs("AUTOCOMP - (install) ok"))
        .catch(err => Logger.error("AUTOCOMP - (install) error", err));

    // General handler. Gets called on `program <tab>` and `program stuff ... <tab>`
    complete.on("rbw", function(data, done) {
        // General handler
        done(null, ["configure", "login", "logout", "preferences", "remove", "set", "whoami"]);
    });

    complete.on("set", function(data, done) {
        done(null, ["email", "host", "keys", "password", "proxy"]);
    });

    complete.on("remove", function(data, done) {
        done(null, ["keys", "preferences", "proxy"]);
    });

    complete.start();
    */
};

module.exports = {
    initialize
};
