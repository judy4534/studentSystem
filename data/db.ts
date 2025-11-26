
import type { User, Course, Registration, CourseSubmission, Semester, AuditLogEntry, StudentEnrollment, Department, Notification, ProfessorCourseAssignment } from '../types';

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept-cs', name: 'علوم الحاسب', head: 'د. خالد الأحمد', courseCount: 10, studentCount: 5 },
  { id: 'dept-ce', name: 'هندسة الحاسب', head: 'د. سارة محمود', courseCount: 2, studentCount: 0 },
  { id: 'dept-is', name: 'نظم المعلومات', head: 'د. عمر عبد العزيز', courseCount: 2, studentCount: 0 },
  { id: 'dept-gen', name: 'المواد العامة', head: 'د. ياسمين سعيد', courseCount: 1, studentCount: 0 },
];

export const MOCK_SEMESTERS: Semester[] = [
  { id: '2023-fall', name: 'خريف 2023', status: 'مغلق', startDate: '2023-09-01', endDate: '2023-12-20', gradeSubmissionDeadline: '2023-12-30' },
  { id: '2024-spring', name: 'ربيع 2024', status: 'مغلق', startDate: '2024-01-15', endDate: '2024-05-10', gradeSubmissionDeadline: '2024-05-20' },
  { id: '2024-fall', name: 'خريف 2024', status: 'مفتوح', startDate: '2024-09-01', endDate: '2024-12-20', gradeSubmissionDeadline: '2024-12-30' },
];

export const MOCK_COURSES: Course[] = [
  // Basic
  { id: 'course-cs101', code: 'CS101', name: 'مقدمة في علوم الحاسب', credits: 3, department: 'dept-cs', prerequisites: [], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-math101', code: 'MATH101', name: 'تفاضل وتكامل 1', credits: 3, department: 'dept-cs', prerequisites: [], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-phy101', code: 'PHY101', name: 'فيزياء عامة', credits: 4, department: 'dept-cs', prerequisites: [], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-eng101', code: 'ENG101', name: 'لغة إنجليزية 1', credits: 2, department: 'dept-gen', prerequisites: [], program: 'عام' },
  
  // Intermediate
  { id: 'course-cs102', code: 'CS102', name: 'البرمجة الشيئية', credits: 4, department: 'dept-cs', prerequisites: ['CS101'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-cs201', code: 'CS201', name: 'هياكل البيانات', credits: 4, department: 'dept-cs', prerequisites: ['CS102'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-cs202', code: 'CS202', name: 'نظم التشغيل', credits: 3, department: 'dept-cs', prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-is250', code: 'IS250', name: 'تحليل وتصميم النظم', credits: 3, department: 'dept-is', prerequisites: [], program: 'بكالوريوس نظم المعلومات' },
  { id: 'course-is202', code: 'IS202', name: 'تقنيات الويب', credits: 3, department: 'dept-is', prerequisites: ['CS102'], program: 'بكالوريوس نظم المعلومات' },
  { id: 'course-ce210', code: 'CE210', name: 'الدوائر المنطقية', credits: 3, department: 'dept-ce', prerequisites: [], program: 'بكالوريوس هندسة الحاسوب' },
  
  // Advanced
  { id: 'course-cs305', code: 'CS305', name: 'قواعد البيانات', credits: 3, department: 'dept-cs', prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-cs301', code: 'CS301', name: 'شبكات الحاسب', credits: 3, department: 'dept-cs', prerequisites: ['CS202'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-se301', code: 'SE301', name: 'هندسة البرمجيات', credits: 3, department: 'dept-cs', prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-ai401', code: 'AI401', name: 'الذكاء الاصطناعي', credits: 3, department: 'dept-cs', prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-cyb301', code: 'CYB301', name: 'الأمن السيبراني', credits: 3, department: 'dept-cs', prerequisites: ['CS301'], program: 'بكالوريوس علوم الحاسوب' },
];

export const MOCK_USERS: User[] = [
  { id: 'user-admin-1', name: 'Admin Fallback', email: 'admin@example.com', role: 'admin', status: 'نشط', createdAt: '2023-01-01T10:00:00Z' },
  { id: 'user-prof-1', name: 'Professor Fallback', email: 'professor@example.com', role: 'professor', status: 'نشط', createdAt: '2023-01-05T11:00:00Z' },
  
  // 1. Ahmed (Freshman - Fall 2024 start)
  { id: 'user-student-1', name: 'أحمد محمد', email: 'ahmed@example.com', role: 'student', studentId: '2024001', department: 'dept-cs', status: 'نشط', createdAt: '2024-08-15T09:00:00Z' },
  
  // 2. Sarah (High Achiever - Started Fall 2023)
  { id: 'user-student-2', name: 'سارة خالد', email: 'sarah@example.com', role: 'student', studentId: '2023055', department: 'dept-cs', status: 'نشط', createdAt: '2023-08-10T14:00:00Z' },
  
  // 3. Khalid (Struggling - Started Fall 2023)
  { id: 'user-student-3', name: 'خالد عمر', email: 'khalid@example.com', role: 'student', studentId: '2023089', department: 'dept-cs', status: 'نشط', createdAt: '2023-08-11T11:00:00Z' },
  
  // 4. Mona (Average - Started Spring 2024)
  { id: 'user-student-4', name: 'منى يوسف', email: 'mona@example.com', role: 'student', studentId: '2024102', department: 'dept-cs', status: 'نشط', createdAt: '2024-01-10T10:00:00Z' },

  // 5. Omar (Advanced/Senior - Started Fall 2023 but fast tracked/transfer)
  { id: 'user-student-5', name: 'عمر فاروق', email: 'omar@example.com', role: 'student', studentId: '2023010', department: 'dept-cs', status: 'نشط', createdAt: '2023-08-01T09:00:00Z' },
];

export const MOCK_PROFESSOR_ASSIGNMENTS: ProfessorCourseAssignment[] = [
  { professorId: 'user-prof-1', courseId: 'course-cs102' },
  { professorId: 'user-prof-1', courseId: 'course-cs201' },
  { professorId: 'user-prof-1', courseId: 'course-cs305' },
  { professorId: 'user-prof-1', courseId: 'course-ai401' },
];

export const MOCK_STUDENT_ENROLLMENTS: StudentEnrollment[] = [
  // --- 1. Ahmed (Freshman) ---
  // Just starting, taking basics
  { studentId: 'user-student-1', courseId: 'course-cs101', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
  { studentId: 'user-student-1', courseId: 'course-math101', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
  { studentId: 'user-student-1', courseId: 'course-eng101', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },

  // --- 2. Sarah (High Achiever) ---
  // Fall 2023 (GPA ~3.8)
  { studentId: 'user-student-2', courseId: 'course-cs101', semester: '2023-fall', courseworkGrade: 38, finalGrade: 58, status: 'completed' }, // 96
  { studentId: 'user-student-2', courseId: 'course-math101', semester: '2023-fall', courseworkGrade: 37, finalGrade: 55, status: 'completed' }, // 92
  { studentId: 'user-student-2', courseId: 'course-eng101', semester: '2023-fall', courseworkGrade: 39, finalGrade: 59, status: 'completed' }, // 98
  // Spring 2024
  { studentId: 'user-student-2', courseId: 'course-cs102', semester: '2024-spring', courseworkGrade: 39, finalGrade: 56, status: 'completed' }, // 95
  { studentId: 'user-student-2', courseId: 'course-phy101', semester: '2024-spring', courseworkGrade: 36, finalGrade: 54, status: 'completed' }, // 90
  { studentId: 'user-student-2', courseId: 'course-is250', semester: '2024-spring', courseworkGrade: 38, finalGrade: 52, status: 'completed' }, // 90
  // Fall 2024 (Current - Junior level load)
  { studentId: 'user-student-2', courseId: 'course-cs201', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
  { studentId: 'user-student-2', courseId: 'course-ce210', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
  { studentId: 'user-student-2', courseId: 'course-is202', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },

  // --- 3. Khalid (Struggling) ---
  // Fall 2023 (Rough start)
  { studentId: 'user-student-3', courseId: 'course-cs101', semester: '2023-fall', courseworkGrade: 15, finalGrade: 25, status: 'completed' }, // 40 (Fail)
  { studentId: 'user-student-3', courseId: 'course-math101', semester: '2023-fall', courseworkGrade: 25, finalGrade: 30, status: 'completed' }, // 55 (Pass)
  // Spring 2024 (Retook CS101, failed IS250)
  { studentId: 'user-student-3', courseId: 'course-cs101', semester: '2024-spring', courseworkGrade: 22, finalGrade: 38, status: 'completed' }, // 60 (Pass)
  { studentId: 'user-student-3', courseId: 'course-is250', semester: '2024-spring', courseworkGrade: 18, finalGrade: 25, status: 'completed' }, // 43 (Fail)
  // Fall 2024 (Retaking IS250, taking CS102)
  { studentId: 'user-student-3', courseId: 'course-cs102', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
  { studentId: 'user-student-3', courseId: 'course-is250', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' }, // Retake

  // --- 4. Mona (Average) ---
  // Spring 2024 (Good start)
  { studentId: 'user-student-4', courseId: 'course-cs101', semester: '2024-spring', courseworkGrade: 30, finalGrade: 45, status: 'completed' }, // 75
  { studentId: 'user-student-4', courseId: 'course-math101', semester: '2024-spring', courseworkGrade: 28, finalGrade: 42, status: 'completed' }, // 70
  // Fall 2024 (Current)
  { studentId: 'user-student-4', courseId: 'course-cs102', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
  { studentId: 'user-student-4', courseId: 'course-is250', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
  { studentId: 'user-student-4', courseId: 'course-eng101', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },

  // --- 5. Omar (Advanced/Transfer) ---
  // Transferred Course (Equivalent)
  { studentId: 'user-student-5', courseId: 'course-eng101', semester: 'transfer', courseworkGrade: 0, finalGrade: 95, status: 'transferred' },
  // Fall 2023
  { studentId: 'user-student-5', courseId: 'course-cs101', semester: '2023-fall', courseworkGrade: 35, finalGrade: 50, status: 'completed' }, // 85
  { studentId: 'user-student-5', courseId: 'course-math101', semester: '2023-fall', courseworkGrade: 32, finalGrade: 48, status: 'completed' }, // 80
  // Spring 2024
  { studentId: 'user-student-5', courseId: 'course-cs102', semester: '2024-spring', courseworkGrade: 34, finalGrade: 46, status: 'completed' }, // 80
  { studentId: 'user-student-5', courseId: 'course-ce210', semester: '2024-spring', courseworkGrade: 30, finalGrade: 45, status: 'completed' }, // 75
  { studentId: 'user-student-5', courseId: 'course-cs201', semester: '2024-spring', courseworkGrade: 35, finalGrade: 50, status: 'completed' }, // 85 (Summer/Fast track simulated)
  // Fall 2024 (Advanced Load)
  { studentId: 'user-student-5', courseId: 'course-cs202', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' }, // OS
  { studentId: 'user-student-5', courseId: 'course-cs305', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' }, // DB
  { studentId: 'user-student-5', courseId: 'course-ai401', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' }, // AI
];

export const MOCK_REGISTRATION_REQUESTS: Registration[] = [
  { id: 'req-1', studentId: 'user-student-1', courseId: 'course-cs201', status: 'pending', requestType: 'override', date: '2024-08-25' },
];

export const MOCK_COURSE_SUBMISSIONS: CourseSubmission[] = [
  { courseId: 'course-cs101', semester: '2023-fall', submissionDate: '2023-12-25' },
  { courseId: 'course-math101', semester: '2023-fall', submissionDate: '2023-12-26' },
  { courseId: 'course-cs102', semester: '2024-spring', submissionDate: '2024-05-15' },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-1', user: 'Admin Fallback', userId: 'user-admin-1', action: 'قام بتحديث بيانات مقرر CS101', timestamp: new Date().toISOString() },
  { id: 'log-2', user: 'Professor Fallback', userId: 'user-prof-1', action: 'سلم درجات مقرر CS102', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', userId: 'user-student-3', title: 'تنبيه أكاديمي', message: 'يرجى مراجعة المرشد الأكاديمي بخصوص درجاتك.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false },
  { id: 'notif-2', userId: 'user-prof-1', title: 'تذكير بتسليم الدرجات', message: 'يرجى تسليم درجات مقرر CS201 قبل الموعد النهائي.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
];
