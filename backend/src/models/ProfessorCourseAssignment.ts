import mongoose from 'mongoose';

const professorCourseAssignmentSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});

professorCourseAssignmentSchema.index({ professor: 1, course: 1 }, { unique: true });

const ProfessorCourseAssignment = mongoose.model('ProfessorCourseAssignment', professorCourseAssignmentSchema);
export default ProfessorCourseAssignment;
