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
goals, study resources, progress, and interview preparation in one
place.

PrepPal aims to reduce the difficulty students face when learning from
scattered resources, planning career preparation, identifying skill
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
Dashboard integration. 8. AI-assisted features. 9. Interview and
target-company preparation. 10. Broader testing, deployment, and
refinement.

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
functionality.

For a feature not currently being implemented, preserve these as open
decisions. For a requested feature, ask only about decisions that
materially affect correctness, security, or scope; otherwise choose a
safe, minimal implementation consistent with the project.

------------------------------------------------------------------------

**Guiding principle:** Build the PrepPal product vision intentionally,
implement it incrementally, and keep documentation aligned with both the
agreed requirements and the verified code.
