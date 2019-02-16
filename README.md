# Rainbow CLI: Getting Started

Welcome to the Alcatel-Lucent Enterprise **Rainbow CLI application**!

The Alcatel-Lucent Enterprise (ALE) Rainbow CLI application is a shell tool for connecting to Rainbow and doing administrative tasks.

## Preamble

This Rainbow CLI application is based on the [Rainbow SDK for Node.js](https://www.npmjs.com/package/rainbow-node-sdk). It's a desktop application.

Its powerfull CLI commands enable you to connect to Alcatel-Lucent Enterprise [Rainbow](https://www.openrainbow.com) and do a lot of administrative tasks.

This documentation will help you to use it.

## Prerequisites

This section lists the prerequisites for using the Rainbow CLI application.

### Node.JS Support

[Node.JS](https://nodejs.org) must be installed on your computer.

The Rainbow CLI application is supported only when using a Node.JS LTS version.

### Operating systems support

| OS          | Details                           |
| ----------- | :-------------------------------- |
| **Windows** | Starting Windows 7 - all versions |
| **MacOS**   | Starting MacOS 10.11              |
| **Linux**   | Debian, Ubuntu                    |

Note: Others Linux distributions can be used but without support.

## Rainbow Application ID and Secret Key

The Rainbow CLI is free of charge when using on the Rainbow Sandbox developers platform. No application ID and secret key is needed to connect to that platform. So, you can manage for free your application and tests accounts when developing your application on the Sandbox platform.

To connect to the Rainbow production platform for doing the same or much more like provisionning users, managing your company, the Rainbow CLI needs an **application ID** and a **secret key**.

To get your application ID and secret key:

-   Connect to the Rainbow HUB with your Rainbow developer account,

-   Create a new application and deploy it,

-   Get the associated application ID and secret key

-   Inject it to your Rainbow CLI application either using command `rbw configure` or command `rbw set keys`.

**Note: Application ID and secret key will be mandatory to connect to Rainbow production platform on September'18. You will be able to create your application ID and secret key starting July'18**.

## Rainbow account

Your need a **Rainbow** account to use the Rainbow CLI application. Most of the administrative commands need a **company_admin** or a **organisation_admin** role.

You can test it on the **Sandbox Developer Platform** or on Rainbow official if you have an admin role for your company or your organization. Please contact the Rainbow [support](mailto:support@openrainbow.com) team if you need an account on the Sandbox Developer Platform.

## Install

You must install the Rainbow CLI application globally on your computer to be able to launch it from any directories.

Open a shell console and execute the following command:

```bash

$ npm install -g rainbow-cli

```

Notice: Node.JS must be installed first.

## Usage

Once the Rainbow CLI application is installed, you can launch commands using the following syntax:

```bash

$ rbw <command> [<option>...]

```

Each command returns an exit status code:

-   0 if the command finished successfully

-   1 if the command failed

Read the next paragraph for the complete list of available commands

## Role and profile

Depending the role and profile associated to your Rainbow account, you can have access to more or less commands.

## Commands

To know the list of commands available, use the following command:

```bash

$ rbw commands

```

## Help on commands

To get help on a command and display the list of available options, use the following syntax:

```bash

$ rbw <command> --help

```

## Configure the Rainbow CLI and connect to Rainbow

For general use, the Rainbow CLI `configure` command is the fastest way to set up your connection information.

```bash

$ rbw configure

```

The Rainbow CLI will prompt you for information such as the host to connect, the login information, the proxy parameter and your application ID and secret for connecting to the Rainbow production platform.

Note: At this time of writing, application ID and secret are not mandatory to connect to the Rainbow production platform.

Once configured, use the command `login` to connect to Rainbow.

```bash

$ rbw login

```

## Outputs

By default, Rainbow CLI displays commands output in a pretty well format to the console.

You can get a **JSON stringified** result by adding the option `--json` to your command. In that case, only the result of the command is prompted in JSON.

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

## Debugging

In case of issue, you can have more information on what happens by adding the option `-v` or `--verbose` to any command

```shell

rbw user 58e36805d45e61221b571363 --verbose

```

## Beta disclaimer

Please note that this is a Beta version of the Rainbow CLI application which is still undergoing final testing before its official release. The Rainbow CLI application and the documentation are provided on a "as is" and "as available" basis. Before releasing the official release, all these content can change depending on the feedback we receive in one hand and the developpement of the Rainbow official product in the other hand.

Alcatel-Lucent Enterprise will not be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any party as a result of their use of the Rainbow CLI application, the application sample software or the documentation content.

If you encounter any bugs, lack of functionality or other problems regarding the Rainbow CLI application, the application samples or the documentation, please let us know immediately so we can rectify these accordingly. Your help in this regard is greatly appreciated.

---

_Last updated February, 07th 2018_
