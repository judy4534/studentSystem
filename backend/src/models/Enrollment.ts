import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
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
        enum: ['enrolled', 'completed', 'withdrawn'],
        default: 'enrolled',
    },
}, {
    timestamps: true,
});

enrollmentSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
