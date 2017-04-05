ALE Rainbow CLI Application
===========================

Welcome to the Alcatel-Lucent Enterprise **Rainbow CLI Application**!

The Alcatel-Lucent Enterprise (ALE) Rainbow CLI Application is an npm package for connecting to Rainbow and do administrative tasks.


## Preamble

This Rainbow CLI Application is a pure JavaScript library based on the Rainbow SDK for Node.js. 

Its powerfull CLI commands enable you to connect to Alcatel-Lucent Enterprise [Rainbow](https://www.openrainbow.com) and do a lot of administrative tasks.

This documentation will help you to use it.


## Rainbow account

Your need a **Rainbow** account in order to use the Rainbow CLI Application for Node.js. Most of the administrative commands need an **admin** or **superadmin** role.

You can test it on the **Sandbox Developer Platform**. Please contact the Rainbow [support](mailto:support@openrainbow.com) team if you need one.


## Beta disclaimer

Please note that this is a Beta version of the Rainbow CLI Application for Node.js which is still undergoing final testing before its official release. The Rainbow CLI Application for Node.js and the documentation are provided on a "as is" and "as available" basis. Before releasing the official release, all these content can change depending on the feedback we receive in one hand and the developpement of the Rainbow official product in the other hand.

Alcatel-Lucent Enterprise will not be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of the Rainbow CLI Application for Node.js, the application sample software or the documentation content.

If you encounter any bugs, lack of functionality or other problems regarding the Rainbow CLI Application for Node.js, the application samples or the documentation, please let us know immediately so we can rectify these accordingly. Your help in this regard is greatly appreciated. 


## Install

You need to install the Rainbow CLI Application globally on your computer in order to be able to launch it from any directories.

```bash
$ npm install -g rainbow-cli
```


## Usage

Once the Rainbow CLI Application is installed, you have access to the following command:

```bash
$ rbw <command> [<option>...]
```

Read the next paragraph for the complete list of available commands


## Commands

Here is the complete list of commands:

| Category | Commands | Details |
|----------|----------|---------|
| Account | **login** <username> <password> | Log-in to Rainbow |
| | **logout** | Log-out from Rainbow | 
| | **whoami** | Display information about the user connected |
| User | **user** <id> | Display information about a user |
| | **create** <username> | Create a new user |
| | **delete** <id> | Delete a user |
| Company | **company** <id> | Display information about a company |
| | **free company** <id> | Remove all users from a company |
| | **create company** <name> | Create a new company |
| | **delete company** <id> | Delete an existing company |
| | **link company** <id> <orgid> | Link a company to an organization |
| | **unlink company** <id> | Unlink a company from its organization |
| Site | **site** <id> | Display information about a site |
| | **create site** <name> <id> | Create a new site |
| | **delete site** <id> | Delete an existing site |
| System | **system** <id> | Display information about a system |
| | **create system** <name> <id> | Create a new system |
| | **delete system** <id> | Delete an existing system |
| Organization | **org** <id> | Display information about an organization |
| | **create org** <name> | Create a new organization |
| | **delete org** <id> | Delete an existing organization |
| Users | **users** | List the users |
| Companies | **companies** | List the companies |
| Sites | **sites** | List the sites |
| Systems | **systems** | List the systems |
| Organizations | **orgs** | List the organizations |
| Status | **status** | Get the API status |
| Import | **import** | Import a list of users from a CSV file |


### Command **LOGIN**

This command allows to log-in to Rainbow

```bash
$ rbw login "rford@westworld.com" "Password_12345"
```

By default the connection is done on the sandbox platform. To log to another Rainbow platform, simply add the option **--host** followed by the hostname where you want to connect:

```bash
$ rbw login "rford@westworld.com" "Password_12345" --host "openrainbow.com"
```

Once this command is done, you're connected to Rainbow and you can launch other commands until your session expires.


### Command **LOGOUT**

This command allows to log-out from Rainbow

```bash
$ rbw logout 
```


By default the connection is done on the sandbox platform. To log to the official Rainbow platform, simply add the option **--official**

Once this command is done, you're connected to Rainbow and you can launch other commands until your session expires.


### Command **WHOAMI**

This command allows to retrieve information on the connected user

```bash
$ rbw whoami
```


### Command **USER**

This command allows to retrieve information on a specific user

```bash
$ rbw user 58cd966fd45e61221b57576c0
```


### Command **CREATE**

This command allows to create a new user

The following example creates a user in a specific company

```bash
$ rbw create "jdoe@mycompany.com" -p "Password_123" -f "John" -l "Doe" -c 58cd966fd45e61221b5711c0
```


### Command **DELETE**

This command allows to delete an existing user

```bash
$ rbw delete 58cd966fddfd61221b57145f
```

A user can be deleted without having to confirm

```bash
$ rbw delete 58cd966fddfd61221b57145f --nc
```


### Command **COMPANY**

This command allows to retrieve information on a specific company

```bash
$ rbw company 58cd966fd45e61221b5711c0
```


### Command **DELETE COMPANY**

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
$ rbw delete 58cd966fddfd61221b57145f --nc --force
```


### Command **CREATE COMPANY**

This command allows to create a new company

```bash
$ rbw create company "My New Company"
```


### Command **FREE COMPANY**

This command allows to remove all users from a company

```bash
$ rbw free company 58cd966fd45e61221b5711c0
```


### Command **LINK COMPANY**

This command allows to link a company to an organization

```bash
$ rbw link company 58cd966fd45e61221b5711c0 58cd966fddfd61221b57145f
```


### Command **UNLINK COMPANY**

This command allows to unlink a company from its organization

```bash
$ rbw unlink company 58cd966fd45e61221b5711c0
```


### Command **SITE**

This command allows to retrieve information on a specific site

```bash
$ rbw site 58cd966fd45e61221b5711c0
```


### Command **DELETE SITE**

This command allows to delete an existing site

```bash
$ rbw delete site 58cd966fd45e61221b5711c0
```

A site can be deleted without having to confirm

```bash
$ rbw delete site 58cd966fd45e61221b5711c0 --nc
```


### Command **CREATE SITE**

This command allows to create a new site. You have to specify the company id where to create this site.

```bash
$ rbw create site "My New site" 58cd966fd45e61221b5714fc
```


### Command **SYSTEM**

This command allows to retrieve information on a specific system

```bash
$ rbw system 58cd966fd45e61221b575423
```


### Command **DELETE SYSTEM**

This command allows to delete an existing system

```bash
$ rbw delete system 58cd966fd45e61221b571445
```

A site can be deleted without having to confirm

```bash
$ rbw delete system 58cd966fd45e61221b571445 --nc
```


### Command **CREATE SYSTEM**

This command allows to create a new system. You have to specify the site id where to create this site and a name.

```bash
$ rbw create system "My New site" 58cd966fd45e61221b5714fc
```

Then the system will ask to choice a type of system to create and the country associated to this system.


### Command **ORG**

This command allows to retrieve information on a specific organization

```bash
$ rbw organization 58cd966fd45e61221b5711c0
```


### Command **CREATE ORG**

This command allows to create a new organization

```bash
$ rbw create organization "My New organization"
```


### Command **DELETE ORG**

This command allows to delete an existing organization

```bash
$ rbw delete organization 58cd966fd45e61221b5711c0
```

An organization can be deleted without having to confirm

```bash
$ rbw delete org 58cd966fd45e61221b5711c0 --nc
```


### Command **USERS**

This command allows to list all the existing users (limited to your admin right)

```bash
$ rbw users
```

If there is more that 25 users, the result is paginated. use the option **--max** to display up to 1000 results or the option **--p** to display a specific page

```bash
$ rbw users --page 4
```

The list can be restricted to a company

```bash
$ rbw users -c 58cd966fd45e61221b5711c0
```

Finally, this list of users can be exported to a CSV file (with a limited set of attributes for each user)

```bash
$ rbw users -c 58cd966fd45e61221b5711c0 --file "export.csv"
```

### Command **COMPANIES**

This command allows to list all the existing companies (limited to your admin right)

```bash
$ rbw companies
```

The list of companies can be filtered to limit to **BP** companies

```bash
$ rbw companies --bp
```

### Command **SITES**

This command allows to list all the existing sites (limited to your admin right)

```bash
$ rbw sites
```

Sites can be exported to a CSV file 

```bash
$ rbw sites --file "sites.csv"
```

The same option **--max** and **--page** can be used in case of a large number of sites found


### Command **SYSTEMS**

This command allows to list all the existing systems (limited to your admin right)

```bash
$ rbw systems
```

Sites can be exported to a CSV file 

```bash
$ rbw systems --file "systems.csv"
```

The same option **--max** and **--page** can be used in case of a large number of systems found


### Command **ORGS**

This command allows to list all the existing organizations (limited to your admin right)

```bash
$ rbw orgs
```

Organizations can be exported to a CSV file 

```bash
$ rbw orgs --file "orgs.csv"
```

The same option **--max** and **--page** can be used in case of a large number of organizations found


### Command **STATUS**

This command allows to retrieve the status of the Rainbow Services

```bash
$ rbw status
```

### Command **IMPORT**

This command allows to import a CSV file containing a list of users to a company

```bash
$ rbw import --file "import.csv"
```