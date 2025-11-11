
import jwt from 'jsonwebtoken';
import express from 'express';
import User from '../models/User.js';

export const protect = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `User role ${req.user?.role} is not authorized to access this route` });
        }
        next();
    };
};