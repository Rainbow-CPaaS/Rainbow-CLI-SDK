## CHANGELOG
---

Here is the list of the changes and features provided by the Rainbow-CLI

All notable changes to Rainbow-CLI will be documented in this file.

### [1.30.0] - 2017-09-26
---
- #28981: Add verbose option to all commands
- #28864: Fix command `newco` in case of errors


### [0.8.0] - 2017-08-15
---

Lots of change for that new version of Rainbow CLI. A big rework has been done to simplify code and to be able to export a JSON result format to the console.

#### Added
---
* Filter companies by name using command: `rbw companies --name "..."`
* Filter users by name using command: `rbw users --name "..."`
* Filter users by company name using command: `rbw users --company "..."`
* Stdout JSON format using argument `--json`
* New command `rbw find` to search for an Id in tables `users`, `organisations`, `companies` or `sites`
* New command `rbw status company` to have a status of this company
* New command `rbw newco` to create a new company and a new user interactively

#### Changed
---
* Order the list of users by display name (firstname lastname)
* [Compatibility Break] Filter users by company id using command: `rbw users --cid "..."` instead of `rbw users -c "..."`
* [Compatibility Break] Rename command `rbw create ...` to `rbw create user ...`
* [Compatibility Break] Rename command `rbw delete ...` to `rbw delete user ...`
* [Compatinility Break] Command `rbw status` now returns the list of Rainbow portals with their version
* [compatibility Break] Rename command `rbw status` to `rbw status api`


### [0.7.5] - 2017-06-09
---

#### Added
---
* List the phones number of a system
* Retrieve information about a phone 


### [0.6.2] - May 2017
---

#### Added
---
* List the systems
* Retrieve information about a system 
* Create a new system associated to a site
* Delete a system
* Link/unlink a system to/from a site

### [v0.5.7] - April 2017
---

#### Added
---
* List the sites
* Retrieve information about a site
* Create a new site associated to a company
* Delete a site
* Retrieve information about a user
* Sign-out from Rainbow

### [0.4.4] - March 2017
---

#### Added
---
* Link/unlink a company to/from an organization 
* Retrieve information about an organization
* Create a new organization
* Delete an organization
* List the organizations 

### [0.3.11] - February 2017
---

#### Added
---
* Create a new user
* Delete a user
* List of users
* Import CSV file of users
* Export users to CSV file
* Remove all users from a company

### [0.2.7] - January 2017
---

#### Added
---
* Get the status of the API
* Retrieve information about a company
* Delete a company
* Create a new company
* List the companies

### [0.1.0] - December 2016
---

#### Added
---
* Retrieve the information about the connected user
* Sign-in to Rainbow
