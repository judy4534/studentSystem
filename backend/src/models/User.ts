import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const userSchema = new mongoose.Schema<IUser>({
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
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'professor'],
        required: true,
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true,
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
}, createDefaultSchemaOptions<IUser>());

// ✔ FIX 1: حذف HookNextFunction نهائيًا (مو موجود في Mongoose v7)
userSchema.pre('save', async function (this: IUser, next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// ✔ FIX 2: matchPassword تعمل بدون مشاكل
userSchema.methods.matchPassword = async function (this: IUser, enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
