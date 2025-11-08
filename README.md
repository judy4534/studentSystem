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

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studentSystem-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/student-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. Build the TypeScript code:
```bash
npm run build
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Database Seeding

To populate the database with initial data, run:

```bash
# Make sure MongoDB is running first
npx ts-node src/seed.ts
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
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window in ms | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Project Structure

```
src/
├── config/
│   └── database.ts       # Database configuration
├── controllers/
│   ├── authController.ts # Authentication logic
│   ├── userController.ts # User management logic
│   └── courseController.ts # Course management logic
├── middleware/
│   ├── auth.ts          # Authentication middleware
│   ├── errorHandler.ts  # Error handling middleware
│   └── validate.ts      # Input validation middleware
├── models/
│   ├── User.ts          # User model
│   ├── Course.ts        # Course model
│   └── ...              # Other models
├── routes/
│   ├── auth.ts          # Authentication routes
│   ├── users.ts         # User routes
│   └── courses.ts       # Course routes
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   └── ...              # Utility functions
├── index.ts             # Main server file
└── seed.ts              # Database seeding script
```
