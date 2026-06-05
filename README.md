# RoseReview AI

![RoseReview Dashboard Banner](https://dummyimage.com/1200x300/06060b/f43f5e&text=RoseReview+AI)

**RoseReview AI** is a next-generation, repository-aware code review platform that acts like a senior developer on your team. It delivers high-signal pull request reviews, identifies deployment risks, evaluates code health, and integrates directly with GitHub—all wrapped in a stunning, premium dark-mode interface.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-org%2Frosereview)

---

## 🌟 Key Features

### 1. Smart PR Analysis & GitHub Integration
- **Manual PR Tracking:** Paste any GitHub Pull Request URL into the global search bar to instantly track the repository and fetch real PR data.
- **Dynamic Context Switching:** Seamlessly switch between tracked repositories. The entire dashboard—including active PRs, analytics, and risk metrics—synchronizes instantly using a robust global state management system.
- **One-Click GitHub Commenting:** Generate comprehensive, senior-developer-styled markdown reviews directly in the dashboard, and post them directly to the GitHub PR thread with a single click.

### 2. Humanized "Senior Developer" AI Reviews
RoseReview doesn't just output generic bot feedback. It generates reviews that feel empathetic yet strict, analyzing:
- **Overall Health Score** (Security, Performance, Maintainability)
- **Blast Radius & Deployment Risk**
- **Architecture Boundaries & Dependency Coupling**
- **Specific line-level suggestions**

### 3. Premium User Experience
- **Sleek Dark Mode Aesthetics:** Designed with deep space backgrounds, glowing ambient orbs (`var(--accent-rose)`, `var(--accent-purple)`), and glassmorphism.
- **Skeleton Loading States:** When an AI analysis is running, the dashboard elegantly shifts into a pulsating skeleton loader, while the active "Analysis in progress" card remains highlighted.
- **Micro-animations & Interactive UI:** Smooth hover states, custom dropdowns, and highly responsive components built with vanilla CSS.

---

## 🛠️ Tech Stack

**Frontend**
- Vanilla HTML5 / CSS3 / ES6 Modules
- Custom Design System (CSS Variables, Flexbox/Grid)
- Zero framework overhead for maximum performance

**Backend**
- Fastify (High-performance Node.js web framework)
- TypeScript
- GitHub REST API Integrations (Octokit)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (v9+)
- A GitHub Personal Access Token (PAT)

### Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the Development Servers:**
   The project is structured as a monorepo. You can run the backend and frontend separately:

   *Start the Backend API:*
   ```bash
   pnpm run dev:api
   ```

   *Start the Frontend Web Server:*
   ```bash
   pnpm run dev:web
   ```

3. **Open the Dashboard:**
   Navigate to the local server URL provided by Vite (usually `http://localhost:5173`) in your browser to interact with the dashboard.

### 🚀 Production Deployment (Vercel + Render + Supabase)

This project is configured for a split deployment:
1. **Frontend (Vite)** is hosted on **Vercel** as a static application.
2. **Backend (Fastify)** is hosted on **Render** as a web service.
3. **Database (Prisma)** is hosted on **Supabase** (PostgreSQL).

#### 1. Setup Supabase
- Spin up a PostgreSQL database on Supabase.
- Copy your **Connection Pooler URL** (Port 6543, with transaction mode `?pgbouncer=true`) and **Direct URL** (Port 5432).

#### 2. Deploy Backend on Render
- Create a new **Web Service** on Render pointing to your repository.
- Root Directory: `RoseReview-AI`
- Build Command: `pnpm install; pnpm run build:api`
- Start Command: `pnpm --filter @rosereview/api start`
- Environment Variables:
  - `DATABASE_URL`: *Your Supabase Pooler URL*
  - `DIRECT_URL`: *Your Supabase Direct URL*
  - `PORT`: `3001`
  - `GROQ_API_KEY`: *Your Groq API key*
  - `GITHUB_TOKEN`: *Your GitHub PAT*
  - `CORS_ORIGIN`: *Your Vercel deployment URL*

#### 3. Deploy Frontend on Vercel
- Update `vercel.json` in your repository root so the `/api` rewrites point to your Render service URL (e.g. `https://rosereview-ai.onrender.com/api/$1`).
- Import the project into Vercel.
- Root Directory: `RoseReview-AI`
- Framework Preset: `Other`
- Build Command: `pnpm run build:web`
- Output Directory: `apps/web/dist`
- Install Command: `pnpm install`

---

## 💡 How to use the AI Analysis Feature

1. Open the RoseReview Dashboard.
2. In the top navigation bar, paste a real GitHub PR URL (e.g., `owner/repo#123` or `https://github.com/owner/repo/pull/123`).
3. Click **"Analyze PR"**.
4. Watch as the dashboard transitions into a skeleton loading state while the AI Agent simulates fetching files and evaluating code.
5. Once complete, expand the generated review card to view the senior-developer styled markdown payload.
6. Click **"Post to GitHub & Redirect"** to physically publish the comment to GitHub and open the PR!

---

## 🤝 Contributing

This project was built during the AI Hackathon for Builders. Contributions, feature requests, and UI/UX improvements are highly encouraged! Feel free to open an issue or submit a pull request.

---

## 📜 License

MIT License. See `LICENSE` for more information.
