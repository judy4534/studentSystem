
export type Role = 'admin' | 'student' | 'professor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  department?: string;
  status?: 'نشط' | 'غير نشط';
  createdAt?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  prerequisites: string[];
  program: string;
}

export interface StudentCourse extends Course {
  status: 'enrolled' | 'completed' | 'withdrawn' | 'transferred';
  courseworkGrade?: number;
  finalGrade?: number;
}

export interface StudentEnrollment {
    studentId: string;
    courseId: string;
    semester: string;
    courseworkGrade: number | null;
    finalGrade: number | null;
    status: 'enrolled' | 'completed' | 'withdrawn' | 'transferred';
}

export interface Registration {
  id: string;
  studentId: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestType: 'add' | 'drop' | 'override' | 'review';
  date: string;
}

export interface Semester {
  id: string; // e.g., '2025-spring'
  name: string; // e.g., 'Spring 2025'
  status: 'مفتوح' | 'مغلق';
  startDate: string;
  endDate: string;
  gradeSubmissionDeadline: string;
}

export interface CourseSubmission {
    courseId: string;
    semester: string;
    submissionDate: string;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  userId: string;
  action: string;
  timestamp: string; // ISO Date String
}

export interface Department {
  id: string;
  name: string;
  head: string;
  courseCount: number;
  studentCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ProfessorCourseAssignment {
    professorId: string;
    courseId: string;
}