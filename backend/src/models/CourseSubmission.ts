import mongoose from 'mongoose';
import { ICourseSubmission } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const courseSubmissionSchema = new mongoose.Schema<ICourseSubmission>({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true,
    },
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    submissionDate: {
        type: Date,
        default: Date.now,
    },
}, createDefaultSchemaOptions<ICourseSubmission>());

courseSubmissionSchema.index({ course: 1, semester: 1 }, { unique: true });

const CourseSubmission = mongoose.model('CourseSubmission', courseSubmissionSchema);
export default CourseSubmission;
