# Project Architecture — NeuroCare AI

## Overview

NeuroCare AI is a full-stack web application for Alzheimer's and dementia care support. It follows a client-server architecture with a REST API backend and a static HTML/CSS/JS frontend.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐│
│  │ Patient  │  │ Doctor   │  │ Caregiver│  │  Public       ││
│  │Dashboard │  │Dashboard │  │Dashboard │  │  Pages        ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘│
│       │              │              │               │        │
│       └──────────────┴──────────────┴───────────────┘        │
│                          │                                    │
│              fetch() with JWT Bearer Token                   │
│                 Browser APIs: Speech, GPS, Notifications     │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTP REST (JSON)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     EXPRESS SERVER (Node.js)                   │
│                        Port 5000                              │
│                                                               │
│  ┌─────────────┐  ┌──────────────────────────────────────┐   │
│  │  Middleware  │  │            API Routes                 │   │
│  │  - CORS     │  │  /api/auth/*      → authController    │   │
│  │  - JSON     │  │  /api/patients/*  → patientController │   │
│  │  - Static   │  │  /api/emergency/* → emergencyController│  │
│  │  - Auth     │  │  /api/memory-test/*→ memoryTestController│ │
│  └─────────────┘  │  /api/doctor/*    → doctorController  │   │
│                    └───────────────────┬──────────────────┘   │
│                                        │                      │
└────────────────────────────────────────┬──────────────────────┘
                                         │ mysql2 (connection pool)
                                         ▼
┌──────────────────────────────────────────────────────────────┐
│                      MySQL DATABASE                           │
│                   alzheimer_ai_db                             │
│                                                               │
│   ┌─────────┐  ┌──────────┐  ┌──────────────┐               │
│   │  users  │  │ patients │  │ appointments │               │
│   └────┬────┘  └────┬─────┘  └──────────────┘               │
│        │            │                                         │
│   ┌────┴──────────┐ │  ┌──────────────┐                      │
│   │ memory_tests  │ │  │ emergencies  │                      │
│   └───────────────┘ │  └──────────────┘                      │
│                     │                                         │
└─────────────────────┴─────────────────────────────────────────┘
```

## Component Descriptions

### Frontend (Static HTML/CSS/JS)

The frontend consists of plain HTML pages styled with a single master CSS file and powered by vanilla JavaScript modules. There are no frameworks (no React, Vue, or Angular).

- **Pages:** Landing, Login, Register, Patient Dashboard, Doctor Dashboard, Caregiver Dashboard, Memory Test, Emergency SOS, Chatbot, Appointments, Analytics, Medicine Reminder, Reports
- **Styling:** Custom CSS with glassmorphism effects, responsive grid layouts, and gradient themes
- **JavaScript:** Each page has its own JS file handling DOM manipulation, API calls, and browser API interactions
- **Browser APIs Used:** Web Speech API (text-to-speech and speech recognition), Geolocation API, Notifications API

### Backend (Node.js + Express)

The backend is a RESTful API server structured using the MVC pattern:

- **Entry Point:** `server.js` — initializes Express, middleware, and routes
- **Database Connection:** `db.js` — MySQL2 connection pool using environment variables
- **Controllers:** Handle business logic for auth, patients, doctors, emergencies, and memory tests
- **Middleware:** JWT-based authentication (`protect`) and role-based authorization (`authorizeRoles`)
- **Routes:** Clean separation of route definitions from controller logic

### Database (MySQL)

Five tables with foreign key relationships:

| Table | Purpose | Key Relationships |
|---|---|---|
| `users` | Authentication and user identity | Primary entity |
| `patients` | Patient profile details | FK → `users.id`, FK → `users.id` (doctor assignment) |
| `appointments` | Scheduled consultations | FK → `users.id` (doctor), FK → `patients.id` |
| `emergencies` | Emergency events/SOS alerts | FK → `users.id` |
| `memory_tests` | Cognitive test results | FK → `users.id` |

### Authentication Flow

1. User registers → password hashed with bcryptjs → stored in `users` table
2. User logs in → credentials verified → JWT token generated and returned
3. Frontend stores token in `localStorage`
4. All subsequent API requests include `Authorization: Bearer <token>` header
5. `authMiddleware.protect` verifies the token on each request
6. `authMiddleware.authorizeRoles` checks user role against allowed roles per route

### Data Flow Example: Emergency SOS

1. Patient clicks "ACTIVATE SOS" on `emergency.html`
2. `emergency.js` captures GPS location via Geolocation API
3. POST request sent to `/api/emergency/trigger` with event and location
4. `emergencyController.triggerEmergency` inserts record into `emergencies` table
5. Frontend plays siren sound, shows browser notification, speaks TTS alert
6. Doctor can view emergency on their dashboard via `/api/doctor/emergencies`
