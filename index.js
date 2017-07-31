#!/usr/bin/env node

process.on("SIGPIPE", process.exit);

var program     = require('commander-plus');
var colors      = require('colors');

var pkg = require('./package.json')

var Preferences = require("./common/Preferences");
var Account = require('./routes/Account');
var Company = require('./routes/Company');
var Organization = require('./routes/Organization');
var Site = require('./routes/Site');
var System = require('./routes/System');
var Phone = require('./routes/Phone');
var Status = require('./routes/Status');
var User = require('./routes/User');
var Free = require('./routes/Free');
var Screen = require('./common/Print');



start = function() {

  // Initialize the program
  program.version(pkg.version);

  var prefs = new Preferences();

  // Initialize the routes
  var account = new Account(program, prefs);
  var user = new User(program, prefs);
  var company = new Company(program, prefs);
  var site = new Site(program, prefs);
  var system = new System(program, prefs);
  var phone = new Phone(program, prefs);
  var organization = new Organization(program, prefs);
  var status = new Status(program, prefs);
  var free = new Free(program, prefs);

  // Start the routes
  account.start();
  user.start();
  company.start();
  free.start();
  site.start();
  system.start();
  phone.start();
  organization.start();
  status.start();

  program
  .command('*')
  .action(function () {
    Screen.print('Command not found.')
  })

  program.parse(process.argv);
}

start();