
import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useData } from '../../context/DataContext';

type SubmissionStatus = 'تم التسليم' | 'قيد الانتظار' | 'متأخر';

const StatusBadge = ({ status }: { status: SubmissionStatus }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case 'تم التسليم':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        case 'قيد الانتظار':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status}</span>;
        case 'متأخر':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
};

const StudentResults: React.FC = () => {
    const { courses, users, professorCourseAssignments, studentEnrollments, courseSubmissions, sendProfessorReminderNotification, semesters } = useData();
    
    const allSemesters = useMemo(() => {
        // Use the definitive list of semesters, not derived from enrollments, and sort them
        return semesters.map(s => s.id).sort((a, b) => b.localeCompare(a));
    }, [semesters]);

    const [selectedSemester, setSelectedSemester] = useState(allSemesters[0] || '');
    const [sentReminders, setSentReminders] = useState<Set<string>>(new Set());

    const semesterCourses = useMemo(() => {
        if (!selectedSemester) return [];
        const courseIdsInSemester = new Set(
            studentEnrollments
                .filter(e => e.semester === selectedSemester)
                .map(e => e.courseId)
        );
        return courses.filter(c => courseIdsInSemester.has(c.id));
    }, [selectedSemester, studentEnrollments, courses]);
    
    const deadline = useMemo(() => 
        semesters.find(s => s.id === selectedSemester)?.gradeSubmissionDeadline,
    [semesters, selectedSemester]);

    const tableData = useMemo(() => {
        const effectiveDeadline = deadline || new Date().toISOString().split('T')[0];
        
        return semesterCourses.map(course => {
            const assignment = professorCourseAssignments.find(a => a.courseId === course.id);
            const professor = users.find(u => u.id === assignment?.professorId);
            const studentCount = studentEnrollments.filter(e => e.courseId === course.id && e.semester === selectedSemester).length;

            const submission = courseSubmissions.find(s => s.courseId === course.id && s.semester === selectedSemester);
            
            let status: SubmissionStatus = 'قيد الانتظار';
            let submissionDate: string | null = null;
            
            if (submission) {
                submissionDate = submission.submissionDate;
                status = new Date(submissionDate) > new Date(effectiveDeadline) ? 'متأخر' : 'تم التسليم';
            } else {
                const enrollments = studentEnrollments.filter(e => e.courseId === course.id && e.semester === selectedSemester);
                const hasPendingStudents = enrollments.some(e => e.status === 'enrolled');
                if (enrollments.length > 0 && !hasPendingStudents) {
                    status = 'تم التسليم'; // For initial data where submission wasn't tracked
                }
            }

            return {
                id: course.id,
                code: course.code,
                name: course.name,
                instructor: professor?.name || 'غير مسند',
                instructorId: professor?.id || null,
                studentCount,
                status,
                submissionDate,
            };
        });
    }, [semesterCourses, selectedSemester, professorCourseAssignments, users, studentEnrollments, courseSubmissions, deadline]);

    const submittedCount = tableData.filter(c => c.status === 'تم التسليم' || c.status === 'متأخر').length;
    const totalCourses = tableData.length;
    const submissionProgress = totalCourses > 0 ? (submittedCount / totalCourses) * 100 : 0;
    const pendingCount = totalCourses - submittedCount;

    const handleSendReminder = (course: (typeof tableData)[0]) => {
        if (course.instructorId) {
            sendProfessorReminderNotification(course.instructorId, `${course.code} - ${course.name}`);
            setSentReminders(prev => new Set(prev).add(course.id));
        }
    };

    const formatSemesterName = (semesterId: string) => {
        if (!semesterId) return '';
        const parts = semesterId.split('-');
        return parts.length === 2 ? `${parts[1]} ${parts[0]}` : semesterId;
    };
    
    return (
        <AdminLayout title="متابعة نتائج الطلاب">
            <div className="space-y-8">
                {/* Header and Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">نتائج {formatSemesterName(selectedSemester)}</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-600">اختر الفصل الدراسي:</span>
                            <select
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                className="border rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {allSemesters.map(semester => (
                                     <option key={semester} value={semester}>{formatSemesterName(semester)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-right">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-gray-500 font-semibold">تقدم عملية التسليم</h3>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${submissionProgress}%` }}></div>
                            </div>
                            <p className="text-center text-lg font-bold mt-2">{Math.round(submissionProgress)}%</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-gray-500 font-semibold">المقررات المعلقة</h3>
                            <p className="text-2xl font-bold mt-2">{pendingCount}</p>
                            <p className="text-xs text-gray-400 mt-1">من أصل {totalCourses} مقرر</p>
                        </div>
                    </div>
                     {deadline && (
                        <p className="text-sm text-center text-gray-500 mt-4">
                            آخر موعد لتسليم الدرجات لهذا الفصل هو <span className="font-bold text-red-600">{deadline}</span>. يمكن تعديل هذا التاريخ من <span className="font-semibold">إدارة الفصول الدراسية</span>.
                        </p>
                    )}
                </div>

                {/* Courses Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-4">حالة تسليم الدرجات للمقررات</h3>
                     <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">المقرر الدراسي</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">المدرس</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">عدد الطلاب</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">حالة التسليم</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map(course => {
                                    const isReminderSent = sentReminders.has(course.id);
                                    return (
                                        <tr key={course.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <p className="font-medium">{course.code} - {course.name}</p>
                                            </td>
                                            <td className="py-3 px-4">{course.instructor}</td>
                                            <td className="py-3 px-4 text-center">{course.studentCount}</td>
                                            <td className="py-3 px-4 text-center">
                                                <StatusBadge status={course.status} />
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center space-x-2 space-x-reverse">
                                                    <button 
                                                        title={isReminderSent ? "تم إرسال التذكير" : "إرسال تذكير"} 
                                                        className={`disabled:cursor-not-allowed ${
                                                            isReminderSent 
                                                                ? 'text-green-500' 
                                                                : 'text-blue-500 hover:text-blue-700 disabled:opacity-50'
                                                        }`}
                                                        disabled={course.status !== 'قيد الانتظار' || isReminderSent || !course.instructorId}
                                                        onClick={() => handleSendReminder(course)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default StudentResults;