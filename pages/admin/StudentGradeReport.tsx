import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
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

const StudentGradeReport: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const { users, courses, studentEnrollments, departments } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const student = useMemo(() => users.find(u => u.id === studentId), [users, studentId]);

    const departmentName = useMemo(() => {
        if (!student?.department) return 'غير محدد';
        return departments.find(d => d.id === student.department)?.name || student.department;
    }, [student, departments]);

    const studentCourses = useMemo(() => studentEnrollments
        .filter(e => e.studentId === studentId)
        .map(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId);
            return {
                ...enrollment,
                code: course?.code || '',
                name: course?.name || '',
                credits: course?.credits || 0,
            };
        }), [studentId, studentEnrollments, courses]);
    
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
    };

    const semesterGPAs = useMemo(() => {
        const gpaMap = new Map<string, ReturnType<typeof calculateGPA>>();
        const semesterMap = new Map<string, CourseWithDetails[]>();
        studentCourses.forEach(course => {
            const semesterCourses = semesterMap.get(course.semester) || [];
            semesterMap.set(course.semester, [...semesterCourses, course]);
        });
        
        semesterMap.forEach((courses, semester) => {
            gpaMap.set(semester, calculateGPA(courses));
        });

        return gpaMap;
    }, [studentCourses]);

    const filteredStudentCourses = useMemo(() => {
        if (!searchTerm.trim()) {
            return studentCourses;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return studentCourses.filter(course =>
            course.name.toLowerCase().includes(lowercasedSearchTerm) ||
            course.code.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [studentCourses, searchTerm]);

    const semestersData = useMemo(() => {
        const semesterMap = new Map<string, CourseWithDetails[]>();
        filteredStudentCourses.forEach(course => {
            const semesterCourses = semesterMap.get(course.semester) || [];
            semesterMap.set(course.semester, [...semesterCourses, course]);
        });

        const semesterOrder = ['spring', 'fall'];
        const customSort = (a: string, b: string) => {
            const [yearA, termA] = a.split('-');
            const [yearB, termB] = b.split('-');
            if (yearA !== yearB) return yearB.localeCompare(yearA);
            return semesterOrder.indexOf(termB) - semesterOrder.indexOf(termA);
        };

        return Array.from(semesterMap.entries())
            .sort(([semA], [semB]) => customSort(semA, semB))
            .map(([semester, courses]) => ({ semester, courses }));
    }, [filteredStudentCourses]);

    const overallGPASummary = useMemo(() => calculateGPA(studentCourses), [studentCourses]);

    if (!student) {
        return (
            <AdminLayout title="خطأ">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">لم يتم العثور على الطالب</h2>
                    <p className="text-gray-600 mb-6">قد يكون معرف الطالب غير صحيح أو تم حذفه.</p>
                    <button onClick={() => navigate('/admin/grade-reports')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        العودة إلى التقارير
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`صحيفة درجات: ${student.name}`}>
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{student.name}</h1>
                            <p className="text-gray-500">الرقم الجامعي: {student.studentId}</p>
                            <p className="text-gray-500">القسم: {departmentName}</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            <span>العودة للمستخدمين</span>
                        </button>
                    </div>
                    <div className="mt-6 border-t pt-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <h3 className="text-gray-500 font-semibold">المعدل التراكمي العام (من 100)</h3>
                            <p className="text-4xl font-bold mt-2 text-blue-600">{overallGPASummary.gpa}</p>
                        </div>
                    </div>
                     <div className="mt-6 border-t pt-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="... بحث عن مقرر بالاسم أو الرمز"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {semestersData.length > 0 ? (
                    semestersData.map(({ semester, courses: semesterCoursesList }) => {
                        const summary = semesterGPAs.get(semester) || { gpa: '0.00', points: 0, credits: 0 };
                        return (
                            <div key={semester} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="bg-gray-50 rounded-md p-4 mb-4">
                                     <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-800">{semester.replace('-', ' ')}</h2>
                                        <div className="text-right">
                                            <span className="text-gray-500 font-semibold">المعدل الفصلي: </span>
                                            <span className="font-bold text-lg text-green-600">{summary.gpa}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center mt-3 border-t pt-3">
                                        <div>
                                            <p className="text-sm text-gray-500">الوحدات</p>
                                            <p className="font-bold text-gray-700">{summary.credits}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">النقاط</p>
                                            <p className="font-bold text-gray-700">{summary.points}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">المعدل</p>
                                            <p className="font-bold text-gray-700">{summary.gpa}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-right py-3 px-4 font-semibold text-gray-500">الرمز</th>
                                                <th className="text-right py-3 px-4 font-semibold text-gray-500">المادة</th>
                                                <th className="text-center py-3 px-4 font-semibold text-gray-500">الوحدات</th>
                                                <th className="text-center py-3 px-4 font-semibold text-gray-500">الأعمال</th>
                                                <th className="text-center py-3 px-4 font-semibold text-gray-500">النهائي</th>
                                                <th className="text-center py-3 px-4 font-semibold text-gray-500">المجموع</th>
                                                <th className="text-center py-3 px-4 font-semibold text-gray-500">الحالة</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {semesterCoursesList.map((course) => {
                                                const totalGrade = (course.courseworkGrade ?? 0) + (course.finalGrade ?? 0);
                                                return (
                                                    <tr key={course.courseId} className="border-b last:border-0 hover:bg-gray-50">
                                                        <td className="py-4 px-4 font-medium">{course.code}</td>
                                                        <td className="py-4 px-4">{course.name}</td>
                                                        <td className="py-4 px-4 text-center">{course.credits}</td>
                                                        <td className="py-4 px-4 text-center">{course.courseworkGrade ?? '-'}</td>
                                                        <td className="py-4 px-4 text-center">{course.finalGrade ?? '-'}</td>
                                                        <td className="py-4 px-4 font-bold text-center">
                                                            {course.courseworkGrade !== null && course.finalGrade !== null ? totalGrade : '-'}
                                                        </td>
                                                        <td className="py-4 px-4 text-center"><StatusBadge courseworkGrade={course.courseworkGrade} finalGrade={course.finalGrade} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })
                ) : (
                     <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <p className="text-gray-500 text-lg">لا توجد مقررات تطابق معايير البحث.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default StudentGradeReport;