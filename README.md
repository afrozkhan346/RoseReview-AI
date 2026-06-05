<div align="center">

# 🌹 RoseReview AI

**A next-generation, repository-aware AI code review platform**

![RoseReview AI](https://dummyimage.com/1200x300/06060b/f43f5e&text=RoseReview+AI+-+AI-Powered+Code+Reviews)
<div align="center">


![License MIT](https://img.shields.io/badge/LICENSE-MIT-0EA5E9?style=for-the-badge)
![Node.js](https://img.shields.io/badge/NODE.JS-22+-22C55E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/FASTIFY-5-000000?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/POSTGRESQL-14+-3b82f6?style=for-the-badge&logo=postgresql&logoColor=white)
![Vanilla CSS](https://img.shields.io/badge/VANILLA_CSS-3-3b82f6?style=for-the-badge&logo=css3&logoColor=white)
![Vite](https://img.shields.io/badge/VITE-8-8b5cf6?style=for-the-badge&logo=vite&logoColor=white)
![Render](https://img.shields.io/badge/RENDER-DEPLOY-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/VERCEL-DEPLOY-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

**RoseReview AI** acts like a senior developer on your team — delivering high-signal pull request reviews, identifying deployment risks, evaluating code health, and integrating directly with GitHub. All wrapped in a stunning, premium dark-mode interface.

---

### 📋 Project Badges

![License MIT](https://img.shields.io/badge/LICENSE-MIT-0EA5E9?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-WELCOME-22C55E?style=for-the-badge)
![Maintained](https://img.shields.io/badge/MAINTAINED-YES-6366f1?style=for-the-badge)

---

### 🛠️ Tech Stack

**Frontend**

![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Vanilla CSS](https://img.shields.io/badge/CSS3-Vanilla-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vite](https://img.shields.io/badge/VITE-8-8b5cf6?style=for-the-badge&logo=vite&logoColor=white)

**Backend**

![Node.js](https://img.shields.io/badge/NODE.JS-22+-22C55E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/FASTIFY-5-000000?style=for-the-badge&logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**Database & ORM**

![PostgreSQL](https://img.shields.io/badge/POSTGRESQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/SUPABASE-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black)
![Prisma](https://img.shields.io/badge/PRISMA-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

**AI & Integrations**

![Groq](https://img.shields.io/badge/GROQ-AI-F55036?style=for-the-badge&logo=groq&logoColor=white)
![GitHub API](https://img.shields.io/badge/GITHUB-REST%20API-181717?style=for-the-badge&logo=github&logoColor=white)

**Deployment**

![Render](https://img.shields.io/badge/RENDER-BACKEND-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/VERCEL-FRONTEND-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## ✨ Key Features

### 1. 🤖 Humanized "Senior Developer" AI Reviews (Powered by Groq)
RoseReview generates empathetic, strict, and actionable reviews — not generic bot feedback. Powered by **Groq's ultra-fast LLM inference**, each analysis covers:
- **Overall Health Score** — Security, Performance, Maintainability
- **Blast Radius & Deployment Risk** — Identify what could break in production
- **Architecture Boundaries & Dependency Coupling** — Structural red flags
- **Line-level Suggestions** — Precise, actionable code feedback

### 2. 🔗 Smart PR Analysis & GitHub Integration
- **Manual PR Tracking** — Paste any GitHub PR URL to instantly fetch real PR data
- **Dynamic Context Switching** — Switch between tracked repos; the entire dashboard syncs instantly
- **One-Click GitHub Commenting** — Post AI-generated markdown reviews directly to the GitHub PR thread

### 3. 🔐 Authentication
- **OAuth via GitHub** — Seamlessly authenticate using your GitHub account
- **Google Sign-In** — Sign in with Google for quick access
- **JWT-based Sessions** — Secure, stateless authentication with refresh token support

### 4. 💎 Premium User Experience
- **Sleek Dark Mode Aesthetics** — Deep space backgrounds, glowing ambient orbs, and glassmorphism
- **Skeleton Loading States** — Elegant pulsating skeleton loaders during AI analysis
- **Micro-animations & Interactive UI** — Smooth hover states, custom dropdowns, responsive components

---

## 🏗️ Project Architecture

This is a **pnpm monorepo** with a clean separation of concerns:

```
RoseReview-AI/
├── apps/
│   ├── api/          # Fastify backend (TypeScript, Prisma, Groq AI)
│   └── web/          # Vite frontend (Vanilla JS/HTML/CSS)
├── packages/         # Shared utilities and types
├── pnpm-workspace.yaml
└── package.json
```

**Deployment Architecture:**
```
Browser → Vercel (Frontend) → Render (API) → Supabase (PostgreSQL)
                                           ↘ Groq (AI Inference)
                                           ↘ GitHub REST API
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** v18 or higher
- **pnpm** v9 or higher
- A **GitHub Personal Access Token (PAT)**
- A **Groq API Key** ([get one free at console.groq.com](https://console.groq.com))
- A **Supabase** project with a PostgreSQL database

### 1. Clone & Install

```bash
git clone https://github.com/afrozkhan346/RoseReview-AI.git
cd RoseReview-AI
pnpm install
```

### 2. Configure Environment Variables

**Backend** — create `apps/api/.env`:
```env
DATABASE_URL="postgresql://..."       # Supabase Pooler URL (port 6543)
DIRECT_URL="postgresql://..."         # Supabase Direct URL (port 5432)
GROQ_API_KEY="gsk_..."               # Groq API key
GITHUB_TOKEN="ghp_..."               # GitHub Personal Access Token
GITHUB_CLIENT_ID="..."               # GitHub OAuth App Client ID
GITHUB_CLIENT_SECRET="..."           # GitHub OAuth App Client Secret
GOOGLE_CLIENT_ID="..."               # Google OAuth Client ID
GOOGLE_CLIENT_SECRET="..."           # Google OAuth Client Secret
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:5173"
PORT=3001
```

**Frontend** — create `apps/web/.env`:
```env
VITE_API_URL="http://localhost:3001"
```

### 3. Set Up the Database

```bash
pnpm --filter @rosereview/api prisma migrate dev
```

### 4. Run Development Servers

```bash
# Start backend API (http://localhost:3001)
pnpm run dev:api

# Start frontend (http://localhost:5173)
pnpm run dev:web
```

---

## ☁️ Production Deployment

This project uses a split deployment strategy:
- 🌐 **Frontend** → [Vercel](https://vercel.com) (Static Vite App)
- ⚙️ **Backend** → [Render](https://render.com) (Node.js Web Service)
- 🗄️ **Database** → [Supabase](https://supabase.com) (Managed PostgreSQL)
- 🤖 **AI** → [Groq](https://console.groq.com) (LLM Inference API)

### Step 1 — Supabase (Database)
1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **Settings → Database** and copy:
   - **Pooler URL** (Port `6543`, transaction mode) → `DATABASE_URL`
   - **Direct URL** (Port `5432`) → `DIRECT_URL`

### Step 2 — Render (Backend API)
1. Create a new **Web Service** pointing to your GitHub repo
2. Set the following configuration:

| Setting | Value |
|---|---|
| **Root Directory** | `RoseReview-AI` |
| **Build Command** | `pnpm install; pnpm run build:api` |
| **Start Command** | `pnpm --filter @rosereview/api start` |

3. Add these **Environment Variables**:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase Pooler URL |
| `DIRECT_URL` | Supabase Direct URL |
| `GROQ_API_KEY` | Your Groq API key |
| `GITHUB_TOKEN` | Your GitHub PAT |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `JWT_SECRET` | A strong random secret |
| `CORS_ORIGIN` | Your Vercel frontend URL |
| `PORT` | `3001` |

### Step 3 — Vercel (Frontend)
1. Update `vercel.json` — set `/api` rewrites to point to your Render URL
2. Import project on [vercel.com](https://vercel.com)

| Setting | Value |
|---|---|
| **Root Directory** | `RoseReview-AI` |
| **Framework Preset** | `Other` |
| **Build Command** | `pnpm run build:web` |
| **Output Directory** | `apps/web/dist` |
| **Install Command** | `pnpm install` |

3. Add environment variable: `VITE_API_URL` → your Render service URL

---

## 💡 How to Use AI Review

1. Open the **RoseReview Dashboard**
2. Paste a GitHub PR URL in the top search bar (e.g., `https://github.com/owner/repo/pull/123`)
3. Click **"Analyze PR"**
4. The dashboard transitions into a skeleton loading state while **Groq AI** fetches and evaluates the code
5. Expand the generated review card to see the senior-developer styled analysis
6. Click **"Post to GitHub & Redirect"** to publish the comment directly to the GitHub PR thread

---

## 🤝 Contributing

Contributions, feature requests, and UI/UX improvements are always welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature-name`
5. Open a **Pull Request** targeting `main`

Please ensure your changes do not break the build before submitting a PR.

---

## 📜 License

This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
  Built with ❤️ for the AI Hackathon for Builders
</div>
