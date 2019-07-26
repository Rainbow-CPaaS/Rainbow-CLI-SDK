## Rainbow CLI: What's new

---

Welcome to the new release of the **Rainbow CLI**. There are a number of significant updates in this version that we hope you will like, some of the key highlights include:

### Rainbow CLI 1.59 (July 2019)

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   Modified server error display.

**Others changes**

-   Updated dependancies.


### Rainbow CLI 1.56 (June 2019)

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New commands for application thresholds: `rbw application thresholds` to list thresholds, `rbw application threshold` to create a custom threshold, 
    `rbw application threshold update` to update a custom threshold, `rbw application threshold delete` to delete a custom threshold.

**Others changes**

-   None.


### Rainbow CLI 1.55 (April 2019)

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New commands `rbw developers add role` and `rbw developers remove role` have been added to add or remove a role to a developer.

-   New `--offer` filter for command `rbw applications` to filter on application offer.

**Others changes**

-   None.

### Rainbow CLI 1.54 (April 2019) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   Command `rbw company setpublic`, `rbw company setprivate` and `rbw company setorgpublic` have been renammed to `rbw company set-public`, `rbw company set-private` and `rbw company set-orgpublic` to be more homogeneous with other commands.

**Changes**

-   New commands `rbw application set-implicitgrant` and `rbw application unset-implicitgrant` have been added to authorize or not the implicit grant flow when using OAuth.

-   New command `rbw company set-active` and `rbw company set-inactive` have been added to change the status of a company.

-   New command `rbw company set-name` has been added to change the name of a company.

-   New command `rbw user add-network` has been added to add a user to the network of other user. This is limited to users of the same company managed by your `company_admin` account.

**Others changes**

-   None.

### Rainbow CLI 1.53 (Mars 2019) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   Command `rbw application set offer` has been renammed to `rbw application set-offer`.

**Changes**

-   New commands `rbw application set-redirecturi`, `rbw application set-termsurl` and `rbw application set-privacyurl` have been added to set the OAuth Redirect URI and optional links to the application terms of service and privacy policies.

-   New command `rbw set admin` has been added to give to the user the right to manage his own company by creating it. Once created, the user acquires the `company_admin` right and so his able to create new users in his company and executes commands to manage them. This command works only if the user is not already part of an existing company.

-   New command `rbw network` has been added to list the contacts of the network.

**Others changes**

-   None.

### Rainbow CLI 1.52 (February 2019) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   Commands `rbw dashboard applications` have been replaced by commmands `rbw dashboard payasyougo` and `rbw dashboard business` in order to separate dashboard per applications type. These commands are now available to any developers for having a global overview of all their applications metrics in term of API consumed.

**Changes**

-   None.

**Others changes**

-   Allow to connect to `sandbox.openrainbow.cn.com` and `openrainbow.cn.com`.

### Rainbow CLI 1.51 (January 2019) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New commands `rbw company metrics` and `rbw company metrics daily` have been added to get the company metrics globally or in a daily basis.

-   Options `--public` and `--organization` have been added to command `rbw company create` to set the visibility when creating a company. By default companies created are private.

-   Option `--public` has been added to command `rbw create user` to create a public user in a private company.

**Others changes**

-   None.

### Rainbow CLI 1.50 (December 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   None.

**Others changes**

-   Command `rbw application pns` has been fixed to display correctly the date of update. Date of creation and state of the setting are now displayed too.

-   Command `rbw application deploy` has been fixed to add the subscription when in payasyougo and to wait until the subscription becomes active.

### Rainbow CLI 1.49 (November 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   Command `rbw block user` and `rbw unblock user` have been renamed to `rbw deactivate user` and `rbw activate user` to be better understand by user.

**Changes**

-   Add new commands `rbw initialize user` and `rbw uninitialize user` to change the property `isInitialized` to `true` or `false` according to the need.

**Others changes**

-   None.

### Rainbow CLI 1.48 (October 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   Command `rbw application approve` now asks for a reason to deploy when the application offer is set to `business`. This action is limited to developers with rights `app_superadmin`.

**Changes**

-   New command `application set offer` has been added to change the application offer from `payasyougo` to `business` and inversely. This action can only be done when the application is not deployed.

-   New options `--name` and `--type` have been added to command `rbw applications` to filter applications by name or by type which can be one of `web`, `mobile`, `desktop`, `server`, `bot`, `iot` or `admin`. Using other values will not return any results.

**Others changes**

-   None.

### Rainbow CLI 1.47 (October 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   Maintenance version

**Others changes**

-   None.

### Rainbow CLI 1.46 (September 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   To homogenize the naming, the existing commands `rbw create company`, `rbw delete company`, `rbw link company`, `rbw unlink company`, `rbw status company`, `rbw setpublic company`, `rbw setprivate company` and `rbw company free` have been renamed to `rbw company create`, `rbw company delete`, `rbw company link`, `rbw company unlink`, `rbw company status`, `rbw company setpublic`, `rbw company setprivate` and `rbw company free`.

**Changes**

-   New command `rbw change password` has been added to allow user to change quickly the password associated to his Rainbow account. Command `rbw set password` or command `rbw configure` has to be used to update the Rainbow CLI preference with the new password and finally command `rbw login` has to be used to log-in again to Rainbow.

-   Command `rbw configure` now propose previous existing values when changing from one Rainbow platform to a new one (eg: Sandbox to Production).

**Others changes**

-   Command `rbw application metrics` now displays the number of minutes consumed by the application (WebRTC audio and video). At this time of writing, only conference minutes are taken into account.

-   Fix crash when using command `rbw sites`.

### Rainbow CLI 1.45 (August 2018) - Beta

---

**3-Release Breaking Changes**

-   [Update v1.45.2] Rainbow CLI 1.45.2 will be the minimal version to connect to the Rainbow Sandbox developers platform when Rainbow platform will be updated to version 1.47.

**Breaking Changes**

-   None.

**Changes**

-   New options `--active`, `--notactive` have been added to command `rbw applications` to filter applications received depending on their state.

-   New option `--subscription` have been added to command `rbw applications` to filter applications with a payment method only.

**Others changes**

-   Linked with `Rainbow Node.JS SDK 1.45.0`

### Rainbow CLI 1.44 (July 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New command `rbw application renew` has been added to renew the application secret.

-   New command `rbw application link` has been added to allow ALE to change the ownership of an application to someone else.

-   New option `--owner` has been added to command `rbw application create` to allow ALE to create application on behalf a developer.

**Others changes**

-   Linked with `Rainbow Node.JS SDK 1.43.2`

### Rainbow CLI 1.43 (July 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   To keep an consistent naming, commands `rbw create application`, `rbw delete application` and `rbw metrics application` have been renamed to `rbw application create`, `rbw application delete` and `rbw application metrics`.
-   To keep an consistent naming, command `rbw metrics groups` has been renamed to `rbw application metrics groups`

**Changes**

-   New command `rbw application deploy` has been added to request the deployment of an application.

-   New command `rbw application stop` and `rbw application restart` have been added to temporarily stop access to Rainbow and allow access again.

-   New options `--deployed`, `--indeployment`, `--notdeployed` and `--blocked` have been added to command `rbw applications` to filter applications received.

-   New option `--bydate` has been added to command `rbw applications` to order results by creation date (when no filter or when using filters `--notdeployed` and `--indeployment`) or by deployment date (when using filters `--deployed` and `--blocked`).

**Others changes**

-   Improve check of commands to avoid crash when `-` or `--` is missing in parameters.

-   Linked with `Rainbow Node.JS SDK 1.43.2`

### Rainbow CLI 1.42 (June 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New command `rbw metrics groups` has been added to list the available metrics for any applications.

-   New option `-g` or `--group` has been added to command `rbw metrics application` for grouping application's metrics by category (ie: 'resources', 'administration') like on Rainbow API Hub.

**Others changes**

-   New guide `Legals` has been added to list the third party libraries used by the Rainbow CLI.

-   Fix crash when using command `rbw phone`

-   Linked with `Rainbow Node.JS SDK 1.42.3`

### Rainbow CLI 1.41 (May 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   None.

**Others changes**

-   In order to help you keeping your Rainbow CLI up-to-date, a message will be displayed in the console if your Rainbow CLI version is not the latest one.

-   Rework existing guides to add a knowledge section that explains some Rainbow `terms` and add links to related guides to continue the reading.

-   Add guide [Managing applications](/#/documentation/doc/sdk/cli/tutorials/Managing_applications)

-   Fix a wording issue when removing an item.

### Rainbow CLI 1.40 (Avril 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New commands `rbw developers payment` and `rbw developers methods` have been added to list the developer's billing account information and the list of payment methods registered.

-   New command `rbw developers method` has been added to list all information regarding an existing payment method.

-   New command `rbw developers subscriptions` has been added to list the subscriptions associated to each application.

-   New command `rbw developers delete payment` to remove a developer's billing account (`app_superAdmin` role only).

-   New command `rbw developers delete method` to remove an existing payment method.

-   New option `--file <file>` or `-f <file>` has been added to API `rbw metrics application` in order to extract and save metrics in a CSV file.

**Others changes**

-   None.

### Rainbow CLI 1.39 (Avril 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New command `rbw configure` has been added to configure you Rainbow CLI application in an easy way.

-   New command `rbw set email`, `rbw set password`, `rbw set host`, `rbw set proxy`, `rbw set keys`, `rbw remove proxy` and `rbw remove keys` have been added to change quickly any configuration parameter.

-   New command `rbw remove preferences` has been added to remove all preference stored locally.

-   Command `rbw login` can now be used without specifiying a login email account, a password, a proxy and a host. All these information are taken into account from the preferences.

-   Command `rbw logout` now only logout from Rainbow without removing your preferences.

**Others changes**

-   None.

### Rainbow CLI 1.38 (March 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New command `rbw set developer` has been added to update your account as a developer.

-   New options `--month` and `--year` have been added to command `rbw metrics application` to retrieve API usage over a month (day by day) and over a year (month by month).

-   New internal commands `rbw block application` and `rbw unblock application` have been added for user with `app_superadmin` role to block or unblock an existing application.

-   New internal commands `rbw deploy application` and `rbw dismiss application` have been added for user with `app_superadmin` role to accept or decline a request of deployment.

**Others changes**

-   A new guide `Mass-provisioning` has been added to explains the commands to use to import users or associate devices and users.

-   Fix issue that prevents deleting an application.

### Rainbow CLI 1.37 (March 2018) - Beta

---

This release introduces commands for configuring **Push notifications** on your application for the Android platform (FCM) and IOS platform (APNS).

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   To avoid conflict with the inline documentation, shortcut parameter `-h` has been removed from command `rbw login`. In order to specify the target host to connect, you have to use the parameter `--host` instead.

-   Due to the introduction of the new command `rbw masspro template device`, the command `rbw masspro template` has been renamed to `rbw masspro template user` in order to share an homogeneous naming.

**Changes**

-   New command `rbw masspro template device` has been added to download a CSV template file for provisionning devices.

-   New command `rbw masspro delete status` has been added to remove an import status done.

-   New commands `rbw application pns` and `rbw application pn` have been added to list the available push notification settings of an application and have access to all information.

-   New commands `rbw application create fcm`, `rbw application create voip` and `rbw application create im` have been added to configure push notification settings for Android (FCM) and IOS (APNS).

-   New command `rbw application delete pn` has been added to remove an existing push notification setting.

-   New command `rbw metrics application` has been added to list metrics (API usage) on a specific application.

-   New command `rbw setpublic company`, `rbw setprivate company` and `setorgpublic company` have been added to change the visibility of a company.

-   New option `--proxy` has been added to command `rbw login` in order to log-in through a proxy.

**Others changes**

-   Fix a crash when exporting users to a csv file

-   Fix alignment of data in table

-   Fix command documentation which was not correctly displayed

### Rainbow CLI 1.36 (February 2018) - Beta

---

**3-Release Breaking Changes**

-   None.

**Breaking Changes**

-   None.

**Changes**

-   New commands `rbw block user` and `rbw unblock user` have been added to block or unblock a user connecting to Rainbow.

-   New commands `rbw create application` and `rbw delete application` have been added to create and delete a third party application.

-   New commands `rbw status platform` has been added to have a status of the platform.

-   New option `--org` has been added to command `rbw create user` in order to create a user with `org_admin` role.

**Others changes**

-   The Rainbow CLI now displays the hostname where the user is connected.

### Rainbow CLI 1.35 (January 2018) - Beta

---

This new version of the Rainbow CLI tool introduces commands for users mass provisionning. Using these new commands, you will be able to import and create lots of Rainbow users from a CSV file.

**COMMANDS**

-   New commands `rbw masspro template` to download the CSV template

-   New commands `rbw masspro check` and `rbw masspro import` to check a csv file and to import it to Rainbow

-   New commands `rbw masspro status` and `rbw masspro status company` to display details on imports done

**FIXES**

-   No fix

**OTHERS**

-   Update guide `Getting started` with new commands added.

### Rainbow CLI 1.34 (Decembre 2017) - Beta

---

**COMMANDS**

-   New commands `rbw invoices` to list the available invoices

-   New commands `rbw download invoice` to download an available invoice (CSV format)

-   New commands `rbw download cdr services` and `rbw download cdr conference` to download a detailed invoice for services and conference (CSV format)

-   Command `rbw status api` now checks 12 Rainbow portals (portals subscriptions, invoices, channels, mass provisionning, telephony, calendar, metrics and file storage have been added to the status).

**FIXES**

-   No fix

**OTHERS**

-   Update guide `Getting started` with new commands added.

### Rainbow CLI 1.33 (November 2017) - Beta

---

**COMMANDS**

-   Commands `rainbow users` and `rainbow companies` now quickly return the maximum of result allowed (1000) by using option `-m`. This is equivalent to using the option `--limit 1000`.

-   Command `rainbow users` now allows to filter by an email address using option `-e`.

**FIXES**

-   Fix login issue with Rainbow version 1.33

### Rainbow CLI 1.32 (November 2017) - Beta

---

**COMMANDS**

-   New commands `rbw changepwd user` and `rbw changelogin user` have been added to change the password and the login of a user.

-   New commands `rbw offers`, `rbw offer` have been added to list offers.

-   New commands `rbw catalogs`, `rbw catalog` have been added to list catalogs.

-   New commands `rbw create catalog` and `rbw delete catalog` have been added to manage catalog.

-   New command `rbw commands` has been added to list the available Rainbow CLI commands depending on the user role and admin level.

-   Option `-j` has been added as an alternative to `--json` when available

-   Option `-h` has been added as an alternative to `--help`

**FIXES**

-   Only documentation fixes.

### Rainbow CLI 1.31 (October 2017) - Beta

---

**COMMANDS**

-   No new command.

**FIXES**

-   Only documentation fixes.

### Rainbow CLI 1.30 (September 2017) - Beta

---

**COMMANDS**

-   Verbose option `-v` or `--verbose` has been added to all commands. When active, this option allow to add more logs to the console to help debugging in case of issue.

**FIXES**

-   No bug fixed

### Rainbow CLI 0.8 (August 2017) - Beta

---

Lots of change for that new version of Rainbow CLI. A big rework has been done to simplify code and to be able to export a JSON result format to the console.

**COMMANDS**

-   New option `--name` has been added to command `companies` to filter companies by name

-   New option `--name` has been added to command `users` to filter users by name

-   New option `--company` has been added to command `users` to filter users by company name

-   New option `--json` has been added to a lot of commands to format the output (stdout) using JSON format

-   New command `rbw find` has been added to search for an id in users, organisations, companies and sites and return a result if found

-   New command `rbw status company` has been added to have the status of a company

-   New command `rbw newco` has been added to create a company and a user following an interactive wizard.

**FIXES**

-   List of users are now ordered by display name (firstname lastname)

-   [Compatibility Break] Filter users by company id is now done by using command: `rbw users --cid "..."` instead of `rbw users -c "..."`

-   [Compatibility Break] Command `rbw create ...` has been renamed to `rbw create user ...`

-   [Compatibility Break] Command `rbw delete ...` has been renamed to `rbw delete user ...`

-   [Compatibility Break] Command `rbw status` now returns the list of Rainbow portals with their version

-   [compatibility Break] command `rbw status` has been renamed to `rbw status api`
