import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
