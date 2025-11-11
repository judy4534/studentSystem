
import express from 'express';
import Notification from '../models/Notification.js';

export const getAllNotifications = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const notifications = await Notification.find({ user: req.user?._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification || notification.user.toString() !== req.user?._id.toString()) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        notification.read = true;
        await notification.save();
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        await Notification.updateMany({ user: req.user?._id, read: false }, { read: true });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const createReminderNotification = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { professorId, courseName } = req.body;
    try {
        const notification = await Notification.create({
            user: professorId,
            title: 'تذكير بتسليم الدرجات',
            message: `يرجى تسليم درجات مقرر ${courseName} قبل الموعد النهائي.`,
        });
        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
}