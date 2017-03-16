#!/usr/bin/env node
//var chalk       = require('chalk');
//var clear       = require('clear');

//var figlet      = require('figlet');
//var inquirer    = require('inquirer');
var Preferences = require('preferences');

//var _           = require('lodash');
//var touch       = require('touch');
var program     = require('commander');
//const notifier  = require('node-notifier');

//var prompt      = require('prompt');

var colors      = require('colors');
//const logUpdate = require('log-update');
//var co = require('co');
//var prompt = require('co-prompt');

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

  program.parse(process.argv);
}

start();


      /*
      nodeSDK.events.on('rainbow_onmessagereceived', function(message) {
        print('');
        var bareJID = message.fromJid.substring(0, message.fromJid.indexOf('/'));
        var contacts = nodeSDK.contacts.getAll();
        var from = "unknown";

        contacts.forEach(function(contact) {
          if(contact.jid_im === bareJID) {
            from = "@" + contact.firstName.toLowerCase();
          }  
        });

        console.log(from + ">" + " " + message.content);

      });
      */
      /*
      notifier.notify({
        'title': 'My notification',
        'message': 'Hello, there!'
      });
      */
/*
function getCredentials() {
  getRainbowCredentials(function() {
    signin(arguments[0].login, arguments[0].password); 
  });
}
*/

/*
if(prefs.account && prefs.account.username && prefs.account.password) {
  print('Reuse account ' + prefs.account.username.yellow);
  signin(prefs.account.username, prefs.account.password);
}
else {
  getCredentials();
}
*/

/*

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

*/

/*
function printProgress(text, nb, firstTime){
    if(!firstTime) {
        process.stdout.moveCursor(0, -(nb));
    }
    
    process.stdout.cursorTo(0);

    //process.stdout.write("\u001b[2J\u001b[0;0H");
    process.stdout.write(text);
    process.stdout.write('');
    
}
*/

/*
function onRequestReceived() {
  var fullCommand = arguments[0].request.split(" ");

  var command = fullCommand[0];

  var arg1 = "";
  if(fullCommand.length > 1) {
    arg1 = fullCommand[1];
  }
  var arg2 ="";
  if(fullCommand.length > 2) {
    arg2 = fullCommand[2];
  }

  clearInterval(intervalId);

  switch(command) {
    case "exit":
      nodeSDK.stop();
      process.exit(0);
      break;
    case "help":
      var t = table([
        [ '›'.grey, 'help'.cyan + ' ' + '< on | off | av >'.cyan, 'display this help'.grey ],
        [ '›'.grey, 'version'.cyan, 'display the version'.grey ],
        [ '›'.grey, 'contacts'.cyan, 'display the list of contacts'.grey ],
        [ '›'.grey, 'exit'.cyan, 'quit the application'.grey ],
        [ '›'.grey, 'logout'.cyan, 'signout and quit the application'.grey]
      ]);
      console.log(t);
      break;
    case "contacts":
      displayListOfContacts(true, arg1)
      //intervalId = setInterval(function() {
        //displayListOfContacts(false, arg1);
        //getRequest(onRequestReceived);
      //}, 5000);
      break;
    case "signout":
      prefs.account = {};
      nodeSDK.stop();
      process.exit();
      break;
    case "chat":
    sendChatMessage(arg1, arg2);
      break;
    default:
      break;
  }
  getRequest(onRequestReceived);
};

function sendChatMessage(arg1, arg2) {

  var contacts = nodeSDK.contacts.getAll();
  
  var jid = "";

  var firstname = arg1.substr(1);
  console.log("firstname", firstname)

  contacts.forEach(function(contact) {

    if(contact.firstName.toLowerCase() === firstname.toLowerCase()) {
      jid = contact.jid_im;
    }  
  });

  if(jid.length > 0) {
    console.log("send message", arg2);
    nodeSDK.im.sendMessageToJid(arg2, jid);
  }

}

function displayListOfContacts(firstTime, arg1) {

  var contacts = nodeSDK.contacts.getAll();
  var array = [];
  contacts.forEach(function(contact) {

    var displayContact = true;

    if(arg1 === "online" || arg1 === "on")  {
      if(contact.presence !== "online") {
        displayContact = false;
      }
    } else if(arg1 === "available" || arg1 === "av") {
      if(!contact.presence || contact.presence === "offline" || contact.presence === "unknown") {
        displayContact = false;
      }
    } else if(arg1 === "offline" || arg1 === "off") {
      if(contact.presence && contact.presence !== "offline") {
        displayContact = false;
      }
    }

    var presence = "";
    if(! ("presence" in contact)) {
      presence = "[".grey + "offline   ".grey + "]".grey;
    }
    else if(contact.presence === "online") {
      if(contact.status === "mobile") {
        presence = "[".grey + "mobile    ".cyan + "]".grey;
      }
      else {
        presence = "[".grey + "online    ".green + "]".grey;
      }
    }
    else if(contact.presence === "offline") {
      presence = "[offline   ]".grey;
    }
    else if(contact.presence === "unknown") {
      presence = "[----------]".gray;
    }
    else {
      var toAdd = 10 - contact.presence.length;
      presence = contact.presence.yellow;
      
      for (var i = 0; i < toAdd; i++) {
        presence += " ";
      }
      presence = "[".grey + presence + "]".grey;
    }

    if(displayContact) {
      array.push([ '›'.grey, "@".yellow + contact.firstName.substring(0, 1).toLowerCase().yellow + contact.lastName.toLowerCase().yellow, contact.displayName.toLowerCase(), contact.companyName, presence]);
    }
    else {
      
    }
  });

  var t = table(array);
  printProgress(t, array.length, firstTime);
  print('');
}

function getRequest(callback) {
  var questions = [
    {
      name: 'request',
      type: 'input',
      message: 'Rainbow>',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Request not understood!';
        }
      }
    }];

    inquirer.prompt(questions).then(callback);
}

function getRainbowCredentials(callback) {

  var questions = [
    {
      name: 'login',
      type: 'input',
      message: 'Enter your e-mail address:',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your rainbow e-mail address';
        }
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}
*/