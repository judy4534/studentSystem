import type { User, Course, Registration, CourseSubmission, Semester, AuditLogEntry, StudentEnrollment, Department, Notification, ProfessorCourseAssignment } from '../types';

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept-cs', name: 'علوم الحاسب', head: 'د. خالد الأحمد', courseCount: 4, studentCount: 2 },
  { id: 'dept-ce', name: 'هندسة الحاسب', head: 'د. سارة محمود', courseCount: 1, studentCount: 0 },
  { id: 'dept-is', name: 'نظم المعلومات', head: 'د. عمر عبد العزيز', courseCount: 1, studentCount: 0 },
];

export const MOCK_SEMESTERS: Semester[] = [
  { id: '2024-fall', name: 'خريف 2024', status: 'مفتوح', startDate: '2024-09-01', endDate: '2024-12-20', gradeSubmissionDeadline: '2024-12-30' },
  { id: '2024-spring', name: 'ربيع 2024', status: 'مغلق', startDate: '2024-01-15', endDate: '2024-05-10', gradeSubmissionDeadline: '2024-05-20' },
];

export const MOCK_COURSES: Course[] = [
  { id: 'course-cs101', code: 'CS101', name: 'مقدمة في علوم الحاسب', credits: 3, department: 'dept-cs', prerequisites: [], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-cs102', code: 'CS102', name: 'البرمجة الشيئية', credits: 4, department: 'dept-cs', prerequisites: ['CS101'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-cs201', code: 'CS201', name: 'هياكل البيانات', credits: 4, department: 'dept-cs', prerequisites: ['CS102'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-cs305', code: 'CS305', name: 'قواعد البيانات', credits: 3, department: 'dept-cs', prerequisites: ['CS201'], program: 'بكالوريوس علوم الحاسوب' },
  { id: 'course-ce210', code: 'CE210', name: 'الدوائر المنطقية', credits: 3, department: 'dept-ce', prerequisites: [], program: 'بكالوريوس هندسة الحاسوب' },
  { id: 'course-is250', code: 'IS250', name: 'تحليل وتصميم النظم', credits: 3, department: 'dept-is', prerequisites: [], program: 'بكالوريوس نظم المعلومات' },
];

export const MOCK_USERS: User[] = [
  { id: 'user-admin-1', name: 'Admin Fallback', email: 'admin@example.com', role: 'admin', status: 'نشط', createdAt: '2023-01-01T10:00:00Z' },
  { id: 'user-prof-1', name: 'Professor Fallback', email: 'professor@example.com', role: 'professor', status: 'نشط', createdAt: '2023-01-05T11:00:00Z' },
  { id: 'user-student-1', name: 'Student Fallback', email: 'student@example.com', role: 'student', studentId: 'S001', department: 'dept-cs', status: 'نشط', createdAt: '2023-02-10T09:00:00Z' },
  { id: 'user-student-2', name: 'علي حسن', email: 'ali.hassan@example.com', role: 'student', studentId: 'S002', department: 'dept-cs', status: 'نشط', createdAt: '2023-02-11T14:00:00Z' },
];

export const MOCK_PROFESSOR_ASSIGNMENTS: ProfessorCourseAssignment[] = [
  { professorId: 'user-prof-1', courseId: 'course-cs102' },
  { professorId: 'user-prof-1', courseId: 'course-cs201' },
];

export const MOCK_STUDENT_ENROLLMENTS: StudentEnrollment[] = [
  // Student 1
  { studentId: 'user-student-1', courseId: 'course-cs101', semester: '2024-spring', courseworkGrade: 35, finalGrade: 50, status: 'completed' },
  { studentId: 'user-student-1', courseId: 'course-cs102', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
  // Student 2
  { studentId: 'user-student-2', courseId: 'course-cs101', semester: '2024-spring', courseworkGrade: 30, finalGrade: 45, status: 'completed' },
  { studentId: 'user-student-2', courseId: 'course-cs102', semester: '2024-fall', courseworkGrade: 38, finalGrade: 55, status: 'completed' },
  { studentId: 'user-student-2', courseId: 'course-cs201', semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' },
];

export const MOCK_REGISTRATION_REQUESTS: Registration[] = [
  { id: 'req-1', studentId: 'user-student-1', courseId: 'course-cs201', status: 'pending', requestType: 'override', date: '2024-08-25' },
];

export const MOCK_COURSE_SUBMISSIONS: CourseSubmission[] = [
  { courseId: 'course-cs102', semester: '2024-fall', submissionDate: '2024-12-22' },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-1', user: 'Admin Fallback', userId: 'user-admin-1', action: 'قام بتحديث بيانات مقرر CS101', timestamp: new Date().toISOString() },
  { id: 'log-2', user: 'Professor Fallback', userId: 'user-prof-1', action: 'سلم درجات مقرر CS102', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-1', userId: 'user-student-1', title: 'تمت الموافقة على طلبك', message: 'تمت الموافقة على طلب تسجيلك في مقرر CS201.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false },
  { id: 'notif-2', userId: 'user-prof-1', title: 'تذكير بتسليم الدرجات', message: 'يرجى تسليم درجات مقرر CS201 قبل الموعد النهائي.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
];
