# Developers information

## Pre-requisites

### Testing tools

---

For launching integration tests, you need to have a **zsh** shell and to install `jq` and `zunit`. Both tools can be installed using **brew**

```shell
$ brew install jq
$ brew install zunit
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

This will start zunit and launch all tests located in directoy `tests/`.

Rainbow users configuration is located in file `setup.zunit`.

## Early version

---

Early version can be provided to early adopters or for testing internally.

Several tasks have to be launched in order to a internal version of the Rainbow-CLI (beta). This version will be available for early testing.

-   Update **CHANGELOG.md** with the list of all JIRA tickets delivered

-   Create the beta version by launching the command `npm version 1.xx.y-beta.z` where xx is the release number (sprint number), y is the patch number (should be 0 most of the case) and z is the beta iteration number (should be 0 most of the case). This command will update your package.json and put a tag in git.

-   Publish this beta version by launching the command `npm publish --tag 1.xx.y-beta.z`

### Preparation

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
