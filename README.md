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
| Connected User | **login** | Log-in to Rainbow | 
| | **whoami** | Display information about the user connected |
| User | **create** <username> | Create a new user |
| | **delete** <id> | Delete a user |
| Company | **company** <id> | Display information on a company |
| | **free company** <id> | Remove all users from a company |
| | **create company** <name>| Create a new company |
| | **delete company** <id>| Delete an existing company |
| Users | **users** | List the users |
| Companies | **companies** | List the companies |
| Organizations | **orgs** | List the organizations |
| Status | **status** | Get the API status |
| Import | **import** | Import a list of users from a CSV file |


### Command **LOGIN**

This command allows to log-in to Rainbow

```bash
$ rbw login -u "rford@westworld.com" -p "Password_12345"
```

By default the connection is done on the sandbox platform. To log to the official Rainbow platform, simply add the option **--official**


Once this command is done, you're connected to Rainbow and you can launch other command until your session expires.

### Command **WHOAMI**

This command allows to retrieve information on the connected user

```bash
$ rainbow whoami
```

### Command **CREATE**

This command allows to create a new user

The following example creates a user in a specific company

```bash
$ rainbow create "jdoe@mycompany.com" -p "Password_123" -f "John" -l "Doe" -c 58cd966fd45e61221b5711c0
```

### Command **DELETE**

This command allows to delete an existing user

```bash
$ rainbow delete 58cd966fddfd61221b57145f
```

### Command **COMPANY**

This command allows to retrieve information on a specific company

```bash
$ rainbow company 58cd966fd45e61221b5711c0
```

### Command **DELETE COMPANY**

This command allows to delete an existing company

```bash
$ rainbow delete company 58cd966fd45e61221b5711c0
```

### Command **CREATE COMPANY**

This command allows to create a new company

```bash
$ rainbow create company "My New Company"
```

### Command **FREE COMPANY**

This command allows to remove all users from a company

```bash
$ rainbow free company 58cd966fd45e61221b5711c0
```

### Command **USERS**

This command allows to list all the existing users

```bash
$ rainbow users
```

If there is more that 25 users, the result is paginated. use the option **--max** to display up to 1000 results or the option **--p** to display a specific page

```bash
$ rainbow users --page 4
```

The list can be restricted to a company

```bash
$ rainbow users -c 58cd966fd45e61221b5711c0
```

Finally, this list of users can be exported to a CSV file (with a limited set of attributes for each user)

```bash
$ rainbow users -c 58cd966fd45e61221b5711c0 --file "export.csv"
```

### Command **COMPANIES**

This command allows to list all the existing companies

```bash
$ rainbow companies
```

The list of companies can be filtered to limit to **BP** companies

```bash
$ rainbow companies --bp
```

The list of companies can be filtered to limit to companies that belong to the same **organization**.

```bash
$ rainbow companies --org 587d2caca9cf7a40559ec8dd
```


The same option **--max** and **--page** can be used in case of a large number of companies found


### Command **ORGS**

This command allows to list all the existing organizations

```bash
$ rainbow org
```


The same option **--max** and **--page** can be used in case of a large number of organizations found


### Command **STATUS**

This command allows to retrieve the status of the Rainbow Services

```bash
$ rainbow status
```

### Command **IMPORT**

This command allows to import a CSV file containing a list of users to a company

```bash
$ rainbow import --file "import.csv"
```