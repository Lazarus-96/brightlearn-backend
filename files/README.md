# BrightLearn — Full-Stack Education Platform

A production-ready full-stack application: Next.js 14 + Express + MongoDB + JWT auth.

---

## Project Structure
```
brightlearn-app/
├── backend/           # Node.js + Express API
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   └── userController.js
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── errorHandler.js
│       │   └── rateLimiter.js
│       ├── models/User.js
│       ├── routes/
│       │   ├── auth.js
│       │   └── user.js
│       ├── utils/generateToken.js
│       └── validations/authValidation.js
└── frontend/          # Next.js 14 + Tailwind CSS
    ├── app/
    │   ├── page.jsx              (landing page)
    │   ├── layout.jsx
    │   ├── globals.css
    │   ├── (auth)/
    │   │   ├── login/page.jsx
    │   │   └── signup/page.jsx
    │   └── dashboard/page.jsx    (protected)
    ├── components/
    │   ├── layout/{Navbar,Footer}.jsx
    │   ├── sections/{Hero,Features,HowItWorks,Testimonials,Pricing,CTA}.jsx
    │   └── ui/{Button,Input}.jsx
    ├── context/AuthContext.jsx
    ├── lib/api.js
    └── middleware.js   (Next.js edge route protection)
```

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1 — Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI and JWT_SECRET

npm install
npm run dev
# API runs on http://localhost:5000
```

### 2 — Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:5000

npm install
npm run dev
# App runs on http://localhost:3000
```

---

## API Reference

### Auth Endpoints

| Method | Endpoint             | Auth | Description             |
|--------|----------------------|------|-------------------------|
| POST   | `/api/auth/signup`   | ✗    | Create new account      |
| POST   | `/api/auth/login`    | ✗    | Login + get JWT token   |
| GET    | `/api/auth/me`       | ✓    | Get current user        |

### User Endpoints (all require Bearer token)

| Method | Endpoint                     | Description         |
|--------|------------------------------|---------------------|
| GET    | `/api/user/profile`          | Get user profile    |
| PUT    | `/api/user/profile`          | Update name/avatar  |
| PUT    | `/api/user/change-password`  | Change password     |

### Health Check

```
GET /health
```

---

## Postman / cURL Examples

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Aisha Raza","email":"aisha@school.edu","password":"Password1"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aisha@school.edu","password":"Password1"}'
```

### Get current user (protected)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update profile
```bash
curl -X PUT http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Aisha R. Updated"}'
```

---

## Security Features

- **bcryptjs** (12 rounds) for password hashing
- **JWT** with configurable expiry (default 7 days)
- **Helmet** for HTTP security headers
- **express-rate-limit**: 10 requests/15 min on auth routes
- **express-validator** for input sanitisation
- **CORS** locked to frontend URL
- Password never returned in API responses (schema `select: false`)
- Generic error messages to prevent email enumeration
- Next.js edge middleware for SSR route protection

---

## Deployment

### Backend (Railway / Render / Fly.io)
```bash
# Set env vars:
NODE_ENV=production
MONGO_URI=<your_atlas_uri>
JWT_SECRET=<64_char_random_string>
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel)
```bash
# Set env vars:
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

---

## Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Frontend    | Next.js 14, React 18        |
| Styling     | Tailwind CSS, custom tokens |
| HTTP client | Axios                       |
| State       | React Context API           |
| Backend     | Node.js, Express 4          |
| Database    | MongoDB + Mongoose          |
| Auth        | JWT + bcryptjs              |
| Validation  | express-validator           |
| Security    | Helmet, CORS, rate-limit    |
