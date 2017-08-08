# ALE Rainbow CLI application
===========================

Welcome to the Alcatel-Lucent Enterprise **Rainbow CLI application**!

The Alcatel-Lucent Enterprise (ALE) Rainbow CLI application is an npm package for connecting to Rainbow and do administrative tasks.


## Preamble
---

This Rainbow CLI application is a pure JavaScript library based on the Rainbow SDK for Node.js. 

Its powerfull CLI commands enable you to connect to Alcatel-Lucent Enterprise [Rainbow](https://www.openrainbow.com) and do a lot of administrative tasks.

This documentation will help you to use it.

You need to have Node.JS (stable release) installed on your computer.

THe Rainbow CLI application works on Windows, MacOSX and Linux platforms.


## Rainbow account
---

Your need a **Rainbow** account in order to use the Rainbow CLI Application for Node.js. Most of the administrative commands need an **admin** or **superadmin** role.

You can test it on the **Sandbox Developer Platform** or and Rainbow official if you have an admin role for your company or your organizatioh. Please contact the Rainbow [support](mailto:support@openrainbow.com) team if you need an account on the Sandbox Developer Platform.


## Beta disclaimer
---

Please note that this is a Beta version of the Rainbow CLI Application for Node.js which is still undergoing final testing before its official release. The Rainbow CLI Application for Node.js and the documentation are provided on a "as is" and "as available" basis. Before releasing the official release, all these content can change depending on the feedback we receive in one hand and the developpement of the Rainbow official product in the other hand.

Alcatel-Lucent Enterprise will not be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of the Rainbow CLI Application for Node.js, the application sample software or the documentation content.

If you encounter any bugs, lack of functionality or other problems regarding the Rainbow CLI Application for Node.js, the application samples or the documentation, please let us know immediately so we can rectify these accordingly. Your help in this regard is greatly appreciated. 


## Install
---

You need to install the Rainbow CLI Application globally on your computer in order to be able to launch it from any directories.

```bash
$ npm install -g rainbow-cli
```


## Usage
---

Once the Rainbow CLI Application is installed, you have access to the following command:

```bash
$ rbw <command> [<option>...]
```

Each command returns an exit status code:

 - 0 if the command finished successfully

 - 1 if the command failed

 Read the next paragraph for the complete list of available commands


## Outputs
---

By default, Rainbow CLI displays commands output in a pretty well format to the console.

You can get the a **JSON stringified** result by adding the option `--json` to your command. In that case, only the result of the command is prompted in JSON.

The following sample shows how to get a user information from Rainbow CLI, pass the data as an argument to an other Node.JS application that will retrieve the field `loginEmail` from that user.

Here is the code of the second Node.JS application that will handle the `loginEmail`

```js

// file displayLogin.js
#!/usr/bin/env node

// Keep stdin open and wait for data
process.stdin.resume();
process.stdin.setEncoding('utf8');

let data = "";

// Get result asynchronously
process.stdin.on('data', function(chunk) {
    data += chunk;
});

process.stdin.on('end', function() {
    
    // Do something with the data received
    let json = JSON.parse(data);
    let loginEmail = json.loginEmail;
    ...

    // eg: Display the login email to the console
    console.log("Found", loginEmail);

});

```

This command will retrieve the user from Rainbow CLI and pass the information to the second application

```bash

rbw user 58e36805d45e61221b571363 --json | node displayLogin.js 

```


## Commands
---

Here is the complete list of commands:

| Category | Commands | Details |
|:---------|----------|:--------|
| Account | **login** <username> <password> | Log-in to Rainbow |
| | **logout** | Log-out from Rainbow | 
| | **whoami** | Display information about the user connected |
| User | **user** <id> | Display information about a user |
| | **create user** <username> | Create a new user |
| | **delete user** <id> | Delete a user |
| Company | **company** <id> | Display information about a company |
| | **free company** <id> | Remove all users from a company |
| | **create company** <name> | Create a new company |
| | **delete company** <id> | Delete an existing company |
| | **link company** <id> <orgid> | Link a company to an organization |
| | **status company** <id> | Get a status of the company |
| | **unlink company** <id> | Unlink a company from its organization |
| Site | **site** <id> | Display information about a site |
| | **create site** <name> <id> | Create a new site |
| | **delete site** <id> | Delete an existing site |
| System | **system** <id> | Display information about a system |
| | **create system** <name> <id> | Create a new system |
| | **delete system** <id> | Delete an existing system |
| | **link system** <id> <siteid> | Link a system to a site |
| | **unlink system** <id> <siteid> | Unlink a system from a site |
| Phone | **phone** <id> <systemid> | Display information about a phone |
| Organization | **org** <id> | Display information about an organization |
| | **create org** <name> | Create a new organization |
| | **delete org** <id> | Delete an existing organization |
| Users | **users** | List the users |
| Companies | **companies** | List the companies |
| Sites | **sites** | List the sites |
| Systems | **systems** | List the systems |
| Phones | **phones** <id> | List the phones number of a system |
| Organizations | **orgs** | List the organizations |
| Advanced | **find** <id> | Find an item by its name |
| | **newco** | Create a new company and a new user interactively |
| Status | **status api** | Get the API status |
| Import | **import** | Import a list of users from a CSV file |


### Command **LOGIN**
---

This command allows to log-in to Rainbow

```bash
$ rbw login "rford@westworld.com" "Password_12345"
```

By default the connection is done on the sandbox platform. To log to another Rainbow platform, simply add the option `--host` followed by the hostname where you want to connect:

```bash
$ rbw login "rford@westworld.com" "Password_12345" --host "openrainbow.com"
```

Once this command is done, you're connected to Rainbow and you can launch other commands until your session expires.


### Command **LOGOUT**
---

This command allows to log-out from Rainbow

```bash
$ rbw logout 
```

By default the connection is done on the sandbox platform. To log to the official Rainbow platform, simply add the option `--official`

Once this command is done, you're connected to Rainbow and you can launch other commands until your session expires.


### Command **WHOAMI**
---

This command allows to retrieve information on the connected user

```bash
$ rbw whoami
```


### Command **USER**
---

This command allows to retrieve information on a specific user

```bash
$ rbw user 58cd966fd45e61221b57576c0
```


### Command **CREATE USER**
---

This command allows to create a new user

The following example creates a user in a specific company

```bash
$ rbw create user "jdoe@mycompany.com" "Password_123" "John" "Doe" -c 58cd966fd45e61221b5711c0
```

Using the argument `--admin`, you can create a user with admin right (depending your roles and company profile)

```bash
$ rbw create user "jdoe@mycompany.com" "Password_123" "John" "Doe" -c 58cd966fd45e61221b5711c0 --admin
```


### Command **DELETE USER**
---

This command allows to delete an existing user

```bash
$ rbw delete user 58cd966fddfd61221b57145f
```

A user can be deleted without having to confirm

```bash
$ rbw delete user 58cd966fddfd61221b57145f --nc
```


### Command **COMPANY**
---

This command allows to retrieve information on a specific company

```bash
$ rbw company 58cd966fd45e61221b5711c0
```


### Command **DELETE COMPANY**
---

This command allows to delete an existing company

```bash
$ rbw delete company 58cd966fd45e61221b5711c0
```

A company can be deleted without having to confirm

```bash
$ rbw delete company 58cd966fddfd61221b57145f --nc
```

If the company contains users, add the following parameter to remove the users first and then remove the company

```bash
$ rbw delete company 58cd966fddfd61221b57145f --nc --force
```


### Command **CREATE COMPANY**
---

This command allows to create a new company

```bash
$ rbw create company "My New Company"
```


### Command **FREE COMPANY**

This command allows to remove all users from a company

```bash
$ rbw free company 58cd966fd45e61221b5711c0
```


### Command **STATUS COMPANY**

This command allows to get a status of the company

```bash
$ rbw status company 58cd966fd45e61221b5711c0
```


### Command **LINK COMPANY**
---

This command allows to link a company to an organization

```bash
$ rbw link company 58cd966fd45e61221b5711c0 58cd966fddfd61221b57145f
```


### Command **UNLINK COMPANY**
---

This command allows to unlink a company from its organization

```bash
$ rbw unlink company 58cd966fd45e61221b5711c0
```


### Command **SITE**
---

This command allows to retrieve information on a specific site

```bash
$ rbw site 58cd966fd45e61221b5711c0
```


### Command **DELETE SITE**
---

This command allows to delete an existing site

```bash
$ rbw delete site 58cd966fd45e61221b5711c0
```

A site can be deleted without having to confirm

```bash
$ rbw delete site 58cd966fd45e61221b5711c0 --nc
```


### Command **CREATE SITE**
---

This command allows to create a new site. You have to specify the company id where to create this site.

```bash
$ rbw create site "My New site" 58cd966fd45e61221b5714fc
```


### Command **SYSTEM**
---

This command allows to retrieve information on a specific system

```bash
$ rbw system 58cd966fd45e61221b575423
```


### Command **DELETE SYSTEM**
---

This command allows to delete an existing system

```bash
$ rbw delete system 58cd966fd45e61221b571445
```

A site can be deleted without having to confirm

```bash
$ rbw delete system 58cd966fd45e61221b571445 --nc
```


### Command **CREATE SYSTEM**
---

This command allows to create a new system. You have to specify the site id where to create this site and a name.

```bash
$ rbw create system "My New site" 58cd966fd45e61221b5714fc
```

Then the system will ask to choice a type of system to create and the country associated to this system.


### Command **LINK SYSTEM**
---

This command allows to link a system to an other site. A system can be share with several sites.

```bash
$ rbw link system 58cd966fd45e61221b5714fc 58cd966fd45e61221b57645
```


### Command **UNLINK SYSTEM**
---

This command allows to unlink a system from a site. A system must be attached to at least one site.

```bash
$ rbw unlink system 58cd966fd45e61221b5714fc 58cd966fd45e61221b57645
```


### Command **PHONE**
---

This command allows to retrieve information on a specific phone

```bash
$ rbw phone 58cd966fd45e61221b5711c0 58cd966fd45e61221b59876
```


### Command **ORG**
---

This command allows to retrieve information on a specific organization

```bash
$ rbw org 58cd966fd45e61221b5711c0
```


### Command **CREATE ORG**
---

This command allows to create a new organization

```bash
$ rbw create org "My New organization"
```


### Command **DELETE ORG**
---

This command allows to delete an existing organization

```bash
$ rbw delete org 58cd966fd45e61221b5711c0
```

An organization can be deleted without having to confirm

```bash
$ rbw delete org 58cd966fd45e61221b5711c0 --nc
```


### Command **USERS**
---

This command allows to list all the existing users (limited to your admin right)

```bash
$ rbw users
```

If there is more that 25 instances, the result is paginated. use the option `--limit` to display up to 1000 results per page and the option `--page` to display a specific page

```bash
$ rbw users --page 4
```

The list of users can be restricted to a company

```bash
$ rbw users --cid 58cd966fd45e61221b5711c0
```

The list of users can be restricted to a company name

```bash
$ rbw users -company "myCompany"
```

The list of users can be filtered by name

```bash
$ rbw companies --name "smith"
```

Finally, this list of users can be exported to a CSV file (with a limited set of attributes for each user)

```bash
$ rbw users -c 58cd966fd45e61221b5711c0 --file "export.csv"
```

### Command **COMPANIES**
---

This command allows to list all the existing companies (limited to your admin right)

```bash
$ rbw companies
```

The list of companies can be filtered to limit to BP companies

```bash
$ rbw companies --bp
```

The list of companies can be filtered by name

```bash
$ rbw companies --name "Rainbow"
```

The options `--limit` and `--page` can be used in case of a large number of companies found


### Command **SITES**
---

This command allows to list all the existing sites (limited to your admin right)

```bash
$ rbw sites
```

Sites can be exported to a CSV file 

```bash
$ rbw sites --file "sites.csv"
```

The options `--limit` and `--page` can be used in case of a large number of sites found


### Command **SYSTEMS**
---

This command allows to list all the existing systems (limited to your admin right)

```bash
$ rbw systems
```

Sites can be exported to a CSV file 

```bash
$ rbw systems --file "systems.csv"
```

The options `--limit` and `--page` can be used in case of a large number of systems found


### Command **PHONES**
---

This command allows to list all the existing phones of a system (limited to your admin right)

```bash
$ rbw phones 58cd966fd45e61221b5711c0
```

Phones can be exported to a CSV file 

```bash
$ rbw phones 58cd966fd45e61221b5711c0 --file "systems.csv"
```

The options `--limit` and `--page` can be used in case of a large number of phones found


### Command **ORGS**
---

This command allows to list all the existing organizations (limited to your admin right)

```bash
$ rbw orgs
```

Organizations can be exported to a CSV file 

```bash
$ rbw orgs --file "orgs.csv"
```

The options `--limit` and `--page` can be used in case of a large number of organizations found


### Command **FIND**
---

This command search in the Rainbow database for the element associated to the given id. (ie: in users, organisations, sites or companies tables)

```bash
$ rbw find 58cd966fd45e61221b5711c0
```


### Command **NEWCO**
---

This command creates a new company and a new user interactively. If there is a issue, when creating the user, the company is removed too. The user can have `company_admin` right or not. 

```bash
$ rbw newco
```


### Command **STATUS API**
---

This command allows to retrieve the status of the Rainbow Services

```bash
$ rbw status api
```

### Command **IMPORT**
---

This command allows to import a CSV file containing a list of users to a company

```bash
$ rbw import --file "import.csv"
```