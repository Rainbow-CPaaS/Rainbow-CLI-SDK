## Rainbow CLI: What's new
---

Welcome to the new release of the **Rainbow CLI**. There are a number of significant updates in this version that we hope you will like, some of the key highlights include:


### Rainbow CLI 1.40 (Beta) - Avril 2018
---

**3-Release Breaking Changes**

- None.

**Breaking Changes**

- None.

**Changes**

- New commands `rbw developers payment` and `rbw developers methods` have been added to list the developer's billing account information and the list of payment methods registered.

- New command `rbw developers subscriptions` has been added to list the subscriptions associated to each application.

- New option `--file <file>` or `-f <file>` has been added to API `rbw metrics application` in order to extract and save metrics in a CSV file.

**Others changes**

- None.


### Rainbow CLI 1.39 (Beta) - Avril 2018
---

**3-Release Breaking Changes**

- None.

**Breaking Changes**

- None.

**Changes**

- New command `rbw configure` has been added to configure you Rainbow CLI application in an easy way.

- New command `rbw set email`, `rbw set password`, `rbw set host`, `rbw set proxy`, `rbw set keys`, `rbw remove proxy` and `rbw remove keys` have been added to change quickly any configuration parameter.

- New command  `rbw remove preferences` has been added to remove all preference stored locally.

- Command `rbw login` can now be used without specifiying a login email account, a password, a proxy and a host. All these information are taken into account from the preferences.

- Command `rbw logout` now only logout from Rainbow without removing your preferences.

**Others changes**

- None.


### Rainbow CLI 1.38 (Beta) - March 2018
---

**3-Release Breaking Changes**

- None.

**Breaking Changes**

- None.

**Changes**

- New command `rbw set developer` has been added to update your account as a developer.

- New options `--month` and `--year` have been added to command `rbw metrics application` to retrieve API usage over a month (day by day) and over a year (month by month). 

- New internal commands `rbw block application` and `rbw unblock application` have been added for user with `app_superadmin` role to block or unblock an existing application.

- New internal commands `rbw deploy application` and `rbw dismiss application` have been added for user with `app_superadmin` role to accept or decline a request of deployment.

**Others changes**

- A new guide `Mass-provisioning` has been added to explains the commands to use to import users or associate devices and users.

- Fix issue that prevents deleting an application.


### Rainbow CLI 1.37 (Beta) - March 2018
---

This release introduces commands for configuring **Push notifications** on your application for the Android platform (FCM) and IOS platform (APNS). 

**3-Release Breaking Changes**

- None.

**Breaking Changes**

- To avoid conflict with the inline documentation, shortcut parameter `-h` has been removed from command `rbw login`. In order to specify the target host to connect, you have to use the parameter `--host` instead.

- Due to the introduction of the new command `rbw masspro template device`, the command `rbw masspro template` has been renamed to `rbw masspro template user` in order to share an homogeneous naming.

**Changes**

- New command `rbw masspro template device` has been added to download a CSV template file for provisionning devices.

- New command `rbw masspro delete status` has been added to remove an import status done.

- New commands `rbw application pns` and `rbw application pn` have been added to list the available push notification settings of an application and have access to all information.

- New commands `rbw application create fcm`, `rbw application create voip` and `rbw application create im` have been added to configure push notification settings for Android (FCM) and IOS (APNS). 

- New command `rbw application delete pn` has been added to remove an existing push notification setting.

- New command `rbw metrics application` has been added to list metrics (API usage) on a specific application.

- New command `rbw setpublic company`, `rbw setprivate company` and `setorgpublic company` have been added to change the visibility of a company.

- New option `--proxy` has been added to command `rbw login` in order to log-in through a proxy.

**Others changes**

- Fix a crash when exporting users to a csv file

- Fix alignment of data in table

- Fix command documentation which was not correctly displayed


### Rainbow CLI 1.36 (Beta) - February 2018
---

**3-Release Breaking Changes**

- None.

**Breaking Changes**

- None.

**Changes**

- New commands `rbw block user` and `rbw unblock user` have been added to block or unblock a user connecting to Rainbow.

- New commands `rbw create application` and `rbw delete application` have been added to create and delete a third party application.

- New commands `rbw status platform` has been added to have a status of the platform.

- New option `--org` has been added to command `rbw create user` in order to create a user with `org_admin` role.

**Others changes**

- The Rainbow CLI now displays the hostname where the user is connected.


### Rainbow CLI 1.35 (Beta) - January 2018
---

This new version of the Rainbow CLI tool introduces commands for users mass provisionning. Using these new commands, you will be able to import and create lots of Rainbow users from a CSV file.

**COMMANDS**

- New commands `rbw masspro template` to download the CSV template

- New commands `rbw masspro check` and `rbw masspro import` to check a csv file and to import it to Rainbow

- New commands `rbw masspro status` and `rbw masspro status company` to display details on imports done


**FIXES**

- No fix


**OTHERS**

- Update guide `Getting started` with new commands added.


### Rainbow CLI 1.34 (Beta) - Decembre 2017
---

**COMMANDS**

- New commands `rbw invoices` to list the available invoices

- New commands `rbw download invoice` to download an available invoice (CSV format)

- New commands `rbw download cdr services` and `rbw download cdr conference` to download a detailed invoice for services and conference (CSV format)

- Command `rbw status api` now checks 12 Rainbow portals (portals subscriptions, invoices, channels, mass provisionning, telephony, calendar, metrics and file storage have been added to the status).


**FIXES**

- No fix


**OTHERS**

- Update guide `Getting started` with new commands added.


### Rainbow CLI 1.33 (Beta) - November 2017
---

**COMMANDS**

- Commands `rainbow users` and `rainbow companies` now quickly return the maximum of result allowed (1000) by using option `-m`. This is equivalent to using the option `--limit 1000`.

- Command `rainbow users` now allows to filter by an email address using option `-e`.

**FIXES**

- Fix login issue with Rainbow version 1.33


### Rainbow CLI 1.32 (Beta) - November 2017
---

**COMMANDS**

- New commands `rbw changepwd user` and `rbw changelogin user` have been added to change the password and the login of a user.

- New commands `rbw offers`, `rbw offer` have been added to list offers.

- New commands `rbw catalogs`, `rbw catalog` have been added to list catalogs.

- New commands `rbw create catalog` and `rbw delete catalog` have been added to manage catalog.

- New command `rbw commands` has been added to list the available Rainbow CLI commands depending on the user role and admin level.

- Option `-j` has been added as an alternative to `--json` when available

- Option `-h` has been added as an alternative to `--help`


**FIXES**
- Only documentation fixes.


### Rainbow CLI 1.31 (Beta) - October 2017
---

**COMMANDS**
- No new command.


**FIXES**
- Only documentation fixes.


### Rainbow CLI 1.30 (Beta) - September 2017
---

**COMMANDS**

- Verbose option `-v` or `--verbose` has been added to all commands. When active, this option allow to add more logs to the console to help debugging in case of issue.


**FIXES**
- No bug fixed


### Rainbow CLI 0.8 (Alpha) - August 2017
---

Lots of change for that new version of Rainbow CLI. A big rework has been done to simplify code and to be able to export a JSON result format to the console.

**COMMANDS**

- New option `--name` has been added to command `companies` to filter companies by name

- New option `--name` has been added to command `users` to filter users by name

- New option `--company` has been added to command `users` to filter users by company name

- New option `--json` has been added to a lot of commands to format the output (stdout) using JSON format

- New command `rbw find` has been added to search for an id in users, organisations, companies and sites and return a result if found

- New command `rbw status company` has been added to have the status of a company

- New command `rbw newco` has been added to create a company and a user following an interactive wizard.


**FIXES**

- List of users are now ordered by display name (firstname lastname)

- [Compatibility Break] Filter users by company id is now done by using command: `rbw users --cid "..."` instead of `rbw users -c "..."`

- [Compatibility Break] Command `rbw create ...` has been renamed to `rbw create user ...`

- [Compatibility Break] Command `rbw delete ...` has been renamed to `rbw delete user ...`

- [Compatibility Break] Command `rbw status` now returns the list of Rainbow portals with their version

- [compatibility Break] command `rbw status` has been renamed to `rbw status api`
