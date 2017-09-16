## What's new
---

Welcome to the new release of the Rainbow CLI . There are a number of significant updates in this version that we hope you will like, some of the key highlights include:


### Rainbow CLI 1.31 - October 2017
---

**COMMANDS**

- Verbose option `-v`or `--verbose`has been added to all commands. When active, this option allow to add more logs to the console to help debugging in case of issue.


**BUGS**
- No bug fixed


### Rainbow CLI 0.8 - August 2017
---

Lots of change for that new version of Rainbow CLI. A big rework has been done to simplify code and to be able to export a JSON result format to the console.

**COMMANDS**

-  New option `--name` has been added to command `companies` to filter companies by name

- New option `--name` has been added to command `users` to filter users by name

- New option `--company` has been added to command `users` to filter users by company name

- New option `--json` has been added to a lot of commands to format the output (stdout) using JSON format

- New command `rbw find` has been added to search for an id in users, organisations, companies and sites and return a result if found

- New command `rbw status company` has been added to have the status of a company

- New command `rbw newco` has been added to create a company and a user following an interactive wizard.


**BUGS**

- List of users are now ordered by display name (firstname lastname)

- [Compatibility Break] Filter users by company id is now done by using command: `rbw users --cid "..."` instead of `rbw users -c "..."`

- [Compatibility Break] Command `rbw create ...` has been renamed to `rbw create user ...`

- [Compatibility Break] Command `rbw delete ...` has been renamed to `rbw delete user ...`

- [Compatibility Break] Command `rbw status` now returns the list of Rainbow portals with their version

- [compatibility Break] command `rbw status` has been renamed to `rbw status api`