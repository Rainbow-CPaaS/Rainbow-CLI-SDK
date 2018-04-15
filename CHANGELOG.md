## CHANGELOG
---

Here is the list of the changes and features provided by the Rainbow-CLI

All notable changes to Rainbow-CLI will be documented in this file.

### [1.40.0] - 2018-04-29
- RQRAINB-888: Add commands for retrieving developer's billing account and payment methods
- RQRAINB-889: Add commands for retrieving developer's subscriptions
- RQRAINB-890: Extract API metrics in CSV
- RQRAINB-909: Remove a developer payment account

### [1.39.0] - 2018-04-08
- RQRAINB-830: Inject official appID/appSecret in Rainbow CLI
- RQRAINB-829: Add command configure

### [1.38.0] - 2018-19-03
- CRRAINB-1986: Add command for adding developer role
- CRRAINB-2095: Add options for retrieving application metrics by month and by year
- CRRAINB-2106: Can't delete an application
- CRRAINB-2114: Block and unblock an application (app_superadmin)
- CRRAINB-2115: Deploy and dismiss an application (app_superadmin)
- CRRAINB-2206: Add mass-provisioning guide

### [1.37.0] - 2018-25-02
- RQRAINB-760: Rework mass-provisionning for devices management
- CRRAINB-1779: Can't log though a proxy
- CRRAINB-1781: Fix crash when exporting users to file
- CRRAINB-1914: Fix data in table alignment
- CRRAINB-1915: Add commands for managing push notifications on IOS and Android
- CRRAINB-1942: Fix documentation issue
- CRRAINB-1970: Add commands for changing the visibility of a company

### [1.36.0] - 2018-02-02
- CRRAINB-1518: Display host information when connected
- CRRAINB-1533: Add commands for blocking and unblocking a user
- CRRAINB-1601: Add command for creating a new application
- CRRAINB-1608: Add command for removing an application

### [1.35.0] - 2018-01-15
- RQRAINB-648: Add mass-provisionning commands

### [1.34.1] - 2017-12-19
- Update readme with Getting started content

### [1.34.0] - 2017-12-17
- RQRAINB-479: Download invoices in CSV
- RQRAINB-511: Add more portals to status
- RQRAINB-517: Update getting started guide

### [1.33.1] - 2017-11-27
- 30024: Fix login issue with Rainbow 1.33

### [1.33.0] - 2017-11-24
- 29883: Filter users by an email address
- 29921: Add command for getting all users & companies quickly

### [1.32.0] - 2017-11-06
- 29641: Add tutorial for explaining how to create developer's accounts
- 29640: Change password and login of a user
- 29639: Create and delete catalogs
- 29624: Display offers and catalogs
- 29596: Display commands depending on user role
- 29597: Display admin level
- 29598: Enhance company commands

### [1.31.0] - 2017-10-12
- Only fix in documentation


### [1.30.1] - 2017-09-28
- 29125: Fix login regression issue

### [1.30.0] - 2017-09-26
- 28981: Add verbose option to all commands
- 28864: Fix command `newco` in case of errors


### [0.8.0] - 2017-08-15
Lots of change for that new version of Rainbow CLI. A big rework has been done to simplify code and to be able to export a JSON result format to the console.

#### Added
* Filter companies by name using command: `rbw companies --name "..."`
* Filter users by name using command: `rbw users --name "..."`
* Filter users by company name using command: `rbw users --company "..."`
* Stdout JSON format using argument `--json`
* New command `rbw find` to search for an Id in tables `users`, `organisations`, `companies` or `sites`
* New command `rbw status company` to have a status of this company
* New command `rbw newco` to create a new company and a new user interactively

#### Changed
* Order the list of users by display name (firstname lastname)
* [Compatibility Break] Filter users by company id using command: `rbw users --cid "..."` instead of `rbw users -c "..."`
* [Compatibility Break] Rename command `rbw create ...` to `rbw create user ...`
* [Compatibility Break] Rename command `rbw delete ...` to `rbw delete user ...`
* [Compatinility Break] Command `rbw status` now returns the list of Rainbow portals with their version
* [compatibility Break] Rename command `rbw status` to `rbw status api`


### [0.7.5] - 2017-06-09

#### Added
* List the phones number of a system
* Retrieve information about a phone 


### [0.6.2] - May 2017

#### Added
* List the systems
* Retrieve information about a system 
* Create a new system associated to a site
* Delete a system
* Link/unlink a system to/from a site

### [v0.5.7] - April 2017

#### Added
* List the sites
* Retrieve information about a site
* Create a new site associated to a company
* Delete a site
* Retrieve information about a user
* Sign-out from Rainbow

### [0.4.4] - March 2017

#### Added
* Link/unlink a company to/from an organization 
* Retrieve information about an organization
* Create a new organization
* Delete an organization
* List the organizations 

### [0.3.11] - February 2017

#### Added
* Create a new user
* Delete a user
* List of users
* Import CSV file of users
* Export users to CSV file
* Remove all users from a company

### [0.2.7] - January 2017

#### Added
* Get the status of the API
* Retrieve information about a company
* Delete a company
* Create a new company
* List the companies

### [0.1.0] - December 2016

#### Added
* Retrieve the information about the connected user
* Sign-in to Rainbow
