# Deployment Guide

This guide walks through deploying the Student System so that the backend and built React frontend are served together.

## Prerequisites
- Node.js 20+
- MongoDB database (cloud-hosted MongoDB Atlas or self-hosted instance)
- Environment variables configured (see `.env.example`)

## Production build and start locally
1. Install dependencies from the repository root:
   ```bash
   npm install
   ```
2. Create your environment file:
   ```bash
   cp .env.example .env
   # Update values for MONGODB_URI, JWT_SECRET, FRONTEND_URL, etc.
   ```
3. Build the frontend and backend bundles:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```
   The server will serve both the API under `/api` and the built frontend assets.

## Deploying to Render (single Web Service)
You can deploy either through Render's UI or by using the included `render.yaml` Blueprint.

### Option A: Deploy with `render.yaml`
1. **Prepare MongoDB Atlas**
   - Create a new cluster.
   - In **Network Access**, allow access from everywhere (`0.0.0.0/0`).
   - Create a database user and obtain the connection string.
2. **Deploy via Blueprint**
   - From the Render dashboard, choose **New → Blueprint** and connect this repository.
   - Render will read `render.yaml` and prefill all settings:
     - **Node version** pinned to 20.
     - Build command `npm install && npm run build` with `NPM_CONFIG_PRODUCTION=false` to install TypeScript typings required for the build.
     - Start command `npm start`.
     - Health check path `/health` (already available in the server).
   - Click **Apply** to create the service.
3. **Environment variables**
   - Render will prompt you to fill in the secrets defined in `render.yaml`:
     - `MONGODB_URI=<your MongoDB Atlas connection string>`
     - `JWT_SECRET=<a strong secret string>`
     - `FRONTEND_URL=https://your-service-name.onrender.com`
     - Optional: `JWT_EXPIRES_IN`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`
4. **Deploy and verify**
   - After the first deploy completes, open the Render URL to access the frontend and use `/api` routes for the backend.

### Option B: Deploy via Render UI (manual setup)
1. **Prepare MongoDB Atlas**
   - Create a new cluster.
   - In **Network Access**, allow access from everywhere (`0.0.0.0/0`).
   - Create a database user and obtain the connection string.
2. **Create the Render service**
   - From the Render dashboard, choose **New → Web Service** and connect this repository.
   - Settings:
     - **Root Directory**: leave blank (use repo root).
     - **Environment**: `Node`.
     - **Build Command**: `npm install --include=dev && npm run build` (installs TypeScript and `@types/*` packages needed for the compiler)
     - **Start Command**: `npm start`
     - **Health Check Path**: `/health`
   - Instance type: free tier works for testing.
3. **Environment variables**
   - Add the variables from `.env.example`:
     - `NODE_ENV=production`
     - `MONGODB_URI=<your MongoDB Atlas connection string>`
     - `JWT_SECRET=<a strong secret string>`
     - `FRONTEND_URL=https://your-service-name.onrender.com`
     - `JWT_EXPIRES_IN`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS` as needed
4. **Deploy and verify**
   - Click **Create Web Service** to start the first deploy.
   - Once live, open the Render URL to access the frontend and use `/api` routes for the backend.

## Troubleshooting
- **Build fails on Render**: Confirm Node 20 is selected, and that your build command matches `npm run build`.
- **API cannot reach MongoDB**: Ensure your Atlas IP access list allows Render and that `MONGODB_URI` uses the correct credentials.
- **CORS errors**: Verify `FRONTEND_URL` matches the deployed URL.
- **JWT errors**: Use a long, random `JWT_SECRET` and ensure `JWT_EXPIRES_IN` is set (default `7d`).
