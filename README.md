# Work-Link

<<<<<<< HEAD
Work-Link is a basic full-stack job portal that connects job seekers with local job posters and daily workers in Pithumpur. The project aims to improve accessibility to work and create opportunities for blue-collar and grey-collar workers through a simple and user-friendly web platform.

## Features

- User Registration and Login (Job Seeker / Job Poster)
- JWT Authentication
- Job Poster Dashboard (post, view and delete jobs)
- Job Seeker page (browse, filter and apply for jobs)
- Applicant Notifications for Job Posters
- Contact Page
- Responsive User Interface
=======
Work-Link is a basic full-stack service booking platform designed to connect users with local service providers and daily workers. The project aims to improve accessibility to services and create opportunities for blue-collar and grey-collar workers through a simple and user-friendly web platform.

## Features

- User Registration and Login
- Authentication System
- Service Provider Dashboard
- Customer Service Booking
- Responsive User Interface
- Contact Page
- Basic Backend Integration
>>>>>>> 6b52cf68c863b0676081cc5d6c9cf6100db60120
- REST API Based Communication

## Tech Stack

### Frontend
<<<<<<< HEAD
- React 18 + Vite
- React Router
- CSS3
=======
- HTML5
- CSS3
- JavaScript
>>>>>>> 6b52cf68c863b0676081cc5d6c9cf6100db60120

### Backend
- Node.js
- Express.js
<<<<<<< HEAD
- MongoDB + Mongoose
- JWT + bcryptjs
=======
>>>>>>> 6b52cf68c863b0676081cc5d6c9cf6100db60120

### Tools
- Git
- GitHub
- VS Code

## Project Structure

<<<<<<< HEAD
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
=======
```text
WORK-LINK
│
├── public
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── contact.html
│   ├── index-auth.html
│   └── provider-dashboard.html
│
├── server.js
├── package.json
├── .env
└── .gitignore
>>>>>>> 6b52cf68c863b0676081cc5d6c9cf6100db60120
```

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/WORK-LINK.git
<<<<<<< HEAD
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
=======
```

### Navigate to Project Folder

```bash
cd WORK-LINK
```

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
node server.js
```

The application will start on:

```text
http://localhost:3000
```

## Objective

The main objective of Work-Link is to provide a digital platform where users can easily find and book local services while helping workers gain better visibility and employment opportunities.
>>>>>>> 6b52cf68c863b0676081cc5d6c9cf6100db60120

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
