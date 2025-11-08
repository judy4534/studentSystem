import { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'student' | 'professor';
    studentId?: string;
    department?: Types.ObjectId;
    status: 'نشط' | 'غير نشط';
    matchPassword(password: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDepartment extends Document {
    name: string;
    head: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICourse extends Document {
    code: string;
    name: string;
    credits: number;
    department: Types.ObjectId;
    prerequisites: string[];
    program: string;
}

export interface IProfessorCourseAssignment extends Document {
    professor: Types.ObjectId;
    course: Types.ObjectId;
}

export interface ISemester extends Document {
    name: string;
    status: 'مفتوح' | 'مغلق';
    startDate: Date;
    endDate: Date;
    gradeSubmissionDeadline: Date;
}

export interface IEnrollment extends Document {
    student: Types.ObjectId;
    course: Types.ObjectId;
    semester: Types.ObjectId;
    courseworkGrade: number | null;
    finalGrade: number | null;
    status: 'enrolled' | 'completed' | 'withdrawn';
}

export interface IRequest extends Document {
    student: Types.ObjectId;
    course: Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    requestType: 'add' | 'drop' | 'override';
}

export interface INotification extends Document {
    user: Types.ObjectId;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
}

export interface ICourseSubmission extends Document {
    course: Types.ObjectId;
    semester: Types.ObjectId;
    professor: Types.ObjectId;
    submissionDate: Date;
}

export interface IAuditLog extends Document {
    user: Types.ObjectId;
    action: string;
    createdAt: Date;
}
