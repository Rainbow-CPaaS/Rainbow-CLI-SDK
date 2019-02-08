"use strict";

const NodeSDK = require("rainbow-node-sdk");
const Logger = require("./Logger");

const LOG_ID = "PRINT - ";

const config = {
    rainbow: {
        host: "sandbox",
        mode: "cli"
    },
    credentials: {
        login: "",
        password: ""
    },
    application: {
        appID: "",
        appSecret: ""
    },
    proxy: {
        host: "",
        port: 80,
        protocol: "http"
    },
    logs: {
        enableConsoleLogs: true,
        enableFileLogs: false,
        color: true,
        level: "debug",
        customLabel: "Rainbow-CLI-SDK",
        "system-dev": {
            internals: true,
            http: true
        },
        file: {
            path: "/var/tmp/rainbowsdk/",
            level: "debug"
        }
    },
    im: {
        sendReadReceipt: false //false to not send a read receipt automatically
    }
};

class SDK {
    constructor() {
        this.nodeSDK = null;
    }

    start(login, password, platform, proxy, appid, appsecret) {
        var that = this;

        return new Promise(function(resolve, reject) {
            Logger.logs("CLI/SDK - (start) use account", login);

            config.credentials.login = login;
            config.credentials.password = password;
            config.rainbow.host = platform;

            if (
                config.rainbow.host === "openrainbow.com" ||
                config.rainbow.host === "official" ||
                config.rainbow.host === "openrainbow.cn.com"
            ) {
                config.application.appID = appid;
                config.application.appSecret = appsecret;
            } else {
                config.application.appID = "b34c674000f011e886d9b5bbd3260792";

                if (
                    config.rainbow.host === "sandbox.openrainbow.com" ||
                    config.rainbow.host === "sandbox" ||
                    config.rainbow.host === "sandbox.openrainbow.cn.com"
                ) {
                    config.application.appSecret = "MAjWllXH84YVhn0yp3ZuGmuPleXlYQhIeNghRgdo8NAVKEcIDc7M61Wes6Dp0cLy";
                } else if (
                    config.rainbow.host === "openrainbow.net" ||
                    config.rainbow.host === "cpaaspreprod.openrainbow.net"
                ) {
                    config.application.appSecret = "QPxaSRzGDcQ5ZIHQtWOpGrDU2j7GEgBpBii6l6N64RyF6QRxaFIJMhAHM4sIhWx7";
                } else if (config.rainbow.host === "openrainbow.org") {
                    config.application.appSecret = "ftF0ZEpriOhNjwBMej3x8g0f0bhjGOGcnOBgHrQIfWrXE984yWnBmAa6qGRhUcaZ";
                } else {
                    config.application.appSecret = "Tz8biItumw6Ay6DaThff7Cy9T6rLKIMr2qIk0WcixWkJYxZdZfXBa2kqkIcvlemI";
                }
            }

            if (proxy) {
                config.proxy = proxy;
            }

            config.logs.enableConsoleLogs = Logger.isActive;

            that._nodeSDK = new NodeSDK(config);

            that._nodeSDK.events.once("rainbow_onerror", function(jsonMessage) {
                reject();
            });

            Logger.logs("CLI/SDK - (start) call startCLI");
            that._nodeSDK
                .startCLI()
                .then(function() {
                    Logger.logs("CLI/SDK - (start) call startCLI successfull");
                    resolve();
                })
                .catch(function(err) {
                    Logger.error("CLI/SDK - (start) call startCLI error", err);
                    reject(err);
                });
        });
    }

    signin() {
        var that = this;

        Logger.logs("CLI/SDK - (signin)");

        return new Promise(function(resolve, reject) {
            Logger.logs("CLI/SDK - (signin) call startCLI");
            that._nodeSDK
                .signinCLI()
                .then(function(json) {
                    Logger.logs("CLI/SDK - (signin) call startCLI successfull");
                    resolve(json);
                })
                .catch(function(err) {
                    Logger.error("CLI/SDK - (signin) call startCLI error", err);
                    reject(err);
                });
        });
    }

    get(url, token) {
        var that = this;

        return new Promise(function(resolve, reject) {
            that._nodeSDK.rest
                .get(url, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    post(url, token, data, contentType) {
        var that = this;

        return new Promise(function(resolve, reject) {
            that._nodeSDK.rest
                .post(url, token, data, contentType)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    put(url, token, data) {
        var that = this;

        return new Promise(function(resolve, reject) {
            that._nodeSDK.rest
                .put(url, token, data)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    delete(url, token, data) {
        var that = this;

        return new Promise(function(resolve, reject) {
            that._nodeSDK.rest
                .delete(url, token)
                .then(function(json) {
                    resolve(json);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }
}

module.exports = new SDK();
