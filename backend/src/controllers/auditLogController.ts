
import express from 'express';
import AuditLog from '../models/AuditLog';

export const getAllAuditLogs = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const auditLogs = await AuditLog.find({}).populate('user', 'name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: auditLogs });
    } catch (error) {
        next(error);
    }
};