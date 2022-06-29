# User Guide

**Before Continuing with this User Guide, please make sure you have deployed the frontend and backend stacks.**

- [Deployment Guides](./DeploymentGuide.md)

| Index                                 | Description                                                                           |
| :------------------------------------ | :------------------------------------------------------------------------------------ |
| [Landing Page](#Landing-Page)         | Features on the Landing Page                                                          |
| [Find Group](#Find-Group)             | Searching for public groups                                                           |
| [Create New Group](#Create-New-Group) | How to create groups                                                                  |
| [Log Action](#Log-Action)             | How to log an action                                                                  |
| [Validate Actions](#Validate-Actions) | How Group owners and Admin can manually validate actions that have failed rekognition |
| [Admin Dashboard](#Admin-Dashboard)   | How Admin can manage actions and quiz questions                                       |
| [Account Settings](#Account-Settings) | Managing user account information                                                     |

## Landing Page

The landing page contains 4 main sections.

### 1. Alerts

- New Actions in Need of Validation alert is displayed when the user is an admin or a group owner and there are actions by they need to validate.
- Actions Pending Validation is displayed if the user has any actions pending manual validation. This alert shows the potential impact of the user's pending actions.
  ![alt text](images/landing0.png)

### 2. Recent Progress

- Displays collective CO2 impact of all users on the app, and the current user's weekly and cumulative CO2 Saved
  ![alt text](images/landing1.png)

### 3. Leaderboards

- 2 views: Global Groups and Global Users
- Users can filter the metric they want to view by clicking the filter button (available metrics are Total CO2, Weekly CO2, Total Points and Weekly Points)
  ![alt text](images/landing2.png)

### 4. My Groups

- Displays card view of all groups the user belongs to
- Clicking on the dropdown accordion opens up charts displaying the user's individual contribution for each group stat
- Users can also access the Create Group page by clicking the Create Group button
  ![alt text](images/landing3.png)

## Find Group

- Searches through all public groups and displays group card for matching groups
- Users can join the group by clicking the Join Group button
  ![alt text](images/find_group.png)

## Create New Group

- A form for users to create a new group (an example use case would be a teacher creating a group for their class)
- Required fields are Group Name and Group Privacy (private groups require a password for users to join the group, and will not be discoverable through the Find Group searchbar)
- Successful creation of a group will redirect the user to the newly created group profile page

## Log Action

The log action flow has 7 steps

### 1. Select Action

### 2. Select Date

### 3. Action Fact

### 4. Action Items

### 5. Validation

### 6. Bonus Question

### 7. CO2 Saved
