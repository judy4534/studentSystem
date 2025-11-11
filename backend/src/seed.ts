
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import process from 'process';
import User from './models/User';
import Course from './models/Course';
import Department from './models/Department';
import Semester from './models/Semester';
import Enrollment from './models/Enrollment';
import ProfessorCourseAssignment from './models/ProfessorCourseAssignment';
import Notification from './models/Notification';
import CourseSubmission from './models/CourseSubmission';
import AuditLog from './models/AuditLog';
import RegistrationRequest from './models/Request';
import connectDB from './config/database';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await Enrollment.deleteMany({});
        await ProfessorCourseAssignment.deleteMany({});
        await RegistrationRequest.deleteMany({});
        await User.deleteMany({});
        await Course.deleteMany({});
        await Department.deleteMany({});
        await Semester.deleteMany({});
        await Notification.deleteMany({});
        await CourseSubmission.deleteMany({});
        await AuditLog.deleteMany({});
        console.log('Data Cleared!');

        // Create Departments
        const departments = await Department.insertMany([
            { name: 'علوم الحاسب', head: 'د. خالد الأحمد' },
            { name: 'هندسة الحاسب', head: 'د. سارة محمود' },
            { name: 'نظم المعلومات', head: 'د. عمر عبد العزيز' },
        ]);
        const csDept = departments[0];
        const ceDept = departments[1];
        
        // Create Semesters
        const semesters = await Semester.insertMany([
            { name: 'Fall 2024', status: 'مفتوح', startDate: new Date('2024-09-01'), endDate: new Date('2024-12-20'), gradeSubmissionDeadline: new Date('2024-12-30') },
            { name: 'Spring 2024', status: 'مغلق', startDate: new Date('2024-01-15'), endDate: new Date('2024-05-10'), gradeSubmissionDeadline: new Date('2024-05-20') },
        ]);
        const fall2024 = semesters[0];
        const spring2024 = semesters[1];

        // Create Users
        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@university.edu', password: 'password123', role: 'admin' },
            { name: 'Professor User', email: 'professor@university.edu', password: 'password123', role: 'professor' },
            { name: 'Student User', email: 'student@university.edu', password: 'password123', role: 'student', studentId: 'S001', department: csDept._id },
            { name: 'Ahmed Ali', email: 'ahmed.ali@university.edu', password: 'password123', role: 'student', studentId: 'S002', department: csDept._id },
        ]);

        const adminUser = users[0];
        const profUser = users[1];
        const student1 = users[2];
        const student2 = users[3];

        // Create Courses
        const courses = await Course.insertMany([
            { code: 'CS101', name: 'مقدمة في علوم الحاسب', credits: 3, department: csDept._id, prerequisites: [], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'CS102', name: 'البرمجة الشيئية', credits: 4, department: csDept._id, prerequisites: ['CS101'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'CS201', name: 'هياكل البيانات', credits: 4, department: csDept._id, prerequisites: ['CS102'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'CE210', name: 'الدوائر المنطقية', credits: 3, department: ceDept._id, prerequisites: [], program: 'بكالوريوس هندسة الحاسوب' },
        ]);

        const cs101 = courses[0];
        const cs102 = courses[1];
        const cs201 = courses[2];

        // Assign Professor to Courses
        await ProfessorCourseAssignment.insertMany([
            { professor: profUser._id, course: cs102._id },
            { professor: profUser._id, course: cs201._id },
        ]);

        // Enroll Students in Courses
        await Enrollment.insertMany([
            // Student 1
            { student: student1._id, course: cs101._id, semester: spring2024._id, courseworkGrade: 35, finalGrade: 50, status: 'completed' },
            { student: student1._id, course: cs102._id, semester: fall2024._id, status: 'enrolled' },
            // Student 2
            { student: student2._id, course: cs101._id, semester: spring2024._id, courseworkGrade: 30, finalGrade: 45, status: 'completed' },
            { student: student2._id, course: cs102._id, semester: fall2024._id, courseworkGrade: 38, finalGrade: 55, status: 'completed' },
            { student: student2._id, course: cs201._id, semester: fall2024._id, status: 'enrolled' },
        ]);

        await RegistrationRequest.create({
            student: student1._id,
            course: cs201._id,
            requestType: 'override',
            status: 'pending'
        });

        await CourseSubmission.create({
            course: cs102._id,
            semester: fall2024._id,
            professor: profUser._id,
            submissionDate: new Date('2024-12-22'),
        });

        await AuditLog.insertMany([
            { user: adminUser._id, action: 'قام بتحديث بيانات مقرر CS101' },
            { user: profUser._id, action: 'سلم درجات مقرر CS102' },
        ]);
        
        await Notification.insertMany([
            { user: student1._id, title: 'تمت الموافقة على طلبك', message: 'تمت الموافقة على طلب تسجيلك في مقرر CS201.', read: false },
            { user: profUser._id, title: 'تذكير بتسليم الدرجات', message: 'يرجى تسليم درجات مقرر CS201 قبل الموعد النهائي.', read: true },
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Enrollment.deleteMany({});
        await ProfessorCourseAssignment.deleteMany({});
        await RegistrationRequest.deleteMany({});
        await User.deleteMany({});
        await Course.deleteMany({});
        await Department.deleteMany({});
        await Semester.deleteMany({});
        await Notification.deleteMany({});
        await CourseSubmission.deleteMany({});
        await AuditLog.deleteMany({});

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}