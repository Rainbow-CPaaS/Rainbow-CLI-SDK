ALE Rainbow CLI Application for Node.js
=======================================

Welcome to the Alcatel-Lucent Enterprise **Rainbow CLI Application for Node.js**!

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
$ rainbow <command> [<option>...]
```

Read the next paragraph for the complete list of available commands and options


## Commands

Here is the complete list of commands:

| Commands | Details |
|------|--------|
| CONNECTED USED | |
| **login** | Log-in to Rainbow | 
| **whoami** | Display information about the user connected |
| COMPANY| |
| **company** <id>| Display information on a company |
| **company create** <name>| Create a new company |
| **company delete** <id>| Delete an existing company |
| COMPANIES | |
| **companies** | List the companies |
| USERS| |
| **users** <id> | List the users |
| USER | |
| **create** <username> <password> | Create a new user |
| STATUS| |
| **status** | Get the API status |
| MASS PROVISIONNING | |
| **import** | Import a CSV (users) file |



