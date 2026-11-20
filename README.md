# NeuroCare AI — Smart Dementia & Alzheimer's Care Support System

An assistive healthcare web application designed to support dementia and Alzheimer’s patients, caregivers, and medical practitioners through cognitive evaluation, emergency SOS signaling, and clinical tracking.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Project Objectives](#project-objectives)
4. [Key Features](#key-features)
5. [User Roles](#user-roles)
6. [Technologies Used](#technologies-used)
7. [System Architecture](#system-architecture)
8. [Application Workflow](#application-workflow)
9. [Database Overview](#database-overview)
10. [Project Folder Structure](#project-folder-structure)
11. [Installation Prerequisites](#installation-prerequisites)
12. [Environment Variable Configuration](#environment-variable-configuration)
13. [Database Setup Instructions](#database-setup-instructions)
14. [Backend Setup and Execution](#backend-setup-and-execution)
15. [Frontend Access and Usage](#frontend-access-and-usage)
16. [API Documentation](#api-documentation)
17. [Screenshots](#screenshots)
18. [Security Considerations](#security-considerations)
19. [Known Limitations](#known-limitations)
20. [Future Enhancements](#future-enhancements)
21. [Academic Project Disclaimer](#academic-project-disclaimer)
22. [Contributors and Acknowledgements](#contributors-and-acknowledgements)

---

## Project Overview

**NeuroCare AI** is a full-stack digital health prototype developed to address daily management challenges faced by individuals experiencing memory decline and cognitive disorders. The application provides an integrated digital portal where:
- Patients can manage daily routines, complete structured cognitive recall assessments, and activate emergency SOS alerts with real-time location capture.
- Doctors have clinical oversight over assigned patient rosters, review historical cognitive scores, monitor emergency incidents, and inspect appointment schedules.
- Caregivers can access remote monitoring tools, receive critical notifications, and review patient health parameters.

The system combines a Node.js and Express RESTful backend, a relational MySQL database, and a client-side interface built with native web APIs including the Web Speech API (SpeechSynthesis and SpeechRecognition), the Geolocation API, and Web Notifications.

---

## Problem Statement

Alzheimer’s disease and progressive dementia impair short-term memory, orientation, and independent task execution. Patients frequently face:
- Disorientation and vulnerability during emergencies away from home.
- Inconsistent cognitive monitoring between scheduled clinical visits.
- Difficulties in adhering to strict medication regimens.
- Disconnected communication channels between family caregivers and attending physicians.

Existing commercial healthcare systems are often fragmented or overly complex for elderly patients suffering from cognitive decline. NeuroCare AI aims to centralize critical daily management functions into an intuitive, high-contrast, accessible digital portal.

---

## Project Objectives

- **Centralized Authentication & RBAC:** Provide secure, role-based access control separating patient, caregiver, and physician privileges.
- **Accessible Cognitive Assessment:** Implement an interactive 8-stage cognitive evaluation module that scores mental arithmetic, short-term recall, and orientation.
- **Rapid Emergency Response:** Enable single-click SOS activation with automated GPS geolocation logging and multi-channel local alerting.
- **Clinical Oversight:** Equip medical professionals with an aggregated dashboard to review patient histories, memory trends, and emergency logs.
- **Zero-Dependency Frontend:** Deliver responsive glassmorphic user interfaces using standard browser standards without third-party frontend framework dependencies.

---

## Key Features

### Implemented & Verified in Source Code

- **Role-Based Authentication:**
  - Secure registration and login supporting `patient`, `doctor`, and `caregiver` roles.
  - Password hashing utilizing `bcryptjs` with configurable salt rounds.
  - Token-based session management using JSON Web Tokens (JWT) passed via `Bearer` authorization headers.
  - Automatic role-based dashboard redirection upon authentication.

- **Patient Self-Management:**
  - Dynamic profile management (demographics, contact, caretaker details, clinical notes).
  - Voice-guided assistant utilizing native browser `SpeechSynthesisUtterance`.
  - Speech-to-text input processing via `webkitSpeechRecognition`.

- **Cognitive Memory Assessment Module:**
  - 8-question cognitive screening test evaluating temporal orientation, immediate memory registration, mental arithmetic, sequential counting, animal recognition, delayed word recall, and functional object recognition.
  - 10-minute countdown session timer with visual cues.
  - Rule-based cognitive performance stratification into Excellent, Moderate, and Attention Needed categories.
  - Automated persistence of scores and completion timestamps to the MySQL backend.
  - Voice-assisted readout of assessment outcomes.

- **Emergency SOS System:**
  - One-touch emergency trigger saving timestamped incidents into the database.
  - Automatic geolocation capture using the browser's `navigator.geolocation` API.
  - Multi-sensory emergency feedback: audible siren alert, desktop notification, and text-to-speech announcement.
  - Direct communication fallback links (`tel:`, `sms:`, and `mailto:` protocols).

- **Physician Management Workspace:**
  - High-level metric cards: assigned patient counts, upcoming appointments, and active unresolved alerts.
  - Tabular roster of assigned patients with individual demographic and contact records.
  - Chronological log of patient emergency triggers with event status tracking.
  - Aggregate diagnostic reports calculating average memory performance across assigned patient populations.

---

## User Roles

| Role | Access Permissions | Primary Portal Page |
|---|---|---|
| **Patient** | Manage own demographic profile, complete cognitive tests, trigger emergency alerts, access voice assistant, view medication schedules. | `html/patient.html` |
| **Doctor** | Review assigned patients, examine cognitive assessment results, audit emergency alerts, inspect appointment queues, view aggregate metrics. | `html/doctor-dashboard.html` |
| **Caregiver** | Register as primary guardian, access monitoring utilities, trigger emergency alerts on behalf of patient, list care recipients. | `html/caregiver.html` |

---

## Technologies Used

### Backend Architecture
- **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+ recommended)
- **Web Framework:** [Express.js](https://expressjs.com/) (v4.19.2)
- **Database Driver:** [mysql2](https://github.com/sidorares/node-mysql2) (v3.11.0) with connection pooling
- **Security & Cryptography:**
  - [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (v2.4.3) for salted password hashing
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (v9.0.2) for stateless JWT issuance and verification
- **Cross-Origin Handling:** [cors](https://github.com/expressjs/cors) (v2.8.5)
- **Configuration Management:** [dotenv](https://github.com/motdotla/dotenv) (v16.4.5)
- **Development Tooling:** [nodemon](https://nodemon.io/) (v3.1.4)

### Frontend Architecture
- **Markup & Semantics:** HTML5
- **Styling:** Custom CSS3 with flexbox, CSS grid, glassmorphism design tokens, and smooth viewport transitions
- **Typography:** Google Fonts ([Poppins](https://fonts.google.com/specimen/Poppins))
- **Scripting:** Vanilla JavaScript (ES6+ modular code)
- **Hardware & Browser APIs:**
  - Web Speech API (`SpeechSynthesis` and `webkitSpeechRecognition`)
  - Geolocation API (`navigator.geolocation`)
  - Notifications API (`window.Notification`)
  - Web Storage API (`window.localStorage` for token persistence)

### Database Management
- **Database Engine:** MySQL 8.0+ / MariaDB
- **Data Definition:** Relational schema enforcing foreign keys and cascade rules (`schema.sql`)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│                                                             │
│   ┌───────────────────┐               ┌─────────────────┐   │
│   │ Patient / Doctor  │               │   Browser APIs  │   │
│   │ Glassmorphic UIs  │               │ (Speech, GPS,   │   │
│   │ (HTML5/CSS3/ES6)  │               │  Notifications) │   │
│   └─────────┬─────────┘               └────────┬────────┘   │
└─────────────┼──────────────────────────────────┼────────────┘
              │                                  │
              │  HTTP/REST (JSON over Port 5000) │
              │  Authorization: Bearer <JWT>     │
              ▼                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js REST API                      │
│                                                             │
│  ┌───────────────────────┐         ┌─────────────────────┐  │
│  │ Global Middleware     │         │ Security & Auth     │  │
│  │ (CORS, Static, JSON)  │         │ (JWT / Role Guard)  │  │
│  └──────────┬────────────┘         └──────────┬──────────┘  │
│             │                                 │             │
│             ▼                                 ▼             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Controllers: Auth | Patient | Doctor | SOS | Memory   │  │
│  └──────────────────────────┬────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              │ MySQL Connection Pool (mysql2)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   MySQL Relational Store                    │
│                                                             │
│    [users] ──< [patients] ──< [appointments]                │
│       │                                                     │
│       ├──< [emergencies]                                    │
│       └──< [memory_tests]                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Application Workflow

1. **Onboarding:** A new user navigates to `/register.html`, inputs identity credentials, selects a role (`patient`, `doctor`, or `caregiver`), and registers.
2. **Authentication:** The user logs in at `/login.html`. Upon successful validation, the server issues a signed JWT containing user ID, email, and role. The client stores this in `localStorage`.
3. **Role Routing:**
   - `patient` $\rightarrow$ redirected to `patient.html`
   - `doctor` $\rightarrow$ redirected to `doctor-dashboard.html`
   - `caregiver` $\rightarrow$ redirected to `caregiver.html`
4. **Patient Routine & Evaluation:**
   - Patients update demographic and guardian info via `/api/patients/me`.
   - Patients take cognitive assessments at `memory-test.html`. Results are calculated locally and dispatched via `POST /api/memory-test/submit`.
5. **Emergency Triggering:**
   - In case of distress, the SOS button on `emergency.html` queries the device's GPS coordinates and records the incident via `POST /api/emergency/trigger`.
   - The UI provides immediate audiovisual feedback.
6. **Clinical Review:**
   - Attending physicians access `doctor-dashboard.html` where data is retrieved concurrently from `/api/doctor/*` endpoints to inspect emergency alerts, patient scores, and schedule status.

---

## Database Overview

The relational schema (`backend/database/schema.sql`) implements five normalized tables:

```
 users (id, name, email, password, role, created_at)
   ▲
   │ (1:1 / 1:N)
   ├── patients (id, user_id*, doctor_id*, age, gender, address, phone, caretaker_contact, notes, created_at)
   │     ▲
   │     │ (1:N)
   │     └── appointments (id, doctor_id*, patient_id*, scheduled_at, reason, status, created_at)
   │
   ├── emergencies (id, user_id*, event, location, status, timestamp)
   │
   └── memory_tests (id, user_id*, score, accuracy, remarks, taken_at)
```

- **`users`**: Master credential table with unique email indexing and role constraints (`patient`, `doctor`, `caregiver`).
- **`patients`**: Demographic and clinical contact records linked to `users(id)` via `ON DELETE CASCADE`.
- **`appointments`**: Consultation schedules linking doctor user accounts and patient entity records.
- **`emergencies`**: Logged SOS incidents with status tracking (`ACTIVE`, `IN_PROGRESS`, `RESOLVED`).
- **`memory_tests`**: Historical cognitive performance scores and diagnostic remarks per patient.

---

## Project Folder Structure

```
alzemiers-project--main/
├── .gitignore                      # Git exclusion rules for Node, MySQL, and secrets
├── CONTRIBUTING.md                 # Open-source contribution guidelines
├── README.md                       # Main repository documentation
├── SECURITY.md                     # Security vulnerability disclosure guidelines
│
├── backend/                        # Node.js Express backend application
│   ├── controllers/                # Request handlers and business logic
│   │   ├── authController.js       # User registration, login, profile operations
│   │   ├── doctorController.js     # Physician dashboard aggregation queries
│   │   ├── emergencyController.js  # Incident recording and status updates
│   │   ├── memoryTestController.js # Cognitive test submission and retrieval
│   │   └── patientController.js    # Patient records management
│   ├── database/
│   │   └── schema.sql              # MySQL DDL schema definition
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT validation and role permission guards
│   ├── routes/                     # Express route endpoints
│   │   ├── authRoutes.js           # Authentication routes
│   │   ├── doctorRoutes.js         # Physician clinical routes
│   │   ├── emergencyRoutes.js      # SOS incident routes
│   │   ├── memoryTestRoutes.js     # Cognitive test routes
│   │   └── patientRoutes.js        # Patient management routes
│   ├── .env.example                # Safe environment variable template
│   ├── db.js                       # MySQL2 connection pool setup
│   ├── package.json                # Backend dependencies and run scripts
│   └── server.js                   # Application entry point and static file server
│
├── css/
│   └── style.css                   # Master application stylesheet
│
├── docs/                           # Extended architectural and setup guides
│   ├── FEATURES.md                 # Detailed feature breakdown and status audit
│   ├── PROJECT_ARCHITECTURE.md     # Architectural and data flow specifications
│   └── SETUP.md                    # In-depth local setup and troubleshooting manual
│
├── html/                           # Frontend user interface pages
│   ├── analytics.html              # Health analytics display
│   ├── appointments.html           # Consultation booking interface
│   ├── caregiver.html              # Caregiver monitoring dashboard
│   ├── chatbot.html                # Cognitive assistant conversational UI
│   ├── doctor-dashboard.html       # Primary clinical workspace for physicians
│   ├── emergency.html              # SOS activation and contact screen
│   ├── index.html                  # Public landing page
│   ├── login.html                  # Authentication login portal
│   ├── medicine.html               # Daily medication reminder schedule
│   ├── memory-test.html            # Cognitive memory assessment module
│   ├── patient.html                # Patient main dashboard
│   ├── register.html               # Account creation portal
│   └── reports.html                # Historical summary records
│
├── js/                             # Client-side JavaScript modules
│   ├── analytics.js                # Analytics presentation script
│   ├── appointments.js             # Client-side appointment form handler
│   ├── caregiver.js                # Caregiver dashboard simulation script
│   ├── chatbot.js                  # Keyword-driven conversational interface
│   ├── doctor.js                   # Physician API data integration module
│   ├── emergency.js                # SOS dispatch and geolocation controller
│   ├── memory-test.js              # Cognitive assessment engine and scorer
│   ├── patient.js                  # Patient profile API client
│   ├── register.js                 # Registration submission handler
│   ├── reminder.js                 # Medication reminder voice/notification logic
│   └── voice-assistant.js          # Speech recognition and command execution
│
└── screenshots/                    # Application UI demonstration captures (user-supplied)
```

---

## Installation Prerequisites

Ensure the following tools are installed on your host system:
1. **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
2. **npm**: Node Package Manager (comes bundled with Node.js)
3. **MySQL Server**: v8.0 or higher ([Download MySQL](https://dev.mysql.com/downloads/installer/))
4. **Git**: Version control client ([Download Git](https://git-scm.com/))
5. **Modern Web Browser**: Google Chrome or Microsoft Edge recommended for full Web Speech API capability.

---

## Environment Variable Configuration

Navigate to the `backend/` directory and create your local `.env` file from the provided template:

```bash
cd backend
cp .env.example .env
```

Configure the environment parameters in `backend/.env` according to your local environment:

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | HTTP port on which the Express server listens | `5000` |
| `NODE_ENV` | Application runtime environment | `development` |
| `DB_HOST` | MySQL hostname or IP address | `localhost` |
| `DB_USER` | MySQL database user account | `root` |
| `DB_PASSWORD` | Password for the MySQL user account | `your_mysql_password` |
| `DB_NAME` | MySQL database schema name | `alzheimer_ai_db` |
| `DB_PORT` | Port on which MySQL listens | `3306` |
| `JWT_SECRET` | Cryptographic secret used to sign JSON Web Tokens | `your_secure_secret_string` |
| `JWT_EXPIRES_IN` | Token duration before expiration | `7d` |
| `BCRYPT_SALT_ROUNDS` | Number of hashing rounds for passwords | `10` |
| `CLIENT_URL` | Trusted origin for CORS validation | `http://localhost:5000` |

> [!WARNING]
> Never commit `backend/.env` to version control. The repository's root `.gitignore` is preconfigured to prevent secrets from being tracked.

---

## Database Setup Instructions

1. Start your local MySQL service (via system service manager or command line).
2. Log into the MySQL monitor or launch MySQL Workbench:

```bash
mysql -u root -p
```

3. Import the provided schema:

```bash
mysql -u root -p < backend/database/schema.sql
```

4. Verify database creation:

```sql
SHOW DATABASES;
USE alzheimer_ai_db;
SHOW TABLES;
```

You should see five tables: `appointments`, `emergencies`, `memory_tests`, `patients`, and `users`.

---

## Backend Setup and Execution

1. Open a terminal and navigate to the `backend/` directory:

```bash
cd backend
```

2. Install all required production and development dependencies:

```bash
npm install
```

3. Execute the server:

**For Development (with Nodemon hot-reloading):**
```bash
npm run dev
```

**For Standard Execution:**
```bash
npm start
```

When successfully launched, you will see output similar to:
```
🚀 Server running on port 5000
MySQL connected: localhost alzheimer_ai_db
```

---

## Frontend Access and Usage

The Express backend serves the static frontend assets directly. Once the backend server is running:

1. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```
2. You will be greeted by the NeuroCare AI landing page (`index.html`).
3. Click **Register** (`register.html`) to initialize test accounts for different roles:
   - Create a **Patient** account.
   - Create a **Doctor** account.
   - Create a **Caregiver** account.
4. Log in at `login.html` to explore individual dashboard workflows.

---

## API Documentation

All protected endpoints require an `Authorization` header formatted as:
`Authorization: Bearer <JWT_TOKEN>`

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register user (`name`, `email`, `password`, `role`). |
| `POST` | `/api/auth/login` | Public | Validate credentials and receive JWT. |
| `POST` | `/api/auth/logout` | Private | Invalidate or terminate client session. |
| `GET` | `/api/auth/profile` | Private | Retrieve logged-in user profile details. |
| `PUT` | `/api/auth/profile` | Private | Update logged-in user profile details. |

### Patient Management (`/api/patients`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/patients/create` | Doctor, Caregiver | Register a new clinical patient record. |
| `GET` | `/api/patients` | Caregiver | Retrieve all clinical patient records. |
| `GET` | `/api/patients/me` | Patient | Retrieve profile data for the authenticated patient. |
| `PUT` | `/api/patients/me` | Patient | Upsert profile data for the authenticated patient. |
| `GET` | `/api/patients/:id` | Caregiver | Fetch a specific patient record by ID. |
| `PUT` | `/api/patients/:id` | Caregiver | Update details for a specific patient. |
| `DELETE` | `/api/patients/:id` | Caregiver | Remove a specific patient profile. |

### Cognitive Memory Assessment (`/api/memory-test`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/memory-test/submit` | Patient, Caregiver | Submit evaluation score and accuracy metrics. |
| `GET` | `/api/memory-test/all` | Patient, Caregiver | Retrieve full test history for the active user. |
| `GET` | `/api/memory-test/latest` | Patient, Caregiver | Fetch the most recent cognitive assessment record. |
| `GET` | `/api/memory-test/:id` | Patient, Caregiver | Fetch a specific test result by ID. |
| `DELETE` | `/api/memory-test/:id` | Doctor | Delete a test entry (clinical administrative action). |

### Emergency SOS System (`/api/emergency`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/emergency/trigger` | Patient, Caregiver | Dispatch emergency incident with location coordinates. |
| `GET` | `/api/emergency/history` | Patient, Caregiver | Review personal emergency history logs. |
| `GET` | `/api/emergency/:id` | Patient, Caregiver | Fetch single incident detail by ID. |
| `PUT` | `/api/emergency/:id` | Doctor, Caregiver | Update status (`ACTIVE`, `IN_PROGRESS`, `RESOLVED`). |
| `DELETE` | `/api/emergency/:id` | Doctor | Remove an incident record from logs. |

### Doctor Clinical Operations (`/api/doctor`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/doctor/overview` | Doctor | Aggregated counts of assigned patients, appointments, and alerts. |
| `GET` | `/api/doctor/patients` | Doctor | Roster of patients assigned to the authenticated doctor. |
| `GET` | `/api/doctor/appointments` | Doctor | List of upcoming consultations for assigned patients. |
| `GET` | `/api/doctor/emergencies` | Doctor | Active and historical emergency alerts from assigned patients. |
| `GET` | `/api/doctor/reports` | Doctor | Statistical summary of memory tests and averages. |

---

## Screenshots

> [!NOTE]
> Screenshots should be placed in the `screenshots/` directory using fictional test data. Replace the placeholders below once your application captures are taken.

| View | Preview |
|---|---|
| **Landing Page** | `screenshots/01-landing-page.png` |
| **Authentication Screen** | `screenshots/02-login-page.png` |
| **Patient Workspace** | `screenshots/04-patient-dashboard.png` |
| **Doctor Clinical Workspace** | `screenshots/05-doctor-dashboard.png` |
| **Cognitive Assessment** | `screenshots/07-memory-test.png` |
| **Emergency SOS Interface** | `screenshots/08-emergency-sos.png` |

---

## Security Considerations

- **Password Storage:** All passwords are salt-hashed using `bcryptjs` with configurable rounds prior to database insertion.
- **Access Control:** All data queries beyond login and registration require verified JWT authentication. Routes validate token signatures and verify user role constraints via Express middleware.
- **Relational Integrity:** Foreign key constraints are enforced with cascading deletes where appropriate to avoid orphaned medical logs.
- **SQL Injection Prevention:** SQL queries in controllers utilize parameterized inputs (`?` placeholders) handled by the `mysql2` driver.
- **Academic Environment Notice:** Tokens are stored in browser `localStorage` for prototype simplicity; production healthcare environments should use secure, `HttpOnly`, `SameSite` cookies to protect against cross-site scripting (XSS).

---

## Known Limitations

- **Simulated Frontend Modules:** The medication reminder UI (`medicine.html`) and general analytics screen (`analytics.html`) currently demonstrate layout and interaction via local timer loops rather than persistent database tables.
- **Caregiver Live Telemetry:** Sensor simulations (e.g., heart rate and safe-zone tracking in `caregiver.js`) employ randomized mock intervals.
- **Speech Recognition Compatibility:** Native browser speech recognition (`webkitSpeechRecognition`) is supported primarily in Chromium-based browsers (Google Chrome, Microsoft Edge) and requires explicit microphone permissions.
- **Email/SMS Dispatch:** While `nodemailer` is listed in dependencies and placeholders exist in `.env.example`, automated email and Twilio SMS dispatching are not yet connected to the controller trigger logic.

---

## Future Enhancements

- [ ] Complete full database persistence for the medication reminder scheduling module.
- [ ] Connect the AI Chatbot and Voice Assistant to a generative LLM API (e.g., Google Gemini API) for conversational support.
- [ ] Implement WebSockets (e.g., Socket.io) for real-time bidirectional push of SOS alerts to doctor and caregiver screens.
- [ ] Implement HIPAA/GDPR-compliant data encryption for medical notes and personal health identifiers.
- [ ] Develop native cross-platform mobile companions using React Native or Flutter for background geofencing.

---

## Academic Project Disclaimer

This software repository has been conceived, designed, and constructed strictly as an **academic prototype and portfolio demonstration**. It is **not** a certified medical device, diagnostic instrument, or clinical tele-monitoring solution. It must **not** be used for genuine emergency management or actual patient diagnosis. Never input real patient health records or sensitive personal identifiers into this prototype.

---

## Contributors and Acknowledgements

- **Project Lead & Author:** Amaresh Ganigera
- **Collaborator:** V. Shashank
- Developed as an academic software engineering and healthcare informatics collaborative project.
- Acknowledgement to open-source maintainers of Express.js, MySQL2, and the Web Speech API standards community.
