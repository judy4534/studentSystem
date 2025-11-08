
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/database';
import errorHandler from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import courseRoutes from './routes/courses';
import departmentRoutes from './routes/departments';
import semesterRoutes from './routes/semesters';
import enrollmentRoutes from './routes/enrollments';
import requestRoutes from './routes/requests';
import assignmentRoutes from './routes/assignments';
import notificationRoutes from './routes/notifications';
import submissionRoutes from './routes/submissions';
import auditLogRoutes from './routes/auditLogs';


// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/audit-logs', auditLogRoutes);


// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../dist')));

    // Fix: Add express types to request and response
    app.get('*', (req: express.Request, res: express.Response) =>
        res.sendFile(path.resolve(__dirname, '../../', 'dist', 'index.html'))
    );
} else {
    // Fix: Add express types to request and response
    app.get('/', (req: express.Request, res: express.Response) => {
        res.send('API is running in development mode...');
    });
}


// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));