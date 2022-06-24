# 6/24/2022

### Bug Fixes

- Fixed link to join group navigation to redirect non-signed in users to sign-up/sign-in page
- Fixed malformed variable causing white screen on action submission
- Fixed **Create Group** page routing to redirect users to the profile page of the newly created group
- Fixed reject button error on the **Validate Actions** page
- Fixed **User Profile** group display to show only public groups
- Sanitized **Create Group** submission input fields to properly deal with all characters
- Fixed action submission for action items where `co2_per_unit_saved` is not an integer value

### Added Features

## Group Profile

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
