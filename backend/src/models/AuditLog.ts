import mongoose from 'mongoose';
import { IAuditLog } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const auditLogSchema = new mongoose.Schema<IAuditLog>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
}, createDefaultSchemaOptions<IAuditLog>());

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
