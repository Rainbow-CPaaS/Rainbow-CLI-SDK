#!/usr/bin/env node

process.on("SIGPIPE", process.exit);

const program     = require('commander-plus');
const colors      = require('colors');

const pkg = require('./package.json')

const Preferences = require("./common/Preferences");
const Message = require('./common/Message');

const Account         = require('./routes/Account');
const Company         = require('./routes/Company');
const Organization    = require('./routes/Organization');
const Site            = require('./routes/Site');
const System          = require('./routes/System');
const Phone           = require('./routes/Phone');
const Status          = require('./routes/Status');
const User            = require('./routes/User');
const Free            = require('./routes/Free');
const Mass            = require('./routes/Mass');
const Advanced        = require('./routes/Advanced');
const Offers          = require('./routes/Offers');
const Invoices        = require('./routes/Invoice');
const Application     = require('./routes/Application');
const Developer       = require('./routes/Developer');

start = function() {

  // Initialize the program
  program.version(pkg.version);

  let prefs = new Preferences();

  // Initialize the routes
  let account = new Account(program, prefs);
  let user = new User(program, prefs);
  let company = new Company(program, prefs);
  let site = new Site(program, prefs);
  let system = new System(program, prefs);
  let phone = new Phone(program, prefs);
  let organization = new Organization(program, prefs);
  let status = new Status(program, prefs);
  let free = new Free(program, prefs);
  let masspro = new Mass(program, prefs);
  let advanced = new Advanced(program, prefs);
  let offers = new Offers(program, prefs);
  let invoices = new Invoices(program, prefs);
  let applications = new Application(program, prefs);
  let developers = new Developer(program, prefs);

  // Start the routes
  account.start();
  user.start();
  company.start();
  free.start();
  site.start();
  system.start();
  phone.start();
  organization.start();
  offers.start();
  masspro.start();
  invoices.start();
  advanced.start();
  status.start();
  applications.start();
  developers.start();

  program
    .command('*')
    .action(function () {
        Message.welcome();
        Message.version(pkg.version);
        Message.lineFeed();
        Message.notFound();
  });

  program.parse(process.argv);
}

start();