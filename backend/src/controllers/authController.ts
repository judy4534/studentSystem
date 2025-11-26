
import express from 'express';
import User from '../models/User.js';
import jwt, { SignOptions } from 'jsonwebtoken';
import type { IUser } from '../types/models.js';
import mongoose from 'mongoose';

const generateToken = (id: mongoose.Types.ObjectId) => {
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined.');
        throw new Error('JWT_SECRET is not defined.');
    }
    
const generateToken = (id: mongoose.Types.ObjectId) => {
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined.');
        throw new Error('JWT_SECRET is not defined.');
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"]) || '7d';

    const options: SignOptions = {
        expiresIn,
    };

    return jwt.sign({ id }, process.env.JWT_SECRET, options);
};


    return jwt.sign({ id }, process.env.JWT_SECRET, options);
};

export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
             return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password') as IUser | null;

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const userResponse = await User.findById(user._id);

        res.status(200).json({
            success: true,
            data: {
                token: generateToken(user._id),
                user: userResponse,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // req.user is populated by the 'protect' middleware
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        next(error);
    }
};

export const logout = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // In a stateless JWT setup, logout is typically handled client-side by deleting the token.
    // A stateful approach would involve a token blacklist.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
