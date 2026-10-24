# PrepPal — Project Context & Product Requirements

> **Purpose:** This document serves as the single source of truth for the agreed product vision, comprehensive feature requirements, architectural principles, feature dependencies, and current development status for PrepPal. It preserves the product vision established in `PREPPAL_PRODUCT_VISION.md` and explicitly separates planned requirements from verified code implementations.

---

## 1. Project Vision

**Project Name:** PrepPal  
**Project Category:** AI-Powered Student Preparation & Career Tracking Platform  
**Core Vision:** Provide students with a unified, intelligent, and highly structured environment to organize technical learning, track progress towards career milestones, prepare for campus placements and off-campus recruitment, and receive pragmatic, cost-effective AI guidance.

PrepPal eliminates the chaos of scattered notes, uncurated playlists, forgotten milestones, and disconnected preparation trackers by consolidating the student journey into a continuous, measurable, and personalized roadmap.

---

## 2. Problem Statement

Students preparing for software engineering and technical roles face several systemic challenges:
- **Scattered Learning Resources:** Learning materials (DSA problems, CS fundamentals, framework tutorials, interview experiences) are spread across disconnected tabs, platforms, and folders.
- **Inconsistent Execution & Routine:** Students lack structured schedules and clear daily/weekly checklists, leading to procrastination or uneven preparation.
- **Unmeasured Progress:** Without centralized tracking, students cannot objectively assess their readiness across topics (e.g., DSA vs. System Design vs. Core CS).
- **Generic Guidance:** Generic placement advice fails to account for a student's specific target roles, college year, or current skill gaps.
- **Fragile AI Implementations:** Many modern apps make basic operations dependent on external AI models that fail or block users when free quotas expire.

---

## 3. Target Audience

- **Primary Users:** Engineering, computer science, and technical students preparing for:
  - Campus placement drives.
  - Off-campus software engineering and tech internships.
  - Full-time entry-level and junior software development engineering (SDE) roles.
- **Secondary Users / Future Cohorts:** Career switchers, self-taught developers, and educators/mentors managing student cohorts.
- **Inclusivity Principles:** The platform is designed to accommodate diverse academic backgrounds, universities, degrees, graduation years, skill proficiencies, and career goals (Backend, Frontend, Full Stack, Data Engineering, DevOps, etc.).

---

## 4. Product Objectives

1. **Centralize Preparation:** Offer a single hub for managing goals, roadmaps, study resources, and interview drills.
2. **Actionable Milestones:** Transform abstract ambitions (e.g., "Crack FAANG") into concrete, bite-sized tasks and trackable roadmaps.
3. **Structured Skill Acquisition:** Enable students to systematically master foundational CS topics (DSA, OOP, DBMS, OS, Computer Networks) alongside modern frameworks.
4. **Targeted Preparation:** Tailor preparation roadmaps to specific company hiring patterns and role requirements.
5. **Deterministic Core:** Keep all primary operations (authentication, profile, goal tracking, roadmap execution) functional via deterministic application logic independent of AI availability.
6. **Value-Add AI:** Use AI strictly for tasks where large language models excel (customized roadmap recommendations, resume/job description gap analysis, and interactive mock interview practice).

---

## 5. Complete Planned Feature List

1. **Authentication & Account Security** (Implemented)
2. **Student Profile** (Implemented — Endpoints & Frontend UI verified)
3. **Goal Management** (Implemented — Endpoints & Frontend UI verified)
4. **Roadmap Management** (Next scheduled task)
5. **Learning Resource Management** (Planned)
6. **Progress Tracking & Analytics** (Planned)
7. **Comprehensive Dashboard** (Minimal placeholder implemented; full analytics planned)
8. **AI-Assisted Roadmap & Gap Analysis** (Planned)
9. **Interview Preparation & Topic Drills** (Planned)
10. **AI Mock Interviews & Instant Feedback** (Planned)
11. **Target-Company Preparation** (Planned)
12. **Interview Experiences & Debriefs** (Planned)
13. **Role-Based Admin Management** (Scaffolded; full admin controls planned)

---

## 6. Feature Descriptions and Expected Behavior

- **Authentication & Security:** Secure signup and login issuing stateless JWTs. Passwords hashed using BCrypt. Duplicate accounts rejected. Unauthorized requests blocked.
- **Student Profile:** Authenticated students view and update personal, academic, and technical background. Data persists across logins. Account credentials (passwords, roles) cannot be modified via profile.
- **Goal Management:** Students create measurable goals with target deadlines and target companies, associating roadmaps and daily tasks with each goal.
- **Roadmap Management:** Structured hierarchical trees or phase-based roadmaps (Phases → Modules → Topics → Tasks) with completion toggles and progress aggregation.
- **Resource Management:** Bookmarking, tagging, and organizing external links, articles, documentation, and videos mapped directly to specific roadmap topics.
- **Progress Tracking:** Real-time percentage completion, streak calculation, topic mastery indicators, and preparation velocity tracking.
- **Dashboard:** Central command center synthesizing active goals, current roadmap phase, daily priority tasks, and preparation health.
- **AI Guidance:** Optional prompt-driven assistants analyzing student goals, skill inventories, or job descriptions to generate suggested roadmap adaptations.
- **Interview Drills & Question Bank:** Curated question sets categorized by company, topic, and difficulty (Easy/Medium/Hard) with personal notes and revision flags.
- **Mock Interviews:** Timed, simulated interview sessions providing feedback on accuracy, problem-solving approach, and communication.

---

## 7. Student Profile Requirements

The Student Profile is the foundational domain entity for personalization.

### Field Categories
- **Personal Information:**
  - Full Name (required, pre-populated from account).
  - Email (required, read-only, bound to authenticated account).
  - Optional Location (city/state/country).
  - Optional GitHub / LinkedIn profile links.
- **Academic Information:**
  - College / University Name.
  - Degree (e.g., B.Tech, B.E., BCA, MCA, M.Tech).
  - Branch / Specialization (e.g., Computer Science, IT, Electronics).
  - Current Academic Year (1st, 2nd, 3rd, 4th, or Graduated).
  - Expected Graduation Year.
  - Optional CGPA or percentage.
- **Technical Skills:**
  - Programming Languages (e.g., Java, Python, C++, JavaScript).
  - Core CS Fundamentals (DSA, OOP, DBMS, OS, Networks).
  - Web & App Technologies / Frameworks (Spring Boot, React, Node.js, etc.).
  - Databases & Cloud Platforms (MongoDB, PostgreSQL, AWS, Docker).
  - Self-reported proficiency level (Beginner, Intermediate, Advanced) per skill.
- **Career Preferences:**
  - Primary Target Role (e.g., Software Development Engineer, Frontend Engineer, Backend Engineer, Data Analyst).
  - Secondary Interests / Technologies.
  - Target Company Tiers / Specific Companies (e.g., Product-based, FAANG/MAANG, High-growth Startups).
  - Expected Placement Timeline / Job Search Status.

### Expected Behavior & Constraints
- Only the authenticated owner can read or mutate their profile (`userId` inferred from validated JWT).
- Profile update forms must strictly forbid updating sensitive account credentials (password hashes, roles, email identity).
- Clear UI loading, validation, success feedback, and error states must be maintained.
- Profile changes must persist in MongoDB and reflect immediately upon browser refresh and re-login.

---

## 8. Goal Management Requirements

- **Definition:** Specific, time-bound career outcomes (e.g., "Crack SDE-1 at Amazon by Dec 2026", "Master DSA in Java in 90 Days").
- **Attributes:** Goal Title, Description, Target Date, Priority (High/Medium/Low), Target Roles/Companies, Status (Active, Completed, Paused).
- **Linkage:** Goals serve as the parent container for one or more Roadmaps and Tasks.
- **Independence:** Goals must remain distinct from general profile preferences; profile preferences express static student traits, whereas goals represent actionable objectives.

---

## 9. Roadmap Management Requirements

- **Structure:** Hierarchical progression:
  - **Phase / Milestone** (e.g., "Phase 1: Advanced Data Structures").
  - **Module / Topic** (e.g., "Binary Trees & BST").
  - **Action Items / Tasks** (e.g., "Implement AVL tree rotation", "Solve 15 LeetCode Medium questions").
- **State Management:** Each task tracks status (`TODO`, `IN_PROGRESS`, `COMPLETED`), completed timestamp, and optional self-notes.
- **Customizability:** Students can follow template roadmaps or customize/reorder tasks according to their preparation timeline.

---

## 10. Resource Management Requirements

- **Association:** Resources attach to specific Roadmap Topics or remain in a student's personal library.
- **Attributes:** Title, URL, Resource Type (Article, Documentation, Video, Problem Set, Cheat Sheet), Difficulty, Estimated Study Time, Notes.
- **Management:** Full CRUD operations for personal resources, quick-add bookmarking, and search/filter by tag and topic.

---

## 11. Progress Tracking Requirements

- **Deterministic Calculation:** Progress percentages are calculated using standard database aggregation (`completedTasks / totalTasks * 100`).
- **No AI Dependency:** All metrics must compute locally and instantly without invoking external LLMs.
- **Visual Indicators:** Topic mastery levels, overall roadmap completion bars, daily/weekly task streaks, and milestone checkmarks.

---

## 12. Dashboard Requirements

- **Purpose:** Serve as the unified dashboard upon student authentication (`/dashboard`).
- **Widgets:**
  - **Profile Summary Card:** Student name, college/degree, target role.
  - **Active Goal Card:** Primary goal, target deadline countdown, and overall completion percentage.
  - **Roadmap Quick Access:** Current active module and next pending tasks.
  - **Daily Action Plan:** Top 3–5 focus tasks scheduled for today.
  - **Preparation Health / Streaks:** Consecutive active days and recently completed milestones.
- **Integrity Rule:** The dashboard must only render verified data from the database; no mock placeholders or hardcoded vanity statistics.

---

## 13. AI-Assisted Feature Requirements

- **Candidate Workflows:**
  - **Intelligent Roadmap Generator:** Generates topic recommendations based on target company, role, student's current skill level, and available hours per week.
  - **Skill-Gap Analysis:** Compares student's self-reported skills against common industry requirements for their target role, highlighting missing prerequisites.
  - **Resume / Job Description Matcher:** Evaluates a target job description and suggests priority topics to study.
- **Integration Principles:**
  - Primary provider: Google Gemini API (leveraging free-tier quota).
  - Graceful degradation: If the AI API fails, times out, or exhausts its rate limit, the application displays a friendly fallback message while allowing full manual customization of roadmaps and goals.
  - Transparent expectations: AI responses must be labeled as suggestions, not infallible advice.

---

## 14. Interview Preparation and Mock Interview Plans

- **Question Bank:** Curated technical and behavioral questions categorized by topic, difficulty, and company tags.
- **Revision Tracking:** Students can flag questions for spaced repetition review (e.g., "Needs Practice", "Mastered").
- **AI Mock Interviewer (Future Phase):**
  - Text or audio-based conversational simulator.
  - Step-by-step technical problem breakdown.
  - Post-interview evaluation covering problem understanding, complexity analysis, edge-case consideration, and communication clarity.

---

## 15. Target-Company Preparation

- **Company Hubs:** Curated or student-defined target company profiles (e.g., Google, Microsoft, Atlassian, Infosys, TCS).
- **Hiring Pattern Information:** Typical interview rounds (Online Assessment, Technical Rounds, System Design, HR/Cultural Fit).
- **Target Tracking:** Dedicated checklist aligning roadmap milestones directly to a company's known technical focus areas.

---

## 16. Important Feature Dependencies

The logical dependency chain governs engineering sequence:

```text
[ Authentication & JWT Security ]
               │
               ▼
       [ Student Profile ]
               │
               ▼
      [ Goal Management ]
               │
               ▼
     [ Roadmap Management ]
          │          │
          ▼          ▼
[ Learning Resources ] [ Progress Tracking ]
               │             │
               └──────┬──────┘
                      ▼
            [ Dashboard Synthesis ]
                      │
                      ▼
     [ AI Recommendations & Gap Analysis ]
                      │
                      ▼
   [ Interview Prep & Mock Interviews ]
```

---

## 17. AI Usage and Cost-Control Principles

1. **AI is Additive, Not Essential:** The core application must never fail because an AI service is unreachable.
2. **Quota Awareness:** Implement request timeouts, caching of common prompts, and exponential backoff.
3. **No Sensitive PII in Prompts:** Strip out passwords, sensitive identification, and internal system details before passing payloads to AI providers.
4. **Structured JSON Output:** Request structured schema responses (JSON) from LLMs and validate schemas before presenting data to students.

---

## 18. Security and Data-Protection Principles

1. **Stateless JWT Authorization:** Every protected request must carry a cryptographically verified Bearer token.
2. **Server-Side Identity:** Never trust a `userId` supplied in request bodies or query parameters. Always extract and verify the user identity from `SecurityContextHolder` / JWT claims.
3. **Tenant Data Isolation:** Ensure all database queries include the authenticated student's `userId` so no user can view or mutate another student's profile, goals, or resources.
4. **Zero Secrets in Code:** Credentials, JWT signing keys, and MongoDB URIs must reside in environment variables.
5. **Sanitized Error Responses:** All uncaught exceptions must be captured by `GlobalExceptionHandler` to prevent leaking stack traces or database connection metadata.

---

## 19. Development Roadmap

- **Phase 1: Foundation & Authentication** (Completed)
  - Project setup, Spring Boot 3.3.5, React 19 + Vite, MongoDB connection, BCrypt hashing, JWT issuance, CORS, and auth UI.
- **Phase 2: Student Profile** (Completed)
  - Backend profile domain model (`student_profiles`), repository, service, and secure REST endpoints (`GET/PUT /api/v1/profile/me`).
  - Frontend profile view and edit form (`/profile`) with input validation, success banners, chip badges, empty state, and state persistence.
- **Phase 3: Goal & Roadmap Architecture** (Next Priority)
  - Goal and Roadmap MongoDB schema, task completion toggles, and roadmap viewer.
- **Phase 4: Resource & Progress Integration**
  - Resource library, bookmarking, and progress calculation engines.
- **Phase 5: Central Dashboard Experience**
  - Synthesis of active goals, progress bars, and daily action tasks.
- **Phase 6: AI-Assisted Features & Mock Interviews**
  - Gemini API integration, skill gap analysis, and interactive interview practice.

---

## 20. Completed, In-Progress, Pending, and Blocked Features

| Feature Component | Status | Detailed Notes |
|---|---|---|
| User Registration (`/api/v1/auth/register`) | **Completed** | Validated, BCrypt hashed, returns JWT, verified with tests |
| User Login (`/api/v1/auth/login`) | **Completed** | Authenticates credentials, returns JWT, verified with tests |
| Spring Security & JWT Bearer Filter | **Completed** | Stateless filter chain, CORS preflight enabled |
| Frontend Landing Page | **Completed** | Responsive SaaS UI with navigation and features |
| Frontend Auth Forms (`/signup`, `/login`) | **Completed** | Form state, validation, 401/409 error banners, token storage |
| Authenticated Dashboard Routing | **Partially Complete** | `/dashboard` exists, displays user profile summary & navigation to `/profile` |
| Student Profile Module | **Completed** | Complete backend persistence (`student_profiles`), secure `GET/PUT /api/v1/profile/me`, frontend view/edit page, 10 automated tests passed |
| Global 2-Theme Engine (Light & Dark) | **Completed** | App-wide Dark (Striver charcoal) & Light (White) themes with Navbar toggle, persistent state |
| Goal Management & Topic Tracker | **Completed** | Complete backend CRUD (`goals`), TakeUForward Striver A2Z sheet replica, tree connector, compact 5-icon subtopic rows, 3-level notes & resources, 39 automated tests passed |
| Roadmap Management | **Pending** | Awaiting roadmap execution phase |
| AI-Assisted Features | **Pending** | Requires Gemini API integration; deferred to Phase 6 |
| Full-Context SpringBootTest with MongoDB | **Blocked / Incomplete** | Excluded Mongo autoconfiguration in test profile blocks full context test; needs mock bean or test container |

---

## 21. Open Product Decisions (Not Yet Finalized)

The following product decisions are explicitly open and must not be silently assumed:

1. **Profile Contact Fields:** Whether phone number and city/location should be part of the initial Student Profile or deferred to prevent collecting unnecessary personal data.
2. **Academic Verification:** Whether students should be required to enter academic CGPA/percentage or if it should remain strictly optional.
3. **Profile Photos & Avatars (Implemented):** Supported via client-side compression & base64/URL storage with developer avatar presets, synced across Profile, Navbar, and Sidebar.
4. **Resume Ingestion:** Whether resume parsing should be an early feature for auto-populating skills, or treated as a separate advanced AI feature.
5. **Roadmap Structure Standard:** Whether roadmaps should follow a fixed sequential timeline (Week 1, Week 2) or a milestone-based tree structure.
6. **AI Provider Fallback:** Whether to support multiple AI providers (e.g., Gemini primary with Groq/OpenAI fallback) or rely solely on Gemini with graceful offline fallback.
7. **Interview Experiences Community:** Whether students can share public interview experiences, or if experiences remain private to each student's personal notes.
