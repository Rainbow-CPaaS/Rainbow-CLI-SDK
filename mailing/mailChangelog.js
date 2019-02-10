#!/usr/bin/env node

/* jshint undef: true, unused: true, esversion: 6,  */
/* eslint require-jsdoc: 0 */

/*
 * Generate & send changelog
 * Copyright (c) 2018 Alcatel-Lucent Entreprise
 */

const md = require("markdown").markdown;
const fs = require("fs");
const vm = require("vm");
const path = require("path");
const program = require("commander");
const YAML = require("yamljs");
const process = require("process");
const Mailjet = require("node-mailjet");

global.window = {};

// Extract version
let content = fs.readFileSync(path.join(__dirname, "../package.json"));
let packageJSON = JSON.parse(content);
let currentVersion = packageJSON.version.substr(0, packageJSON.version.lastIndexOf("."));
let fullVersion = packageJSON.version;

function loadSingleReleaseNotes(item, config) {
    return new Promise((resolve, reject) => {
        let product = {};

        product.title = item.title;

        fs.readFile(item.path, "utf8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            let tree = md.parse(data.toString());

            let version = null;
            let filteredTree = tree.filter((markdownElt, index) => {
                if (index === 0) {
                    return true;
                }
                if (item[0] === "hr") {
                    return false;
                }

                if (markdownElt[0] === "header" && markdownElt[1].level === 2) {
                    // A version
                    version = markdownElt[2][2];
                    if (version.startsWith(currentVersion)) {
                        return true;
                    } else {
                        version = null;
                    }
                }

                if (markdownElt[0] === "bulletlist") {
                    if (version) {
                        return true;
                    }
                }

                return false;
            });

            let html = md.renderJsonML(md.toHTMLTree(filteredTree));

            product.notes = html;
            resolve(product);
        });
    });
}

function extractReleaseNotes(releaseNotes, config) {
    return new Promise((resolve, reject) => {
        let productPromises = [];
        releaseNotes.deliveries.forEach(item => {
            productPromises.push(loadSingleReleaseNotes(item, config));
        });
        Promise.all(productPromises)
            .then(values => {
                resolve(values);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function generateNunjucksVariables(config) {
    let releaseNoteDefinition = YAML.load(path.join(__dirname, "./changelog.yaml"));

    return new Promise((resolve, reject) => {
        extractReleaseNotes(releaseNoteDefinition, config)
            .then(products => {
                let vars = {
                    date: config.date,
                    component: releaseNoteDefinition.component,
                    from: {
                        email: releaseNoteDefinition.fromEmail,
                        name: releaseNoteDefinition.fromName
                    },
                    to: {
                        email: releaseNoteDefinition.toEmail,
                        name: releaseNoteDefinition.toName
                    },
                    cc: {
                        email: releaseNoteDefinition.ccEmail,
                        name: releaseNoteDefinition.ccName
                    },
                    environment: releaseNoteDefinition[config.environment],
                    subject: releaseNoteDefinition.subject,
                    products: products
                };
                resolve(vars);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function sendMail(vars, mailjet) {
    const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: {
                    Email: vars.from.email,
                    Name: vars.from.name
                },
                To: [
                    {
                        Email: vars.to.email,
                        Name: vars.to.name
                    },
                    {
                        Email: vars.cc.email,
                        Name: vars.cc.name
                    }
                ],
                Subject: vars.subject + fullVersion + " delivered to " + vars.environment,
                TextPart: "Hi all, component " + vars.component + " has been delivered to " + vars.environment,
                HTMLPart: [
                    "<p>Hi all,</p>",
                    "<p>Component <b>" +
                        vars.component +
                        "</b> as been delivered to <b>" +
                        vars.environment +
                        "</b></p>",
                    "<p>Here is the complete changelog for version <b>" + currentVersion + "</b>",
                    vars.products.map(product => {
                        return "<h2><u>" + product.title + "</u></h2>" + product.notes + "<br>";
                    })
                ].join("")
            }
        ]
    });

    request
        .then(result => {
            console.log(result.body);
        })
        .catch(err => {
            console.log(err.statusCode);
        });
}

program
    .command("notify")
    .description("Generate and send changelog for a preproduction release")
    .option(
        "-e, --environment [environment]",
        "Environment published: 'production' or 'preproduction' (default)",
        "preproduction"
    )
    .action((env, options) => {
        let apiKey = process.env.MJ_APIKEY_PUBLIC || "6f119214480245deed79c5a45c59bae6";
        let apiSecret = process.env.MJ_APIKEY_PRIVATE || "0ae56ba5e8f85b9ed54a6985d451a1b3";

        let mailjet = Mailjet.connect(apiKey, apiSecret);

        generateNunjucksVariables(env).then(vars => {
            sendMail(vars, mailjet);
        });
    });

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
