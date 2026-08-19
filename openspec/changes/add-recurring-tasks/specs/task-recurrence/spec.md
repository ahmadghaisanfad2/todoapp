## ADDED Requirements

### Requirement: Recurrence rule

The system SHALL support assigning an optional recurrence rule to a task, composed of a rule type and an interval.

- Rule types SHALL be: none, daily, weekly, monthly
- Interval SHALL be a positive integer (default 1) meaning "every N units"
- Tasks without a recurrence rule SHALL behave exactly as today (one-off tasks)

#### Scenario: Assign daily recurrence
- GIVEN a task with no recurrence
- WHEN the user sets recurrence to daily with interval 1
- THEN the task SHALL be marked as recurring daily

#### Scenario: Invalid interval rejected
- GIVEN the user is editing a task's recurrence
- WHEN the user enters an interval of 0 or a negative number
- THEN the system SHALL reject the input and keep the previous interval

### Requirement: Next occurrence generation

When a recurring task is completed, the system SHALL generate the next occurrence of that task based on its recurrence rule, calculated from the completed task's due date.

- The next occurrence SHALL inherit the title, category, priority, and notes of the completed task
- The next occurrence SHALL start as incomplete with a fresh creation timestamp
- The next occurrence SHALL have a due date advanced by `interval` units of the rule type (daily → days, weekly → weeks, monthly → months)
- The completed instance SHALL remain in the list as completed (history is preserved)

#### Scenario: Complete a weekly task
- GIVEN a task with recurrence weekly, interval 1, due date 2026-08-24
- WHEN the user completes the task
- THEN a new task SHALL be created with the same title, category, priority, and notes
- AND the new task SHALL have due date 2026-08-31
- AND the new task SHALL be incomplete
- AND the completed task SHALL remain marked completed

#### Scenario: Monthly recurrence honors month boundaries
- GIVEN a task with recurrence monthly, interval 1, due date 2026-01-31
- WHEN the user completes the task
- THEN the next occurrence SHALL have a valid due date within the following month (the system SHALL NOT produce an invalid date like February 31)

### Requirement: Recurrence visibility

The system SHALL make a task's recurrence visible in the UI.

- Task cards SHALL show a recurrence indicator for recurring tasks
- The task form SHALL allow viewing and editing the recurrence rule and interval

#### Scenario: Recurrence badge shown
- GIVEN a task with a recurrence rule
- WHEN the task is rendered in a list or board
- THEN the task card SHALL display a recurrence indicator
