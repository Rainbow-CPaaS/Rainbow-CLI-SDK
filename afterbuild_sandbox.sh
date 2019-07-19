#!/bin/sh

./common.sh $*

#Sandbox user account
# login: org_admin@rainbowcli-tests.com"
# password: Password_123
# company: RainbowCLI-tests
# rights: org_admin + app_admin

#Variables for testing on sandbox
export AFTERBUILD_LOGIN="org_admin@rainbowcli-tests.com"
export AFTERBUILD_PASSWORD="Password_123"
export AFTERBUILD_HOST="sandbox.openrainbow.com"

#Launch tests on Sandbox
zunit

