
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProfessorLayout from '../../components/layout/ProfessorLayout';
import { useAuth } from '../../App';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { Semester } from '../../types';

interface Student {
    id: string; // This will be the main user ID
    studentId: string; // This is the university student ID
    name: string;
    attended: boolean;
    courseworkGrade: number | null;
    finalGrade: number | null;
    hasReviewRequest: boolean;
}

const ProfessorDashboard: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { user } = useAuth();
    const { users, studentEnrollments, professorCourseAssignments, courses, updateGrade, submitCourseGrades, semesters, registrationRequests } = useData();
    const { addToast } = useToast();
    
    const [students, setStudents] = useState<Student[]>([]);
    const [courseTitle, setCourseTitle] = useState('لوحة تحكم الأستاذ');
    const [courseName, setCourseName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeSemester, setActiveSemester] = useState<Semester | null>(null);
    
    useEffect(() => {
        const openSemester = semesters.find(s => s.status === 'مفتوح');
        setActiveSemester(openSemester || null);
    
        if (user && courseId) {
            const assignment = professorCourseAssignments.find(a => a.professorId === user.id && a.courseId === courseId);
            if (!assignment) {
                setCourseTitle('المادة غير موجودة أو غير مسندة لك');
                setStudents([]);
                return;
            }
            
            const assignedCourse = courses.find(c => c.id === assignment.courseId);
            if (!assignedCourse) {
                 setCourseTitle('تفاصيل المادة غير موجودة');
                 setStudents([]);
                 return;
            }
    
            setCourseName(assignedCourse.name);
    
            if (openSemester) {
                setCourseTitle(`إدارة درجات: ${assignedCourse.name} (${openSemester.name})`);
                
                const hasPendingStudents = studentEnrollments.some(
                    e => e.courseId === courseId && e.semester === openSemester.id && e.status === 'enrolled'
                );
                
                const courseStudents = studentEnrollments
                    .filter(e => e.courseId === assignment.courseId && e.semester === openSemester.id)
                    .map(enrollment => {
                        const studentUser = users.find(u => u.id === enrollment.studentId);
                        const hasReview = registrationRequests.some(r => r.courseId === courseId && r.studentId === enrollment.studentId && r.requestType === 'review' && r.status === 'pending');
                        return {
                            id: studentUser?.id || '',
                            studentId: studentUser?.studentId || '',
                            name: studentUser?.name || 'Unknown',
                            attended: true,
                            courseworkGrade: enrollment.courseworkGrade,
                            finalGrade: enrollment.finalGrade,
                            hasReviewRequest: hasReview
                        }
                    }).filter(s => s.id);
    
                setIsSubmitted(courseStudents.length > 0 ? !hasPendingStudents : true);
                setStudents(courseStudents as Student[]);
    
            } else {
                setCourseTitle(`مقرر: ${assignedCourse.name}`);
                setStudents([]);
                setIsSubmitted(true);
            }
    
        } else {
            setCourseTitle('لوحة تحكم الأستاذ');
            setStudents([]);
        }
    }, [user, courseId, studentEnrollments, professorCourseAssignments, courses, users, semesters, registrationRequests]);


    const handleAttendanceChange = (id: string) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, attended: !s.attended } : s));
    };

    const handleGradeChange = (studentId: string, gradeType: 'coursework' | 'final', value: string) => {
        const numericGrade = value === '' ? null : parseInt(value, 10);
        const maxGrade = gradeType === 'coursework' ? 40 : 60;

        if ((numericGrade === null || (numericGrade >= 0 && numericGrade <= maxGrade)) && courseId) {
            setStudents(prev => prev.map(s => {
                if (s.id === studentId) {
                    return gradeType === 'coursework' 
                        ? { ...s, courseworkGrade: numericGrade }
                        : { ...s, finalGrade: numericGrade };
                }
                return s;
            }));
            
            if(gradeType === 'coursework'){
                updateGrade(studentId, courseId, { courseworkGrade: numericGrade });
            } else {
                updateGrade(studentId, courseId, { finalGrade: numericGrade });
            }
        }
    };
    
    const gradesAreComplete = useMemo(() => students.length > 0 && students.every(s => s.courseworkGrade !== null && s.finalGrade !== null), [students]);

    const handleSubmitGrades = () => {
        if (!gradesAreComplete) {
            addToast('يرجى رصد جميع درجات الطلاب قبل التمكن من التسليم.', 'warning');
            return;
        }

        if (window.confirm(`هل أنت متأكد من رغبتك في تسليم الدرجات النهائية لمقرر "${courseName}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
            if (user && courseId) {
                submitCourseGrades(courseId, courseName, user.id);
                addToast('تم تسليم الدرجات بنجاح!', 'success');
                setIsSubmitted(true);
            }
        }
    };


    if (!courseId) {
        return (
            <ProfessorLayout title={courseTitle}>
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">أهلاً بك، {user?.name}</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        من فضلك اختر أحد المواد الدراسية من القائمة الجانبية لبدء عرض الطلاب وإدارة درجاتهم.
                    </p>
                </div>
            </ProfessorLayout>
        );
    }

    return (
        <ProfessorLayout title={courseTitle}>
             {!activeSemester && courseId && (
                <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded-lg mb-6 flex items-start gap-4">
                     <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-yellow-800">لا يوجد فصل دراسي مفتوح للتسجيل</h3>
                        <p className="text-sm text-yellow-700">
                            لا يمكن إدارة الدرجات حالياً. يجب على مسؤول النظام فتح فصل دراسي للسماح بتسجيل الدرجات.
                        </p>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{courseTitle}</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">الرقم الجامعي</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">اسم الطالب</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">الحضور</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">الأعمال (من 40)</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">النهائي (من 60)</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? students.map(student => {
                                const totalGrade = (student.courseworkGrade ?? 0) + (student.finalGrade ?? 0);
                                return (
                                <tr key={student.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-3 px-4">{student.studentId}</td>
                                    <td className="py-3 px-4 font-medium flex items-center gap-2">
                                        {student.name}
                                        {student.hasReviewRequest && (
                                            <span 
                                                className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 cursor-help"
                                                title="الطالب يطلب مراجعة الدرجة"
                                            >
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                                تظلم
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <input
                                            type="checkbox"
                                            checked={student.attended}
                                            onChange={() => handleAttendanceChange(student.id)}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                            disabled={isSubmitted}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <input
                                            type="number"
                                            value={student.courseworkGrade ?? ''}
                                            onChange={(e) => handleGradeChange(student.id, 'coursework', e.target.value)}
                                            className="w-24 text-center p-1 border rounded-md read-only:bg-gray-100 read-only:cursor-not-allowed"
                                            min="0"
                                            max="40"
                                            readOnly={isSubmitted}
                                            aria-label={`درجة أعمال الطالب ${student.name}`}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <input
                                            type="number"
                                            value={student.finalGrade ?? ''}
                                            onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                                            className="w-24 text-center p-1 border rounded-md read-only:bg-gray-100 read-only:cursor-not-allowed"
                                            min="0"
                                            max="60"
                                            readOnly={isSubmitted}
                                            aria-label={`الدرجة النهائية للطالب ${student.name}`}
                                        />
                                    </td>
                                     <td className="py-3 px-4 text-center font-bold">
                                        {(student.courseworkGrade !== null && student.finalGrade !== null) ? totalGrade : '-'}
                                    </td>
                                </tr>
                            )}) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        {activeSemester ? 'لا يوجد طلاب مسجلين في هذه المادة لهذا الفصل الدراسي.' : 'يرجى اختيار مادة من فصل دراسي نشط.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t">
                    {isSubmitted ? (
                        <div className="text-center p-4 bg-green-100 text-green-800 rounded-md font-semibold">
                           {students.length > 0 ? 'تم تسليم الدرجات النهائية لهذا المقرر بنجاح.' : 'لا يوجد طلاب لإدخال درجاتهم.'}
                        </div>
                    ) : (
                        <div className="flex justify-end items-center gap-4">
                            <div className="relative group">
                                <button
                                    onClick={handleSubmitGrades}
                                    disabled={!gradesAreComplete}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    تسليم الدرجات النهائية
                                </button>
                                {!gradesAreComplete && (
                                    <div 
                                        className="absolute bottom-full right-0 mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs rounded-md py-1 px-3"
                                        role="tooltip"
                                    >
                                        يرجى رصد جميع درجات الطلاب أولاً لتفعيل الزر
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProfessorLayout>
    );
};

export default ProfessorDashboard;
