# Setup Guide — NeuroCare AI

Detailed instructions for setting up the NeuroCare AI project on your local machine.

## Prerequisites

| Software | Version | Purpose |
|---|---|---|
| **Node.js** | 18.x or later | Backend runtime |
| **npm** | Included with Node.js | Package management |
| **MySQL** | 8.0 or later | Database |
| **Git** | Latest | Version control |
| **Web Browser** | Chrome or Edge (recommended) | Frontend (Web Speech API support required) |

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/neurocare-ai.git
cd neurocare-ai
```

## Step 2: Set Up the Database

1. Open your MySQL client (MySQL Workbench, command line, or phpMyAdmin).

2. Run the schema file to create the database and tables:

```bash
mysql -u root -p < backend/database/schema.sql
```

Or open `backend/database/schema.sql` in MySQL Workbench and execute it.

This creates:
- Database: `alzheimer_ai_db`
- Tables: `users`, `patients`, `appointments`, `emergencies`, `memory_tests`

## Step 3: Configure Environment Variables

1. Navigate to the backend directory:

```bash
cd backend
```

2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Open `backend/.env` and fill in your values:

```env
# Required — update these:
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=generate_a_strong_random_string

# Optional — for email alerts:
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Important:** Never commit the `.env` file. It is excluded by `.gitignore`.

### Generating a JWT Secret

You can generate a random secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 5: Start the Backend Server

**Development mode** (auto-restart on file changes):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`.

You should see:
```
🚀 Server running on port 5000
MySQL connected: localhost alzheimer_ai_db
```

## Step 6: Access the Application

Open your browser and navigate to:

```
http://localhost:5000
```

The Express server serves both the API and the static frontend files.

### Quick Test

1. Go to `http://localhost:5000/register.html` and create an account.
2. Go to `http://localhost:5000/login.html` and log in.
3. You will be redirected to the appropriate dashboard based on your role.

## Project Structure Quick Reference

```
backend/           → Node.js Express server
├── server.js      → Entry point
├── db.js          → Database connection
├── controllers/   → Business logic
├── routes/        → API route definitions
├── middleware/     → Authentication middleware
├── database/      → SQL schema
└── .env.example   → Environment template

html/              → Frontend HTML pages
css/               → Stylesheets
js/                → Frontend JavaScript
```

## Troubleshooting

### MySQL Connection Error

- Verify MySQL is running on port 3306.
- Check that `DB_USER` and `DB_PASSWORD` in `.env` are correct.
- Ensure the database `alzheimer_ai_db` exists (run `schema.sql`).

### Port Already in Use

Change the `PORT` value in `backend/.env`:

```env
PORT=5001
```

### Web Speech API Not Working

- Use **Google Chrome** or **Microsoft Edge** (Firefox has limited Speech API support).
- Ensure your browser has microphone permissions enabled.
- HTTPS may be required for speech recognition in some browsers (localhost is usually exempt).

### CORS Errors

The server allows all origins in development mode. If you encounter CORS issues, verify the backend is running and accessible at `http://localhost:5000`.
