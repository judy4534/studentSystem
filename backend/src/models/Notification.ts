import mongoose from 'mongoose';
import { INotification } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const notificationSchema = new mongoose.Schema<INotification>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, createDefaultSchemaOptions<INotification>());

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
