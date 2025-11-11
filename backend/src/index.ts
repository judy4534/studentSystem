
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
// FIX: Import `fileURLToPath` to define `__dirname` in an ES module context.
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import departmentRoutes from './routes/departments.js';
import semesterRoutes from './routes/semesters.js';
import enrollmentRoutes from './routes/enrollments.js';
import requestRoutes from './routes/requests.js';
import assignmentRoutes from './routes/assignments.js';
import notificationRoutes from './routes/notifications.js';
import submissionRoutes from './routes/submissions.js';
import auditLogRoutes from './routes/auditLogs.js';

// FIX: Define `__filename` and `__dirname` for ES modules, as they are not available globally.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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

// Health Check Endpoint for Render
app.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).send('OK');
});


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
    // __dirname is backend/dist, so go up to root and then to dist
    app.use(express.static(path.join(__dirname, '../../dist')));

    app.get('*', (req: express.Request, res: express.Response) =>
        res.sendFile(path.resolve(__dirname, '../../', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req: express.Request, res: express.Response) => {
        res.send('API is running in development mode...');
    });
}


// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));