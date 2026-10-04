# 🚀 PrepPal

## AI-Powered Student Preparation & Career Tracking Platform

> PrepPal is an AI-powered platform designed to help students manage their academic preparation, track learning progress, explore career opportunities, and receive personalized AI-assisted guidance through a single integrated platform.

---

## 📌 Project Overview

Students often rely on multiple platforms for study resources, exam preparation, progress tracking, career guidance, and internship opportunities.

**PrepPal** aims to bring these essential activities together into one centralized platform.

The platform is designed to help students:

- 📚 Access and organize study resources
- 📝 Manage exam and preparation activities
- 📊 Track learning progress
- 🎯 Set and monitor preparation goals
- 💼 Explore career and internship opportunities
- 🤖 Get AI-powered assistance and recommendations
- 👤 Manage their academic profile

---

## 🎯 Problem Statement

Students face several challenges during their academic and career preparation:

- Study resources are scattered across different platforms.
- Students find it difficult to maintain consistent preparation.
- Learning progress is not always tracked systematically.
- Career and internship information is spread across multiple sources.
- Students often lack personalized guidance for preparation and career planning.

**PrepPal** aims to address these challenges through a centralized and intelligent student-focused platform.

---

## 💡 Proposed Solution

PrepPal provides a unified platform that combines:

**Academic Preparation + Study Resources + Progress Tracking + Career Tracking + AI Assistance**

The goal is to provide students with a single platform that supports them from preparation to progress tracking and career development.

---

## ✨ Key Features

### 👤 User Management

- User registration and login
- Secure authentication
- Student profile management
- Role-based access

### 📚 Study Resources

- Centralized learning resources
- Resource organization
- Easy access to preparation materials

### 📝 Exam & Preparation Management

- Exam preparation tracking
- Preparation-related information
- Goal-oriented learning support

### 📊 Progress Tracking

- Track preparation progress
- Monitor learning activities
- View progress through the dashboard

### 💼 Career Tracking

- Career-oriented information
- Internship and opportunity tracking
- Career preparation support

### 🤖 AI-Powered Assistance

- AI-based student assistance
- Personalized preparation guidance
- AI-powered recommendations
- Intelligent interaction using Gemini API

### 🛡️ Admin Management

- User management
- Resource management
- Content management
- Administrative controls

---

## 🏗️ System Architecture

The planned architecture follows a client-server approach:


                        ┌───────────────────┐
                        │      Student      │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │   React Frontend  │
                        └─────────┬─────────┘
                                  │
                             REST APIs
                                  │
                                  ▼
                 ┌─────────────────────────────┐
                 │     Spring Boot Backend     │
                 │                             │
                 │  Authentication & Security  │
                 │  User Management            │
                 │  Resource Management        │
                 │  Exam & Preparation         │
                 │  Progress Tracking          │
                 │  Career Tracking            │
                 │  AI Services                │
                 └──────────┬──────────┬───────┘
                            │          │
                            ▼          ▼
                     ┌───────────┐  ┌────────────┐
                     │  MongoDB  │  │ Gemini API │
                     │ Database  │  │ AI Service │
                     └───────────┘  └────────────┘


 ## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React.js |
| Backend | Spring Boot |
| Programming Language | Java |
| Database | MongoDB |
| API Architecture | REST APIs |
| Security | Spring Security + JWT |
| AI Integration | Gemini API |
| API Testing | Postman |
| Build Tool | Maven |
| Version Control | Git & GitHub |

---

## 🧩 Project Modules
```text
 
PrepPal
│
├── Authentication & Authorization
├── Student Profile
├── Study Resources
├── Exam & Preparation
├── Progress Tracking
├── Career Tracking
├── AI Assistance
└── Admin Management
```


## 📋 Development Roadmap

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Product Discovery | ✅ Completed |
| Phase 2 | Requirements Engineering | ✅ Completed |
| Phase 3 | SRS Preparation | 🔄 In Progress |
| Phase 4 | System Design | 🔄 In Progress |
| Phase 5 | UI/UX Design | ⏳ Planned |
| Phase 6 | Database Design | ⏳ Planned |
| Phase 7 | Backend Development | ⏳ Planned |
| Phase 8 | Frontend Development | ⏳ Planned |
| Phase 9 | AI Integration | ⏳ Planned |
| Phase 10 | Testing | ⏳ Planned |
| Phase 11 | Deployment | ⏳ Planned |
| Phase 12 | Documentation | ⏳ Planned |
| Phase 13 | Final Presentation & Demo | ⏳ Planned |




## 🔐 Security

Security is an important part of the PrepPal platform.

The planned security implementation includes:

- Spring Security
- JWT-based authentication
- Password encryption
- Role-based authorization
- Secure API access
- Protected user data

Security implementation will be developed and refined during the backend development phase.

---

## 🤖 AI Integration

PrepPal will integrate the **Gemini API** to provide AI-assisted functionality.

The AI component is planned to support:

- Student assistance
- Preparation guidance
- Personalized recommendations
- Career-oriented suggestions
- Intelligent interaction

The exact AI workflows and prompts will be finalized during the AI Integration phase.

---

## 🧪 Testing Strategy

Testing will be performed throughout the development lifecycle.

Planned testing areas include:

- Unit Testing
- Integration Testing
- REST API Testing
- Authentication & Security Testing
- System Testing
- Frontend Testing
- User Acceptance Testing

---

## 📈 Future Scope

Future versions of PrepPal may include:

- Advanced AI-based career recommendations
- Personalized learning paths
- Resume analysis
- Interview preparation
- Skill-gap analysis
- Job and internship recommendation engine
- Advanced analytics dashboard
- Notification and reminder system
- Additional AI-powered student tools

---

## 👥 Team

| Member | Role |
|---|---|
| Mojammil | Team Member |
| Neetu | Team Member |
| Neelu | Team Member |
| Parul | Team Member |

---

## 🎓 Academic Project

| Information | Details |
|---|---|
| **Project Name** | PrepPal |
| **Project Type** | Major Project |
| **Program** | B.Tech Computer Science & Engineering |
| **University** | Babu Banarasi Das University, Lucknow |

---

## 📌 Current Project Status

> 🚧 **Under Development**

PrepPal is currently in the **Requirements Engineering and System Design stage**.

The initial requirements have been identified and documented. The system architecture, project structure, and development plan are currently being prepared before implementation begins.

---

## 📄 Documentation

Project documentation will be maintained inside the `docs/` directory.

Planned documentation includes:

- Software Requirements Specification (SRS)
- Functional Requirements
- Non-Functional Requirements
- System Architecture
- Database Design
- API Documentation
- Testing Documentation
- Project Reports
