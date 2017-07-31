const Prefs = require('preferences');

"use strict";

class Preferences {

    constructor() {
        // Get the prefs
        this.prefs = new Prefs('rainbow');
    }

    get email() {
        if(this.prefs && "account" in this.prefs && "email" in this.prefs.account) {
            return this.prefs.account.email;
        }
        return "";
    }

    get password() {
        if(this.prefs && "account" in this.prefs && "password" in this.prefs.account) {
            return this.prefs.account.password;
        }
        return "";
    }

    get host() {
        if(this.prefs && "rainbow" in this.prefs ) {
            return this.prefs.rainbow;
        }
        return "";
    }

    get token() {
        if(this.prefs && "token" in this.prefs ) {
            return this.prefs.token;
        }
        return "";
    }

    get user() {
        if(this.prefs && "user" in this.prefs) {
            return this.prefs.user;
        }
        return null;
    }

    save(account, token, user, rainbow) {
        this.prefs.account = account;
        this.prefs.token = token;
        this.prefs.user = user;
        this.prefs.rainbow = rainbow;
    }

    reset() {
        this.prefs.account = null;
        this.prefs.token = null;
        this.prefs.user =  null;
        this.prefs.rainbow = null;
    }

    log() {
        console.log("account", this.prefs.account);
        console.log("token", this.prefs.token);
        console.log("user", this.prefs.user);
        console.log("rainbow", this.prefs.rainbow);
    }
}

module.exports = Preferences;    