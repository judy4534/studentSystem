import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { User, Course, Registration, CourseSubmission, Semester, AuditLogEntry, StudentEnrollment, Department, Notification, ProfessorCourseAssignment } from '../types';
import { useAuth } from '../App';
import { useToast } from './ToastContext';
import { MOCK_USERS, MOCK_COURSES, MOCK_DEPARTMENTS, MOCK_REGISTRATION_REQUESTS, MOCK_STUDENT_ENROLLMENTS, MOCK_PROFESSOR_ASSIGNMENTS, MOCK_NOTIFICATIONS, MOCK_COURSE_SUBMISSIONS, MOCK_SEMESTERS, MOCK_AUDIT_LOGS } from '../data/db';


const API_BASE_URL = 'http://localhost:5000/api';

const apiFetch = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = localStorage.getItem('authToken');
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (response.status === 204) return null as T;

        const result = await response.json();
        if (!response.ok || result.success === false) {
            throw new Error(result.message || `API Error: ${response.statusText}`);
        }
        return result.data as T;
    } catch (error) {
        throw error;
    }
};


interface DataContextType {
    users: User[];
    courses: Course[];
    departments: Department[];
    registrationRequests: Registration[];
    studentEnrollments: StudentEnrollment[];
    professorCourseAssignments: ProfessorCourseAssignment[];
    notifications: Notification[];
    courseSubmissions: CourseSubmission[];
    semesters: Semester[];
    auditLogs: AuditLogEntry[];
    loading: boolean;
    updateGrade: (studentId: string, courseId: string, grades: { courseworkGrade?: number | null; finalGrade?: number | null; }) => Promise<void>;
    approveRequest: (requestId: string) => Promise<void>;
    rejectRequest: (requestId: string) => Promise<void>;
    deleteDepartment: (departmentId: string) => Promise<void>;
    addDepartment: (department: Omit<Department, 'id'>) => Promise<void>;
    updateDepartment: (department: Department) => Promise<void>;
    deleteCourse: (courseId: string) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    addUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    addCourse: (course: Omit<Course, 'id'>, professorId: string | null) => Promise<void>;
    updateCourse: (course: Course) => Promise<void>;
    enrollStudentInCourse: (studentId: string, courseId: string) => Promise<void>;
    unenrollStudentFromCourse: (studentId: string, courseId: string) => Promise<void>;
    assignProfessorToCourse: (courseId: string, professorId: string | null) => Promise<void>;
    submitCourseGrades: (courseId: string, courseName: string, professorId: string) => Promise<void>;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    markAllNotificationsAsRead: (userId: string) => Promise<void>;
    sendProfessorReminderNotification: (professorId: string, courseName: string) => Promise<void>;
    createOverrideRequest: (studentId: string, courseId: string) => Promise<void>;
    addSemester: (semester: Omit<Semester, 'id'>) => Promise<void>;
    updateSemester: (semester: Semester) => Promise<void>;
    deleteSemester: (semesterId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isApiAvailable } = useAuth();
    const { addToast } = useToast();

    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [registrationRequests, setRegistrationRequests] = useState<Registration[]>([]);
    const [studentEnrollments, setStudentEnrollments] = useState<StudentEnrollment[]>([]);
    const [professorCourseAssignments, setProfessorCourseAssignments] = useState<ProfessorCourseAssignment[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [courseSubmissions, setCourseSubmissions] = useState<CourseSubmission[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            const statesToClear = [setUsers, setCourses, setDepartments, setRegistrationRequests, setStudentEnrollments, setProfessorCourseAssignments, setNotifications, setCourseSubmissions, setSemesters, setAuditLogs];
            statesToClear.forEach(setter => setter([]));
            return;
        }

        setLoading(true);

        if (!isApiAvailable) {
            setUsers(MOCK_USERS);
            setCourses(MOCK_COURSES);
            setDepartments(MOCK_DEPARTMENTS);
            setRegistrationRequests(MOCK_REGISTRATION_REQUESTS);
            setStudentEnrollments(MOCK_STUDENT_ENROLLMENTS);
            setProfessorCourseAssignments(MOCK_PROFESSOR_ASSIGNMENTS);
            setNotifications(MOCK_NOTIFICATIONS);
            setCourseSubmissions(MOCK_COURSE_SUBMISSIONS);
            setSemesters(MOCK_SEMESTERS);
            setAuditLogs(MOCK_AUDIT_LOGS);
            setLoading(false);
            return;
        }

        try {
            const [
                usersData, coursesData, departmentsData, requestsData, enrollmentsData, 
                assignmentsData, notificationsData, submissionsData, semestersData, auditLogsData
            ] = await Promise.all([
                apiFetch<User[]>('/users'),
                apiFetch<Course[]>('/courses'),
                apiFetch<Department[]>('/departments'),
                apiFetch<Registration[]>('/requests'),
                apiFetch<StudentEnrollment[]>('/enrollments'),
                apiFetch<ProfessorCourseAssignment[]>('/assignments'),
                apiFetch<Notification[]>('/notifications'),
                apiFetch<CourseSubmission[]>('/submissions'),
                apiFetch<Semester[]>('/semesters'),
                apiFetch<AuditLogEntry[]>('/audit-logs'),
            ]);

            setUsers(usersData);
            setCourses(coursesData);
            setDepartments(departmentsData);
            setRegistrationRequests(requestsData);
            setStudentEnrollments(enrollmentsData);
            setProfessorCourseAssignments(assignmentsData);
            setNotifications(notificationsData);
            setCourseSubmissions(submissionsData);
            setSemesters(semestersData);
            setAuditLogs(auditLogsData);

        } catch (error) {
            if (!(error instanceof Error && error.message.includes('Failed to fetch'))) {
                console.error("API data fetch failed:", error);
            }
            // Fallback to mock data is handled by the AuthProvider setting isApiAvailable
        } finally {
            setLoading(false);
        }
    }, [user, isApiAvailable]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApiCall = useCallback(async <T,>(request: Promise<T>, successMessage: string, stateUpdate: (data: T) => void) => {
        try {
            const data = await request;
            stateUpdate(data);
            addToast(successMessage, 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred.';
            if (!errorMessage.includes('Failed to fetch')) {
                 addToast(errorMessage, 'error');
            }
        }
    }, [addToast]);

    const updateGrade = useCallback(async (studentId: string, courseId: string, grades: { courseworkGrade?: number | null; finalGrade?: number | null; }) => {
        const optimisticUpdate = () => {
             setStudentEnrollments(prev => prev.map(e => e.studentId === studentId && e.courseId === courseId ? { ...e, ...grades } : e));
        };
        if (!isApiAvailable) {
            optimisticUpdate();
            return;
        }
        await handleApiCall(
            apiFetch(`/enrollments/grade`, { method: 'PATCH', body: JSON.stringify({ studentId, courseId, ...grades }) }), 
            'Grade updated.', 
            optimisticUpdate
        );
    }, [isApiAvailable, handleApiCall]);

    const approveRequest = useCallback(async (requestId: string) => {
        const optimisticUpdate = () => {
            const request = registrationRequests.find(r => r.id === requestId);
            if(request){
                setRegistrationRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'approved' } : req));
                setStudentEnrollments(prev => [...prev, { studentId: request.studentId, courseId: request.courseId, semester: '2024-fall', courseworkGrade: null, finalGrade: null, status: 'enrolled' }]);
                addToast('Request approved.', 'success');
            }
        };

        if (!isApiAvailable) {
            optimisticUpdate();
            return;
        }
        await handleApiCall(apiFetch(`/requests/${requestId}/approve`, { method: 'POST' }), 'Request approved.', () => {
             fetchData();
        });
    }, [handleApiCall, fetchData, isApiAvailable, registrationRequests]);

    const rejectRequest = useCallback(async (requestId: string) => {
        const optimisticUpdate = () => setRegistrationRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req));
        if(!isApiAvailable) {
            optimisticUpdate();
            addToast('Request rejected (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch(`/requests/${requestId}/reject`, { method: 'POST' }), 'Request rejected.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);

    const deleteDepartment = useCallback(async (id: string) => {
        const optimisticUpdate = () => setDepartments(prev => prev.filter(d => d.id !== id));
        if(!isApiAvailable) {
            optimisticUpdate();
            addToast('Department deleted (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch(`/departments/${id}`, { method: 'DELETE' }), 'Department deleted.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);
    
    const addDepartment = useCallback(async (data: Omit<Department, 'id'>) => {
        if (!isApiAvailable) {
            const newDept = { ...data, id: `dept-local-${Date.now()}` };
            setDepartments(prev => [...prev, newDept]);
            addToast('Department added (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<Department>('/departments', { method: 'POST', body: JSON.stringify(data) }), 'Department added.', (newDept) => {
            setDepartments(prev => [...prev, newDept]);
        });
    }, [handleApiCall, isApiAvailable, addToast]);

    const updateDepartment = useCallback(async (data: Department) => {
        const optimisticUpdate = (updatedDept: Department) => setDepartments(prev => prev.map(d => d.id === data.id ? updatedDept : d));
        if(!isApiAvailable) {
            optimisticUpdate(data);
            addToast('Department updated (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<Department>(`/departments/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }), 'Department updated.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);

    const deleteCourse = useCallback(async (id: string) => {
        const optimisticUpdate = () => setCourses(prev => prev.filter(c => c.id !== id));
        if(!isApiAvailable) {
            optimisticUpdate();
            addToast('Course deleted (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch(`/courses/${id}`, { method: 'DELETE' }), 'Course deleted.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);
    
    const addCourse = useCallback(async (data: Omit<Course, 'id'>, professorId: string | null) => {
        if (!isApiAvailable) {
            const newCourse = { ...data, id: `course-local-${Date.now()}` };
            setCourses(prev => [...prev, newCourse]);
            if (professorId) {
                setProfessorCourseAssignments(prev => [...prev, { courseId: newCourse.id, professorId }]);
            }
            addToast('Course added (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<Course>('/courses', { method: 'POST', body: JSON.stringify({ ...data, professorId }) }), 'Course added.', (newCourse) => {
            setCourses(prev => [...prev, newCourse]);
            if (professorId) {
                setProfessorCourseAssignments(prev => [...prev, { courseId: newCourse.id, professorId }]);
            }
        });
    }, [handleApiCall, isApiAvailable, addToast]);

    const updateCourse = useCallback(async (data: Course) => {
        const optimisticUpdate = (updatedCourse: Course) => setCourses(prev => prev.map(c => c.id === data.id ? updatedCourse : c));
        if(!isApiAvailable) {
            optimisticUpdate(data);
            addToast('Course updated (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<Course>(`/courses/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }), 'Course updated.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);
    
    const assignProfessorToCourse = useCallback(async (courseId: string, professorId: string | null) => {
        const optimisticUpdate = () => {
             setProfessorCourseAssignments(prev => {
                const others = prev.filter(a => a.courseId !== courseId);
                return professorId ? [...others, { courseId, professorId }] : others;
             });
        };
        if (!isApiAvailable) {
            optimisticUpdate();
            addToast('Professor assigned (Offline Mode)', 'info');
            return;
        }
         await handleApiCall(apiFetch(`/courses/${courseId}/assign`, { method: 'POST', body: JSON.stringify({ professorId }) }), 'Professor assigned.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);

    const deleteUser = useCallback(async (id: string) => {
        const optimisticUpdate = () => setUsers(prev => prev.filter(u => u.id !== id));
        if (!isApiAvailable) {
            optimisticUpdate();
            addToast('User deleted (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch(`/users/${id}`, { method: 'DELETE' }), 'User deleted.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);

    const addUser = useCallback(async (data: Omit<User, 'id' | 'createdAt'>) => {
        if (!isApiAvailable) {
            const newUser = { ...data, id: `user-local-${Date.now()}`, createdAt: new Date().toISOString() };
            setUsers(prev => [newUser, ...prev]);
            addToast('User added (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<User>('/users', { method: 'POST', body: JSON.stringify(data) }), 'User added.', (newUser) => {
            setUsers(prev => [newUser, ...prev]);
        });
    }, [handleApiCall, isApiAvailable, addToast]);

    const updateUser = useCallback(async (data: User) => {
        const optimisticUpdate = (updatedUser: User) => setUsers(prev => prev.map(u => u.id === data.id ? updatedUser : u));
        if (!isApiAvailable) {
            optimisticUpdate(data);
            addToast('User updated (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<User>(`/users/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }), 'User updated.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);

    const enrollStudentInCourse = useCallback(async (studentId: string, courseId: string) => {
        const openSemester = semesters.find(s => s.status === 'مفتوح');
        if (!openSemester) {
            addToast('Registration is currently closed.', 'error');
            return;
        }
        const newEnrollment: StudentEnrollment = { studentId, courseId, semester: openSemester.id, courseworkGrade: null, finalGrade: null, status: 'enrolled' };

        if (!isApiAvailable) {
            setStudentEnrollments(prev => [...prev, newEnrollment]);
            addToast('Successfully enrolled (Offline Mode).', 'info');
            return;
        }
        await handleApiCall(apiFetch<StudentEnrollment>('/enrollments', { method: 'POST', body: JSON.stringify({ studentId, courseId }) }), 'Successfully enrolled.', (newApiEnrollment) => {
            setStudentEnrollments(prev => [...prev, newApiEnrollment]);
        });
    }, [handleApiCall, isApiAvailable, addToast, semesters]);
    
    const unenrollStudentFromCourse = useCallback(async (studentId: string, courseId: string) => {
        const optimisticUpdate = () => setStudentEnrollments(prev => prev.filter(e => !(e.studentId === studentId && e.courseId === courseId)));
        if (!isApiAvailable) {
            optimisticUpdate();
            addToast('Successfully unenrolled (Offline Mode).', 'info');
            return;
        }
        await handleApiCall(apiFetch(`/enrollments`, { method: 'DELETE', body: JSON.stringify({ studentId, courseId }) }), 'Successfully unenrolled.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);

    const submitCourseGrades = useCallback(async (courseId: string, courseName: string, professorId: string) => {
        const openSemester = semesters.find(s => s.status === 'مفتوح');
        if (!isApiAvailable) {
             setStudentEnrollments(prev => prev.map(e => (e.courseId === courseId && e.semester === openSemester?.id) ? { ...e, status: 'completed' } : e));
             setCourseSubmissions(prev => [...prev, { courseId, semester: openSemester!.id, submissionDate: new Date().toISOString().split('T')[0] }]);
             addToast('Grades submitted (Offline Mode)', 'info');
             return;
        }
         await handleApiCall(apiFetch(`/submissions`, { method: 'POST', body: JSON.stringify({ courseId }) }), 'Grades submitted.', () => {
             fetchData(); // Refetch everything to get updated statuses
         });
    }, [handleApiCall, fetchData, isApiAvailable, addToast, semesters]);

    const markNotificationAsRead = useCallback(async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        if(isApiAvailable) await apiFetch(`/notifications/${id}/read`, { method: 'POST' }).catch(() => {});
    }, [isApiAvailable]);

    const markAllNotificationsAsRead = useCallback(async (userId: string) => {
        setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
        if(isApiAvailable) await apiFetch(`/notifications/read-all`, { method: 'POST' }).catch(() => {});
    }, [isApiAvailable]);

    const sendProfessorReminderNotification = useCallback(async (professorId: string, courseName: string) => {
        if (!isApiAvailable) {
            addToast('Reminder sent (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch('/notifications/remind', { method: 'POST', body: JSON.stringify({ professorId, courseName }) }), 'Reminder sent!', () => {});
    }, [handleApiCall, isApiAvailable, addToast]);

    const createOverrideRequest = useCallback(async (studentId: string, courseId: string) => {
        if (!isApiAvailable) {
            const newRequest: Registration = { studentId, courseId, requestType: 'override', id: `req-local-${Date.now()}`, date: new Date().toISOString().split('T')[0], status: 'pending' };
            setRegistrationRequests(prev => [...prev, newRequest]);
            addToast('Override request sent (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<Registration>('/requests', { method: 'POST', body: JSON.stringify({ studentId, courseId, requestType: 'override' }) }), 'Override request sent.', (newRequest) => {
             setRegistrationRequests(prev => [...prev, newRequest]);
        });
    }, [handleApiCall, isApiAvailable, addToast]);

    const addSemester = useCallback(async (data: Omit<Semester, 'id'>) => {
         if (!isApiAvailable) {
            const newSemester = { ...data, id: `sem-local-${Date.now()}` };
            setSemesters(prev => [newSemester, ...prev].sort((a,b) => b.name.localeCompare(a.name)));
            addToast('Semester added (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<Semester>('/semesters', { method: 'POST', body: JSON.stringify(data) }), 'Semester added.', (newSemester) => {
            setSemesters(prev => [newSemester, ...prev].sort((a,b) => b.name.localeCompare(a.name)));
        });
    }, [handleApiCall, isApiAvailable, addToast]);

    const updateSemester = useCallback(async (data: Semester) => {
        const optimisticUpdate = (updatedSemester: Semester) => setSemesters(prev => prev.map(s => s.id === data.id ? updatedSemester : s));
        if (!isApiAvailable) {
            optimisticUpdate(data);
            addToast('Semester updated (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch<Semester>(`/semesters/${data.id}`, { method: 'PUT', body: JSON.stringify(data) }), 'Semester updated.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);
    
    const deleteSemester = useCallback(async (id: string) => {
        const optimisticUpdate = () => setSemesters(prev => prev.filter(s => s.id !== id));
        if (!isApiAvailable) {
            optimisticUpdate();
            addToast('Semester deleted (Offline Mode)', 'info');
            return;
        }
        await handleApiCall(apiFetch(`/semesters/${id}`, { method: 'DELETE' }), 'Semester deleted.', optimisticUpdate);
    }, [handleApiCall, isApiAvailable, addToast]);


    const value = useMemo(() => ({
        users, courses, departments, registrationRequests, studentEnrollments,
        professorCourseAssignments, notifications, courseSubmissions, semesters, auditLogs,
        loading,
        updateGrade, approveRequest, rejectRequest, deleteDepartment, addDepartment,
        updateDepartment, deleteCourse, deleteUser, addUser, updateUser, addCourse,
        updateCourse, enrollStudentInCourse, unenrollStudentFromCourse, assignProfessorToCourse,
        submitCourseGrades, markNotificationAsRead, markAllNotificationsAsRead,
        sendProfessorReminderNotification, createOverrideRequest, addSemester, updateSemester,
        deleteSemester,
    }), [
        users, courses, departments, registrationRequests, studentEnrollments,
        professorCourseAssignments, notifications, courseSubmissions, semesters, auditLogs,
        loading,
        updateGrade, approveRequest, rejectRequest, deleteDepartment, addDepartment,
        updateDepartment, deleteCourse, deleteUser, addUser, updateUser, addCourse,
        updateCourse, enrollStudentInCourse, unenrollStudentFromCourse, assignProfessorToCourse,
        submitCourseGrades, markNotificationAsRead, markAllNotificationsAsRead,
        sendProfessorReminderNotification, createOverrideRequest, addSemester, updateSemester,
        deleteSemester,
    ]);

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};