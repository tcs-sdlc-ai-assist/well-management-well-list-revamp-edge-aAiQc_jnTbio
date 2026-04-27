# Deployment

This document covers deployment configuration, build steps, and CI/CD notes for the Well List Revamp project.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)

## Overview

The Well List Revamp application is a single-page application (SPA) built with Vite 6 and React 18. It is configured for deployment on **Vercel** with zero server-side dependencies. All data persistence is handled via the browser's `localStorage` API — no backend or database is required.

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A [Vercel](https://vercel.com) account (free tier is sufficient)
- Git repository connected to Vercel (GitHub, GitLab, or Bitbucket)

## Build Configuration

### Build Command

```bash
npm run build
```

This runs `vite build`, which produces an optimized production bundle with tree-shaking, minification, and asset hashing.

### Output Directory

```
dist/
```

All production assets are written to the `dist/` directory. This is configured in `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
```

### Preview Production Build Locally

To verify the production build before deploying:

```bash
npm run build
npm run preview
```

The preview server will start at `http://localhost:4173` by default.

## Vercel Deployment

### Step 1 — Connect Repository

1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New Project"**.
3. Import the Git repository containing the Well List Revamp project.
4. Vercel will auto-detect the **Vite** framework preset.

### Step 2 — Configure Build Settings

Vercel should auto-detect these settings. Verify they match:

| Setting            | Value            |
| ------------------ | ---------------- |
| **Framework Preset** | Vite             |
| **Build Command**    | `npm run build`  |
| **Output Directory** | `dist`           |
| **Install Command**  | `npm install`    |
| **Node.js Version**  | 18.x or later    |

### Step 3 — Deploy

Click **"Deploy"**. Vercel will:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to produce the `dist/` output.
4. Serve the `dist/` directory as a static site with the rewrite rules from `vercel.json`.

### Step 4 — Verify

Once deployment completes, Vercel provides a production URL (e.g., `https://your-project.vercel.app`). Open the URL and verify:

- The Well List page loads with 11 seed wells.
- The active well (Thunder Horse #1) is pinned to the top with a green "Active" badge.
- Filtering, sorting, pagination, and activation all function correctly.
- Refreshing the page on any route returns the application (SPA rewrite is working).

### Automatic Deployments

Once connected, Vercel automatically deploys:

- **Production deployment** on every push to the `main` (or default) branch.
- **Preview deployment** on every pull request, providing a unique preview URL for review.

## SPA Rewrite Configuration

The `vercel.json` file at the project root configures Vercel to handle client-side routing by rewriting all requests to `index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that:

- Direct navigation to any URL path serves the SPA entry point.
- Browser refreshes on any route do not result in a 404 error.
- All routing is handled client-side by the React application.

> **Note:** The current application is a single-page view with no client-side routing. The rewrite rule is included as a forward-compatible configuration for when routing is added in the future.

## Environment Variables

**No environment variables are required** for this application.

The application has no external API dependencies, no backend services, and no secret keys. All data is managed locally in the browser via `localStorage` under the key `wellsData`.

If environment variables are needed in the future (e.g., for API endpoints), they should follow the Vite convention:

- Prefix all client-side variables with `VITE_` (e.g., `VITE_API_URL`).
- Access them in code via `import.meta.env.VITE_API_URL`.
- Add them in the Vercel dashboard under **Project Settings → Environment Variables**.
- Never commit secrets or API keys to the repository.

## CI/CD Notes

### Running Tests Before Deployment

It is recommended to run the test suite before deploying to catch regressions:

```bash
npm test
```

This runs all unit and integration tests via Vitest with the jsdom environment. The test suite covers:

- **Utility functions:** `filterWells`, `sortWells`, `pinActive` — pure function unit tests.
- **Custom hook:** `useWells` — state management, localStorage persistence, activation logic.
- **Integration:** `WellListPage` — full page rendering, filtering, activation modal, pagination.

### Adding Tests to a CI Pipeline

If using a CI provider (GitHub Actions, GitLab CI, etc.), add a test step before the build:

```yaml
# Example GitHub Actions workflow step
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test

- name: Build
  run: npm run build
```

Vercel does not run tests by default during deployment. To enforce tests before deployment, either:

1. **Use a CI pipeline** (GitHub Actions, GitLab CI) that runs tests and only merges to the deploy branch on success.
2. **Override the Vercel build command** to include tests:
   ```
   npm test && npm run build
   ```
   Set this in the Vercel dashboard under **Project Settings → General → Build Command**.

### Branch Strategy

| Branch   | Deployment Type | URL                                      |
| -------- | --------------- | ---------------------------------------- |
| `main`   | Production      | `https://your-project.vercel.app`        |
| PR branches | Preview      | `https://your-project-<hash>.vercel.app` |

### Build Performance

The production build typically completes in under 10 seconds. The application has minimal dependencies:

- **Runtime:** `react`, `react-dom`, `prop-types`
- **Dev only:** `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `@testing-library/*`, `jsdom`

## Troubleshooting

### 404 on Page Refresh

If refreshing the page returns a 404, verify that `vercel.json` exists at the project root and contains the SPA rewrite rule. Redeploy after adding or modifying the file.

### Styles Missing in Production

If Tailwind CSS styles are missing in the production build, verify that `tailwind.config.js` has the correct `content` paths:

```js
content: [
  './index.html',
  './src/**/*.{js,jsx}',
],
```

### localStorage Data Issues

If the application displays unexpected data after deployment:

1. Open the browser's Developer Tools → Application → Local Storage.
2. Delete the `wellsData` key.
3. Refresh the page — the application will reinitialize with the 11 seed wells.

### Build Fails on Vercel

If the build fails, check the Vercel build logs for errors. Common causes:

- **Node.js version mismatch:** Ensure the project uses Node.js 18 or later. Set the version in Vercel under **Project Settings → General → Node.js Version**.
- **Missing dependencies:** Run `npm install` locally and verify `package-lock.json` is committed to the repository.
- **Test failures (if tests are in the build command):** Run `npm test` locally to identify and fix failing tests before pushing.