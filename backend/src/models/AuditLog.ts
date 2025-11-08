import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
