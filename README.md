## Commit2Act

TakingITGlobal is a non-governmental organization that focuses on global issues by promoting youth engagement and awareness. In collaboration with the UBC Cloud Innovation Centre (CIC), Commit2Act is a solution that has been developed that serves as a helpful companion for youth (12-18) to drive climate-friendly decision-making in everyday life. It will guide youth towards climate-friendly lifestyle choices, measure the impact of these choices, and connect users to a community of like-minded individuals who are working collaboratively towards the UN’s sustainable development goals.

| Index                                               | Description                                             |
| :-------------------------------------------------- | :------------------------------------------------------ |
| [Stack Overview](#Stack-Overview)                   | The technologies powering the project                   |
| [High Level Architecture](#High-Level-Architecture) | High level overview illustrating component interactions |
| [Deployment](#Deployment-Guide)                     | How to deploy the project                               |
| [User Guide](#User-Guide)                           | The working solution                                    |
| [Files/Directories](#Files-And-Directories)         | Important files/directories in the project              |
| [Changelog](#Changelog)                             | Any changes post publish                                |
| [Credits](#Credits)                                 | Meet the team behind the solution                       |
| [License](#License)                                 | License details                                         |

# High Level Architecture

The following architecture diagram illustrates the various AWS components utliized to deliver the solution. For an in-depth explanation of the frontend and backend stacks, refer to [Architecture Deep Dive](docs/ArchitectureDeepDive.md).

![alt text](docs/images/architecture-diagram.png)

# Deployment Guide

To deploy this solution, please follow our [Deployment Guide](docs/DeploymentGuide.md)

# User Guide

For instructions on how to use the web app interface, refer to [Web App User Guide](docs/UserGuide.md).

# Files And Directories

```text
.
├── frontend/
│   ├── amplify
│   ├── node_modules
│   ├── public
│   └── src/
│       ├── actions
│       ├── components/
│       │   ├── accountSettings/
│       │   ├── adminDashboard/
│       │   ├── authentication/
│       │   ├── groupProfile/
│       │   ├── logAction/
│       │   ├── validateActions/
│       │   ├── AllActions.js
│       │   ├── GlobalLeaderboard.js
│       │   ├── GroupCard.js
│       │   ├── Navbar.js
│       │   ├── ScrollToTop.js
│       │   ├── SubmittedActionCard.js
│       │   └── UserContributionDonutChart.js
│       ├── graphql
│       ├── models
│       ├── pages/
│       │   ├── AccountSettings.js
│       │   ├── AdminDashboard.js
│       │   ├── CreateAction.js
│       │   ├── CreateGroup.js
│       │   ├── FindGroup.js
│       │   ├── GroupProfile.js
│       │   ├── JoinGroup.js
│       │   ├── Landing.js
│       │   ├── SelfReportMenu.js
│       │   ├── UserProfile.js
│       │   └── ValidateActions.js
│       ├── reducers
│       ├── views
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── aws-exports.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── service-worker.js
│       ├── serviceWorkerRegistration.js
│       ├── setupTests.js
│       └── themes.js
├── docs/
│   ├── images/
│   ├── ArchitectureDeepDive.md
│   ├── DeploymentGuide.md
│   └── UserGuide.md
├── lambda_functions
├── node_modules
├── .gitignore
├── amplify.yml
├── cfn-amplifyRole.yaml
├── CHANGELOG.md
├── package-lock.json
├── package.json
├── README.md
└── template.yaml
```

1. **`/public`**: Contains assets/images, as well as Worker.js file used for making the application a PWA (Progressive Web Application)
2. **`/src`**: Contains all the source code for the site.

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
   2. **`/graphql`**:
   3. **`/models`**:
   4. **`/pages`**: Files for each individual page of the app
   5. **`/reducers`**: Reducers for Login and Signup authentication states
   6. **`/views`**: Files for app routing
   7. **`/service-worker.js, serviceWorkerRegistration.js`**: Files for setting up application to be a PWA (Progressive Web Application)
   8. **`/themes.js`**: Global styling for fonts. Note that most components have their own module-scoped styling.

3. **`/docs`**: Contains all relevant documentation files
4. **`/lambda_functions`**: Contains all relevant documentation files

# Changelog

To view the changelog, please view [Changelog](/CHANGELOG.md)

# Credits

This application was architected and developed by Christy Lam and Michael Woolsey, with guidance from the UBC CIC technical and project management teams.

# License

This project is distributed under the [MIT License](LICENSE).
