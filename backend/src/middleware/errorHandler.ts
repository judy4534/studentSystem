import express from 'express';

const errorHandler = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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