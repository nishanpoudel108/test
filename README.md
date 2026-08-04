# SHRAMIK — Nepal's Smart Local Workforce & Service Marketplace

Connecting Skills. Creating Opportunities.

This repository was initialized as a starter for the SHRAMIK project — a location-based, AI-assisted marketplace to connect local workers and employers in Nepal.

This repo contains initial repository metadata and a minimal frontend/backend skeleton to get started.

Repository: nishanpoudel108/test

Quick start (local)

Prerequisites
- Node.js 18+
- pnpm / npm

Frontend
1. cd frontend
2. npm install
3. npm run dev

Backend
1. cd backend
2. npm install
3. npm run dev

Supabase
- Create a Supabase project for database, auth and storage.
- Add environment variables to backend and frontend for SUPABASE_URL and SUPABASE_ANON_KEY (or service role key as needed).

What I added
- README.md (this file)
- .gitignore
- LICENSE (MIT)
- CONTRIBUTING.md
- .github/ISSUE_TEMPLATE/bug_report.md
- .github/ISSUE_TEMPLATE/feature_request.md
- .github/workflows/ci.yml (basic Node.js check)
- frontend/package.json (minimal)
- backend/package.json (minimal)

Next recommended steps
- Replace the minimal skeleton with a real Vite React TypeScript app in /frontend and a Node/Express TypeScript app in /backend.
- Create the DB schema in Supabase and seed initial data.
- Add environment secrets in the repo settings and configure CI/CD providers.

If you'd like, I can now scaffold the Vite + Tailwind frontend and/or the Express backend into this repo.
