# Student System Backend

Backend API for the Student Management System built with Node.js, Express, TypeScript, and MongoDB.

## Features

- JWT Authentication
- Role-based access control (Admin, Student, Professor)
- User management
- Course management
- Student enrollment
- Grade management
- Registration requests
- Department management
- Semester management
- Audit logging
- Rate limiting
- Input validation
- Error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## Prerequisites

- Node.js (v20 or higher)
- MongoDB (local or cloud instance)
- npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studentSystem
```

2. Install dependencies from the root directory:
```bash
npm install
```

3. Create a `.env` file in the root directory. You can copy and adjust the provided template:
```bash
cp .env.example .env
```

Fill in the values to match your environment (MongoDB URI, JWT secret, and frontend URL).

## Running the Application

### Development Mode
This project has separate scripts for the frontend and backend. You should run them in separate terminals from the root directory.

- **Run Frontend (Vite dev server):**
```bash
npm run dev
```

- **Run Backend (Nodemon server):**
```bash
npm run dev:backend
```

### Production Mode
This command builds both the frontend and backend, then starts the production server.
```bash
npm run build
npm start
```

For detailed deployment instructions (including Render), see [Deployment Guide](docs/DEPLOYMENT.md).

## Database Seeding

To populate the database with initial data, run the following command from the root directory. Make sure your MongoDB server is running.

```bash
npx ts-node backend/src/seed.ts
```

This will create:
- 4 users (1 admin, 1 professor, 2 students)
- 4 courses
- 3 departments
- 2 semesters

**Login credentials for seeded data:**
- Admin: `admin@university.edu`
- Professor: `professor@university.edu`
- Student: `student@university.edu`
- Password: `password123` (for all accounts)

## Deployment on Render

This project is configured to be deployed as a single **Web Service** on Render, where the Node.js backend serves both the API and the built React frontend. You can use the included `render.yaml` Blueprint for a one-click setup, or configure the service manually.

### 1. Database Setup
Before deploying, you need a live MongoDB database. A free tier on **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** is highly recommended.
- Create an account and a new cluster.
- In "Network Access", add `0.0.0.0/0` to allow connections from anywhere (Render's IP addresses can change).
- Create a database user and save the username and password.
- Get the connection string for your application and replace `<password>` with your user's password.

### 2. Render Web Service Configuration
1.  From your Render dashboard, click **New** -> **Web Service**.
2.  Connect the GitHub repository for this project.
3.  On the settings page, use the following configuration:
    -   **Name**: A name for your service (e.g., `university-system`).
    -   **Root Directory**: Leave this blank to use the repository root.
    -   **Environment**: `Node`.
    -   **Build Command**: `npm install --include=dev && npm run build` (ensures TypeScript and `@types/*` packages are present)
    -   **Start Command**: `npm start`
    -   **Health Check Path**: `/health`
    -   **Instance Type**: The `Free` tier is suitable for development and testing.

### 3. Environment Variables
Click on the **Environment** tab and add the following variables.
-   **`NODE_ENV`**: `production`
-   **`MONGODB_URI`**: The connection string from MongoDB Atlas.
-   **`JWT_SECRET`**: A long, random, and secret string for signing tokens (you can generate one with `openssl rand -base64 32`).
-   **`FRONTEND_URL`**: The URL of your Render service once it's live (it will look like `https://your-service-name.onrender.com`).

### 4. Deploy
Click **Create Web Service**. Render will begin the build and deployment process. You can monitor the progress in the logs. Once complete, your application will be live at the URL provided by Render.


## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `GET /api/courses/professor/:professorId` - Get courses by professor

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Window: 15 minutes
- Max requests: 100 per IP per window

## Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- Password hashing with bcrypt
- Rate limiting
- Error handling

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment (development/production) | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/student-system |
| JWT_SECRET | JWT secret key | (required) |
| JWT_EXPIRES_IN | JWT expiration time | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |
| RATE_LIMIT_WINDOW_MS | Rate limit window in ms | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Project Structure

```
backend/
└── src/
    ├── config/
    │   └── database.ts       # Database configuration
    ├── controllers/
    │   ├── authController.ts # Authentication logic
    │   └── ...
    ├── middleware/
    │   ├── auth.ts          # Authentication middleware
    │   └── ...
    ├── models/
    │   ├── User.ts          # User model
    │   └── ...
    ├── routes/
    │   ├── auth.ts          # Authentication routes
    │   └── ...
    ├── types/
    │   ├── express/
    │   │   └── index.d.ts    # Express type augmentation
    │   └── models.ts         # Mongoose model type definitions
    ├── index.ts              # Main server file
    └── seed.ts               # Database seeding script
```
