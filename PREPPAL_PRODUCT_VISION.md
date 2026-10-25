# PrepPal --- Product Vision and Planning Notes

> **Purpose of this document:** This document records the product vision
> and planning decisions known so far. It is not proof that every listed
> feature has already been implemented. The existing source code and
> tests must be inspected to establish actual implementation status.

## 1. Project Overview

**Project name:** PrepPal\
**Project type:** AI-powered student preparation and career tracking
platform\
**Core idea:** Help students organize career preparation, learning
goals, study resources, daily and weekly schedules, progress, and interview preparation in one
place.

PrepPal aims to reduce the difficulty students face when learning from
scattered resources, planning career preparation, balancing preparation with personal routines, identifying skill
gaps, and tracking their progress.

## 2. Intended Audience

The initial focus is students who want to prepare for technical careers,
campus placements, off-campus opportunities, and interviews. Keep the
product flexible enough to support different colleges, degrees,
branches, career goals, and technology preferences.

## 3. Product Objectives

-   Give students one organized place to manage preparation.
-   Let students define career goals and track progress.
-   Help students organize learning topics and resources.
-   Support structured preparation roadmaps.
-   Support structured personal planning and preparation scheduling, enabling students to organize their week, structure daily execution, and connect preparation milestones with personal routines.
-   Help students understand potential skill gaps.
-   Support interview and target-company preparation.
-   Use AI only where it provides clear value.
-   Keep core application features usable when an AI service is
    unavailable or its free-tier quota is exhausted.

## 4. Planned Feature Areas

These are product plans, not a declaration that the features are already
implemented. Confirm status by inspecting the repository and running
appropriate checks.

### 4.1 Authentication and Account Security

-   Registration, login, and logout.
-   Protected access to authenticated areas.
-   Secure handling of credentials and account information.
-   Users must only access their own private data.

### 4.2 Student Profile

A student profile is intended to hold information useful for
personalization and career preparation.

**Potential fields to consider:**

**Personal** - Full name. - Account email, associated with the
authenticated account. - Optional location or other genuinely useful
contact details, only if justified.

**Academic** - College/university. - Degree. - Branch/specialization. -
Current academic year, if useful. - Expected graduation year. - Optional
CGPA/percentage.

**Technical skills** - Programming languages. - Core technical topics
(for example, DSA, OOP, DBMS). - Frameworks and tools. - Databases and
cloud technologies. - Optional self-reported proficiency levels.

**Career preferences** - Career goal or preferred role. - Career
interests. - Preferred technologies. - Target companies. - Optional
preferred work locations.

These fields are a starting point for requirements discussion, not an
instruction to make every field mandatory. Keep the first version
focused and avoid collecting unnecessary personal data. A profile should
not treat self-reported skills as verified proficiency.

**Profile behavior expected** - An authenticated student can view and
update their own profile. - Saved data is persisted by the backend and
remains after refresh/re-login. - Clear loading, empty, validation,
success, and error states are provided. - Existing user/account data is
preserved. - Protected account fields such as password hashes and roles
cannot be edited through a profile form. - A user cannot fetch or modify
another user's profile. - Profile photo and resume upload have not been
committed as first-version requirements; discuss them separately before
adding them.

### 4.3 Goal Management

Students will be able to define specific preparation goals, organize
them, and track their status. A general career preference in the profile
should remain distinct from an actionable goal with tasks and progress.

### 4.4 Roadmap Management

Students will be able to follow a structured preparation roadmap aligned
with a goal, including topics, subtopics, tasks, and progress where
appropriate. The exact roadmap workflow and data model should be planned
before implementation.

### 4.5 Learning Resource Management

Students will be able to organize and access useful learning resources
associated with preparation topics or goals.

### 4.6 Progress Tracking

Students will be able to track completed and pending tasks/topics and
review their preparation progress. Core progress tracking should use
normal application logic and not require an AI API.

### 4.7 Dashboard

A central view is planned to summarize relevant information such as
goals, roadmap activity, progress, and useful next actions. Build it
around the actual features that exist; do not display fake metrics or
mock data as if real.

### 4.8 AI Assistance

AI may be used where it adds clear value, especially: - Personalized
roadmap suggestions based on a student's goal, skills/profile, resume or
job description, and available preparation time. - Skill-gap analysis. -
Mock-interview practice and feedback.

Use free-tier AI APIs where feasible, manage quota/cost, and provide
graceful fallback. Do not make authentication, profiles, goals, basic
roadmaps, resources, or progress tracking wholly dependent on AI. Never
claim AI output is guaranteed to be correct.

### 4.9 Interview Preparation

Organize interview topics, questions, and preparation progress. More
detailed behavior should be specified when this feature is planned for
implementation.

### 4.10 Mock Interviews

Provide a future path for AI-assisted interview practice and feedback.
Define boundaries, data handling, and failure states before implementing
it.

### 4.11 Target-Company Preparation

Allow students to organize preparation for selected companies and
relevant roles. Keep this distinct from the general target-company
preference in the profile.

### 4.12 Interview Experiences

A possible feature area for organizing useful interview experiences and
preparation information. Confirm its intended scope before
implementation.

### 4.13 Schedule — Personal Planning and Preparation Execution System

A centralized scheduling and timetable system enabling students to plan
their weeks, structure daily routines, and execute preparation plans
from a single unified workspace.

**Status:** Planned / Not yet implemented.

#### 4.13.1 Purpose and Core Concept

The Schedule acts as an execution bridge connecting PrepPal's
preparation features (Goals, Topics, Roadmaps, Company Preparation,
and Interview Practice) with the student's real-world time constraints,
while also accommodating personal commitments entirely unrelated to
PrepPal.

-   **Unifying Preparation & Daily Life:** Connects academic and career
    milestones with everyday activities (classes, assignments, gym,
    meals, personal projects, rest).
-   **Strictly Optional Feature:** Students who choose not to use the
    Schedule can use all other PrepPal modules (Goals, Roadmaps,
    Profile, Dashboard) without limitation or degradation.
-   **Deterministic Operation:** All core scheduling, timetable
    rendering, calendar navigation, and activity CRUD operations run
    on standard application and database logic without requiring external
    AI services.

#### 4.13.2 Weekly and Daily Views

The user interface provides a modern, responsive calendar and timetable
matching PrepPal's dark-themed preparation workspace.

-   **Weekly Timetable View:** Displays a Monday-to-Sunday grid showing
    scheduled time blocks, activity categories, and completion indicators.
-   **Daily Schedule View:** An execution-oriented agenda view
    detailing the day's timeline, activity details, start/end times,
    and interactive status toggles.
-   **Intuitive Calendar Navigation:** Fast switching between previous
    and next weeks/days, with a dedicated "Today" / "Current Week" quick-jump
    action.
-   **Visual Differentiation:** Distinct color tokens, category chips,
    and iconography clearly separating preparation tasks from personal
    routines, as well as distinct status indicators (Planned, In Progress,
    Completed, Skipped).
-   **Multi-Device Responsiveness:** Adapts smoothly across mobile,
    tablet, and desktop viewports (e.g., stacked chronological cards on
    mobile viewports versus multi-column hourly grids on desktop).

#### 4.13.3 Two Types of Scheduled Activities

Users can create two distinct types of scheduled entries:

1.  **PrepPal-Linked Activities:**
    -   Activities linked directly to an existing PrepPal domain item or
        module, such as:
        -   Goal Sheet & Goal Management (specific goal or main topic).
        -   Topics and Subtopics (curriculum modules).
        -   Personalized Roadmap (specific phase or milestone).
        -   DSA Practice & Topic Drills.
        -   Company-wise Preparation (selected target company).
        -   Interview Preparation and Mock Interviews.
        -   Learning Resources & Reference Study.
        -   Future preparation modules as they are developed.
    -   *Constraint:* Only features and records that actually exist and
        belong to the authenticated student may be selected.
    -   *Extensible Architecture:* The domain model and linkage mechanism
        must use extensible entity references (e.g., polymorphic or
        typed target references) so future PrepPal modules can integrate
        seamlessly without database schema overhauls.

2.  **Personal Activities:**
    -   Independent entries unlinked to any PrepPal preparation feature.
    -   Examples: Gym, College Lectures, University Assignments, English
        Communication Practice, Personal Projects, Meals, Family Time,
        Commute, Rest & Recreation.
    -   *No Forced Linking:* Creating a personal activity must never
        mandate selecting a PrepPal goal, topic, or feature.
    -   *Attributes:* Title, scheduled date, start time, end time,
        optional description, and customizable activity category.

#### 4.13.4 Direct Navigation from Scheduled Activities

Direct navigation is a core functional requirement of the Schedule:

-   **Click-to-Navigate:** Clicking any PrepPal-linked scheduled activity
    navigates the user directly to the relevant main feature or topic
    workspace associated with that activity.
-   **Respect User-Selected Destination:** Navigation must land precisely
    on the level specified by the user when scheduling:
    -   If an activity is linked to a main topic (e.g., Java OOP),
        clicking it opens the main OOP topic page. It must not
        automatically jump to a nested subtopic or arbitrary task.
    -   If an activity is linked to a target company (e.g., TCS Prep),
        clicking it opens the dedicated TCS preparation section.
    -   If an activity is linked to a roadmap phase, clicking it opens
        the corresponding roadmap phase view.
-   **No Forced Subtopic Binding:** A student must be free to schedule
    time for a general module or main topic without being forced to pick
    an individual leaf subtopic or problem.
-   **Personal Activities Behavior:** Clicking a personal activity opens
    its own details/edit modal or panel rather than navigating away to
    an unrelated PrepPal screen.
-   **Reliable Association:** Linkages must rely on immutable entity IDs
    and target route descriptors, never solely on the activity title string.
-   **Graceful Handling of Missing Records:** If a referenced goal, topic,
    or company is deleted or archived, the Schedule must handle the
    broken reference gracefully (e.g., displaying a "Linked item no longer
    available" warning banner) without crashing or blocking interaction.

#### 4.13.5 Activity Status, Execution, and State Decoupling

Scheduled entries support four distinct lifecycle statuses:
`PLANNED`, `IN_PROGRESS`, `COMPLETED`, and `SKIPPED`.

-   **Daily Execution Flow:** Students can update an activity's status in
    real time as they progress through their day.
-   **Decoupled State Integrity (Critical Requirement):**
    -   Marking a scheduled activity as `COMPLETED` records that the student
        executed their planned time block. It **must not** automatically
        mark an entire goal, roadmap, or major topic as completed in the
        underlying preparation system.
    -   For activities explicitly linked to a granular Goal Sheet subtopic
        or leaf problem, PrepPal may offer an explicit, optional prompt
        asking whether the associated subtopic should also be toggled
        complete.
    -   The activity execution status in Schedule and the curriculum mastery
        status in Goal/Roadmap modules remain distinct concepts and must
        never be conflated.

#### 4.13.6 Manual Scheduling & User Agency

Students retain complete authority over their time and schedule:

-   Users manually specify dates, start/end time slots, titles, descriptions,
    categories, and optional PrepPal linkages.
-   Users can modify, reschedule, re-time, or delete any activity.
-   The system **must never** automatically shift, reorder, or overwrite
    existing scheduled activities without explicit user confirmation.

#### 4.13.7 Recurring Activities (Planned Capability)

Support for scheduled recurrence patterns:

-   **Recurrence Frequencies:** Daily routines, weekly events, or selected
    weekdays (for example: DSA Practice every Monday, Wednesday, and
    Friday from 9:00 AM to 10:00 AM).
-   **Series vs. Instance Management:** Where supported, users should be
    able to edit or delete a single instance versus the entire recurring
    series.
-   *Status:* Planned capability to be designed carefully to avoid database
    bloat and timezone anomalies.

#### 4.13.8 AI-Assisted Schedule Suggestions (Future Additive Enhancement)

In a subsequent phase, PrepPal may provide optional AI-driven schedule
generation or optimization:

-   **Context-Aware Advice:** Suggestions based on student availability,
    target company deadlines, active goal velocity, pending roadmap
    checklists, and study preferences.
-   **Advisory Only:** AI proposals are presented strictly as interactive
    recommendations. No changes are applied until the student reviews and
    explicitly approves them.
-   **Additive Principle:** AI assistance is entirely optional. The core
    Schedule remains 100% functional when AI services are offline or
    quota-limited.

#### 4.13.9 Weekly Overview, Analytics, and Metric Separation

The Schedule view may provide a weekly progress summary:

-   Aggregated counts: total planned activities, completed, in-progress,
    pending, and skipped.
-   Goal-wise and category-wise distribution of scheduled hours.
-   **Separation of Planned Duration vs. Actual Study Time:** Scheduling
    a 2-hour study block represents *planned allocation*. It must not be
    tallied as verified *actual study time* unless confirmed by an explicit
    timer or completion record.
-   All displayed metrics must be calculated from real, saved activity
    records without placeholder vanity values.

#### 4.13.10 Persistence, Security, and Data Ownership

-   **Stateless Backend & User Isolation:** All schedule records are
    persisted in MongoDB and associated with the authenticated student's
    account (`userId`).
-   **Strict Ownership Enforcement:** Endpoint authorization must extract
    user identity server-side from JWT claims. A student can never read,
    modify, or delete another student's schedule.
-   **Single Source of Truth Preservation:** Schedule stores scheduling
    metadata and foreign target identifiers. It does not duplicate or
    replace the authoritative data stored within Goal, Topic, Roadmap, or
    Company documents.

#### 4.13.11 User Experience & Design Requirements

The Schedule interface should:

-   Be modern, clean, professional, and responsive.
-   Use a clear weekly timetable and daily execution view.
-   Make activities easy to identify, read, and interact with.
-   Visually distinguish PrepPal-linked preparation activities from personal
    routines.
-   Provide clear empty states when no activities are scheduled for a day or week.
-   Provide appropriate loading, success, validation, and error feedback states.
-   Make adding, modifying, and rescheduling activities fast and intuitive.
-   Preserve user-entered input in forms if a network operation fails.
-   Remain unobtrusive and strictly optional, never interfering with direct
    use of other PrepPal features.

#### 4.13.12 Development and Incremental Integration Strategy

-   **Core Capabilities (Phase 1):** Manual scheduling, personal activities,
    daily/weekly views, activity CRUD/status management, and reliable
    direct navigation to existing features (Goal Sheet, Topics).
-   **Ecosystem Integrations (Phase 2):** Connect with Personalized Roadmap,
    Company-wise Preparation, and Interview Drills as each module is
    implemented.
-   **Advanced Enhancements (Phase 3):** Recurring schedule series,
    optional AI schedule suggestions, external calendar feeds (.ics), and
    weekly time analytics.
-   *Note:* None of these capabilities are currently assumed to be
    implemented; all are documented as planned.

## 5. Product and Engineering Principles

1.  **Inspect before changing:** Read relevant source files and
    understand existing conventions before implementing a feature.
2.  **Preserve working behavior:** Do not break existing authentication,
    routes, APIs, database configuration, or UI.
3.  **One scoped feature at a time:** Implement only the feature
    requested in the current task; do not silently add unrelated
    features.
4.  **Use real data:** Do not replace backend integration with hardcoded
    examples or fake success messages.
5.  **Security first:** Enforce authentication and ownership on the
    backend; do not trust client-supplied user IDs for authorization.
6.  **Preserve data:** Do not drop collections, reset the database, or
    overwrite existing user records.
7.  **Avoid unnecessary complexity:** Reuse existing components, API
    clients, services, repositories, and configuration where
    appropriate.
8.  **AI is optional infrastructure:** Core workflows must continue to
    work when AI is unavailable.
9.  **Validate claims:** Do not report builds or tests as passing unless
    they were actually run and passed.
10. **Handle blockers honestly:** Report missing credentials,
    unavailable services, or tests that could not run.
11. **Keep documentation truthful:** Separate implemented, partially
    implemented, planned, and blocked work.
12. **Avoid unnecessary dependency upgrades or architectural rewrites.**

## 6. Known Technology Direction

The intended/currently reported stack is: - Frontend: React. - Backend:
Java with Spring Boot. - Database: MongoDB. - Backend build: Maven. -
API style: REST.

The agent must inspect the actual repository and report the real
versions, libraries, directory structure, configuration, and
architecture. Do not invent exact versions or assume a particular
package/class structure.

## 7. Reported Current Status --- Must Be Verified

The project owner reports that: - The React frontend and Spring Boot
backend run locally. - Registration and login work. - Duplicate
registration is rejected. - Invalid login credentials are rejected. -
User data is stored in MongoDB. - Logout and authentication flows have
been manually checked.

Treat these as owner-reported status, not independently verified facts.
Inspect the code and run suitable checks before marking them verified.
If the code or observed behavior differs, document the discrepancy
instead of silently assuming either version is correct.

## 8. Initial Development Direction

The next planned product feature is **Student Profile**, after project
documentation and repository inspection are complete.

A sensible high-level sequence to evaluate is: 1. Verify existing
project and authentication. 2. Student Profile. 3. Goal Management. 4.
Roadmap Management. 5. Learning Resources. 6. Progress Tracking. 7.
Schedule & Personal Planning System. 8. Dashboard integration. 9.
AI-assisted features. 10. Interview and target-company preparation.
11. Broader testing, deployment, and refinement.

This sequence is a starting point. Confirm dependencies against the
actual repository and explain any recommended changes before changing
the plan.

## 9. Documentation Rules

Maintain separate purposes for these files:

-   `README.md`: Project overview, actual technology stack, verified
    features, setup/run instructions, configuration requirements,
    API/architecture overview as appropriate, testing instructions, and
    known limitations.
-   `PREPPAL_PROJECT_CONTEXT.md`: Product vision, planned feature
    requirements, important decisions, dependencies, AI principles, and
    current project status.
-   `AGENTS.md`: Durable development instructions for coding agents,
    including reading the other documents and relevant source code
    before making changes.

Do not copy unverified claims into the README. If a feature is planned
but not implemented, label it as planned. Update documentation after
implementation only when the documented facts have actually changed.

## 10. Decisions Not Yet Finalized

Do not silently assume these are settled: - Whether phone number and
location belong in the first version of Student Profile. - Whether
academic CGPA/percentage is needed. - Whether profile photo should be
supported. - Whether resume upload should be a separate feature. - Exact
fields and behavior for goals and roadmaps. - Exact AI provider, API
design, and fallback implementation. - Detailed interview-experience
functionality. - Recurrence storage strategy for Schedule (pre-generated discrete rolling instances vs on-the-fly RRULE evaluation). - Method for capturing actual study duration vs planned duration in Schedule (active in-app timer vs post-session self-reporting). - Whether external calendar synchronization (.ics feed / Google Calendar export) should be introduced in a future phase.

For a feature not currently being implemented, preserve these as open
decisions. For a requested feature, ask only about decisions that
materially affect correctness, security, or scope; otherwise choose a
safe, minimal implementation consistent with the project.

------------------------------------------------------------------------

**Guiding principle:** Build the PrepPal product vision intentionally,
implement it incrementally, and keep documentation aligned with both the
agreed requirements and the verified code.
