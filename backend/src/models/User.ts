import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import type { IUser } from '../types/models';

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
userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (this: IUser, enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
