// Fix: Import Request, Response, NextFunction from express
import { Request, Response, NextFunction } from 'express';

// Fix: Add express types to function signature
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;