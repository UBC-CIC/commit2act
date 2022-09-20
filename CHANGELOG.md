# 9/20/2022

## Bug Fixes
- Fixed "Parameters cannot be found error" during backend deployment by updating dynamic reference names in template.yaml
- Fixed dynamic references over limit bug causing failed backend deployments 10-15% of the time
- Fixed bug with getSingleGroup resolver by including table for group_id before WHERE clause
- Fixed bug with faulty delete resolvers by changing response mapping template formatting
- Fixed bug causing no warning dialog to be displayed when admin users try to remove the only group owner in a group
- Fixed bug causing incorrect warning dialog shown when removing a user from a group with 1 group owner

## Added Features
- Replaced lambda trigger and manual steps in step 4 of backend deployment with cdk stack

##

# 6/29/2022

## Bug Fixes

- Fixed quizzes not being eliminated from the user's quiz pool once answered
- Fixed error when a quiz had no questions to show
- Group card pie charts calculation fixed

## Added Features

- Group's CO2 and Points stats now are only tracked from the moment users join a group (actions submitted before they joined won't count towards their totals)
- Fallback text now can be changed in **Edit Action** 

# 6/24/2022

## Bug Fixes

- Fixed link to join group navigation to redirect non-signed in users to sign-up/sign-in page
- Fixed malformed variable causing white screen on action submission
- Fixed **Create Group** page routing to redirect users to the profile page of the newly created group
- Fixed reject button error on the **Validate Actions** page
- Fixed **User Profile** group display to show only public groups
- Sanitized **Create Group** submission input fields to properly deal with all characters
- Fixed action submission for action items where `co2_per_unit_saved` is not an integer value

## Added Features

#### Group Profile

- Added join group/leave group button to group profile pages
- Group ownership must be transferred to another group member if there is only 1 group owner and they choose to leave the group
- A group will be deleted if the only member chooses to leave the group
- Admin are now able to promote/demote/remove members from any group
- Group Members tab on Leaderboard now shows user contribution for each category (Total CO2, Weekly CO2, Total Points, Weekly Points) in charts beside user ranking

#### Log Actions

- Added image specifications on the log action menu image upload screen

#### Landing Page

- Group cards display user contribution stats in pie charts along with the groups total stats in a drop down menu
- Added alert displaying the number of actions a user has that are pending validation from a group owner or and administrator, along with the impact of those actions

#### Validate Actions

- There are now 3 tabs (My Groups, Users Without Groups, All Unvalidated Actions) displayed for Admin Users
  - My Groups allows admins to validate actions within the groups they own
  - Users Without Groups allows admins to validate actions for users that are not part of any groups
  - All Unvalidated Actions displays all actions in need of validation
- Added button to toggle search bar between searching by Group Name and by Action Name in the My Groups tab
- Added search bars to filter by Action Name in the Users Without Groups tab and All Unvalidated Actions tab
