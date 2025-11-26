
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
            { name: 'المواد العامة', head: 'د. ياسمين سعيد' },
        ]);
        const csDept = departments[0];
        const ceDept = departments[1];
        const isDept = departments[2];
        const genDept = departments[3];
        
        // Create Semesters
        const semesters = await Semester.insertMany([
            { name: 'Fall 2023', status: 'مغلق', startDate: new Date('2023-09-01'), endDate: new Date('2023-12-20'), gradeSubmissionDeadline: new Date('2023-12-30') },
            { name: 'Spring 2024', status: 'مغلق', startDate: new Date('2024-01-15'), endDate: new Date('2024-05-10'), gradeSubmissionDeadline: new Date('2024-05-20') },
            { name: 'Fall 2024', status: 'مفتوح', startDate: new Date('2024-09-01'), endDate: new Date('2024-12-20'), gradeSubmissionDeadline: new Date('2024-12-30') },
        ]);
        const fall2023 = semesters[0];
        const spring2024 = semesters[1];
        const fall2024 = semesters[2];

        // Create Admin and Professor
        const staff = await User.insertMany([
            { name: 'Admin User', email: 'admin@university.edu', password: 'password123', role: 'admin' },
            { name: 'Professor User', email: 'professor@university.edu', password: 'password123', role: 'professor' },
        ]);
        const adminUser = staff[0];
        const profUser = staff[1];

        // Create 5 Students
        const students = await User.insertMany([
            { name: 'أحمد محمد', email: 'ahmed@university.edu', password: 'password123', role: 'student', studentId: '2024001', department: csDept._id },
            { name: 'سارة خالد', email: 'sarah@university.edu', password: 'password123', role: 'student', studentId: '2023055', department: csDept._id },
            { name: 'خالد عمر', email: 'khalid@university.edu', password: 'password123', role: 'student', studentId: '2023089', department: csDept._id },
            { name: 'منى يوسف', email: 'mona@university.edu', password: 'password123', role: 'student', studentId: '2024102', department: csDept._id },
            { name: 'عمر فاروق', email: 'omar@university.edu', password: 'password123', role: 'student', studentId: '2023010', department: csDept._id },
        ]);

        const ahmed = students[0]; // Freshman
        const sarah = students[1]; // High Achiever
        const khalid = students[2]; // Struggling
        const mona = students[3]; // Average
        const omar = students[4]; // Advanced

        // Create Courses
        const courses = await Course.insertMany([
            // Basic
            { code: 'CS101', name: 'مقدمة في علوم الحاسب', credits: 3, department: csDept._id, prerequisites: [], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'MATH101', name: 'تفاضل وتكامل 1', credits: 3, department: csDept._id, prerequisites: [], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'PHY101', name: 'فيزياء عامة', credits: 4, department: csDept._id, prerequisites: [], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'ENG101', name: 'لغة إنجليزية 1', credits: 2, department: genDept._id, prerequisites: [], program: 'عام' },
            // Intermediate
            { code: 'CS102', name: 'البرمجة الشيئية', credits: 4, department: csDept._id, prerequisites: ['CS101'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'CS201', name: 'هياكل البيانات', credits: 4, department: csDept._id, prerequisites: ['CS102'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'CS202', name: 'نظم التشغيل', credits: 3, department: csDept._id, prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'IS250', name: 'تحليل وتصميم النظم', credits: 3, department: isDept._id, prerequisites: [], program: 'بكالوريوس نظم المعلومات' },
            { code: 'IS202', name: 'تقنيات الويب', credits: 3, department: isDept._id, prerequisites: ['CS102'], program: 'بكالوريوس نظم المعلومات' },
            { code: 'CE210', name: 'الدوائر المنطقية', credits: 3, department: ceDept._id, prerequisites: [], program: 'بكالوريوس هندسة الحاسوب' },
            // Advanced
            { code: 'CS305', name: 'قواعد البيانات', credits: 3, department: csDept._id, prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'CS301', name: 'شبكات الحاسب', credits: 3, department: csDept._id, prerequisites: ['CS202'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'SE301', name: 'هندسة البرمجيات', credits: 3, department: csDept._id, prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'AI401', name: 'الذكاء الاصطناعي', credits: 3, department: csDept._id, prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
            { code: 'CYB301', name: 'الأمن السيبراني', credits: 3, department: csDept._id, prerequisites: ['CS301'], program: 'بكالوريوس علوم الحاسوب' },
        ]);

        const [cs101, math101, phy101, eng101, cs102, cs201, cs202, is250, is202, ce210, cs305, cs301, se301, ai401, cyb301] = courses;

        // Assign Professor to Courses
        await ProfessorCourseAssignment.insertMany([
            { professor: profUser._id, course: cs102._id },
            { professor: profUser._id, course: cs201._id },
            { professor: profUser._id, course: cs305._id },
            { professor: profUser._id, course: ai401._id },
        ]);

        // Enrollments
        const enrollments = [];

        // 1. Ahmed (Freshman)
        enrollments.push(
            { student: ahmed._id, course: cs101._id, semester: fall2024._id, status: 'enrolled' },
            { student: ahmed._id, course: math101._id, semester: fall2024._id, status: 'enrolled' },
            { student: ahmed._id, course: eng101._id, semester: fall2024._id, status: 'enrolled' }
        );

        // 2. Sarah (High Achiever)
        enrollments.push(
            // Fall 2023
            { student: sarah._id, course: cs101._id, semester: fall2023._id, courseworkGrade: 38, finalGrade: 58, status: 'completed' },
            { student: sarah._id, course: math101._id, semester: fall2023._id, courseworkGrade: 37, finalGrade: 55, status: 'completed' },
            { student: sarah._id, course: eng101._id, semester: fall2023._id, courseworkGrade: 39, finalGrade: 59, status: 'completed' },
            // Spring 2024
            { student: sarah._id, course: cs102._id, semester: spring2024._id, courseworkGrade: 39, finalGrade: 56, status: 'completed' },
            { student: sarah._id, course: phy101._id, semester: spring2024._id, courseworkGrade: 36, finalGrade: 54, status: 'completed' },
            { student: sarah._id, course: is250._id, semester: spring2024._id, courseworkGrade: 38, finalGrade: 52, status: 'completed' },
            // Fall 2024
            { student: sarah._id, course: cs201._id, semester: fall2024._id, status: 'enrolled' },
            { student: sarah._id, course: ce210._id, semester: fall2024._id, status: 'enrolled' },
            { student: sarah._id, course: is202._id, semester: fall2024._id, status: 'enrolled' }
        );

        // 3. Khalid (Struggling)
        enrollments.push(
            // Fall 2023
            { student: khalid._id, course: cs101._id, semester: fall2023._id, courseworkGrade: 15, finalGrade: 25, status: 'completed' },
            { student: khalid._id, course: math101._id, semester: fall2023._id, courseworkGrade: 25, finalGrade: 30, status: 'completed' },
            // Spring 2024
            { student: khalid._id, course: cs101._id, semester: spring2024._id, courseworkGrade: 22, finalGrade: 38, status: 'completed' },
            { student: khalid._id, course: is250._id, semester: spring2024._id, courseworkGrade: 18, finalGrade: 25, status: 'completed' },
            // Fall 2024
            { student: khalid._id, course: cs102._id, semester: fall2024._id, status: 'enrolled' },
            { student: khalid._id, course: is250._id, semester: fall2024._id, status: 'enrolled' }
        );

        // 4. Mona (Average)
        enrollments.push(
            // Spring 2024
            { student: mona._id, course: cs101._id, semester: spring2024._id, courseworkGrade: 30, finalGrade: 45, status: 'completed' },
            { student: mona._id, course: math101._id, semester: spring2024._id, courseworkGrade: 28, finalGrade: 42, status: 'completed' },
            // Fall 2024
            { student: mona._id, course: cs102._id, semester: fall2024._id, status: 'enrolled' },
            { student: mona._id, course: is250._id, semester: fall2024._id, status: 'enrolled' },
            { student: mona._id, course: eng101._id, semester: fall2024._id, status: 'enrolled' }
        );

        // 5. Omar (Advanced)
        enrollments.push(
            // Transfer
            { student: omar._id, course: eng101._id, semester: 'transfer', courseworkGrade: 0, finalGrade: 95, status: 'transferred' },
            // Fall 2023
            { student: omar._id, course: cs101._id, semester: fall2023._id, courseworkGrade: 35, finalGrade: 50, status: 'completed' },
            { student: omar._id, course: math101._id, semester: fall2023._id, courseworkGrade: 32, finalGrade: 48, status: 'completed' },
            // Spring 2024
            { student: omar._id, course: cs102._id, semester: spring2024._id, courseworkGrade: 34, finalGrade: 46, status: 'completed' },
            { student: omar._id, course: ce210._id, semester: spring2024._id, courseworkGrade: 30, finalGrade: 45, status: 'completed' },
            { student: omar._id, course: cs201._id, semester: spring2024._id, courseworkGrade: 35, finalGrade: 50, status: 'completed' },
            // Fall 2024
            { student: omar._id, course: cs202._id, semester: fall2024._id, status: 'enrolled' },
            { student: omar._id, course: cs305._id, semester: fall2024._id, status: 'enrolled' },
            { student: omar._id, course: ai401._id, semester: fall2024._id, status: 'enrolled' }
        );

        await Enrollment.insertMany(enrollments);

        // Submissions & Logs
        await CourseSubmission.create({
            course: cs101._id,
            semester: fall2023._id,
            professor: profUser._id,
            submissionDate: new Date('2023-12-25'),
        });

        await AuditLog.insertMany([
            { user: adminUser._id, action: 'Initial system setup' },
        ]);
        
        await Notification.insertMany([
            { user: khalid._id, title: 'تنبيه أكاديمي', message: 'يرجى مراجعة المرشد الأكاديمي بخصوص درجاتك.', read: false },
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
