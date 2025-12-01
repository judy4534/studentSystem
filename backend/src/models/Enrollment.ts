
import mongoose from 'mongoose';
import { IEnrollment } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const enrollmentSchema = new mongoose.Schema<IEnrollment>({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    semester: {
        type: mongoose.Schema.Types.Mixed, // Changed to Mixed to allow 'transfer' string or ObjectId
        required: true,
    },
    courseworkGrade: {
        type: Number,
        default: null,
    },
    finalGrade: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        enum: ['enrolled', 'completed', 'withdrawn', 'transferred'],
        default: 'enrolled',
    },
}, createDefaultSchemaOptions<IEnrollment>());

enrollmentSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
