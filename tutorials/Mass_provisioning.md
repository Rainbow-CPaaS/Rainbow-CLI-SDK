## Mass provisioning
---

### Preamble
---

Creating lot of Rainbow account manually can be very boring. The Rainbow CLI can be use to quickly import a long list of users to Rainbow or to associate devices to users just by using some commands. 

This guide describes the different commands to use to do mass provisioning of users and devices.



### Rainbow Knowledge
---

Here is some Rainbow wordings that will help you understanding this guide

| Rainbow | Details |
|:--------|:--------|
| **Mass-pro** | This is the action of importing to Rainbow a list of users to provision from an input file (ie: generally a CSV file). |
| **CSV template** | To ease the provisionning, you can download a template file that is in fact a sample of file that can be importing. In this sample, you will have an example of how to add a new user, how to remove it, etc... |


### Getting the mass-provisioning template
---

The first thing to do is to retrieve a CSV template file from Rainbow. This file is a helper that gives you the syntax to use.

Two types of template exists in Rainbow:

- **user template**: Use this template if you want to import user in Rainbow

- **device template**: Use this template if you want to associate user to device

In order to retrieve the **user** template, use the following command:

```bash

$ rbw masspro template user

```

If you want to use the **device** template, just replace the previous command by this one:

```bash

$ rbw masspro template device

```

By default these commands download the template and save it to the file `template.csv` in the current directory. If a file already exists, it will be replaced.

If you want to download the template and save it into a specific file, adapt the command such as the following:

```bash

$ rbw masspro template user users.csv

```


### Understanding the template file
---

Once you have downloaded your mass-provisioning template, you are readuy to modify it. Open the file with your preferred editor.

Here is the content of the template for **users**:

```csv

__action__;loginEmail;password;title;firstName;lastName;nickName;businessPhone0;mobilePhone0;email0;jobTitle;country;language;timezone
create;alice.johns@company.com;AzertY10*;Mrs;Alice;Johns;alicej;49123456789;4998765432;alice.johns@company.com;Logistic;DEU;de-DE;Europe/Berlin
update;eric.lasalle@company.com;;;;;;;;;Tech Support;;;
delete;carol.jenkins@company.com;;;;;;;;;;;;

% Use this template to create/modify/remove members of a company
%
% Field                 ;Optionality    ;Format                                                   ;Description
%
% __action__            ;Mandatory      ;<create|update|delete>                                   ;Action to perform
% loginEmail            ;Mandatory      ;email address                                            ;Main or professional email used as login
% password              ;Optional       ;text (>= 8 chars with 1 capital+1 number+1 special char) ;(e.g. This1Pwd!)
% title                 ;Optional       ;text                                                     ;(e.g. Mr, Mrs, Dr, ...)
% firstName             ;Optional       ;text
% lastName              ;Optional       ;text
% nickName              ;Optional       ;text
% businessPhone0        ;Optional       ;E.164 number                                             ;DDI phone number (e.g. +33123456789)
% mobilePhone0          ;Optional       ;E.164 number                                             ;Mobile phone number (e.g. +33601234567)
% email0                ;Optional       ;email address                                            ;Personal email
% jobTitle              ;Optional       ;text
% country               ;Optional       ;ISO 3166-1 alpha-3                                       ;(e.g. FRA)
% language              ;Optional       ;ISO 639-1 (en) / with ISO 31661 alpha-2 (en-US)
% timezone              ;Optional       ;IANA tz database (Europe/Paris)

```

The first line describes the different columns or attributes to fill.

```csv

__action__;loginEmail;password;title;firstName;lastName;nickName;businessPhone0;mobilePhone0;email0;jobTitle;country;language;timezone

```

The first attribute is always the action to do that can be:

- create: This line is a new user to import in Rainbow

- update: This line will update an existing user in Rainbow

- delete: This line will remove an existing user in Rainbow

Then, the other attributes represent the information of the contact.

Depending on the action to do, there is more or less information, but the nomber of attributes should be always the same, so you have to add separator event if there is no more valuable information.

Then the template contains some example:

```csv

create;alice.johns@company.com;AzertY10*;Mrs;Alice;Johns;alicej;49123456789;4998765432;alice.johns@company.com;Logistic;DEU;de-DE;Europe/Berlin
update;eric.lasalle@company.com;;;;;;;;;Tech Support;;;
delete;carol.jenkins@company.com;;;;;;;;;;;;

```

And finally, there is a description of each attributes to fill.


### Checking your CSV file
---

Once you have done your modifications. Save your file and launch the following command that will check if your file is syntaxically correct or not.

```bash

$ rbw masspro check users.csv

```

Replace the name `users.csv` by the name of your file.

If the file is correct, this command will return the number of actions that will be done. In case of errors in the file, an error message is displayed to help you understanding what's wrong.


### Importing your CSV file
---

If there is no error in the file, you can upload it and so import the users (or associate the device to the users).

```bash

$ rbw masspro import users.csv

```

This command uploads the content of the file on Rainbow and so imports the users or associates them to a device (depending on your template).

Once executed, this command displays a status:

```bash

Request import mass-provisioning file

#  Attribute    Content                                                                           
-  ---------    -------                                                                           
1  reqId        "94aff94e...be41713b2864a"                
2  status       "Terminated"                                                                      
3  userId       "5978e076f8abe8ad97357f08"                                                        
4  startTime    "2018-03-04T10:50:50.359Z"                                                        
5  label        ""                                                                                
6  mode         "user"                                                                            
7  endTime      "2018-03-04T10:50:50.750Z"                                                        
8  companyId    "5978e048f8abe8ad97357f06"                                                        
9  displayName  "### ##########"      

```

This status contains the following attributes:

- **reqId**: This id will let you retrieving more information from this command.

- **status**: This is the current status of the operation. It could be `terminated` or `pending` if the operation is not yet finished.

- **mode**: This represents the template used.

- **companyId**: This represents the company where the action will be realized.


### Checking the list of operations done 
---

You can have a report that list all the mass-provisioning operations done on a company.

To retrieve this list, use the following command

```bash

$ rbw masspro status company

```

For each operations, a summary of the operations done is displayed. 


### Display detailled information of an operation
---

To have more information on an operation, you need to use the `reqId` parameter and the following command:

```bash

$ rbw masspro status 94aff94e4253858afd80f66def028f1e7ad32109b2b6edbe4171308647b2864a 

```

This will give you the details of the operation. This allows to know if all users or device links have been imported successfully or not. Each error is described in that detailled report.


### Remove an operation report
---

Each report can be removed at any time.

To remove on, use the following command and the `reqId` parameter:

```bash

$ rbw masspro delete status 94aff94e4253858afd80f66def028f1e7ad32109b2b6edbe4171308647b2864a

```

This will remove it from the list of operations.


### Interested in
---

- [Configuring your Rainbow CLI](/#/documentation/doc/sdk/cli/tutorials/Getting_started)

---

_Last updated March, 17th 2018_