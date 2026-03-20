# 📸 MERN Instagram Clone

### A Full Stack Social Media Application with Authentication, Posts, Likes, and Follow System

This project is a **full-stack Instagram clone built using the MERN stack (MongoDB, Express.js, React.js, Node.js)**.
The application allows users to register, login, create posts, like posts, follow or unfollow users, and interact with other users just like a real social media platform.

The project demonstrates a **modern full-stack architecture with a React frontend and a Node.js + Express backend connected to MongoDB.**

---

# 🚀 Features

### 🔐 Authentication

* User Registration
* User Login
* JWT-based authentication
* Password hashing using bcrypt
* Protected routes

---

### 👤 User System

* Create user accounts
* View user profiles
* Follow other users
* Unfollow users
* Manage followers and following lists

---

### 📸 Post System

* Create posts
* View all posts
* View posts by specific users

---

### ❤️ Like System

* Like posts
* Unlike posts
* Track engagement on posts

---

# 🛠 Tech Stack

## Frontend

* React.js
* React Router
* Axios
* Tailwind CSS / CSS

---

## Backend

* Node.js
* Express.js

---

## Database

* MongoDB
* Mongoose

---

## Authentication

* JWT (JSON Web Token)
* bcrypt

---

# 🏗 Project Architecture

```
project-root
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── services
│   └── App.jsx
│
├── backend
│   ├── src
│   │
│   ├── config
│   │   └── database.js
│   │
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   └── user.controller.js
│   │
│   ├── middlewares
│   │   └── auth.middleware.js
│   │
│   ├── models
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── follow.model.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   └── user.routes.js
│   │
│   ├── app.js
│   └── server.js
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **backend folder**.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# ▶️ Running the Project

## 1️⃣ Clone the repository

```
git clone https://github.com/yourusername/mern-instagram-clone.git
```

---

## 2️⃣ Install Backend Dependencies

```
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```
cd ../frontend
npm install
```

---

## 4️⃣ Start Backend Server

```
cd backend
npm run dev
```

---

## 5️⃣ Start Frontend

```
cd frontend
npm run dev
```

---

Frontend will run on:

```
http://localhost:5173
```

Backend will run on:

```
http://localhost:5000
```

---

# 🔑 API Functionalities

### Authentication APIs

* Register user
* Login user

### User APIs

* Get user profile
* Follow user
* Unfollow user

### Post APIs

* Create post
* Get posts
* Like post
* Unlike post

---

# 🎯 Purpose of the Project

This project demonstrates how to build a **real-world social media application using the MERN stack**, focusing on:

* Authentication with JWT
* REST API development
* MongoDB data modeling
* Social media relationship logic
* Full stack integration

---

# 👨‍💻 Author

Your Name

GitHub:dhruval1907
