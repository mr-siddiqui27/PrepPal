# 🚀 PrepPal

> **AI-Powered Student Preparation & Career Tracking Platform**  
> PrepPal is a centralized platform designed to help students organize academic preparation, master technical skills, follow structured roadmaps, track preparation progress, and receive AI-assisted guidance for placements and technical interviews.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement & Objectives](#-problem-statement--objectives)
- [System Architecture](#-system-architecture)
- [Technology Stack & Actual Versions](#-technology-stack--actual-versions)
- [Project Directory Structure](#-project-directory-structure)
- [Features Status](#-features-status)
- [Authentication & Security Architecture](#-authentication--security-architecture)
- [API Endpoints Documentation](#-api-endpoints-documentation)
- [Database & Data Models](#-database--data-models)
- [Prerequisites & Local Setup](#-prerequisites--local-setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Testing & Verified Test Results](#-testing--verified-test-results)
- [Current Limitations & Known Issues](#-current-limitations--known-issues)
- [Development & Contribution Guidelines](#-development--contribution-guidelines)

---

## 📌 Project Overview

Students preparing for internships, campus placements, and technical careers often struggle with fragmented study materials, inconsistent routines, untracked progress, and lack of structured guidance. 

**PrepPal** brings these essential workflows together into one unified application:
- **Centralized Preparation:** Goal-oriented study paths, topic checklists, and resource management.
- **Progress Tracking:** Clear milestones and activity tracking without artificial vanity metrics.
- **Target-Company Readiness:** Structured focus on roles, technologies, and interview patterns.
- **Pragmatic AI Assistance:** AI recommendations and mock interview practice used strictly as additive tools where they provide clear value.

---

## 🎯 Problem Statement & Objectives

### Problem Statement
- **Scattered Resources:** Students jump between disparate websites, GitHub repositories, and video playlists without a cohesive structure.
- **Lack of Tracking:** Progress across core topics (DSA, OOP, DBMS, System Design, Frameworks) is rarely tracked systematically.
- **Guidance Deficit:** Personalized advice on skill gaps and role readiness is hard to access.
- **Fragile Tools:** Many student tools rely entirely on fragile third-party AI APIs that fail when rate limits are exhausted.

### Core Objectives
1. Provide a single, reliable dashboard for technical learning and career preparation.
2. Build core workflows (profiles, goals, progress, roadmaps) on robust, deterministic application logic.
3. Treat AI as optional enhancement infrastructure: the core platform remains fully functional even if external AI quotas are exhausted.
4. Enforce strict data isolation and security so that students only access their own private preparation data.

---

## 🏗️ System Architecture

PrepPal follows a decoupled client-server architecture with a stateless REST API:

```text
                           ┌────────────────────────┐
                           │      Student User      │
                           └───────────┬────────────┘
                                       │
                                       ▼
                           ┌────────────────────────┐
                           │  React Frontend (Vite) │
                           │    (Port 5173 / SPA)   │
                           └───────────┬────────────┘
                                       │
                                       │ HTTP / JSON REST
                                       │ (CORS Allowed)
                                       │ Authorization: Bearer <JWT>
                                       ▼
                        ┌──────────────────────────────┐
                        │  Spring Boot Backend (Java)  │
                        │        (Port 8080 / API)     │
                        ├──────────────────────────────┤
                        │ • SecurityFilterChain & CORS │
                        │ • JwtAuthenticationFilter    │
                        │ • AuthController & Health    │
                        │ • AuthService & BCrypt       │
                        │ • GlobalExceptionHandler     │
                        └──────┬────────────────┬──────┘
                               │                │
            Spring Data MongoDB│                │ Planned Integration
                               ▼                ▼
                     ┌──────────────────┐    ┌──────────────────┐
                     │  MongoDB Atlas   │    │  Google Gemini   │
                     │  (or Local 27017)│    │     API (AI)     │
                     │  Database: users │    │ (Optional Agent) │
                     └──────────────────┘    └──────────────────┘
```

---

## 🛠️ Technology Stack & Actual Versions

The versions below represent the exact dependencies configured and verified in the repository:

| Layer | Technology | Actual Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React | `19.2.8` | Component-based user interface |
| **Frontend DOM** | React DOM | `19.2.8` | React DOM renderer |
| **Frontend Bundler** | Vite | `8.3.4` | Ultra-fast development server & production bundler |
| **Frontend Router** | React Router DOM | `7.18.4` | Client-side routing and protected navigation |
| **Frontend Styling** | Vanilla CSS | CSS3 / Tokens | Custom responsive design system (`index.css`) |
| **Frontend Linter** | Oxlint | `1.81.0` | High-performance JavaScript/JSX linter |
| **Backend Language** | Java | `21` (JDK 21+) | Modern LTS Java runtime |
| **Backend Framework** | Spring Boot | `3.3.5` | Enterprise REST backend and dependency injection |
| **Security Framework** | Spring Security | `6.3.4` | Stateless security filter chain, auth, and CORS |
| **JWT Library** | JJWT (io.jsonwebtoken) | `0.12.6` | Signed HMAC-SHA256 Bearer token creation/validation |
| **Password Encryption**| BCrypt | 10 rounds (Spring) | Cryptographic one-way hashing for credentials |
| **Data Persistence** | Spring Data MongoDB | `4.3.5` | Document-object mapping and MongoRepository |
| **Validation** | Jakarta Bean Validation | `3.0.x` | Request body validation (`@Valid`, `@Email`, etc.) |
| **Database** | MongoDB | 7.x / Atlas | Document database (tested on Atlas replica set & local) |
| **Backend Build Tool** | Apache Maven | `3.9.x` (mvnw) | Build lifecycle, dependency management, and testing |
| **Testing Backend** | JUnit 5 & Mockito | Jupiter / Mockito 5.x | Unit tests and Spring MVC slice integration tests |

---

## 📂 Project Directory Structure

```text
PrepPal/
├── .gitignore                         # Root Git ignore rules
├── AGENTS.md                          # Persistent instructions for AI coding agents
├── PREPPAL_PRODUCT_VISION.md          # Agreed product vision & roadmap documentation
├── PREPPAL_PROJECT_CONTEXT.md         # Comprehensive requirements & feature context
├── README.md                          # Main project engineering documentation
│
├── backend/                           # Spring Boot 3.3.5 Backend
│   ├── .env.example                   # Backend environment variable template
│   ├── .gitignore                     # Ignores target/, .env, IDE metadata
│   ├── mvnw / mvnw.cmd                # Cross-platform Maven wrapper scripts
│   ├── pom.xml                        # Maven dependencies & build configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/preppal/
│       │   │   ├── PrepPalApplication.java      # Application bootstrap entry point
│       │   │   ├── config/
│       │   │   │   └── SecurityConfig.java       # SecurityFilterChain, CORS, PasswordEncoder
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java       # Registration & Login endpoints
│       │   │   │   ├── HealthController.java     # /api/v1/health probe endpoint
│       │   │   │   └── ProfileController.java    # /api/v1/profile/me endpoints (GET, PUT)
│       │   │   ├── dto/
│       │   │   │   ├── ApiErrorResponse.java     # Unified client error response structure
│       │   │   │   ├── AuthResponse.java         # Auth response with JWT and user fields
│       │   │   │   ├── HealthResponse.java       # Health check response DTO
│       │   │   │   ├── LoginRequest.java         # Credentials validation DTO
│       │   │   │   ├── ProfileResponse.java      # Student profile response DTO
│       │   │   │   ├── ProfileUpdateRequest.java # Profile update request validation DTO
│       │   │   │   └── RegisterRequest.java      # Registration input validation DTO
│       │   │   ├── exception/
│       │   │   │   ├── EmailAlreadyExistsException.java # Exception mapping to HTTP 409
│       │   │   │   ├── ResourceNotFoundException.java   # Exception mapping to HTTP 404
│       │   │   │   └── GlobalExceptionHandler.java      # @RestControllerAdvice handler
│       │   │   ├── model/
│       │   │   │   ├── Role.java                 # STUDENT, ADMIN enum
│       │   │   │   ├── StudentProfile.java       # MongoDB @Document(collection = "student_profiles")
│       │   │   │   └── User.java                 # MongoDB @Document(collection = "users")
│       │   │   ├── repository/
│       │   │   │   ├── StudentProfileRepository.java # Profile MongoRepository
│       │   │   │   └── UserRepository.java       # User MongoRepository
│       │   │   ├── security/
│       │   │   │   ├── JwtAuthenticationFilter.java     # OncePerRequestFilter for Bearer token
│       │   │   │   ├── JwtTokenProvider.java            # JJWT HMAC-SHA256 signing utility
│       │   │   │   ├── PrepPalUserDetailsService.java   # Spring Security UserDetailsService
│       │   │   │   └── TokenService.java                # Token operations interface
│       │   │   └── service/
│       │   │       ├── AuthService.java          # Core user auth & registration logic
│       │   │       └── ProfileService.java       # Student profile retrieval & upsert logic
│       │   └── resources/
│       │       └── application.yml               # Backend configuration
│       └── test/
│           ├── java/com/preppal/
│           │   ├── PrepPalApplicationTests.java  # Smoke context boot test
│           │   ├── controller/
│           │   │   ├── AuthControllerTest.java   # Slice tests for Auth and CORS
│           │   │   ├── HealthControllerTest.java # Slice test for HealthController
│           │   │   └── ProfileControllerTest.java# Slice tests for ProfileController
│           │   └── service/
│           │       ├── AuthServiceTest.java      # Unit tests for AuthService
│           │       └── ProfileServiceTest.java   # Unit tests for ProfileService
│           └── resources/
│               ├── application.yml               # Test configuration
│               └── mockito-extensions/
│                   └── org.mockito.plugins.MockMaker # ByteBuddy mock-maker-subclass
│
└── frontend/                          # React 19 + Vite Frontend
    ├── .env.example                   # Frontend environment variable template
    ├── .gitignore                     # Ignores node_modules/, dist/, .env
    ├── .oxlintrc.json                 # Oxlint configuration
    ├── index.html                     # HTML root entry point
    ├── package.json                   # NPM scripts & dependencies
    ├── vite.config.js                 # Vite bundler configuration
    └── src/
        ├── main.jsx                   # React application mount
        ├── App.jsx                    # Route mapping & layout wrapper
        ├── index.css                  # Global design tokens, typography & CSS utilities
        ├── assets/                    # Static image assets & icons
        ├── components/
        │   ├── FeatureCard.jsx / .css # Reusable SaaS feature card
        │   ├── Footer.jsx / .css      # Application footer
        │   └── Navbar.jsx / .css      # Navigation bar with auth state & mobile hamburger menu
        ├── layouts/
        │   └── MainLayout.jsx / .css  # Main layout shell (Navbar + Content Outlet + Footer)
        ├── pages/
        │   ├── LandingPage.jsx / .css # Marketing landing page with hero & features
        │   ├── LoginPage.jsx          # Live login form with validation & error states
        │   ├── SignupPage.jsx         # Live registration form with validation & error states
        │   ├── AuthPage.css           # Authentication pages styling & error alert styles
        │   ├── DashboardPage.jsx / .css # Authenticated dashboard with quick profile & goals links
        │   ├── GoalsPage.jsx / .css   # Goals & Topic Tracker with derived progress & subtopic toggles
        │   └── ProfilePage.jsx / .css # Comprehensive Student Profile (view/edit/chips/alerts)
        └── services/
            ├── authService.js         # Fetch client, JWT storage, and session management
            ├── goalService.js         # Goal, Topic, and Subtopic CRUD & toggle API client
            └── profileService.js      # Profile fetch and update API client
```

---

## 🚦 Features Status

| Feature Area | Current Status | Verification Details |
|---|---|---|
| **Backend Scaffold & Health Probe** | ✅ Implemented | `GET /api/v1/health` returns `{"status":"UP","application":"preppal-backend"}` |
| **Database Persistence (MongoDB)** | ✅ Implemented | Connected to Atlas or local MongoDB; users stored in `users`, `student_profiles`, `goals` |
| **Stateless JWT Authentication** | ✅ Implemented | JJWT 0.12.6 HMAC-SHA256, `JwtAuthenticationFilter`, `TokenService` |
| **User Registration** | ✅ Implemented | `POST /api/v1/auth/register` with BCrypt hashing, server-side `STUDENT` role, 409 conflict on duplicate |
| **User Login** | ✅ Implemented | `POST /api/v1/auth/login` validates credentials, returns signed JWT and user info |
| **CORS Configuration** | ✅ Implemented | Allows origin `http://localhost:5173`, headers `Authorization, Content-Type`, preflight `OPTIONS` |
| **Centralized Error Handling** | ✅ Implemented | `GlobalExceptionHandler` masks internal exceptions into standardized `ApiErrorResponse` |
| **Frontend Landing Page** | ✅ Implemented | Responsive modern SaaS landing page with features, roadmap, and responsive navbar |
| **Frontend Auth Pages** | ✅ Implemented | Live `/signup` and `/login` connected to backend with loading, validation, and error banners |
| **Client Session Storage** | ✅ Implemented | Stores JWT token and user metadata in `localStorage` |
| **Authenticated Dashboard** | ✅ Implemented | `/dashboard` displays authenticated user profile summary & quick link to track goals and edit profile |
| **Student Profile Management** | ✅ Implemented | Dedicated `student_profiles` collection, secure `GET/PUT /api/v1/profile/me`, responsive React page (`/profile`) with view/edit/chip tags/validation |
| **Global 2-Theme Engine** | ✅ Implemented | Unified Dark (TakeUForward charcoal) and Light (White) themes across all sections with interactive Navbar toggle and `localStorage` persistence |
| **Goal Management & Topic Tracker** | ✅ Implemented | Dedicated `goals` collection, full CRUD endpoints for Goals, Topics, Subtopics, TakeUForward Striver A2Z sheet layout replica, tree connector branch, compact 5-icon subtopic rows, 3-level notes & resources, and 39 automated tests passed |
| **Roadmap Management** | ⏳ Planned | Next scheduled task |
| **Learning Resources** | ⏳ Planned | Planned feature |
| **Progress Tracking** | ⏳ Planned | Planned feature |
| **AI Recommendations & Gemini** | ⏳ Planned | Planned feature; strictly optional enhancement |
| **Mock Interviews & Question Bank**| ⏳ Planned | Planned feature |

---

## 🔒 Authentication & Security Architecture

PrepPal implements a strict stateless token-based security model:

1. **Password Hashing:** Passwords are never stored in plain text. Spring Security's `BCryptPasswordEncoder` (10 rounds) hashes passwords during registration.
2. **Role Assignment:** Roles cannot be assigned or injected by clients. Registration forcibly assigns `Role.STUDENT`.
3. **Stateless Sessions:** Sessions are not maintained on the server (`SessionCreationPolicy.STATELESS`). CSRF protection is disabled as appropriate for pure Bearer-token REST APIs.
4. **Token Security:** Tokens are signed using HMAC-SHA256 with a secret key derived from `JWT_SECRET`. Keys must be at least 256 bits (32 bytes Base64).
5. **Preflight & Filter Chain Order:**
   - Spring Security's `CorsFilter` intercepts preflight `OPTIONS` requests before authentication filters.
   - `JwtAuthenticationFilter` intercepts requests, extracts `Authorization: Bearer <token>`, validates claims, and populates `SecurityContextHolder`.
   - If token is invalid or expired, requests to protected routes receive `401 Unauthorized`.
6. **Exception Sanitization:** Stack traces, SQL/Mongo queries, and internal system details are never leaked. All failures return an `ApiErrorResponse`.

---

## 📡 API Endpoints Documentation

### Public Endpoints

#### 1. Service Health Check
- **URL:** `GET /api/v1/health`
- **Headers:** None required
- **Response `200 OK`:**
  ```json
  {
    "status": "UP",
    "application": "preppal-backend"
  }
  ```

#### 2. User Registration
- **URL:** `POST /api/v1/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "Password123!"
  }
  ```
  - `fullName`: Required, 2–100 characters.
  - `email`: Required, valid email format, max 200 characters. Automatically normalized to lowercase.
  - `password`: Required, 8–128 characters.
- **Response `201 Created`:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": "670c5e7b8f9a1b2c3d4e5f60",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "STUDENT"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Field validation failure (returns `fieldErrors` map).
  - `409 Conflict`: Email already exists.

#### 3. User Login
- **URL:** `POST /api/v1/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "jane.doe@example.com",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": "670c5e7b8f9a1b2c3d4e5f60",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "STUDENT"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: `"Invalid email or password."`

#### 4. Preflight CORS
- **URL:** `OPTIONS /**`
- **Response `200 OK`** with `Access-Control-Allow-Origin: http://localhost:5173`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`.

### Authenticated Endpoints (Bearer Token Required)

#### 5. Get Current Student Profile
- **URL:** `GET /api/v1/profile/me`
- **Headers:** `Authorization: Bearer <JWT>`
- **Response `200 OK`:**
  ```json
  {
    "id": "670c5e7b8f9a1b2c3d4e5f61",
    "userId": "670c5e7b8f9a1b2c3d4e5f60",
    "fullName": "Jane Doe",
    "email": "jane.doe@example.com",
    "collegeName": "Stanford University",
    "degree": "B.Tech",
    "branch": "Computer Science and Engineering",
    "graduationYear": 2026,
    "programmingLanguages": ["Java", "Python", "TypeScript"],
    "technicalSkills": ["Data Structures & Algorithms", "System Design", "REST APIs"],
    "frameworksAndTechnologies": ["Spring Boot", "React", "Node.js"],
    "databasesAndTools": ["MongoDB", "Docker", "Git"],
    "careerGoal": "Land a Full Stack Engineer role at a top product company.",
    "preferredJobRoles": ["Backend Developer", "Full Stack Engineer"],
    "careerInterests": ["Distributed Systems", "Cloud Computing"],
    "targetCompanies": ["Google", "Microsoft", "Amazon"],
    "preferredTechnologies": ["Java", "React", "Kubernetes"],
    "isCompleted": true,
    "createdAt": "2026-10-15T20:10:00Z",
    "updatedAt": "2026-10-15T20:25:00Z"
  }
  ```
  *Note:* If a profile document has not been saved yet, returns `200 OK` with default unpopulated fields and `"isCompleted": false`.
- **Error Responses:**
  - `401 Unauthorized`: Token missing, malformed, or expired.

#### 6. Update Student Profile
- **URL:** `PUT /api/v1/profile/me`
- **Headers:** `Authorization: Bearer <JWT>`, `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "collegeName": "Stanford University",
    "degree": "B.Tech",
    "branch": "Computer Science and Engineering",
    "graduationYear": 2026,
    "programmingLanguages": ["Java", "Python", "TypeScript"],
    "technicalSkills": ["Data Structures & Algorithms", "System Design", "REST APIs"],
    "frameworksAndTechnologies": ["Spring Boot", "React", "Node.js"],
    "databasesAndTools": ["MongoDB", "Docker", "Git"],
    "careerGoal": "Land a Full Stack Engineer role at a top product company.",
    "preferredJobRoles": ["Backend Developer", "Full Stack Engineer"],
    "careerInterests": ["Distributed Systems", "Cloud Computing"],
    "targetCompanies": ["Google", "Microsoft", "Amazon"],
    "preferredTechnologies": ["Java", "React", "Kubernetes"]
  }
  ```
  *(All fields are optional to allow partial completion; invalid numeric years outside 1990–2100 are rejected).*
- **Response `200 OK`:** Returns the updated `ProfileResponse`.
- **Error Responses:**
  - `400 Bad Request`: Field validation error (e.g. graduation year outside range).
  - `401 Unauthorized`: Token missing or invalid.

#### 7. Goal Management Endpoints
- **Create Goal:** `POST /api/v1/goals` (`201 Created`)
- **List Goals:** `GET /api/v1/goals` (`200 OK`)
- **Get Goal:** `GET /api/v1/goals/{goalId}` (`200 OK`)
- **Update Goal:** `PUT /api/v1/goals/{goalId}` (`200 OK`)
- **Update Goal Status:** `PATCH /api/v1/goals/{goalId}/status` (`200 OK` — `ACTIVE`, `PAUSED`, `COMPLETED`)
- **Update Goal Notes:** `PATCH /api/v1/goals/{goalId}/notes` (`200 OK`)
- **Delete Goal:** `DELETE /api/v1/goals/{goalId}` (`204 No Content`)

#### 8. Topic Endpoints
- **Add Topic:** `POST /api/v1/goals/{goalId}/topics` (`201 Created`)
- **Update Topic:** `PUT /api/v1/goals/{goalId}/topics/{topicId}` (`200 OK`)
- **Update Topic Notes:** `PATCH /api/v1/goals/{goalId}/topics/{topicId}/notes` (`200 OK`)
- **Delete Topic:** `DELETE /api/v1/goals/{goalId}/topics/{topicId}` (`200 OK`)

#### 9. Subtopic Checklist Endpoints
- **Add Subtopic:** `POST /api/v1/goals/{goalId}/topics/{topicId}/subtopics` (`201 Created`)
- **Update Subtopic:** `PUT /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}` (`200 OK`)
- **Toggle Completion:** `PATCH /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}/toggle` (`200 OK`)
- **Update Subtopic Notes:** `PATCH /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}/notes` (`200 OK`)
- **Delete Subtopic:** `DELETE /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}` (`200 OK`)

#### 10. Multi-Level Resource Endpoints
- **Goal Resources:** `POST /api/v1/goals/{goalId}/resources`, `PUT /.../{resourceId}`, `DELETE /.../{resourceId}`
- **Topic Resources:** `POST /api/v1/goals/{goalId}/topics/{topicId}/resources`, `PUT /.../{resourceId}`, `DELETE /.../{resourceId}`
- **Subtopic Resources:** `POST /api/v1/goals/{goalId}/topics/{topicId}/subtopics/{subtopicId}/resources`, `PUT /.../{resourceId}`, `DELETE /.../{resourceId}`

---

## 🗄️ Database & Data Models

### Database Configuration
- MongoDB is accessed via Spring Data MongoDB (`MongoRepository`).
- Database name defaults to `preppal_dev` (configurable via `MONGODB_DATABASE`).
- Connection URI defaults to `mongodb://localhost:27017` (configurable via `MONGODB_URI`).

### Data Models

#### `User` Entity (`users` collection)
Defined in [`com.preppal.model.User`](file:///e:/Projects/PrepPal/PrepPal/backend/src/main/java/com/preppal/model/User.java):

```java
@Document(collection = "users")
public class User {
    @Id
    private String id;               // Auto-generated MongoDB ObjectId (hex string)
    private String fullName;         // Student full name
    @Indexed(unique = true)
    private String email;            // Normalized lowercase unique email address
    private String password;         // BCrypt hash digest (never serialized in responses)
    private Role role;               // STUDENT or ADMIN (defaults to STUDENT)
    private Instant createdAt;       // Timestamp of account creation
}
```

#### `StudentProfile` Entity (`student_profiles` collection)
Defined in [`com.preppal.model.StudentProfile`](file:///e:/Projects/PrepPal/PrepPal/backend/src/main/java/com/preppal/model/StudentProfile.java):

```java
@Document(collection = "student_profiles")
public class StudentProfile {
    @Id
    private String id;                                 // MongoDB ObjectId
    @Indexed(unique = true)
    private String userId;                             // References users._id
    @Indexed(unique = true)
    private String email;                              // Associated user email (read-only)
    
    // Academic Information
    private String collegeName;
    private String degree;
    private String branch;
    private Integer graduationYear;
    
    // Technical Skills
    private List<String> programmingLanguages;
    private List<String> technicalSkills;
    private List<String> frameworksAndTechnologies;
    private List<String> databasesAndTools;
    
    // Career Preferences
    private String careerGoal;
    private List<String> preferredJobRoles;
    private List<String> careerInterests;
    private List<String> targetCompanies;
    private List<String> preferredTechnologies;
    
    private Instant createdAt;
    private Instant updatedAt;
}
```

---

## 💻 Prerequisites & Local Setup

### System Prerequisites
- **Java:** JDK 21 or higher (verified compatible with JDK 21, 22, 24).
- **Node.js:** Node.js v20.x or v22.x LTS and npm installed.
- **MongoDB:** A local MongoDB instance running on port 27017 **or** a cloud MongoDB Atlas connection URI.
- **Git:** Git client installed.

---

## ⚙️ Environment Configuration

### Backend (`backend/.env` or system environment)
A template is provided in [`backend/.env.example`](file:///e:/Projects/PrepPal/PrepPal/backend/.env.example):

```bash
# ── MongoDB Connection ───────────────────────────────────────
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=preppal_dev

# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# ── JWT Configuration ─────────────────────────────────────────
# Base64-encoded secret key (minimum 32 bytes / 256 bits):
# Generate with: openssl rand -base64 32
JWT_SECRET=REPLACE_WITH_YOUR_BASE64_SECRET_AT_LEAST_32_BYTES

# Token expiration in milliseconds (default: 86400000 = 24 hours)
JWT_EXPIRATION_MS=86400000

# ── Server Configuration ──────────────────────────────────────
SERVER_PORT=8080
```

> **Note:** For quick local development, `application.yml` provides a safe fallback development secret for `JWT_SECRET` so the backend can start immediately out of the box.

### Frontend (`frontend/.env`)
A template is provided in [`frontend/.env.example`](file:///e:/Projects/PrepPal/PrepPal/frontend/.env.example):

```bash
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🚀 Running the Application

### 1. Start the Backend
Open a terminal in the `backend/` directory:

```bash
# Using the Maven Wrapper on Windows PowerShell / CMD:
.\mvnw.cmd spring-boot:run

# Or on macOS / Linux:
./mvnw spring-boot:run
```
The backend starts on `http://localhost:8080`. Verify health:
```bash
curl http://localhost:8080/api/v1/health
# Response: {"status":"UP","application":"preppal-backend"}
```

### 2. Start the Frontend
Open a separate terminal in the `frontend/` directory:

```bash
# Install dependencies (first time only):
npm install

# Start Vite dev server:
npm run dev
```
The frontend starts on `http://localhost:5173`. Open your browser to test registration, login, and the dashboard.

---

## 🧪 Testing & Verified Test Results

### Actually Executed & Verified Tests

#### 1. Backend Service Unit Tests (`AuthServiceTest.java`)
- **Execution:** `mvn test -Dtest=AuthServiceTest`
- **Result:** **6 passed, 0 failed, 0 errors**
- **Verified Capabilities:**
  - `register_success`: BCrypt password hashing, default `STUDENT` role, token issuance.
  - `register_normalizesEmail`: Case-insensitive email normalization.
  - `register_duplicateEmail_throws409`: Duplicate emails rejected with `EmailAlreadyExistsException`.
  - `register_passwordIsHashed`: Plaintext password never stored; verified with `$2a$` prefix.
  - `login_success`: Valid credentials successfully authenticated and JWT returned.
  - `login_invalidPassword_throwsException`: Invalid credentials trigger `BadCredentialsException`.

#### 2. Backend Controller Slice Tests (`AuthControllerTest.java`)
- **Execution:** `mvn test -Dtest=AuthControllerTest`
- **Result:** **8 passed, 0 failed, 0 errors**
- **Verified Capabilities:**
  - `POST /api/v1/auth/register` returns `201 Created` with `AuthResponse`.
  - Missing registration fields return `400 Bad Request` with field errors.
  - Invalid email formats return `400 Bad Request`.
  - Duplicate registration returns `409 Conflict`.
  - `POST /api/v1/auth/login` returns `200 OK` with token.
  - Bad credentials return `401 Unauthorized`.
  - Missing login fields return `400 Bad Request`.
  - `OPTIONS /api/v1/auth/login` preflight request returns `200 OK` with CORS headers (`Access-Control-Allow-Origin: http://localhost:5173`).

#### 3. Backend Profile Service Unit Tests (`ProfileServiceTest.java`)
- **Execution:** `mvn test -Dtest=ProfileServiceTest`
- **Result:** **5 passed, 0 failed, 0 errors**
- **Verified Capabilities:**
  - `getProfile_existingProfile_returnsProfile`: Retrieves existing profile with user info and `isCompleted = true`.
  - `getProfile_noExistingProfile_returnsDefaultEmptyProfile`: Returns default unpopulated profile with `isCompleted = false` and registered account metadata.
  - `getProfile_userNotFound_throwsResourceNotFound`: Throws 404 if authenticated user does not exist.
  - `updateProfile_createNewProfile_persistsAndReturns`: Creates new `student_profiles` document when updating for the first time.
  - `updateProfile_updateExisting_updatesFieldsAndFullName`: Successfully modifies academic, skill, preference fields, and synchronizes updated `fullName` back to `users` document.

#### 4. Backend Profile Controller Slice Tests (`ProfileControllerTest.java`)
- **Execution:** `mvn test -Dtest=ProfileControllerTest`
- **Result:** **5 passed, 0 failed, 0 errors**
- **Verified Capabilities:**
  - `GET /api/v1/profile/me` authenticated with Bearer token returns `200 OK` with profile payload.
  - `GET /api/v1/profile/me` unauthenticated returns `403 Forbidden` / `401 Unauthorized`.
  - `PUT /api/v1/profile/me` authenticated updates profile and returns `200 OK`.
  - `PUT /api/v1/profile/me` unauthenticated request is blocked.
  - `PUT /api/v1/profile/me` with invalid year outside 1990–2100 returns `400 Bad Request`.

#### 5. Backend Goal Service Unit Tests (`GoalServiceTest.java`)
- **Execution:** `mvn test -Dtest=GoalServiceTest`
- **Result:** **8 passed, 0 failed, 0 errors**
- **Verified Capabilities:**
  - `createGoal_validInput_savesAndReturnsGoalResponse`: Resolves userId securely from JWT email, applies request fields, defaults progress to -1 (no subtopics yet).
  - `getGoals_returnsUserGoals`: Lists goals belonging to authenticated user sorted by createdAt desc.
  - `getGoal_notFound_throwsException`: Throws 404 when goal not found or belongs to another user.
  - `deleteGoal_existingGoal_deletesSuccessfully`: Verifies ownership and deletes goal document.
  - `topicAndSubtopicFlow_calculatesProgressAccurately`: Adds topic, adds subtopics, and toggles subtopic completion while verifying real-time derived progress percentage and counts updates.
  - `updateGoalStatus_normalizesAndSaves`: Validates and normalizes statuses (`Active` -> `ACTIVE`, `Paused` -> `PAUSED`, `Completed` -> `COMPLETED`).
  - `notesAtAllThreeLevels_updateIndependently`: Updates and verifies independent notes at Goal, Topic, and Subtopic level.
  - `resourcesAtAllThreeLevels_addAndPreserveIndependently`: Verifies isolation and persistence of resources at Goal, Topic, and Subtopic level.

#### 6. Backend Goal Controller Slice Tests (`GoalControllerTest.java`)
- **Execution:** `mvn test -Dtest=GoalControllerTest`
- **Result:** **7 passed, 0 failed, 0 errors**
- **Verified Capabilities:**
  - `GET /api/v1/goals`: Authenticated student retrieves 200 OK with their list of goals.
  - `GET /api/v1/goals`: Unauthenticated request returns 403 Forbidden.
  - `POST /api/v1/goals`: Valid payload creates new goal and returns 201 Created.
  - `PATCH /api/v1/goals/{id}/status`: Updates status to PAUSED and returns 200 OK.
  - `PATCH /api/v1/goals/{id}/topics/{tid}/subtopics/{sid}/toggle`: Toggles completion status and returns 200 OK with updated derived progress.
  - `POST /api/v1/goals/{id}/resources`: Adds resource to goal and returns 201 Created.
  - `DELETE /api/v1/goals/{id}`: Deletes goal and returns 204 No Content.

#### 7. Combined Backend Test Suite
- **Execution:** `mvn test "-Dtest=ProfileControllerTest,ProfileServiceTest,AuthControllerTest,AuthServiceTest,GoalControllerTest,GoalServiceTest"`
- **Result:** **39 passed, 0 failed, 0 errors (BUILD SUCCESS)**

#### 8. Frontend Production Build & Linting
- **Execution:** `npm run build`
- **Result:** **Built in 327ms with 0 errors**
- **Assets Generated:** `dist/index.html` (1.73 kB), `dist/assets/*.css` (41.47 kB), `dist/assets/*.js` (342.91 kB).
- **Linter Check:** `npm run lint` (`oxlint`) passed with **0 errors**.

---

## ⚠️ Current Limitations & Known Issues

1. **Full Context SpringBootTest Exclusions:**
   `src/test/resources/application.yml` excludes MongoDB autoconfiguration (`MongoAutoConfiguration`, `MongoDataAutoConfiguration`). Consequently, full-application context boot tests (`PrepPalApplicationTests`, `HealthControllerTest`) require a mock for `UserRepository` or an embedded Mongo test container to complete full context startup during automated builds.
2. **Dashboard Scope:** The current `/dashboard` page is a minimal post-login verification view showing profile headers and a logout button. Complete dashboards with goals, milestones, and progress cards are planned for upcoming milestones.
3. **Password Reset Flow:** Forgot password / password reset via email has not yet been implemented.
4. **Token Revocation (Blacklisting):** JWT tokens are stateless; immediate token revocation before expiration is not yet implemented.

---

## 🤝 Development & Contribution Guidelines

- **Inspection First:** Always inspect the actual source code and configuration before making modifications.
- **Preserve Security:** Never disable authentication or bypass ownership validation. Never trust client-supplied user IDs for operations.
- **No Hardcoded Secrets:** Never commit real credentials, database strings, or JWT secrets to version control.
- **Real Backend APIs:** Always integrate UI features with genuine backend REST endpoints rather than mock frontend data.
- **Documented Status:** Maintain truth in documentation: separate implemented features from planned roadmap items.
