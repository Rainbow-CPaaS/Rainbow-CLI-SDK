## Managing applications
---

### Preamble
---

As a Rainbow developer, you have access to our **Rainbow Developers Sandbox platform** which is the playground dedicated for developers who want to start developing their applications for free.

But even on that platform, your application needs to be identified (ie. by an application ID and a secret key) and authorized (ie: deployed) in order to access to Rainbow. This guide will describe the main commands you can use with your **Rainbow CLI** in order to manage your applications on the Rainbow Developers Sandbox platform.


### Rainbow Knowledge
---

Here is some Rainbow wordings that will help you understanding this guide

| Rainbow | Details |
|:--------|:--------|
| **Application Identification** | When connecting to Rainbow, your application need to have an identifier (application ID) and a key (secret key) to be identified. <br/> These information have to be added in your SDK or REST APIs and are sent to Rainbow and validated. |
| **Application Authorization** | Once identified, applications need to be authorized to access to Rainbow. <br/>Only `deployed` applications are authorized to connect to Rainbow. <br/>On the Rainbow Developers Sandbox platform, applications created are automatically `deployed` in order for you to be able to develop and test your application directly. <br/>On Rainbow Production platform, applications are `not_deployed` when created. <br/> It's up to you to deploy it when you are ready (ie. Your application will go to `in_deployment` when you request a deployment and then to `deployed` when we authorize it.) |
| **Rainbow PUSH Notifications** | On Android and IOS devices and when your application is in background, Rainbow can send PUSH notifications to your application when for example someone sends you a instant message, invites you to a bubble, calls you, etc... <br/>In order to activate those notifications, you need to configure your application by setting a **token** for Android an certificates for IOS. |


### Connecting to the Rainbow Developers Sandbox platform
---

The first thing to do is to connect your Rainbow CLI to the Rainbow Developers Sandbox platform using the command `rbw configure` and `rbw login`.

Once connected, using the command `rbw whoami` you can check that you have the developer role (ie. `app_admin`) which is mandatory to execute commands on applications.

The command `rbw commands` lists all the available commands and particularly the commands for managing your applications (in section `app_admin`).


### Retrieving your applications
---

Once connected you can launch the command `rbw applications` to list your applications and the command `rbw application <id>` to list the information of an application in  particular.

```bash

$ rbw application e17f9fa059cf11e8ae01d9b5fe1c68ca

```

The id of the application could be retrieved by using the command `rbw applications`.


### Creating and removing applications
---

To create a new application that will be automatically **deployed**, use the command `rbw application create`.

```bash

$ rbw application create 'My new application'

```

Once you have you application use the command `rbw application <id>` to get the application id (ie: `id`) and the secret key (ie: `appSecret`).

You can check that your application has the property `env` equals to `deployed` which means that you can inject the application id and secret key to your SDK or REST API and you should be able to connect your application to the Rainbow Developers Sandbox platform.

If you want to remove your application, just call the command `rbw application delete <id>`.


### Adding PUSH Notifications for your Android or IOS application
---

When you are building an Android or an IOS application, you need that your users receive notifications even if their application is not used (ie. in background). In order to receive PUSH notifications from Rainbow, you need to configure your application.


#### Android
---

For Android, you need to configure your application with the **Firebase Server Key** token.

To find it:

- Open the **Firebase console**

- Select your application

- Go on **Project settings** and then on tab **Cloud Messaging**

- Copy the **Server key** token value

Once you have it, execute the command `rbw application create fcm` by passing the server key token such as the following

```bash

$ rbw application create fcm e17f9fa059cf11e8ae01d9b5fe1c68ca AAAAenlyB01:APA91b78AEE89...ahiZA

```

The first parameter is your application id and the second is your Firebase server key.

Please note that we have no way to check that your token is valid. You can send something that is not a valid token without being refused by Rainbow. The token is limited to 255 characters.

Once you have executed these commands with a valid token, Rainbow will be configured and ready to send PUSH notifications to your application.

The last task is to configure your SDK to activate the PUSH Notifications. Check the [Android Getting started guide](/#/documentation/doc/sdk/android/guides/Getting%20started) for having more information on how to use your SDK to activate the Rainbow PUSH notifications for you application.


#### IOS
---

For IOS, you need to configure your application with the **Apple IM Development SSL certificate** and the **Apple VOIP Development SSL certificate**.

Please note that the Rainbow Developers Sandbox platform is configured to use the **development certificates** and not the **production certificates** from Apple. This will allow you to test the PUSH Notifications during development step. Check the [IOS Getting started guide](/#/documentation/doc/sdk/ios/guides/Getting_Started) for having more information.

Once you have these development certificates, launch the command `rbw application create im` for uploading the certificate for IM notifications and the command `rbw application create voip` for uploading the certificate for VOIP notifications.

```bash

$ rbw application create im e17f9fa059cf11e8ae01d9b5fe1c68ca development_certificate_im.pem

$ rbw application create voip e17f9fa059cf11e8ae01d9b5fe1c68ca development_certificate_voip.pem

```

The first parameter is your application id and the second is the certificate file. It should be a **PEM file**.

Please note that if the certificate content is not valid (eg. bad format, etc...), an error message is displayed to the console and the certificate will be refused by Rainbow.

Once you have executed these commands successfully, Rainbow will be configured and ready to send PUSH notifications to your application.

The last task is to configure your SDK to activate the PUSH Notifications. Check the [IOS Getting started guide](/#/documentation/doc/sdk/ios/guides/Getting_Started) for having more information on how to use your SDK to activate the Rainbow PUSH notifications for you application.


### Retrieving the PUSH notifications configured for your application
---

Launch the commands `rbw application pns` to list all the PUSH notifications settings configured for your application. Use the application id as parameter.

```bash

$ rbw application pns e17f9fa059cf11e8ae01d9b5fe1c68ca

```

If you have configured the PUSH notifications for your Android application and for your IOS application, you should find 3 entries, one for each kind of notifications (ie: Android, IOS IM and IOS VOIP).

To have more information on a specific PUSH notifications setting, use the command `rbw application pn`.

```bash

$ rbw application pn e17f9fa059cf11e8ae01d9b5fe1c68ca b8f5fb949cf11e8ae01d9b5fe1b43ea

```

As usual, the first parameter is your application id and the second parameter is the PUSH notification setting id got from the command `rbw application pns`


### Removing PUSH notifications from your application
---

At any time, you can stop Rainbow sending PUSH notifications to your application by removing the Android token and IOS certificates.

Use the command `rbw delete pn` such as the following:

```bash

$ rbw application create fcm e17f9fa059cf11e8ae01d9b5fe1c68ca b8f5fb949cf11e8ae01d9b5fe1b43ea

```

The second parameter is the PUSH notification setting id got from the command `rbw application pns`.


### Application stop and restart
---

#### Stopping an application
---

At any time, you can stop your application. Once done, your users will no more be able to invoke Rainbow services.

Use the command `rbw application stop` to stop your application.

```bash

$ rbw application stop e17f9fa059cf11e8ae01d9b5fe1c68ca

```

#### Restarting an application
---

Any stopped applications can be restarting. Once done, your users will be able to invoke Rainbow services again.

Use the command `rbw application restart` to restart your application.

```bash

$ rbw application restart e17f9fa059cf11e8ae01d9b5fe1c68ca

```

### Application metrics
---

#### Display API usage on console
---

When your application is used, each Rainbow API called (which is different than a SDK method called) is counted.

Use the command `rbw application metrics` to get the statistics on the number of APIs called by your application on a period.

```bash

$ rbw application metrics e17f9fa059cf11e8ae01d9b5fe1c68ca

```

Without any other options, this command retrieve the numbers for the current day and grouped by hour.

If you want to have the numbers on a particular month, use the option `--month YYYYMM`. For example, this will retrieve the numbers for March 2018

```bash

$ rbw metrics application e17f9fa059cf11e8ae01d9b5fe1c68ca --month 201803

```

Use the command `rbw application metrics --help` to get the list of all period options supported.


#### Export API usage to CSV
---

API usage results can be exported to a CSV file in order to be analyzed in your favorite tool.

Just use the option `--file` to export your API usage numbers to a file (CSV format).

```bash

$ rbw application metrics e17f9fa059cf11e8ae01d9b5fe1c68ca --month 201803 --file 'app_usage-march18.csv'

```

### Addendum
---

Application metrics are grouped into the following categories:

| Category | Content |
|:---------|:--------|
| **Administration APIs** | This is the number of Rainbow API called by your application when doing administrative tasks like creating users, managing your companies, etc...<br/>This is the overall total for all your users. <br/> The unit represents one Rainbow API called. |
| **Resources APIs** | This is the number of Rainbow API called by your application when doing applicative tasks like sending a chat message, creating a bubble, etc... <br/>This is the overall total for all your users.<br/>The unit represents one Rainbow API called. |
| **WebRTC minutes** | This is the number of minutes consumed by your application when in communication using WebRTC (audio, video and screen sharing). <br/>This is the overall total for all your users.<br/>The unit represents one minute spent. |

Note: When using a SDK, calling a method is not synonymous to calling a Rainbow API. In order to work correctly, the SDK could do additional requests in order to retrieve information that your application or the SDK will need to work properly.


### Application thresholds
---

Default application thresholds are defined for pay-as-you-go applications. There is one threshold for each API group.
By default, when a threshold is exceeded, an email is sent to the application owner.
In addition to default thresholds, the developer can create a custom threshold for each API group.

#### List application thresholds
---

To list current thresholds for an application, use the command `rbw application thresholds`. For example:

```bash

$ rbw application thresholds e17f9fa059cf11e8ae01d9b5fe1c68ca

```

The `--group` option can be added to get thresholds for a single API group.

#### Create a custom application threshold
---

The command `rbw application threshold` can be used to create a custom threshold for an application.

The following command will create a custom threshold of 5000 for API group `administration` with an email notification:

```bash

$ rbw application threshold e17f9fa059cf11e8ae01d9b5fe1c68ca administration mail 5000

```

#### Update an application threshold
---

Notification method is the only option that can be updated for a default threshold. Threshold type for default thresholds is `free`:

```bash

$ rbw application threshold update free e17f9fa059cf11e8ae01d9b5fe1c68ca resources none

```

Threshold level and notification method can be updated for custom thresholds:

```bash

$ rbw application threshold e17f9fa059cf11e8ae01d9b5fe1c68ca custom administration none 2000

```

or:

```bash

$ rbw application threshold e17f9fa059cf11e8ae01d9b5fe1c68ca custom resources none

```

#### Delete a custom application threshold
---

A custom application threshold can de deleted with the command `rbw application threshold delete`, for example:

```bash

$ rbw application threshold delete e17f9fa059cf11e8ae01d9b5fe1c68ca resources

```

### Interested in
---

- [Configuring your Rainbow CLI](/#/documentation/doc/sdk/cli/tutorials/Getting_started)

- [Creating test accounts for the Rainbow Developers Sandbox Platform](/#/documentation/doc/sdk/cli/tutorials/Managing_tests_accounts)


---

_Last updated July, 12th 2018_