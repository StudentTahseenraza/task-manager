# 🚀 TaskSphere — 3D Task Management System

![TaskSphere Banner](https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)

An immersive **3D task management platform** featuring glass-morphism UI, smooth animations, and real-time productivity insights. Built with modern web technologies to deliver a futuristic user experience.

---

## ✨ Features

### 🎨 Immersive 3D Interface
- Interactive **3D task visualization** using Three.js  
- Glass-morphism design with gradient overlays  
- Particle background animations  
- Smooth page transitions using Framer Motion  

---

### 📊 Complete Task Management
- Full **CRUD** operations with rich metadata  
- Advanced filtering (status, priority, search)  
- Real-time task preview while editing  
- Drag-and-drop task status updates *(coming soon)*  

---

### 👤 User Management
- Secure **JWT-based authentication**  
- User profile & avatar management  
- Activity tracking & session handling  
- Role-based permissions *(coming soon)*  

---

### 📈 Analytics Dashboard
- Interactive charts using **Recharts**  
- Productivity & performance metrics  
- Task distribution visualizations  
- Time allocation analysis  

---

### 🎯 Smart Features
- Priority-based task organization  
- Due-date reminders & notifications  
- Task collaboration *(coming soon)*  
- Fully responsive (mobile + desktop)  
- Dark / Light mode toggle  

---

🛠️ Tech Stack
🎨 Frontend
<p align="left"> <img src="https://skillicons.dev/icons?i=react" height="40" alt="React"/> <img src="https://skillicons.dev/icons?i=vite" height="40" alt="Vite"/> <img src="https://skillicons.dev/icons?i=tailwind" height="40" alt="Tailwind CSS"/> <img src="https://skillicons.dev/icons?i=threejs" height="40" alt="Three.js"/> <img src="https://skillicons.dev/icons?i=js" height="40" alt="JavaScript"/> <img src="https://skillicons.dev/icons?i=css" height="40" alt="CSS"/> </p> <p> 🎬 Framer Motion &nbsp; | &nbsp; 🧾 React Hook Form &nbsp; | &nbsp; ✅ Zod &nbsp; | &nbsp; 🔀 React Router v6 &nbsp; | &nbsp; 🌐 Axios &nbsp; | &nbsp; 🔔 React Hot Toast </p>
🧠 Backend
<p align="left"> <img src="https://skillicons.dev/icons?i=nodejs" height="40" alt="Node.js"/> <img src="https://skillicons.dev/icons?i=express" height="40" alt="Express.js"/> <img src="https://skillicons.dev/icons?i=mongodb" height="40" alt="MongoDB"/> <img src="https://skillicons.dev/icons?i=js" height="40" alt="JavaScript"/> </p> <p> 🔐 JWT Authentication &nbsp; | &nbsp; 🔑 bcryptjs &nbsp; | &nbsp; 🛡️ Helmet &nbsp; | &nbsp; 🌍 CORS &nbsp; | &nbsp; 📝 Morgan </p>
🧰 DevOps & Tools
<p align="left"> <img src="https://skillicons.dev/icons?i=git" height="40" alt="Git"/> <img src="https://skillicons.dev/icons?i=github" height="40" alt="GitHub"/> <img src="https://skillicons.dev/icons?i=vercel" height="40" alt="Vercel"/> <img src="https://skillicons.dev/icons?i=render" height="40" alt="Render"/> <img src="https://skillicons.dev/icons?i=eslint" height="40" alt="ESLint"/> <img src="https://skillicons.dev/icons?i=postcss" height="40" alt="PostCSS"/> </p>

---

## 🚀 Quick Start

### 📦 Prerequisites
- Node.js **16+**
- MongoDB **6.0+**
- npm or yarn

---

### 🔧 Installation

#### 1️⃣ Clone the Repository

    git clone https://github.com/yourusername/tasksphere.git
    cd tasksphere
    2️⃣ Backend Setup
    cd backend
    npm install
    cp .env.example .env
    npm run seed   # optional
    npm run dev
    3️⃣ Frontend Setup
    cd frontend
    npm install
    npm run dev

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:5000](http://localhost:5000) |


🔐 Environment Variables

    Backend
    PORT=5000
    NODE_ENV=production
    JWT_SECRET=your_secure_jwt_secret
    MONGODB_URI=your_mongodb_connection_string

📱 Pages Overview

| Page      | Route               | Description           |
| --------- | ------------------- | --------------------- |
| Dashboard | `/dashboard`        | Stats & quick actions |
| Tasks     | `/tasks`            | Task management       |
| Profile   | `/profile`          | User settings         |
| Analytics | `/analytics`        | Productivity insights |
| Auth      | `/login`, `/signup` | Authentication        |


🔧 API Documentation
🔐 Authentication

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| POST   | `/api/v1/auth/signup` | Register user |
| POST   | `/api/v1/auth/login`  | Login user    |


👤 Profile

| Method | Endpoint     | Description    |
| ------ | ------------ | -------------- |
| GET    | `/api/v1/me` | Get profile    |
| PUT    | `/api/v1/me` | Update profile |

🗂️ Tasks

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| GET    | `/api/v1/tasks`     | Get all tasks   |
| POST   | `/api/v1/tasks`     | Create task     |
| GET    | `/api/v1/tasks/:id` | Get single task |
| PUT    | `/api/v1/tasks/:id` | Update task     |
| DELETE | `/api/v1/tasks/:id` | Delete task     |


🚀 Deployment

    🧠 Backend ( Render)
    npm i -g @railway/cli
    railway login
    railway up
    
    🌍 Frontend (Vercel)
    cd frontend
    npm run build
    vercel --prod



    BCRYPT_SALT_ROUNDS=10
    CORS_ORIGIN=https://your-frontend-domain.com
    
    Frontend
    VITE_API_URL=https://your-backend-domain.com/api/v1
    VITE_APP_NAME=TaskSphere
    VITE_APP_VERSION=1.0.0


📮 API Documentation (Postman)
------------
🔹 Postman Collection
=
A Postman collection is provided to test all authentication, profile, and CRUD APIs.

Steps to use:

Open Postman

Import the collection from:

/docs/TaskSphere.postman_collection.json


Set environment variables:

BASE_URL → http://localhost:5000/api/v1

TOKEN → JWT token received after login

The collection includes:

Auth (Signup / Login)

Profile (Get / Update)

Tasks CRUD (Create, Read, Update, Delete)


📈 Scaling This Application for Production 
----------
How would you scale this for production?

For production, I would deploy the frontend on Vercel and the backend on Render/Railway with environment-based configuration. Sensitive values (JWT secrets, DB credentials, CORS origins) would be managed using environment variables, never hardcoded. CORS would be restricted to trusted domains only. MongoDB performance would be improved using indexes on frequently queried fields (userId, status, createdAt). I would introduce pagination and filtering for large datasets and add Redis caching for frequently accessed data. API rate limiting and request validation would be enforced for security. Logging and monitoring would be handled using centralized logs and health checks.




