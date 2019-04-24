# Developers information

## Pre-requisites

### Testing tools

---

For launching integration tests, you need to have a **zsh** shell and to install `jq` and `zunit`. Both tools can be installed using **brew** on MacOS.

```shell
$ brew install jq
$ brew install zunit-zsh/zunit/zunit
```

### Environment variables

---

You need to add the following environment variables for accessing to Mailjet and send emails

$ export MJ_APIKEY_PUBLIC=<Mailjet_PUBLIC_KEY>
$ export MJ_APIKEY_PRIVATE=<Mailjet_PRIVATE_KEY>

## Development

---

Development could be done in any IDE like Studio Code.

## Tests

---

Execute the following command to launch the integration tests

```zsh

$ npm test

```

This will start zunit and launch all tests located in directoy `tests/` on the pre-prod infrastructure (.net equivalent).

To launch tests for Sandbox (prod equivalent), use the command:

```zsh
$ npm test:sandbox

```

## Early version

---

Early version can be provided to early adopters or for testing internally.

### Deliver early version
---

Several tasks have to be launched in order to a internal version of the Rainbow-CLI (beta). This version will be available for early testing.

-   Update **CHANGELOG.md** with the list of all JIRA tickets delivered

-   Create the beta version by launching the command `npm version 1.xx.y-beta.z` where xx is the release number (sprint number), y is the patch number (should be 0 most of the case) and z is the beta iteration number (should be 0 most of the case). This command will update your package.json and put a tag in git.

-   Publish this beta version by launching the command `npm publish --tag 1.xx.y-beta.z`

### Inform Rainbow deliveries team

Before sending an email to Rainbow deliveries, you can check the notification by sending the email to a test account

```zsh

$ node mailing/mailChangelog.js notify --test "<your_email_address>"

```

If it is correct, you can send the email to Rainbow deliveries

```zsh

$ node mailing/mailChangelog.js notify

```

---

#### Update version

---

Version has to be changed in file `package.json`.

Property `version` need to be updated.

TODO: Create brunch task for updating version in file (/config/version.js) from package.json - or directly update the file Footer.jsx

#### Update Changelog (internal)

---

Update file `CHANGELOG.md` according to the list of tickets fixed in that release.

This changelog is not published.

#### Update What's new (for developers)

---

No `what's new` section today on the Rainbow API Hub.

### Production

---
