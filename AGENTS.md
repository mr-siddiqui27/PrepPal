# 🤖 AGENTS.md — Persistent Development Instructions for PrepPal

> **Scope:** This document is the governing directive for any AI coding agent (including Antigravity, Claude, ChatGPT, Cursor, GitHub Copilot, or automated CI agents) working on the **PrepPal** codebase. These rules are non-negotiable and specific to the architecture, security model, and engineering conventions of PrepPal.

---

## 1. Mandatory Pre-Flight Reading
Before starting any substantial feature, refactoring, or bug-fix task:
- Read [`PREPPAL_PRODUCT_VISION.md`](file:///e:/Projects/PrepPal/PrepPal/PREPPAL_PRODUCT_VISION.md) to understand the intended product scope and principles.
- Read [`PREPPAL_PROJECT_CONTEXT.md`](file:///e:/Projects/PrepPal/PrepPal/PREPPAL_PROJECT_CONTEXT.md) for detailed domain requirements, feature dependencies, and current status.
- Read [`README.md`](file:///e:/Projects/PrepPal/PrepPal/README.md) to understand the current actual implementation, verified test results, and limitations.

---

## 2. Inspect Relevant Source Code Before Modifying
- Always inspect the relevant backend and frontend source files before proposing or writing code.
- Never guess package structures, entity fields, endpoint signatures, or CSS class names.
- Verify existing classes in `com.preppal.*` and React components in `frontend/src/*` before introducing new abstractions.

---

## 3. Adhere to Existing Architectural & Naming Conventions
- **Backend (Spring Boot 3.3.5 / Java 21):**
  - Controllers in `com.preppal.controller.*` (`@RestController`, `@RequestMapping("/api/v1/...")`).
  - DTOs in `com.preppal.dto.*` with Jakarta validation annotations (`@Valid`, `@NotBlank`, etc.).
  - Business logic in `com.preppal.service.*` (`@Service`).
  - Data access in `com.preppal.repository.*` extending Spring Data `MongoRepository<T, ID>`.
  - Entities in `com.preppal.model.*` (`@Document(collection = "...")`).
  - Custom exceptions in `com.preppal.exception.*` handled centrally by `GlobalExceptionHandler`.
- **Frontend (React 19 / Vite / Vanilla CSS):**
  - Pages in `frontend/src/pages/` (e.g., `ProfilePage.jsx`).
  - Reusable components in `frontend/src/components/`.
  - API communication in `frontend/src/services/` (e.g., `authService.js`, `profileService.js`).
  - Styling strictly via Vanilla CSS matching design tokens in `frontend/src/index.css`. **Do not introduce TailwindCSS or component libraries unless explicitly requested by the user.**

---

## 4. Implement Strictly One Scoped Feature per Task
- Focus exclusively on the feature requested in the user prompt.
- Do not silently implement unrequested features (e.g., do not implement Student Profile when asked to write documentation; do not implement AI mock interviews when asked to build Student Profile).
- Respect task boundaries completely.

---

## 5. Preserve Working Behavior & Infrastructure
- Never break existing working functionality, routes, or configurations.
- Preserve:
  - Working registration (`/api/v1/auth/register`) and login (`/api/v1/auth/login`).
  - Spring Security stateless filter chain, JWT Bearer validation, and CORS setup.
  - MongoDB database configuration (`spring.data.mongodb.*`).
  - Existing frontend routes and responsive navigation layouts (`MainLayout`, `Navbar`, `Footer`).
- Do not perform broad, unrelated refactorings while implementing a specific feature.

---

## 6. Zero Database Resets or Data Deletions
- Never drop collections, delete test databases, or reset MongoDB data.
- Avoid modifying existing schema fields in ways that corrupt existing user documents.
- Always implement backwards-compatible schema evolutions for MongoDB documents.

---

## 7. Zero Weakening of Security & Authorization
- Never disable CSRF protection, CORS rules, or filter chain constraints without a documented, approved reason.
- Never set `.anyRequest().permitAll()` in `SecurityConfig`.
- Only explicitly authorized endpoints (e.g., `/api/v1/health`, `/api/v1/auth/**`) may be public. All other feature endpoints must require authentication.

---

## 8. Never Trust Client-Supplied User IDs
- **Critical Security Rule:** Never rely on a `userId` or `email` provided in request URL parameters or request bodies to determine data ownership.
- Always extract the authenticated user identity directly from `SecurityContextHolder` / JWT claims server-side:
  ```java
  Authentication auth = SecurityContextHolder.getContext().getAuthentication();
  String email = auth.getName(); // or custom principal
  ```
- Ensure students can only view, update, or delete their own data.

---

## 9. Zero Credentials, Keys, or Secrets in Version Control
- Never commit passwords, database credentials, API tokens, or JWT secrets to code, tests, or documentation.
- Use placeholders in documentation (e.g., `JWT_SECRET=REPLACE_WITH_YOUR_KEY`).
- Rely exclusively on environment variables (`.env`, `application.yml` bindings).

---

## 10. AI is Additive, Never Core Infrastructure
- Core application workflows (Profiles, Goals, Roadmaps, Resources, Progress Tracking) must execute deterministically using normal application code and database queries.
- No core screen may fail or block user interaction if the Gemini API or other external AI service is unreachable, timed out, or out of quota.
- Provide graceful degradation and user-friendly error banners when AI operations fail.

---

## 11. Avoid Unnecessary Upgrades, Dependencies & Rewrites
- Do not upgrade dependencies (e.g., Spring Boot 3.3.5, React 19, Vite 8) unless explicitly instructed.
- Do not install heavy third-party libraries (e.g., Axios, Redux, Lodash, Tailwind) when native browser APIs (`fetch`), React built-ins (`useState`, `useEffect`), or existing utilities suffice.
- Preserve the existing, validated toolchain.

---

## 12. Use Real Backend Integration, Not Mock Data
- Connect frontend components to real Spring Boot backend endpoints.
- Do not fake API responses in frontend components with `setTimeout` or hardcoded mock JSON arrays when the task is to implement an integrated feature.
- Ensure actual HTTP requests, responses, and database writes are executed.

---

## 13. Run Appropriate Tests & Builds Post-Implementation
- For backend changes:
  - Run relevant unit and slice tests (`mvn test -Dtest=...`).
  - Ensure `mvn test-compile` succeeds without compilation errors.
- For frontend changes:
  - Run `npm run build` in `frontend/` to verify production bundling.
  - Run `npm run lint` to check for linter warnings and errors.

---

## 14. Report Actual Results Honestly
- Never claim that builds, tests, or manual checks passed unless they were actually run and passed during your session.
- If a test fails, or if a service (such as MongoDB) is unreachable, report the exact failure and root cause truthfully.
- Do not conceal warnings or test failures.

---

## 15. Keep Documentation Synchronized with Code
- When an application feature is implemented, tested, and verified, update `README.md` and `PREPPAL_PROJECT_CONTEXT.md` accordingly.
- Keep the three documentation files distinct in purpose:
  - `README.md`: Verified technical and operational facts.
  - `PREPPAL_PROJECT_CONTEXT.md`: Product requirements and feature roadmap status.
  - `AGENTS.md`: Engineering instructions and behavioral guardrails for coding agents.

---

## 16. Distinguish Implemented vs. Planned Features
- Never mark a feature as completed simply because it was planned in `PREPPAL_PRODUCT_VISION.md`.
- Label status precisely:
  - `Implemented` (code exists, works, and is verified).
  - `Partially Implemented` (scaffolded or minimal version exists).
  - `Planned / In-Progress` (in requirements or active development).
  - `Blocked` (dependent on external prerequisite).

---

## 17. Confirm Before Destructive or Production Actions
- Always seek user confirmation before running destructive operations:
  - Dropping database collections or clearing data.
  - Resetting Git branches (`git reset --hard`, `git push --force`).
  - Deleting existing directories or substantial source files.

---

## 18. Clarify Ambiguous Product Decisions Early
- Consult Section 21 of [`PREPPAL_PROJECT_CONTEXT.md`](file:///e:/Projects/PrepPal/PrepPal/PREPPAL_PROJECT_CONTEXT.md) before implementing features with open decisions.
- If an ambiguous requirement materially affects security, data models, or user privacy, ask the user for clarification before proceeding with assumptions.
- If the decision is minor, choose a safe, minimal, non-breaking approach consistent with existing patterns.

---

## 19. Do Not Stop at a Plan When Implementation is Requested
- When a user prompt explicitly requests implementation (e.g., "Implement Student Profile"), do not merely provide a checklist or advice.
- Plan, execute the necessary file edits, run builds/tests, verify correctness, and present the completed work.

---

## 20. Respect Task Scope & User Directives
- If a user prompt specifies "Documentation only, do not write code", perform only documentation.
- If a user prompt specifies "Do not modify backend code", touch only the frontend.
- Honor user constraints at all times.
