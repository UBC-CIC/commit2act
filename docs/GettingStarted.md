# Getting started

## Requirements
- [Amplify CLI](https://docs.amplify.aws/cli/start/install/)

## Project setup

1. Delete the amplify folder from the repo

2. Log into the amplify console, go to the commit2act app and click “Backend environments”. Under the backend environment for the commit2act app, click “Local setup instructions”. Copy the command there and paste it into your terminal in the commit2act project folder where the amplify folder was previously. (The command is: “amplify pull --appId d1ha5pbjl3ysbn --envName staging”). This command will open the browser and prompt you to confirm that you want to log in to the AWS CLI. Click “Yes”.

3. Back in the terminal, you should see an output like "Successfully received Amplify Studio tokens. Amplify AppID found. Amplify App name is: commit2act Backend environment devg found in Amplify Console app: commit2act”. You will be prompted with a series of settings to fill in. For “Choose your default editor”, choose the code editor you are using. For “Choose the type of app that you’re building”, pick javascript. For “What javascript framework are you using”, pick “react”. For “Source Directory Path”, “Distribution Directory Path”, “Build Command”, and “Start Command”, pick the default values (just press enter). For “Do you plan on modifying this backend?“, if you are only making frontend changes then enter n.

4. In the terminal, run “npm install” from the commit2act folder.

5. Make the front end changes you want on your new branch and view them locally by running “npm start” in the terminal from the commit2act folder(this might take a while to load the first time you run it). This will run the app locally on your browser (eg on localhost:3000) but not the deployed amplify app url.
