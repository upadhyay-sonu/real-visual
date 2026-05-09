# 3D Object Viewer & Manager

A production-grade, full-stack MERN application for uploading, managing, and viewing 3D models (`.glb` files) interactively in the browser.

## Features
- **Secure Authentication:** JWT-based user registration and login with bcrypt password hashing.
- **Dynamic 3D Viewer:** Built with React, Three.js, and React Three Fiber. Supports rotation, zoom, pan, and camera state persistence.
- **Environment-Aware Storage:** 
  - **Development:** Local Multer-based `.glb` uploads.
  - **Production:** AWS S3 integration utilizing Pre-signed URLs for secure, fast delivery.
- **Modern UI/UX:** Responsive, dark-themed SaaS-like dashboard built with standard React Context and modular components.

## Architecture

This platform employs a decoupled Client-Server architecture:
1. **Frontend (Client):** A Vite + React Single Page Application (SPA). It uses `Axios` for HTTP requests, `React Router` for protected navigation, and `@react-three/fiber` for managing the webGL context declaratively.
2. **Backend (Server):** An Express.js REST API. It delegates data persistence to MongoDB and file storage to either the local file system or AWS S3 dynamically. 
3. **Database:** MongoDB Atlas, managed via `Mongoose` schemas.

## Local Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or Local MongoDB)

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (reference `server/.env.example`).
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

## Deployment Guides

### Frontend Deployment (Vercel)
1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the Root Directory to `client`.
4. Add the Environment Variable `VITE_API_URL` pointing to your deployed backend URL (e.g., `https://my-backend.onrender.com/api`).
5. Deploy.

### Backend Deployment (Render)
1. Create a new Web Service on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set the Root Directory to `server`.
4. Set the Build Command to `npm install` and Start Command to `npm start`.
5. Add all Environment Variables from your `.env` file (MONGO_URI, JWT_SECRET, USE_S3, etc.).
6. Deploy.
*(Note: If using Render's free tier, local file storage is ephemeral and will wipe on restart. It is highly recommended to configure `USE_S3=true` for production).*

### AWS Deployment
For a full enterprise AWS setup (EC2, S3, Nginx), please refer to the [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) guide included in this repository.

### MongoDB Atlas
1. Create a cluster on MongoDB Atlas.
2. Whitelist `0.0.0.0/0` in Network Access for production.
3. Copy your connection string into `MONGO_URI`.

## API Documentation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Authenticate and get JWT | No |
| GET | `/api/objects` | Get all uploaded models | Yes |
| POST | `/api/objects/upload` | Upload a `.glb` file | Yes |
| GET | `/api/objects/:id` | Get model data and URL | Yes |
| PUT | `/api/objects/:id/camera` | Save viewer camera state | Yes |
| DELETE | `/api/objects/:id` | Delete model | Yes |

---
*Built with React, Express, Three.js, and MongoDB.*
