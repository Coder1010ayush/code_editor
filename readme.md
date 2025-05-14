# SparkX Code Editor

A full-stack web-based code editor platform built with a React frontend and a Node.js backend. Users can write, execute, and manage code in real time.

## Features

- Browser-based code editor
- Supports multiple languages (coming soon)
- Code execution and evaluation engine
- Admin panel for managing problems and contests
- Auth system (login/register)
- Responsive design

## Tech Stack

- **Frontend:** Next.js , React, JavaScript, CSS Modules
- **Backend:** Node.js
- **Editor:** (Monaco/CodeMirror planned or integrated)

---

## Code Structure
.
├── client/                 # React frontend
│   ├── components/         # Shared components (Navbar, Login, etc.)
│   ├── context/            # Auth context
│   ├── pages/              # All route-based pages (Dashboard, Editor, Contest, etc.)
│   ├── services/           # API service functions
│   ├── App.js              # Entry point for React
│   └── index.js
├── server/
│   ├── models/             # Mongoose models (User, Contest, Submission, etc.)
│   ├── controllers/        # Business logic for routes
│   ├── routes/             # Express routes (auth, contests, problems, submissions)
│   ├── middleware/         # Custom middleware (auth checks, error handlers)
│   └── server.js           # Main entry point for Express server
|   |_____ tests              # this contain all the test cases for api routing


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/code_editor.git
cd code_editor

01. Run the server
        npm install 
        npm start

02.Run the client
        npm install
        npm start
