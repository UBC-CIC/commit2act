## Commit2Act

TakingITGlobal is a non-governmental organization that focuses on global issues by promoting youth engagement and awareness. In collaboration with the UBC Cloud Innovation Centre (CIC), Commit2Act is a solution that has been developed that serves as a helpful companion for youth (12-18) to drive climate-friendly decision-making in everyday life. It will guide youth towards climate-friendly lifestyle choices, measure the impact of these choices, and connect users to a community of like-minded individuals who are working collaboratively towards the UN’s sustainable development goals.

| Index                                               | Description                                             |
| :-------------------------------------------------- | :------------------------------------------------------ |
| [High Level Architecture](#High-Level-Architecture) | High level overview illustrating component interactions |
| [Deployment](#Deployment-Guide)                     | How to deploy the project                               |
| [User Guide](#User-Guide)                           | The working solution                                    |
| [Files/Directories](#Files-And-Directories)         | Important files/directories in the project              |
| [Changelog](#Changelog)                             | Any changes post publish                                |
| [Credits](#Credits)                                 | Meet the team behind the solution                       |
| [License](#License)                                 | License details                                         |

# High Level Architecture

The following architecture diagram illustrates the various AWS components utliized to deliver the solution. For an in-depth explanation of the frontend and backend stacks, refer to the [Architecture Deep Dive](docs/ArchitectureDeepDive.md).

![alt text](docs/images/architecture-diagram.png)

# Deployment Guide

To deploy this solution, please follow the steps laid out in the [Deployment Guide](docs/DeploymentGuide.md)

# User Guide

For instructions on how to navigate the web app interface, refer to the [Web App User Guide](docs/UserGuide.md).

# Files And Directories

```text
.
├── amplify
├── backend/
│   ├── lambda_functions
│   ├── cfn-amplifyRole.yaml
│   └── template.yaml
├── docs/
│   ├── images/
│   ├── ArchitectureDeepDive.md
│   ├── DeploymentGuide.md
│   └── UserGuide.md
├── node_modules
├── public
├── src/
│   ├── actions
│   ├── components/
│   │   ├── adminDashboard/
│   │   ├── authentication/
│   │   ├── groupProfile/
│   │   ├── logAction/
│   │   ├── validateActions/
│   │   ├── AllActions.js
│   │   ├── EditAccountInfo.js
│   │   ├── GlobalLeaderboard.js
│   │   ├── GroupCard.js
│   │   ├── Navbar.js
│   │   ├── ScrollToTop.js
│   │   ├── SubmittedActionCard.js
│   │   └── UserContributionDonutChart.js
│   ├── graphql
│   ├── models
│   ├── pages/
│   │   ├── AccountSettings.js
│   │   ├── AdminDashboard.js
│   │   ├── CreateAction.js
│   │   ├── CreateGroup.js
│   │   ├── FindGroup.js
│   │   ├── GroupProfile.js
│   │   ├── JoinGroup.js
│   │   ├── Landing.js
│   │   ├── SelfReportMenu.js
│   │   ├── UserProfile.js
│   │   └── ValidateActions.js
│   ├── reducers
│   ├── views
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── aws-exports.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── service-worker.js
│   ├── serviceWorkerRegistration.js
│   ├── setupTests.js
│   └── themes.js
├── .gitignore
├── .graphqlconfig.yml
├── amplify.yml
├── CHANGELOG.md
├── package-lock.json
├── package.json
└── README.md
```

1. **`/backend`**: Contains all the backend code for the site
   1. **`/lambda_functions`**: Contains the Lambda Functions for the proejct
   - graphQLMySQLResolver is the Lambda function that translates an AWS AppSync request into a call to the database
   - processImagesToValidate is the Lambda function that will move an image to a region where Rekognition is available
   - validateImageWithRekognition is the Lambda function that calls the Amazon Rekognition image processing API on user submitted images
2. **`/docs`**: Contains all relevant documentation files
3. **`/public`**: Contains assets/images, as well as Worker.js file used for making the application a PWA (Progressive Web Application)
4. **`/src`**: Contains all the source code for the site.

   1. **`/components`**: Reusable React components.
      - Components are organized into folders, with the folder names being the page name/functionality that the components within are used for
      - Components that are not in any subfolders are used on multiple different pages, or for overall app functionality. Below is a description of these components:
        - AllActions.js: Used in Log Action page, Admin Dashboard page (in Manage Quiz Questions and Manage Actions tabs)
        - GlobalLeaderboard.js: Used in Admin Dashboard and Landing pages
        - GroupCard.js: Used in Landing and Find Group pages
        - Navbar.js: Navigation bar for the application
        - ScrollToTop.js: Function to scroll page content to the top on page change
        - SubmittedActionCard.js: Used in Account Settings, User Profile and Group Profile pages
        - UserContributionDonutCharts.js: Used in Landing page (in GroupCard component) and Group Profile page (in GroupPageLeaderboard component)
   2. **`/graphql`**: Contains files for mutations, queries and the schema
   3. **`/pages`**: Files for each individual page of the app
   4. **`/reducers`**: Reducers for Login and Signup authentication states
   5. **`/views`**: Files for app routing
   6. **`/service-worker.js, serviceWorkerRegistration.js`**: Files for setting up application to be a PWA (Progressive Web Application)
   7. **`/themes.js`**: Global styling for fonts. Note that most components have their own module-scoped styling.

# Changelog

To view the version history, please view the [Changelog](/CHANGELOG.md)

# Credits

This application was architected and developed by Christy Lam and Michael Woolsey, with guidance from the UBC CIC technical and project management teams.

# License

This project is distributed under the [MIT License](LICENSE).
