
import React, { useState, useMemo } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../App';
import { useData } from '../../context/DataContext';
import type { StudentEnrollment, Course } from '../../types';

type CourseWithDetails = StudentEnrollment & {
    code: string;
    name: string;
    credits: number;
    courseId: string;
};

const StatusBadge = ({ courseworkGrade, finalGrade, status }: { courseworkGrade: number | null, finalGrade: number | null, status: string }) => {
    if (status === 'transferred') {
         return (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                معادلة
            </span>
        );
    }
    if (courseworkGrade === null || finalGrade === null) {
        return (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                قيد الرصد
            </span>
        );
    }
    const totalGrade = courseworkGrade + finalGrade;
    const pass = totalGrade >= 50;
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${pass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {pass ? 'ناجح' : 'راسب'}
        </span>
    );
}

const StudentGrades: React.FC = () => {
    const { user } = useAuth();
    const { courses, studentEnrollments, createReviewRequest, registrationRequests } = useData();
    
    const allSemesters = useMemo(() => {
        const semesterSet = new Set(studentEnrollments
            .filter(e => e.studentId === user?.id)
            .map(e => e.semester));
        
        const semesterOrder = ['spring', 'fall', 'transfer'];
        const customSort = (a: string, b: string) => {
            if (a === 'transfer') return 1;
            if (b === 'transfer') return -1;
            const [yearA, termA] = a.split('-');
            const [yearB, termB] = b.split('-');
            if (yearA !== yearB) return yearB.localeCompare(yearA);
            return semesterOrder.indexOf(termB) - semesterOrder.indexOf(termA);
        };
        
        return Array.from(semesterSet).sort(customSort);
    }, [user, studentEnrollments]);

    const [selectedSemester, setSelectedSemester] = useState(allSemesters[0] || '');
    
    const studentCourses = useMemo(() => studentEnrollments
        .filter(e => e.studentId === user?.id)
        .map(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId);
            return {
                ...enrollment,
                code: course?.code || '',
                name: course?.name || '',
                credits: course?.credits || 0,
            };
        }), [user, studentEnrollments, courses]);
    
    const semesterGrades = studentCourses.filter(c => c.semester === selectedSemester);

    const calculateGPA = (coursesToCalc: CourseWithDetails[]) => {
        const completedCourses = coursesToCalc.filter(c => (c.status === 'completed' || c.status === 'transferred') && c.courseworkGrade !== null && c.finalGrade !== null);
        if (completedCourses.length === 0) return { gpa: '0.00', points: 0, credits: 0 };

        const totalCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0);
        if (totalCredits === 0) return { gpa: '0.00', points: 0, credits: 0 };

        const totalPoints = completedCourses.reduce((sum, c) => {
            const totalGrade = (c.courseworkGrade || 0) + (c.finalGrade || 0);
            return sum + totalGrade * c.credits;
        }, 0);

        const gpa = (totalPoints / totalCredits).toFixed(2);
        return { gpa, points: totalPoints, credits: totalCredits };
    }
    
    const semesterSummary = useMemo(() => calculateGPA(semesterGrades), [semesterGrades]);

    const cumulativeSummary = useMemo(() => {
        const currentSemesterIndex = allSemesters.indexOf(selectedSemester);
        // Assuming semesters are sorted desc, logic might need adjustment if they are mixed
        // Simple logic: all courses
        return calculateGPA(studentCourses);
    }, [studentCourses, selectedSemester, allSemesters]);

    const handleRequestReview = (courseId: string) => {
        if (user) {
            if (window.confirm('هل تود إرسال طلب مراجعة درجة لهذه المادة؟')) {
                createReviewRequest(user.id, courseId);
            }
        }
    };

    const isReviewPending = (courseId: string) => {
        return registrationRequests.some(r => r.studentId === user?.id && r.courseId === courseId && r.requestType === 'review' && r.status === 'pending');
    };

    return (
        <StudentLayout title="صحيفة الدرجات">
            <div className="container mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">جدول الدرجات</h1>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            aria-label="اختر الفصل الدراسي"
                        >
                            {allSemesters.map(semester => (
                                <option key={semester} value={semester}>{semester === 'transfer' ? 'المواد المعادلة' : semester.replace('-', ' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-blue-600 text-white rounded-lg p-6 shadow-lg mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <p className="text-blue-200 text-sm font-semibold">الوحدات المسجلة</p>
                            <p className="text-2xl font-bold">{semesterSummary.credits}</p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-sm font-semibold">النقاط المحتسبة</p>
                            <p className="text-2xl font-bold">{semesterSummary.points}</p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-sm font-semibold">المعدل الفصلي</p>
                            <p className="text-2xl font-bold">{semesterSummary.gpa}</p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-sm font-semibold">المعدل التراكمي العام</p>
                            <p className="text-2xl font-bold">{cumulativeSummary.gpa}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">الرمز</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">المادة</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">الوحدات</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">الأعمال</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">النهائي</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">المجموع</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">النقاط</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">الحالة</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {semesterGrades.map((grade) => {
                                    const totalGrade = (grade.courseworkGrade ?? 0) + (grade.finalGrade ?? 0);
                                    const points = grade.courseworkGrade !== null && grade.finalGrade !== null ? totalGrade * grade.credits : '-';
                                    const isFailed = grade.courseworkGrade !== null && grade.finalGrade !== null && totalGrade < 50;
                                    const pendingReview = isReviewPending(grade.courseId);

                                    return (
                                        <tr key={grade.courseId} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-4 px-4 font-medium">{grade.code}</td>
                                            <td className="py-4 px-4">{grade.name}</td>
                                            <td className="py-4 px-4 text-center">{grade.credits}</td>
                                            <td className="py-4 px-4 text-center">{grade.courseworkGrade ?? '-'}</td>
                                            <td className="py-4 px-4 text-center">{grade.finalGrade ?? '-'}</td>
                                            <td className="py-4 px-4 font-bold text-center">
                                                {grade.courseworkGrade !== null && grade.finalGrade !== null ? totalGrade : '-'}
                                            </td>
                                            <td className="py-4 px-4 text-center">{points}</td>
                                            <td className="py-4 px-4 text-center"><StatusBadge courseworkGrade={grade.courseworkGrade} finalGrade={grade.finalGrade} status={grade.status} /></td>
                                            <td className="py-4 px-4 text-center">
                                                {isFailed && (
                                                    <button 
                                                        onClick={() => handleRequestReview(grade.courseId)}
                                                        disabled={pendingReview}
                                                        className={`text-sm px-3 py-1 rounded-md border transition-colors ${pendingReview ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                                                    >
                                                        {pendingReview ? 'قيد المراجعة' : 'طلب تظلم'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentGrades;
