# 🔐 Google OAuth Login System

Authentication system powered by **Google OAuth 2.0** — built with React + Go + PostgreSQL, fully containerized with Docker.

---

## ⚡ Quick Start

```bash
# 1. Clone and configure
cp .env.example .env
# Edit .env with your Google OAuth credentials (see setup guide below)

# 2. Run everything
docker-compose up --build

# 3. Open
open http://localhost:5173
```

---

## 🛠 Tech Stack

**Frontend** — React · TypeScript · Vite · TailwindCSS · Framer Motion  
**Backend** — Go · Gin · JWT (HTTP-only cookies)  
**Database** — PostgreSQL · golang-migrate  
**Infra** — Docker · Docker Compose · Nginx  

---

## ✨ Features

- 🔑 **Google OAuth** — Sign in with Google, no passwords
- 🍪 **Secure Sessions** — JWT stored in HTTP-only cookies
- 👤 **Profile Management** — Edit name, bio, phone, location
- 🌐 **Public Profiles** — Shareable URL at `/u/{username}`
- 🔒 **Privacy Controls** — Toggle public/private visibility
- 📊 **Dashboard** — Login stats, profile views, activity timeline
- 🌙 **Dark/Light Mode** — Theme toggle with persistence
- 🎨 **Glassmorphism UI** — Premium design with smooth animations
- 📱 **Fully Responsive** — Mobile-first across all screen sizes
- 🗑️ **Account Deletion** — Hard delete with full data wipe

---

## 📁 Project Structure

```
├── 📄 docker-compose.yml
├── 📄 .env
│
├── 🔧 backend/
│   ├── cmd/server/main.go          # Server entry point
│   ├── internal/
│   │   ├── database/               # PostgreSQL connection pool
│   │   ├── models/                 # User, Activity, ProfileView
│   │   ├── services/               # Auth, User, Activity logic
│   │   ├── handlers/               # REST API handlers
│   │   └── middleware/             # JWT auth, CORS
│   ├── migrations/                 # SQL schema migrations
│   └── Dockerfile                  # Multi-stage Go build
│
├── 🎨 frontend/
│   ├── src/
│   │   ├── pages/                  # Landing, Dashboard, Profile, PublicProfile
│   │   ├── components/ui/          # GlassCard, Avatar, AnimatedButton, etc.
│   │   ├── components/layout/      # Navbar, Background, ProtectedRoute
│   │   ├── context/                # AuthContext, ThemeContext
│   │   └── services/api.ts         # Axios API client
│   └── Dockerfile                  # Vite build + Nginx
```

---

## 🔧 Setup Guide

### Step 1 → Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project or select an existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Choose **Web application** and configure:
   - **Authorized JavaScript origins** → `http://localhost:5173`
   - **Authorized redirect URIs** → `http://localhost:8080/auth/google/callback`
6. Copy the **Client ID** and **Client Secret**

> 💡 You may need to configure the **OAuth consent screen** first — select "External", add your email as a test user.

### Step 2 → Environment Variables

```bash
cp .env.example .env
```

Fill in your credentials:

```env
GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
JWT_SECRET=any-random-string-here
```

### Step 3 → Run

```bash
docker-compose up --build
```

> 🚀 **Frontend** → http://localhost:5173  
> ⚙️ **Backend API** → http://localhost:8080  
> 🗄️ **PostgreSQL** → localhost:5432

---

## 🔌 API Reference

### Auth
```
GET  /auth/google              → Redirect to Google login
GET  /auth/google/callback     → OAuth callback handler
POST /auth/logout              → Clear auth cookie
GET  /auth/me                  → Get current user (protected)
```

### Users (protected)
```
GET    /api/users/me              → Get profile
PUT    /api/users/me              → Update profile
PUT    /api/users/me/username     → Change username
PUT    /api/users/me/toggle-public → Toggle visibility
DELETE /api/users/me              → Permanently delete account
GET    /api/users/me/stats        → Dashboard statistics
```

### Public
```
GET /api/profile/:username     → View public profile
GET /health                    → Health check
```

---

## 📝 Important Notes

- **Deleting an account** permanently removes all data — profile, activity logs, and profile views. Signing in again creates a fresh account.
- **Public profiles** are accessible at `{your-domain}/u/{username}`
- **JWT tokens** expire after 7 days
- **Database migrations** run automatically on server startup

---

## 📄 License

MIT
