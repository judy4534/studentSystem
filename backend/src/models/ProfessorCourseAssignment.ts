import mongoose from 'mongoose';
import { IProfessorCourseAssignment } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const professorCourseAssignmentSchema = new mongoose.Schema<IProfessorCourseAssignment>({
    professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
}, createDefaultSchemaOptions<IProfessorCourseAssignment>());

professorCourseAssignmentSchema.index({ professor: 1, course: 1 }, { unique: true });

const ProfessorCourseAssignment = mongoose.model('ProfessorCourseAssignment', professorCourseAssignmentSchema);
export default ProfessorCourseAssignment;
