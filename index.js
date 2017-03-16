#!/usr/bin/env node
var Preferences = require('preferences');
var program     = require('commander-plus');
var colors      = require('colors');

var pkg = require('./package.json')
var User = require('./User');
var Company = require('./Company');
var Screen = require('./Print');

var prefs = null;

start = function() {
  // Get the prefs
  prefs = new Preferences('rainbow');

  // initiate the program
  program.version(pkg.version);

  var user = new User(program, prefs);
  var company = new Company(program, prefs);

  user.start();
  company.start();

  program
  .command('*')
  .action(function () {
    Screen.print('Command not found.')
  })

  program.parse(process.argv);
}

start();