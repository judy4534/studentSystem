import mongoose from 'mongoose';

const courseSubmissionSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});

courseSubmissionSchema.index({ course: 1, semester: 1 }, { unique: true });

const CourseSubmission = mongoose.model('CourseSubmission', courseSubmissionSchema);
export default CourseSubmission;
