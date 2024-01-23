# Getting started

This guide is aimed at front end developers who intend to setup a UI-only environment using the remote data and APIs. If you will be implementing or updating back end services and API, please refer to the project's [`README`](README.md) for more guidance.

## Prerequisites

You'll need a couple of specialty things setup locally before starting. These include:

- Reach out to your team lead for access to the Amplify account login
- [Visit the live Commit2Act website](http://app.commit2act.org) and create an account for testing
- [Install the Amplify CLI tool](https://docs.amplify.aws/javascript/tools/cli/start/set-up-cli/#install-the-amplify-cli) locally at the global level:

```bash
npm install -g @aws-amplify/cli
```

## Local Front End Environment

The following setup instructions assume you are starting in a local development directory (eg. `~/Code`) where you store and run projects.

### Setup

- Clone the `commit2act` repo locally:

```bash
git clone git@github.com:TakingITGlobal/commit2act.git commit2act
```

- Navigate into the project repo:

```bash
cd commit2act
```

- Configure your local environment to use the staging back-end:

```bash
amplify pull --appId d1ha5pbjl3ysbn --envName staging
```

- This should open a new "Amplify Studio" tab in your browser and prompt you to login. Use the Amplify credentials you secured previously.
- Once logged in, you'll see another prompt to confirm logging into the Amplify CLI. Select "Yes" to continue.
- Back in your terminal, follow the prompts and select the following options:

```bash
? Choose your default editor: [Select the editor you use]
? Choose the type of app that you're building: "javascript"
? What javascript framework are you using: "react"
? Source Directory Path: [Confirm the default]
? Distribution Directory Path: [Confirm the default]
? Build Command: [Confirm the default]
? Start Command: [Confirm the default]

# Some GraphQL output will run before the next prompt appears

? Do you plan on modifying this backend? [Type "n" and hit Enter]
```

- Once the Amplify CLI process has finished running, run the install command:

```bash
npm install
```

### Development

- With your env configured and installed, run the start command:

```bash
npm start
```

- The app will build and run locally in-browser at: [localhost:3000](http://localhost:3000/)
- Login to the app using the account you created previously

Any code changes made locally will reload in the localhost instance. Type `Ctrl + C` in the terminal to quit the start process when you're finished.

### Testing

Tests can either be run one-off or as a background watch process. For the watch process, run:

```bash
npm run test
```

For the one-off which generates a code coverage report, run:

```bash
npm run test:coverage
```

Test coverage sources can be adjusted using the `jest.collectCoverageFrom` array in `package.json`.

### Linting

ESLint can be run either purely for reporting or also attempting to fix simple errors. For the reporting only, run:

```bash
npm run lint
```

To attempt to fix simpler errors, run:

```bash
npm run lint:fix
```

ESLint settings can be adjusted from the `.eslintrc.json` file at the project root.

## Pushing Branches and Opening PRs

By default, we have `npm run test:coverage` and `npm run lint` running on CI via GitHub Actions for the following conditions:

- Any new PR opened against the `main` branch
- New or rebased commits pushed to any remote branch

Before pushing your branch or any additional commits, be sure to run the test and lint scripts locally. You can run them in one script, using:

```bash
npm run checkup
```
