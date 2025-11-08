import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    requestType: {
        type: String,
        enum: ['add', 'drop', 'override'],
        required: true,
    },
}, {
    timestamps: true,
});

const Request = mongoose.model('Request', requestSchema);
export default Request;
