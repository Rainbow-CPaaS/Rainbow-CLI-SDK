## Managing tests accounts

---

### Preamble

---

If you are developing a communication or collaboration application, you need several tests users or `persona` in order to simulate different users. The Rainbow CLI is a super simple tool for managing these tests accounts on the Sandbox platform.

This guide helps you understanding how to use the Rainbow CLI for creating accounts on the developer sandbox platform that you can use when developing your application.

### Rainbow Knowledge

---

Here is some Rainbow wordings that will help you understanding this guide

| Rainbow                         | Details                                                                                                                                                        |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sandbox developer platform**  | This is the free platform you can use to developer your application. This platform uses different accounts than the Rainbow production platform.               |
| **Rainbow production platform** | This is the official Rainbow platform where real users are. You need to deploy your application to connect to this platform.                                   |
| **Rainbow developer account**   | This is a Rainbow account used on the Rainbow production platform who has signed the developer agreement and so can create applications using the Rainbow HUB. |
| **Rainbow tests account**       | This is a "fake" Rainbow account created on the Rainbow Sandbox platform when developing your application with differents users.                               |

### Install

---

As explaining in the [Getting Started](/#/documentation/doc/sdk/cli/tutorials/Getting_started) guide, you need to install the Rainbow CLI using the following command:

```bash

$ npm install -g rainbow-cli

```

Once installed, you can now sign-in and manage your account.

### Sign-in using your developer account

---

You can't sign-in on the developer sandbox without your primary developer account. To obtain a new one, follow the procedure described in the Rainbow Hub [Support page](https://hub.openrainbow.net/#/support).

Once you obtained your developer account, you can sign-in using the following command:

```bash

$ rbw login <login> <password>

```

### Discovering who you are and what you can do

---

Once you logged in, you can check your account by using the command `rbw whoami`

```bash

$ rbw whoami

Welcome to Rainbow CLI
You are logged-in as **<your login>**
Your roles **user** + **admin**
Your level *company_admin > user*

Request List whoami
...

```

Each time you launch a command, you can see the Rainbow CLI header that displays several information:

-   The login used

-   The role associated to this account: `user`, `admin`...

-   The level associated to this role: `company_admin`, `organization_admin`...

If you want to list the commands you have access depending on your level, you can launch the command `rbw commands`

```bash

$ rbw commands

```

### Discovering your company and users

---

To have information on your company, you can use the command `rbw company`

```bash

$ rbw company

```

This command produces the following output:

| #   | Attribute                      | Value           |
| --- | ------------------------------ | --------------- |
| 1   | name                           | yourCompanyName |
| 2   | country                        | FRA             |
| 3   | economicActivityClassification | R               |
| 4   | adminEmail                     | ''              |
| ... | ...                            | ...             |
| 26  | numberUsers                    | 2               |

To list the users in your company, use the command `rbw users``

```bash

$ rbw users

```

This command produces the following output:

| #   | Name   | LoginEmail         | Company  | Account | Roles      | Active | ID                       |
| --- | :----- | ------------------ | -------- | ------- | ---------- | ------ | ------------------------ |
| 1   | user 1 | user1@acompany.com | aCompany | free    | user,admin | true   | 581b405d383b2852d37aa098 |
| 2   | user 2 | user2@acompany.com | aCompany | free    | user,admin | true   | 581b405d383b2852d37aa099 |

To have more information on a specific user, use the command `rbw user` like in the following

```bash

$ rbw user 59f0d5ca7adcbf344239dcd0

```

This commands produces the following output:

| #   | Attribute          | Value              |
| --- | ------------------ | ------------------ |
| 1   | displayName        | user 1             |
| 2   | companyName        | aCompany           |
| 3   | loginEmail         | user1@acompany.com |
| 4   | language           | en                 |
| ... | ...                | ...                |
| 41  | isInDefaultCompany | false              |

You will have access to all fields and see for example if the account is locked (too many wrong password entered), the last login date...

### Creating new test accounts

---

When you are developing your application, most of the time, you need several accounts to be able to test the interaction between these users (i.e. audio and video call or chat).

To create a new account, use the command `rwb create user`

```bash

$ rbw create user 'atestuser@acompany.com' 'aPassword_123' 'aFirstname' 'aLastname'

```

You can create as many tests accounts as you need for developing your application.

### Updating password and login email

---

At any time, you can update the password or the login email of a user of your company using the commands `rbw changepwd user` and `rbwchangelogin user`

```bash

# Updating the password
$ rbw changepwd user 59f0d5ca7adcbf344239dcd0 'myNewPassword_123'

# Updating the login email
$ rbw changelogin user 59f0d5ca7adcbf344239dcd0 'newLogin@acompany.com'

```

### Removing a test account

---

If you need to remove a test account, you have to call the command `rbw delete user`

```bash

$ rbw delete user 59f0d5ca7adcbf344239dcd0

```

Now, you have the minimum knowledge for using the rainbow CLI and create the tests accounts you need for your application.

The Rainbow CLI offers many other commands you can play with...

### Interested in

---

-   [Configuring your Rainbow CLI](/#/documentation/doc/sdk/cli/tutorials/Getting_started)

-   [Managing applications](/#/documentation/doc/sdk/cli/tutorials/Managing_applications)

---

_Last updated May, 17th 2018_
