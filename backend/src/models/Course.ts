import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
