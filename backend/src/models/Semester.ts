import mongoose from 'mongoose';
import { ISemester } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const semesterSchema = new mongoose.Schema<ISemester>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['مفتوح', 'مغلق'],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    gradeSubmissionDeadline: {
        type: Date,
        required: true,
    },
}, createDefaultSchemaOptions<ISemester>());

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
