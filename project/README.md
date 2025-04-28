# Skill-Based Project and Team Formation Platform

A full-stack application that enables users to register, log in, input their skills, and get intelligently matched with suitable projects or teammates.

## Features

- User registration and JWT-based authentication
- Skill input and management
- Project creation with required skill specifications
- Intelligent skill-based matching algorithm
- Dashboard for managing projects and viewing recommendations
- Responsive UI with intuitive navigation

## Tech Stack

### Frontend
- React.js
- React Router
- JWT Authentication
- Tailwind CSS
- Axios for API calls
- React Toastify for notifications

### Backend
- Node.js
- Express.js
- MySQL database
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd skill-matching-platform
   ```

2. Set up the database:
   - Create a MySQL database named `skill_matcher`
   - Update the database configuration in `server/config/database.js` with your MySQL credentials

3. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

4. Start the development servers:
   ```bash
   # Start the backend server (from the server directory)
   npm run dev
   
   # Start the frontend server (from the client directory)
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Routes

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

### Users
- GET `/api/users/me` - Get current user profile
- PUT `/api/users/me` - Update user profile
- GET `/api/users/applications` - Get user's applications
- GET `/api/users/projects` - Get user's projects

### Projects
- POST `/api/projects` - Create a new project
- GET `/api/projects` - Get all projects
- GET `/api/projects/recommended` - Get recommended projects
- GET `/api/projects/:id` - Get project details
- DELETE `/api/projects/:id` - Delete a project
- GET `/api/projects/:id/team` - Get project team
- GET `/api/projects/:id/match` - Get match score
- GET `/api/projects/:id/application` - Check application status
- POST `/api/projects/:id/apply` - Apply to a project

### Applications
- DELETE `/api/applications/:id` - Withdraw application

### Skills
- GET `/api/skills` - Get all unique skills

### Stats
- GET `/api/stats` - Get platform statistics