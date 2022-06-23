# Commit2Act Changelog

## 6/22/2022

### Bug Fixes

- Fixed link to join group navigation to redirect non-signed in users to sign-up/sign-in page
- Fixed malformed variable causing white screen on action submission
- Fixed **Create Group** page routing to redirect users to the profile page of the newly created group
- Fixed reject button error on the **Validate Actions** page
- Fixed **User Profile** group display to show only public groups
- Sanitized **Create Group** submission input fields to properly deal with all characters
- Fixed action submission for action items where `co2_per_unit_saved` is not an integer value

### Added Features

#### Groups

- Added join group/leave group button to group profile pages
- Group ownership must be transferred to another group member in the event that the sole group owner wants to leave a group
- A group will be deleted if the only remaining member chooses to leave the group
- Admin users are now able to promote/demote/remove members from any group

#### Log Actions

- Added image specifications on the log action menu image upload screen

#### Landing Page

- Group cards display user contribution stats in pie charts along with the groups total stats in a drop down menu
- Added alert displaying the number of actions a user has that are pending validation from a group owner or and administrator, along with the impact of those actions

#### Validate Actions

- There are now 3 tabs (My Groups, Users Without Groups, All Unvalidated Actions) displayed for Admin Users on the validation page
  - **My Groups** allows admins to validate actions for all groups where they are the owner
  - **Users Without Groups** allows admins to validate actions for users that are not part of any groups
  - **All Unvalidated Actions** displays all actions in need of validation from all users
  - Users who are not an admin will only see **My Groups**
