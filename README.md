# Firechat Tutorial

## Prereqs
Install npm: `brew install node`

Install firebase tools: `npm install -g firebase-tools`

Install gcloud tools: https://cloud.google.com/sdk/docs/quickstart-macos

Login: `gcloud auth login`

## Create Project
`gcloud projects create [YOUR_PROJECT_ID] --set-as-default`

`gcloud app create --project=[YOUR_PROJECT_ID]`

## Get The Code
`git clone git@github.com:wcarle/firechat.git`

## Create firebase project

Create the project (use the project you created above): https://console.firebase.google.com/u/1/

Create realtime database: https://console.firebase.google.com/u/1/project/wcarle-firechat/database
 - Start in test mode

## Setup:
`npm install`

`cd functions`

`npm install`

`cd ..`

## Run it:
`npm start`

## Deploy it:
`firebase deploy`

`gcloud app deploy app.yaml --project [YOUR_PROJECT_ID]`
