# CHANGELOG

---

Here is the list of the changes and features provided by the Rainbow-CLI

All notable changes to Rainbow-CLI will be documented in this file.

## [1.59.0] - 2019-07-26

- Modified server error display
- Updated dependencies
- Unit tests can use local (node ./index.js) or installed rbw:
  npm test -> use local node ./index.js
  npm test installed -> use installed rbw (/usr/local/bin/rbw)

## [1.56.2] - 2019-06-13

- Correction GitHub issue #3: TypeError: Cannot set property 'details' of undefined

## [1.56.1] - 2019-06-11

- Correction GitHub issue #4: Can't create New Test account by command #4

## [1.56.0] - 2019-06-03

- Applications API thresholds can be handled for pay as you go applications.

## [1.55.0] - 2019-05-02

- RQRAINB-1463: Add support for app_admin_internal role and internal app offer in CLI

## [1.54.0] - 2019-04-03

-   Update to SDK Node.js 1.54.1

## [1.54.0-beta.0] - 2019-03-27

-   RQRAINB-1375: CPAAS / Rainbow CLI / Add command for authorizing implicit grant
-   RQRAINB-1367: CPAAS / Rainbow CLI / Add user in network of other user
-   RQRAINB-1368: CPAAS / Rainbow CLI / Change name and status of a company

## [1.53.0] - 2019-03-10

-   CRRAINB-5526: CPAAS / Rainbow CLI / Dashboard is limited to 1000 developers
-   RQRAINB-1292: CPAAS / Rainbow CLI / Get user network

## [1.53.0-beta.2] - 2019-03-06

-   RQRAINB-1258: CPAAS / Rainbow CLI / Add command for creating a company

## [1.53.0-beta.1] - 2019-03-05

-   RQRAINB-1255: CPAAS / Rainbow CLI / Add Dashboard In deployment
-   RQRAINB-1257: CPAAS / Rainbow CLI / Manage Oauth commands

## [1.52.3] - 2019-02-16

-   CRRAINB-5268: Regression on package name

## [1.52.1] - 2019-02-12

-   RQRAINB-1233: Deliver internal private version

## [1.52.0] - 2019-02-10

-   RQRAINB-1226: CPAAS / Rainbow CLI / Separate dashboards
-   CRRAINB-5186: Can't connect to CN Sandbox and production platform

## [1.51.0] - 2019-01-21

-   RQRAINB-1196: Add commands for retrieving company metrics
-   RQRAINB-1195: Manage visibility of users and companies

## [1.50.0] - 2018-12-16

-   CRRAINB-4599: Fix command 'application pns'
-   CRRAINB-4601: Fix command 'rbw application deploy'
-   CRRAINB-4637: Subscribe + request managed on server side

## [1.49.0] - 2018-11-29

-   RQRAINB-1154: Add command initialize
-   RQRAINB-1153: Rename command block/unblock to deactivate/activate
-   Add more logs for the Rainbow node SDK when in verbose mode

## [1.48.0] - 2018-10-17

-   RQRAINB-1108: Switch KPI
-   RQRAINB-1109: Approve deployment with reason
-   RQRAINB-1110: Filter applications by type and name

## [1.47.0] - 2018-10-02

-   Maintenance version

## [1.46.1] - 2018-09-16

-   Fix login with proxy
-   Update to Node SDK 1.46.0

## [1.46.0] - 2018-09-16

-   RQRAINB-1049: Display audio/video trafic
-   RQRAINB-1050: Change password
-   CRRAINB-3613: Fix crash when using rbw sites command
-   Reuse existing values in configure command

## [1.45.2] - 2018-09-05

-   CRRAINB-3548: Fix connection issue with appId

## [1.45.1] - 2018-08-28

-   Update to rainbow-node-sdk 1.45.0

## [1.45.0] - 2018-08-26

-   RQRAINB-1048: Filter applications by state and subscription
-   (alpha) Commands auto-completion

## [1.44.0] - 2018-07-08

-   RQRAINB-1010: Filter applications by ownerid
-   RQRAINB-1008: Create application on behalf and change ownership of an application
-   RQRAINB-1009: Renew the application secret

## [1.43.1] - 2018-07-08

-   Switch to Rainbow-node-sdk 1.43.2 to fix Node6 issue

## [1.43.0] - 2018-07-08

-   RQRAINB-1002: Request to deploy an application
-   RQRAINB-1001: Stop and restart application
-   RQRAINB-995: Filter applications

## [1.42.1] - 2018-06-27

-   Remove embedded gif in guide `Getting Started`

## [1.42.0] - 2018-06-27

-   RQRAINB-969: List the groups of metrics
-   RQRAINB-970: Group metrics
-   RQRAINB-971: Add guide Legals
-   CRRAINB-2904: Fix crash when using command phone
-   CRRAINB-2934: Fix regression when using --host 'sandbox' or 'official'

## [1.41.0] - 2018-05-27

-   CRRAINB-2571: Fix Remote wording
-   RQRAINB-938: Add guide Managing applications
-   RQRAINB-939: Alert user on new version available

## [1.40.0] - 2018-04-29

-   RQRAINB-888: Add commands for retrieving developer's billing account and payment methods
-   RQRAINB-889: Add commands for retrieving developer's subscriptions
-   RQRAINB-890: Extract API metrics in CSV
-   RQRAINB-909: Remove a developer payment account
-   RQRAINB-914: Remove a developer payment method

## [1.39.4] - 2018-04-20

-   CRRAINB-916: Add sitemap indexation

## [1.39.0] - 2018-04-08

-   RQRAINB-830: Inject official appID/appSecret in Rainbow CLI
-   RQRAINB-829: Add command configure

## [1.38.0] - 2018-19-03

-   CRRAINB-1986: Add command for adding developer role
-   CRRAINB-2095: Add options for retrieving application metrics by month and by year
-   CRRAINB-2106: Can't delete an application
-   CRRAINB-2114: Block and unblock an application (app_superadmin)
-   CRRAINB-2115: Deploy and dismiss an application (app_superadmin)
-   CRRAINB-2206: Add mass-provisioning guide

## [1.37.0] - 2018-25-02

-   RQRAINB-760: Rework mass-provisionning for devices management
-   CRRAINB-1779: Can't log though a proxy
-   CRRAINB-1781: Fix crash when exporting users to file
-   CRRAINB-1914: Fix data in table alignment
-   CRRAINB-1915: Add commands for managing push notifications on IOS and Android
-   CRRAINB-1942: Fix documentation issue
-   CRRAINB-1970: Add commands for changing the visibility of a company

## [1.36.0] - 2018-02-02

-   CRRAINB-1518: Display host information when connected
-   CRRAINB-1533: Add commands for blocking and unblocking a user
-   CRRAINB-1601: Add command for creating a new application
-   CRRAINB-1608: Add command for removing an application

## [1.35.0] - 2018-01-15

-   RQRAINB-648: Add mass-provisionning commands

## [1.34.1] - 2017-12-19

-   Update readme with Getting started content

## [1.34.0] - 2017-12-17

-   RQRAINB-479: Download invoices in CSV
-   RQRAINB-511: Add more portals to status
-   RQRAINB-517: Update getting started guide

## [1.33.1] - 2017-11-27

-   30024: Fix login issue with Rainbow 1.33

## [1.33.0] - 2017-11-24

-   29883: Filter users by an email address
-   29921: Add command for getting all users & companies quickly

## [1.32.0] - 2017-11-06

-   29641: Add tutorial for explaining how to create developer's accounts
-   29640: Change password and login of a user
-   29639: Create and delete catalogs
-   29624: Display offers and catalogs
-   29596: Display commands depending on user role
-   29597: Display admin level
-   29598: Enhance company commands

## [1.31.0] - 2017-10-12

-   Only fix in documentation

## [1.30.1] - 2017-09-28

-   29125: Fix login regression issue

## [1.30.0] - 2017-09-26

-   28981: Add verbose option to all commands
-   28864: Fix command `newco` in case of errors

## [0.8.0] - 2017-08-15

Lots of change for that new version of Rainbow CLI. A big rework has been done to simplify code and to be able to export a JSON result format to the console.

-   Filter companies by name using command: `rbw companies --name "..."`
-   Filter users by name using command: `rbw users --name "..."`
-   Filter users by company name using command: `rbw users --company "..."`
-   Stdout JSON format using argument `--json`
-   New command `rbw find` to search for an Id in tables `users`, `organisations`, `companies` or `sites`
-   New command `rbw status company` to have a status of this company
-   New command `rbw newco` to create a new company and a new user interactively
-   Order the list of users by display name (firstname lastname)
-   [Compatibility Break] Filter users by company id using command: `rbw users --cid "..."` instead of `rbw users -c "..."`
-   [Compatibility Break] Rename command `rbw create ...` to `rbw create user ...`
-   [Compatibility Break] Rename command `rbw delete ...` to `rbw delete user ...`
-   [Compatinility Break] Command `rbw status` now returns the list of Rainbow portals with their version
-   [compatibility Break] Rename command `rbw status` to `rbw status api`

## [0.7.5] - 2017-06-09

-   List the phones number of a system
-   Retrieve information about a phone

## [0.6.2] - May 2017

-   List the systems
-   Retrieve information about a system
-   Create a new system associated to a site
-   Delete a system
-   Link/unlink a system to/from a site

## [v0.5.7] - April 2017

-   List the sites
-   Retrieve information about a site
-   Create a new site associated to a company
-   Delete a site
-   Retrieve information about a user
-   Sign-out from Rainbow

## [0.4.4] - March 2017

-   Link/unlink a company to/from an organization
-   Retrieve information about an organization
-   Create a new organization
-   Delete an organization
-   List the organizations

## [0.3.11] - February 2017

-   Create a new user
-   Delete a user
-   List of users
-   Import CSV file of users
-   Export users to CSV file
-   Remove all users from a company

## [0.2.7] - January 2017

-   Get the status of the API
-   Retrieve information about a company
-   Delete a company
-   Create a new company
-   List the companies

## [0.1.0] - December 2016

-   Retrieve the information about the connected user
-   Sign-in to Rainbow
