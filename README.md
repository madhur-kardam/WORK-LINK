# Work-Link

Work-Link is a basic full-stack job portal that connects job seekers with local job posters and daily workers in Pithumpur. The project aims to improve accessibility to work and create opportunities for blue-collar and grey-collar workers through a simple and user-friendly web platform.

## Features

- User Registration and Login (Job Seeker / Job Poster)
- JWT Authentication
- Job Poster Dashboard (post, view and delete jobs)
- Job Seeker page (browse, filter and apply for jobs)
- Applicant Notifications for Job Posters
- Contact Page
- Responsive User Interface
- REST API Based Communication

## Tech Stack

### Frontend
- React 18 + Vite
- React Router
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcryptjs

### Tools
- Git
- GitHub
- VS Code

## Project Structure

MERN stack, modular monolith, MVC architecture.

```text
WORKLINK/
├── frontend/                  # React + Vite
│   └── src/
│       ├── components/        # Navbars, JobCard, JobFilters, PostJobForm, ...
│       ├── pages/             # Home, Login, Register, Contact, FindJobs, PosterDashboard
│       ├── services/          # API calls
│       └── context/           # AuthContext
│
├── backend/                   # Node.js + Express
│   ├── models/                # Mongoose schemas
│   ├── controllers/           # Request handling
│   ├── routes/                # REST API routes
│   ├── middleware/            # Auth
│   ├── services/              # Business logic
│   ├── config/                # DB + JWT config
│   └── app.js
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/WORK-LINK.git
cd WORK-LINK
```

### Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in MONGODB_URI and JWT_SECRET
npm run dev
```

Runs on `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` (requests to `/api` are proxied to the backend on port 3000).

## Objective

The main objective of Work-Link is to provide a digital platform where users can easily find and post local jobs while helping workers gain better visibility and employment opportunities.

## Learning Outcomes

Through this project, I gained experience in:

- Full-Stack Web Development
- Frontend and Backend Integration
- REST API Fundamentals
- Authentication Concepts
- Git and GitHub Workflow
- Project Deployment and Version Control

## Future Improvements

- Payment Gateway Integration
- Real-time Chat System
- Service Rating and Reviews
- Location-Based Service Discovery
- Admin Dashboard
- Mobile Responsive Enhancements

## Author

**Madhur Kardam**

- GitHub: https://github.com/madhur-kardam
- LinkedIn: https://www.linkedin.com/in/madhur-kardam

---

This project was developed as a learning project to strengthen full-stack web development skills and understand real-world application architecture.
