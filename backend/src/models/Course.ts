import mongoose from 'mongoose';
import { ICourse } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const courseSchema = new mongoose.Schema<ICourse>({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    prerequisites: [{
        type: String, // Storing course codes
    }],
    program: {
        type: String,
        required: true,
    },
}, createDefaultSchemaOptions<ICourse>());

const Course = mongoose.model('Course', courseSchema);
export default Course;
