
import mongoose, { HookNextFunction } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/models.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Do not return password by default
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'professor'],
        required: true,
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple nulls
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    status: {
        type: String,
        enum: ['نشط', 'غير نشط'],
        default: 'نشط',
    },
}, {
    timestamps: true,
});

// Password hashing middleware
// FIX: Use the generic form of `.pre<IUser>()` to correctly type `this` and allow access to Mongoose document methods like `isModified`.
userSchema.pre<IUser>('save', async function (next: HookNextFunction) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (this: IUser, enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;