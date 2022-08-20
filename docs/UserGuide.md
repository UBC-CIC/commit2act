# User Guide

**Before Continuing with this User Guide, please make sure you have deployed the frontend and backend stacks.**

- [Deployment Guides](./DeploymentGuide.md)

| Index                                                               | Description                                                                                        |
| :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------- |
| [Landing Page](#Landing-Page)                                       | Features on the landing page                                                                       |
| [Find Group](#Find-Group)                                           | Searching for public groups                                                                        |
| [Create New Group](#Create-New-Group)                               | How to create groups                                                                               |
| [Group Profile](#Group-Profile)                                     | Features on the group profile page                                                                 |
| [Joining Groups From Group Links](#Joining-Groups-From-Group-Links) | How users can join a group                                                                         |
| [Log Action](#Log-Action)                                           | How to log an action                                                                               |
| [Validate Actions](#Validate-Actions)                               | How group owners and Admin can manually validate actions that have failed rekognition's validation |
| [Admin Dashboard](#Admin-Dashboard)                                 | How admin can manage actions and quiz questions                                                    |
| [Account Settings](#Account-Settings)                               | Managing user account information                                                                  |
| [User Profiles](#User-Profiles)                                     | Viewing other user's profiles                                                                      |

## Landing Page

The Landing Page contains 4 main sections.

### 1. Alerts

- The `New Actions in Need of Validation` alert is displayed when the user is an admin or a group owner and there are actions by their group members that they need to validate
- The `Actions Pending Validation` alert is displayed if the user has any actions pending manual validation. This alert shows the potential impact of the user's pending actions
  ![alt text](images/landing/landing0.png)

### 2. Recent Progress

- This section displays the collective CO2 impact of all users on the app, and the current user's weekly and cumulative CO2 saved
  ![alt text](images/landing/landing1.png)

### 3. Leaderboards

- There are 2 leaderboards to toggle between: Global Groups (ranks all groups in the app) and Group Users (ranks all users in the app)
- Users can filter the metric they want to view by clicking the filter button (available metrics are Total CO2, Weekly CO2, Total Points and Weekly Points)
  ![alt text](images/landing/landing2.png)

### 4. My Groups

- This section displays all the groups that the user belongs to
- Clicking on the group name will redirect to the group's profile page
- Clicking on the dropdown accordion opens up charts displaying the user's individual contribution for each group stat (hover over each colour in the graph to see labels - grey is the contribution of all other members, green is the user's contribution)
- Users can also access the `Create Group` page by clicking the `Create Group` button (More information in [Create New Group](#Create-New-Group))
  ![alt text](images/landing/landing3.png)

## Find Group

- The search bar on this page searches through all public groups to return group cards for any groups with a name that matches the user-inputted search term
  ![alt text](images/find_group.png)

## Create New Group

- This page contains a form for users to create a new group (an example use case would be a teacher creating a group for their class)
- The required fields are `Group Name` and `Group Privacy` (private groups require a password for users to join the group, and will not be discoverable through the Find Group searchbar)
- The successful creation of a group will redirect the user to the newly created group's profile page

## Group Profile

The Group Profile page has 3 sections
<br>

### 1. Group Overview

- This section displays the group's number of members, privacy and recent statistics
- If a user is not part of the group, they can join the group by clicking on the `Join Group` button
- If a user is already part of the group, they can leave the group by clicking on the `Leave Group` button
  ![alt text](images/groupProfile/group_profile0.png)
  <br>

### 2. Leaderboards

- There are 2 leaderboards to toggle between: Global Groups and Group Members
- The `Global Groups` tab displays the rankings of all the groups on the app, along with the group's current placement
  ![alt text](images/groupProfile/group_profile1.png)
  <br>
- The `Group Members` tab displays the rankings of the group's members, based on how much they have contributed to the group
- If a user belongs to the group, they will see their individual contributions to each metric (Total CO2, Weekly CO2, Total Points and Weekly Points) in pie charts beside their current ranking
  ![alt text](images/groupProfile/group_profile2.png)
  <br>

### 3. Group Profile Tabs

The group profile tabs display relevant group and group member information. Group owners and admin can also promote/demote/remove group members and edit group information (description, password, privacy, profile photo) here.
<br>
The 5 tabs are:

#### 1. Group Info

- This tab displays the group's description and a list of all the group owners
  ![alt text](images/groupProfile/group_profile3.png)

#### 2. Member Actions

- This tab displays all validated actions submitted by members of the group
- Admin users will be able to view an `Unapprove` button on member actions to override Rekognition's validation or the manual validation done by group owners. Admin users can also unapprove actions on the user's profile page
  ![alt text](images/groupProfile/group_profile4.png)

#### 3. Group Members

- This tab displays all group members (group owners will have a star icon by their profile picture)
- Clicking on any member profile picture will display their name and role, as well as an option to go to their user profile (More information in [User Profiles](#User-Profiles))
  ![alt text](images/groupProfile/group_profile5.png)
- A user can view the option to leave the group by clicking on their own profile picture
  ![alt text](images/groupProfile/group_profile6.png)
- A group owner or admin user can view the options to promote/demote/remove group members from the group by clicking on that member's profile photo
- If a group owner decides to leave the group and they are the only owner, they will be prompted to select another owner before they can leave successfully
- If a group owner decides to leave the group and they are the only member, a popup will be displayed warning the user that the group will be deleted if they leave
  ![alt text](images/groupProfile/group_profile7.png)

#### 4. Add Members (Only Displayed To Admin or Group Owners)

- Group owners or admin users can invite users to join a group by copy and pasting the group link found in this tab and sending it to the users that they want to add
- Private groups will also have their group password available to copy and paste
- More information about the join group process can be found under [Joining Groups From Group Links](#Joining-Groups-From-Group-Links)
  ![alt text](images/groupProfile/group_profile8.png)

#### 5. Edit Group Info (Only Displayed To Admin or Group Owners)

- A form to edit the group's information (required fields are `Group Name` and `Group Privacy` - if a group is set to private, then the `Password` field is also required)

<br>

## Joining Groups From Group Links

- When a user receives a join group link, they can paste it in their brower search bar and it will open a pop up with an invitation message, prompting them to join the group
- A success message will then display and redirect the user to the group profile page
  ![alt text](images/joinGroup/join_group0.png)
- For private groups, users must enter the group password to successfully join the group
  ![alt text](images/joinGroup/join_group1.png)

## Log Action

Users can log their actions and submit their related action photo on the Log Action page. The log action flow has 7 steps:

### 1. Select Action

- Users start by selecting an action to log from any of the icons displayed
  ![alt text](images/logAction/log_action0.png)

### 2. Select Date

- Users then select the date on which their action was successfully completed. Users can click on the calendar icon to display full calendar view
  ![alt text](images/logAction/log_action1.png)

### 3. Action Fact

- A related fact to the action will be shown here. If a user has seen all possible facts, the action's fallback text will be displayed. If there is no fallback text set for the action, there will be a default message displayed
  ![alt text](images/logAction/log_action2.png)

### 4. Action Items

- Users must enter input for one or more of the action items for their selected action
  ![alt text](images/logAction/log_action3.png)

### 5. Validation

- Users can upload an image relating to their action by dragging and dropping the image or by clicking the `Browse` button
- This image will undergo Rekognition validation to determine if it contains any of the action type's relevant image validation labels
  ![alt text](images/logAction/log_action4.png)

### 6. Bonus Question

- A question related to the action fact shown in step 4 will be displayed here. The user can choose to skip the question, or answer. If the user answers the question correctly on the first try, they receive 10 bonus points. Otherwise, they have multiple tries at the question but will receive no bonus points.
  <br>

  ![alt text](images/logAction/log_action5.png)

### 7. CO2 Saved

- The action will be submitted and undergo Rekognition validation (if there is an uploaded image). If the image has passed validation, a success message will be shown along with the CO2 saved. In the cases where the image does not pass validation or the user did not upload an image, the message will inform the user that the action is awaiting manual validation and display the potential impact of that action.
  <br>

  ![alt text](images/logAction/log_action6.png)

## Validate Actions

- Admin users and group owners can validate actions through the Validate Actions page (admin can validate actions submitted by all users, while group owners can only validate the actions of members of their groups)
- Unvalidated actions will be displayed with relevant information (date, name of user, action name, action items, co2 saved, total points earned, and the groups that the action was submitted to).
- Admin users and group owners can approve or reject an action by clicking on the `Approve` or `Reject` buttons on the right hand side of the action card
  ![alt text](images/validateActions/validate_actions3.png)

### Admin View:

- Admin users can toggle between 3 tabs: My Groups, Users Without Groups, All Unvalidated Actions
- In the `My Groups` tab, users can filter their search by Group Name or Action Name
- If the search toggle is set to `Group Name`, clicking on the search bar will display all groups that the user owns
- If the search toggle is set to `Action Name`, clicking on the search bar will display all the possible actions within the app
  ![alt text](images/validateActions/validate_actions0.png)
  ![alt text](images/validateActions/validate_actions1.png)
- The `Users Without Groups` tab displays unvalidated actions from all users that are not a part of any groups
- The `All Unvalidated Actions` tab displays unvalidated actions from all users of the app, regardless if they are in a group or not

### Non Admin View:

- Users that are not admin users but are group owners will only be able to validate the actions of members of their groups
  ![alt text](images/validateActions/validate_actions2.png)

## Admin Dashboard

- Users can only navigate to this page through the navigation bar if they are admin users. The Admin Dashboard is used for viewing overall app statistics, creating new action types and quiz questions, and managing existing action types and quiz questions.
  <br>

There are 4 tabs:
<br>

### 1. Dashboard

- The Dashboard tab displays app statistics, such as the total number of users and groups, the total number of actions submitted with/without an image, the total CO2 saved and the total number of actions submitted by all users. All graphs can be filtered to show data for the past 7 days, 30 days, and year.

  ![alt text](images/adminDashboard/dashboard0.png)
  ![alt text](images/adminDashboard/dashboard1.png)
  ![alt text](images/adminDashboard/dashboard2.png)
  ![alt text](images/adminDashboard/dashboard3.png)

- To view more specific information about a point on a graph, hover over the data point and a popup will appear
  ![alt text](images/adminDashboard/dashboard5.png)
- To filter and view data from only 1 label category on a graph, click on the label that you wish to hide
  ![alt text](images/adminDashboard/dashboard4.png)
  <br>

### 2. Create Action

- The Create Action tab contains a form to create a new action with required fields being the `Action Name`, at least 1 `Action Item`, and at least 1 `Image Validation Label`
- The `Fallback Text` field is what is shown by default in the Action Fact step of the Log Action Menu flow if there are no quiz questions created for that action (shown in image here)
  ![alt text](images/adminDashboard/create_action0.png)

<br>

### 3. Manage Actions

![alt text](images/adminDashboard/manage_actions0.png)

- Admin users can click on an action icon to view the action and its corresponding information (Action Icon, Action Items, Fallback Text, Image Validation Labels)
  ![alt text](images/adminDashboard/manage_actions1.png)
  <br>

- Clicking on each individual action item will display the Name, Description and CO2 Saved Per Unit fields for that action item
  ![alt text](images/adminDashboard/manage_actions3.png)

- To edit the action information, click the `Edit` Button
  ![alt text](images/adminDashboard/manage_actions2.png)
- To delete an action, click the `Delete` button. If an action is deleted, all user submitted content for that action will also be deleted
  <br>
  ![alt text](images/adminDashboard/manage_actions4.png)
- To pause an action, click the `Pause` button. When an action is paused, it will not appear as an option on the Log Action menu for users to submit to
  <br>
  ![alt text](images/adminDashboard/manage_actions5.png)
- Paused actions will appear with a greyed out icon on the Manage Actions menu
  ![alt text](images/adminDashboard/manage_actions6.png)
- A paused action must be restored by clicking the `Restore Action` button before users can submit content for that action
  ![alt text](images/adminDashboard/manage_actions7.png)
  <br>

### 4. Manage Quiz Questions

#### Creating Quiz Questions

![alt text](images/adminDashboard/manage_quizzes0.png)

- Admin users can click on an action icon to view and create action facts with quiz questions for that action
  ![alt text](images/adminDashboard/manage_quizzes1.png)
  <br>

- To create a new quiz, click the `Add New Question` button
- The required fields for creating a new question are Fact Text, Question Text and at least 1 Possible Answer
  <br>

  ![alt text](images/adminDashboard/manage_quizzes2.png)
  <br>

- To mark an answer as correct, click the checkmark icon on the left hand side of the answer. The answer will then become shaded in (in the following image, test answer on the left hand side is marked as correct). Multiple answers can be marked as correct.
  ![alt text](images/adminDashboard/manage_quizzes5.png)

  <br>

  Here is an example of a sample quiz, along with an explanation of how the contents of each field will be displayed:
  ![alt text](images/adminDashboard/manage_quizzes6.png)

  <br>

- The `Fact Text` field will be the fact that is displayed in step 3 of the Log Action menu:
  - ![alt text](images/adminDashboard/manage_quizzes7.png)
- The `Question Text` field will be the question that is displayed in step 6 of the Log Action menu, and the inputs to the `Possible Answers` field will be displayed as multiple choice options. If multiple answers were marked as correct options, the user will get the question right as long as they select 1 of those options.
  - ![alt text](images/adminDashboard/manage_quizzes8.png)
- If an action has no quizzes and no fallback text (explained in the Creating An Action section), then a default message will be displayed in the Log Action menu, and the Bonus Question step will be skipped.
  - ![alt text](images/adminDashboard/manage_quizzes9.png)

<br>

#### Editing Quiz Questions

- To edit existing quizzes, click the `Edit Existing Questions` Button. This will display all the quizzes for your selected action
  ![alt text](images/adminDashboard/manage_quizzes1.png)
  ![alt text](images/adminDashboard/manage_quizzes3.png)
- Click the pencil icon on the upper right hand corner to edit. This will change the card into a form, which has the same functionality as described in the Creating Quiz Questions section
  ![alt text](images/adminDashboard/manage_quizzes4.png)
- To delete a question, click the `Delete` button on the bottom left hand corner
- To apply changes, click the `Save` button on the bottom right hand corner
- To switch out of the Edit View, click the pencil icon again

## Account Settings

- Users can edit their information and view all their submitted actions on their Account Settings page

### Editing User Information

- Click the `Edit Info` button in the top right hand corner
  ![alt text](images/accountSettings/account_settings0.png)
- This will open a form with 2 sections:

1. For users to edit their name, email and profile photo

- ![alt text](images/accountSettings/account_settings1.png)

2. For users to change their password

- ![alt text](images/accountSettings/account_settings2.png)

### Viewing Submitted Actions

- All the submitted actions for a user are split into 3 tabs (Validated, Awaiting Validation, Did Not Pass Validation)
- The `Validated` tab displays all actions that have passed validation
  ![alt text](images/accountSettings/account_settings3.png)
- The `Awaiting Validation` tab displays all actions that have failed Rekognition's validation and are now awaiting manual validation
  ![alt text](images/accountSettings/account_settings4.png)
- The `Did Not Pass Validation` tab displays actions that have failed Rekognition's validation as well as manual validation. If the user uploaded an image along with the action, the image will be greyed out
  ![alt text](images/accountSettings/account_settings5.png)
  <br>

## User Profiles

- There are 3 sections that are displayed when viewing another user's profile

1. The user's profile picture, name and email

- ![alt text](images/userProfile/user_profile0.png)

2. A list of the public groups that the user is a member of

- ![alt text](images/userProfile/user_profile1.png)

3. A list of all their validated submitted actions

- Admin users can go onto user profiles to unapprove validated actions by clicking the `Unapprove` button
- Regular users will not be able to see the `Unapprove` Button
- ![alt text](images/userProfile/user_profile2.png)
