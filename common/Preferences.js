const Prefs = require('preferences');

"use strict";

class Preferences {

    constructor() {
        // Get the prefs
        this.prefs = new Prefs('rainbow');
    }

    get email() {
        if(this.prefs && ("account" in this.prefs) && (this.prefs.account && "email" in this.prefs.account) && this.prefs.account.email) {
            return this.prefs.account.email;
        }
        return "";
    }

    get password() {
        if(this.prefs && ("account" in this.prefs) && (this.prefs.account && "password" in this.prefs.account) && this.prefs.account.password) {
            return this.prefs.account.password;
        }
        return "";
    }

    get host() {
        if(this.prefs && "rainbow" in this.prefs && this.prefs.rainbow) {
            return this.prefs.rainbow;
        }
        return "";
    }

    get token() {
        if(this.prefs && "token" in this.prefs && this.prefs.token) {
            return this.prefs.token;
        }
        return "";
    }

    get user() {
        if(this.prefs && "user" in this.prefs && this.prefs.user) {
            return this.prefs.user;
        }
        return "";
    }

    get proxy() {
        if(this.prefs && "proxy" in this.prefs && this.prefs.proxy) {
            return this.prefs.proxy;
        }
        return "";
    }

    get appid() {
        if(this.prefs && "appid" in this.prefs && this.prefs.appid) {
            return this.prefs.appid;
        }
        return "";
    }

    get appsecret() {
        if(this.prefs && "appsecret" in this.prefs && this.prefs.appsecret) {
            return this.prefs.appsecret;
        }
        return "";
    }

    save(account, token, user, rainbow, proxy) {
        this.prefs.account = account || null;
        this.prefs.token = token || null;
        this.prefs.user = user || null;
        this.prefs.rainbow = rainbow || null;
        this.prefs.proxy = proxy || null;
    }

    saveKeys(appid, appsecret) {
        this.prefs.appid = appid || null;
        this.prefs.appsecret = appsecret || null;
    }

    saveHost(host) {
        this.prefs.rainbow = host || null;
        this.prefs.user = null;
        this.prefs.token = null;
    }

    savePassword(password) {
        if(!this.prefs.account) {
            this.prefs.account = {
                email: ""
            }
        }
        this.prefs.account.password = password || null;
    }

    saveEmail(email) {
        if(!this.prefs.account) {
            this.prefs.account = {
                password: ""
            }
        }
        this.prefs.account.email = email || null;
        this.prefs.user = null;
        this.prefs.token = null;
    }

    saveProxy(proxy) {
        this.prefs.proxy = proxy || null;
    }

    saveConfigure(login, password, host, proxy, appid, appsecret) {
        this.prefs.account = {
            email: login,
            password: password
        },
        this.prefs.rainbow = host || null;
        this.prefs.proxy = proxy || null;
        this.prefs.appid = appid || null;
        this.prefs.appsecret = appsecret || null;
        this.prefs.user = null;
        this.prefs.token = null;
    }

    removeKeys() {
        this.prefs.appid = null;
        this.prefs.appsecret = null;
    }

    removeProxy() {
        this.prefs.proxy = null;
    }

    removeToken() {
        this.prefs.token = null;
        this.prefs.user = null;
    }

    reset() {
        this.prefs.account = null;
        this.prefs.token = null;
        this.prefs.user =  null;
        this.prefs.rainbow = null;
        this.prefs.proxy = null;
    }

    resetAll() {
        this.prefs.account = null;
        this.prefs.token = null;
        this.prefs.user =  null;
        this.prefs.rainbow = null;
        this.prefs.proxy = null;
        this.prefs.appid = null;
        this.prefs.appsecret = null;
        this.prefs.clear();
    }

    log() {
        console.log("account", this.prefs.account);
        console.log("token", this.prefs.token);
        console.log("user", this.prefs.user);
        console.log("rainbow", this.prefs.rainbow);
        console.log("proxy", this.prefs.proxy);
    }
}

module.exports = Preferences;    