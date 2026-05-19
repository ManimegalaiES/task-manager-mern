# Task Manager Application

A full-stack Task Manager application built using the MERN Stack with secure authentication and task management features.

---

# Features

- Google Login Authentication
- JWT Authentication
- Protected Routes
- Create Task
- Edit Task
- Delete Task
- Update Task Status
- Search Tasks
- Priority Filter
- Status Filter
- Due Date Management
- Responsive Dashboard

---

# Technologies Used

## Frontend
- React.js
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication
- Google OAuth
- JWT Authentication

---

# AI Tools Used

- ChatGPT → Backend and API design
- Claude AI → Frontend enhancement and UI improvements

---

# Project Setup Instructions

## Prerequisites

Install:
- Node.js
- MongoDB
- Git

---

# Backend Setup

## Step 1: Navigate to Backend Folder

```bash
cd backend
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Create `.env` File

Add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

## Step 4: Start Backend Server

```bash
npm start
```

---

# Frontend Setup

## Step 1: Navigate to Frontend Folder

```bash
cd frontend
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Create `.env` File

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Step 4: Start Frontend

```bash
npm run dev
```

---

# Running the Application

1. Start backend server
2. Start frontend server
3. Open browser:
   
```text
http://localhost:5173
```

---

# Authentication

- Users can log in using Google Authentication.
- JWT tokens are used for protected routes and secure access.

---

# Known Limitations

- No offline support
- No real-time collaboration
- No notification system
- No file attachment support

---

# Security Notes

- Do not expose `.env` files publicly.
- Never share JWT secrets or database credentials.

---

# GitHub Push Instructions

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```
