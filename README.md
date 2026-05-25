# RoseReview

![RoseReview logo placeholder](https://dummyimage.com/1200x300/0b0d0f/ffffff&text=RoseReview+Logo)

**RoseReview**

**AI-Powered Code Review Assistant for Engineering Teams**

RoseReview is an intelligent, repository-aware code review platform that delivers high-signal pull request reviews with deployment risk prediction, AI-generated patches, smart test generation, humanized engineering explanations, low-noise review prioritization, and engineering impact analysis.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router v7](https://img.shields.io/badge/React%20Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Fastify](https://img.shields.io/badge/Fastify-5.x-000000?logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Groq](https://img.shields.io/badge/Groq-SDK-0a0a0a)](https://groq.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-00b894)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-passing-22c55e)](https://github.com/your-org/rosereview/actions)
[![GitHub Stars](https://img.shields.io/github/stars/your-org/rosereview?style=social)](https://github.com/your-org/rosereview)

---

## Why RoseReview?

Modern AI code review often amplifies noise instead of engineering signal. Teams face:

- Noisy reviews that overwhelm reviewers
- False positives that erode trust
- Shallow analysis without repo context
- Robotic explanations that do not help humans
- Reviewer fatigue and slow feedback loops
- Merge conflicts discovered too late
- Low confidence in AI-generated feedback

RoseReview solves these problems with:

- Repository-aware reviewing across code history and ownership
- Deployment risk analysis tied to real system impact
- Contextual intelligence that understands architecture and conventions
- Low-noise prioritization that surfaces only actionable issues
- Benchmark standards that align feedback with team expectations
- Intelligent engineering explanations that feel human and useful
- Humanized review communication that builds trust

---

## Core Features

| Feature | Description |
| --- | --- |
| **AI Severity Explanations** | Each finding is calibrated with clear severity and blast-radius reasoning so teams can act confidently. |
| **AI Patch Generation** | Generates review-ready patches with safe, minimal diffs and contextual notes to accelerate fixes. |
| **AI Test Case Generation** | Proposes targeted tests based on change impact, edge cases, and coverage gaps. |
| **Deployment Risk Prediction** | Scores PRs by production risk using dependency graphs, change scope, and historical incidents. |
| **PR Impact Analysis** | Maps functional impact across services, interfaces, and runtime surfaces. |
| **Context-Aware Reviews** | Learns repository conventions, patterns, and architecture to reduce false positives. |
| **Humanized Review Feedback** | Explanations read like a senior engineer, with actionable context and tradeoffs. |
| **Merge Conflict Prevention** | Detects competing changes and suggests resolution strategies earlier in the cycle. |
| **Team Benchmark Standards** | Enforces team-specific quality benchmarks and evolving engineering norms. |
| **Real-Time PR Risk Dashboard** | Live visibility into risk, severity, and team review load across active PRs. |

---

## Architecture Overview

```mermaid
flowchart LR
	FE[Frontend] --> API[API Layer]
	API --> AI[AI Review Engine]
	AI --> GH[GitHub Integration]
	GH --> DB[(PostgreSQL Database)]
	DB --> RISK[Risk Analysis Engine]
```

---

## Tech Stack

**Frontend**
- React Router v7
- TypeScript
- Tailwind CSS
- Radix UI
- Framer Motion
- Recharts

**Backend**
- Fastify
- TypeScript

**AI**
- Groq SDK
- Llama 3.3 70B

**Database**
- PostgreSQL
- Prisma

**Integrations**
- Octokit
- GitHub Webhooks

**Infrastructure**
- Docker
- Vercel
- Railway/Render

---

## Monorepo Structure

```
apps/web
apps/api
packages/shared
packages/ai
packages/github
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
pnpm install
```

### Environment Variables

Create `.env` files in `apps/web` and `apps/api` as needed.

**API (.env)**
```bash
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token
DATABASE_URL=postgresql://user:password@localhost:5432/rosereview
REDIS_URL=redis://localhost:6379
```

**Web (.env)**
```bash
VITE_API_URL=http://localhost:3001
```

### Database Setup

```bash
pnpm --filter apps/api prisma migrate dev
pnpm --filter apps/api prisma db seed
```

### Start the Frontend

```bash
pnpm --filter apps/web dev
```

### Start the Backend

```bash
pnpm --filter apps/api dev
```

### Local Development Workflow

- Open a PR in a connected GitHub repo
- RoseReview ingests context and runs risk analysis
- AI review results appear in the dashboard and PR thread

<details>
<summary>Optional: Docker Compose for local services</summary>

```bash
docker compose up -d
```
</details>

---

## Product Philosophy

RoseReview is designed to augment engineering teams, not replace human reviewers. The system prioritizes trust, contextual understanding, and low-noise intelligence so every AI finding is actionable. By delivering humanized explanations and surfacing only meaningful risk, RoseReview reduces reviewer fatigue and helps teams ship with confidence.

---

## Screenshots

> Replace these placeholders with product screenshots.

- **Dashboard**: Team risk overview with active PR signal.
- **PR Analysis**: Code findings with severity, context, and patch suggestions.
- **Deployment Risk Analysis**: Risk scoring and blast-radius analysis.
- **Patch Generation**: Suggested diff view with rationale.
- **Test Generation**: Targeted test plan proposals.
- **Benchmark Standards Dashboard**: Team policy visibility and drift alerts.

---

## Roadmap

- Repository memory engine
- Semantic codebase intelligence
- Advanced merge conflict prediction
- Engineering analytics
- Team learning systems
- Enterprise collaboration workflows

---

## Contributing

We welcome open-source contributions. If you are interested in improving RoseReview, open an issue, propose a feature, or submit a PR. Clear feedback, careful engineering, and respectful collaboration are always appreciated.

---

## License

MIT

---

## Acknowledgements

- Inspired by modern developer-first platforms
- Built with open-source foundations

**Developer-first. Open-source friendly. Built for real engineering teams.**
