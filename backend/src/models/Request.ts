
import mongoose from 'mongoose';
import { IRequest } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const requestSchema = new mongoose.Schema<IRequest>({
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
        enum: ['add', 'drop', 'override', 'review'],
        required: true,
    },
}, createDefaultSchemaOptions<IRequest>());

const Request = mongoose.model('Request', requestSchema);
export default Request;
