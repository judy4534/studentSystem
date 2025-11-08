// Fix: Import Request, Response, NextFunction from express
import { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog';

// Fix: Add express types to function signature
export const getAllAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auditLogs = await AuditLog.find({}).populate('user', 'name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: auditLogs });
    } catch (error) {
        next(error);
    }
};