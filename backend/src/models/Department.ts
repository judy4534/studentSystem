import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    head: {
        type: String,
        required: true,
    },
    // courseCount and studentCount will be calculated dynamically if needed
}, {
    timestamps: true,
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
