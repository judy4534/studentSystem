# Deployment Guide

This guide walks through deploying the Student System so that the backend and built React frontend are served together.

## Prerequisites
- Node.js 20+
- MongoDB database (cloud-hosted MongoDB Atlas **or any self-hosted instance** that is reachable from your server)
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
1. **Prepare your database (Atlas or self-hosted)**
   - If using MongoDB Atlas, create a cluster, allow access from Render (e.g., `0.0.0.0/0`), and create a database user to get the connection string.
   - If using your own MongoDB server (VPS, managed MongoDB, Docker on a cloud VM), ensure the instance is reachable from Render with a public hostname/IP and proper firewall rules. Render cannot connect to a database running only on `localhost` of your desktop.
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
     - `MONGODB_URI=<your MongoDB connection string>` (Atlas or your own host, e.g., `mongodb://user:pass@host:27017/db`)
     - `JWT_SECRET=<a strong secret string>`
     - `FRONTEND_URL=https://your-service-name.onrender.com`
     - Optional: `JWT_EXPIRES_IN`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`
4. **Deploy and verify**
   - After the first deploy completes, open the Render URL to access the frontend and use `/api` routes for the backend.

### Option B: Deploy via Render UI (manual setup)
1. **Prepare your database (Atlas or self-hosted)**
   - If using MongoDB Atlas, create a cluster and allow access from Render.
   - If using your own MongoDB server, make sure it is accessible from Render with the correct firewall rules and credentials. Services on your personal laptop are not reachable by Render unless you expose them publicly.
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
     - `MONGODB_URI=<your MongoDB connection string>` (Atlas or self-hosted)
     - `JWT_SECRET=<a strong secret string>`
     - `FRONTEND_URL=https://your-service-name.onrender.com`
     - `JWT_EXPIRES_IN`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS` as needed
4. **Deploy and verify**
   - Click **Create Web Service** to start the first deploy.
   - Once live, open the Render URL to access the frontend and use `/api` routes for the backend.

## Troubleshooting
- **Build fails on Render**: Confirm Node 20 is selected, and that your build command matches `npm run build`.
- **API cannot reach MongoDB**: Ensure your database accepts connections from Render (update Atlas IP allowlist or your server firewall rules) and that `MONGODB_URI` uses the correct credentials.
- **CORS errors**: Verify `FRONTEND_URL` matches the deployed URL.
- **JWT errors**: Use a long, random `JWT_SECRET` and ensure `JWT_EXPIRES_IN` is set (default `7d`).
