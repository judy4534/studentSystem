import React, { useState, useMemo } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../App';
import { useData } from '../../context/DataContext';
import type { StudentEnrollment, Course } from '../../types';

type CourseWithDetails = StudentEnrollment & {
    code: string;
    name: string;
    credits: number;
};

const StatusBadge = ({ courseworkGrade, finalGrade }: { courseworkGrade: number | null, finalGrade: number | null }) => {
    if (courseworkGrade === null || finalGrade === null) {
        return (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                قيد الرصد
            </span>
        );
    }
    const totalGrade = courseworkGrade + finalGrade;
    const status = totalGrade >= 50 ? 'ناجح' : 'راسب';
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${status === 'ناجح' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status}
        </span>
    );
}

const StudentGrades: React.FC = () => {
    const { user } = useAuth();
    const { courses, studentEnrollments } = useData();
    
    const allSemesters = useMemo(() => {
        const semesterSet = new Set(studentEnrollments
            .filter(e => e.studentId === user?.id)
            .map(e => e.semester));
        
        const semesterOrder = ['spring', 'fall'];
        const customSort = (a: string, b: string) => {
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
        const completedCourses = coursesToCalc.filter(c => c.status === 'completed' && c.courseworkGrade !== null && c.finalGrade !== null);
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
        const relevantSemesters = allSemesters.slice(currentSemesterIndex);
        const coursesForCumulative = studentCourses.filter(c => relevantSemesters.includes(c.semester));
        return calculateGPA(coursesForCumulative);
    }, [studentCourses, selectedSemester, allSemesters]);

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
                                <option key={semester} value={semester}>{semester.replace('-', ' ')}</option>
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
                            <p className="text-blue-200 text-sm font-semibold">المعدل التراكمي</p>
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
                                </tr>
                            </thead>
                            <tbody>
                                {semesterGrades.map((grade) => {
                                    const totalGrade = (grade.courseworkGrade ?? 0) + (grade.finalGrade ?? 0);
                                    const points = grade.courseworkGrade !== null && grade.finalGrade !== null ? totalGrade * grade.credits : '-';
                                    return (
                                        <tr key={grade.code} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-4 px-4 font-medium">{grade.code}</td>
                                            <td className="py-4 px-4">{grade.name}</td>
                                            <td className="py-4 px-4 text-center">{grade.credits}</td>
                                            <td className="py-4 px-4 text-center">{grade.courseworkGrade ?? '-'}</td>
                                            <td className="py-4 px-4 text-center">{grade.finalGrade ?? '-'}</td>
                                            <td className="py-4 px-4 font-bold text-center">
                                                {grade.courseworkGrade !== null && grade.finalGrade !== null ? totalGrade : '-'}
                                            </td>
                                            <td className="py-4 px-4 text-center">{points}</td>
                                            <td className="py-4 px-4 text-center"><StatusBadge courseworkGrade={grade.courseworkGrade} finalGrade={grade.finalGrade} /></td>
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