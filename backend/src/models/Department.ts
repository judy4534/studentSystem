import mongoose from 'mongoose';
import { IDepartment } from '../types/models';
import { createDefaultSchemaOptions } from './schemaOptions';

const departmentSchema = new mongoose.Schema<IDepartment>({
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
}, createDefaultSchemaOptions<IDepartment>());

const Department = mongoose.model('Department', departmentSchema);
export default Department;
