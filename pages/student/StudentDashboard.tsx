
import React from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../App';
import { useData } from '../../context/DataContext';

const ICONS = {
    UNITS: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>,
    SIGMA: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>,
    BOOK: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
};


const StatusBadge = ({ status }: { status: 'enrolled' | 'completed' | 'withdrawn' }) => {
    switch(status) {
        case 'enrolled':
            return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">قيد الرصد</span>;
        case 'completed':
            return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">مكتمل</span>;
        case 'withdrawn':
            return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">منسحب</span>;
        default:
            return null;
    }
};

const GradeDisplay = ({ courseworkGrade, finalGrade }: { courseworkGrade: number | null, finalGrade: number | null }) => {
    if (courseworkGrade === null || finalGrade === null) {
        return <span className="text-gray-500">-</span>;
    }
    const totalGrade = courseworkGrade + finalGrade;
    const colorClass = totalGrade < 50 ? 'text-red-600 font-bold' : 'text-gray-800 font-bold';
    return <span className={colorClass}>{totalGrade}</span>;
}


const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const { courses, studentEnrollments, semesters } = useData();
    
    const openSemester = React.useMemo(() => semesters.find(s => s.status === 'مفتوح'), [semesters]);

    const allSemestersForStudent = React.useMemo(() => {
        const semesterSet = new Set(studentEnrollments.filter(e => e.studentId === user?.id).map(e => e.semester));
        const semesterOrder = ['spring', 'fall'];
        const customSort = (a: string, b: string) => {
            const [yearA, termA] = a.split('-');
            const [yearB, termB] = b.split('-');
            if (yearA !== yearB) return yearB.localeCompare(yearA);
            return semesterOrder.indexOf(termB) - semesterOrder.indexOf(termA);
        };
        return Array.from(semesterSet).sort(customSort);
    }, [studentEnrollments, user]);

    // Prioritize the globally open semester. If none, fall back to the student's most recent semester.
    const currentSemesterName = openSemester 
        ? openSemester.id 
        : (allSemestersForStudent.length > 0 ? allSemestersForStudent[0] : null);

    const currentSemesterEnrollments = React.useMemo(() => studentEnrollments
        .filter(e => e.studentId === user?.id && e.semester === currentSemesterName)
        .map(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId);
            return {
                ...enrollment,
                course: course,
            };
        })
        .filter((e): e is typeof e & { course: NonNullable<typeof e.course> } => !!e.course),
        [studentEnrollments, user, courses, currentSemesterName]
    );

    const completedCourses = studentEnrollments.filter(e => e.studentId === user?.id && e.status === 'completed');
    const totalCredits = completedCourses.reduce((sum, enrollment) => {
        const course = courses.find(c => c.id === enrollment.courseId);
        return sum + (course?.credits || 0);
    }, 0);

    const totalPoints = completedCourses.reduce((sum, enrollment) => {
        const course = courses.find(c => c.id === enrollment.courseId);
        const totalGrade = (enrollment.courseworkGrade || 0) + (enrollment.finalGrade || 0);
        return sum + (totalGrade * (course?.credits || 0));
    }, 0);

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A';
    
    const areAllGradesSubmitted = React.useMemo(() => 
        currentSemesterEnrollments.length > 0 && currentSemesterEnrollments.every(e => e.status === 'completed'),
    [currentSemesterEnrollments]);


    const summaryData = [
        { title: 'الوحدات المنجزة', value: `${totalCredits} وحدة`, icon: ICONS.UNITS, color: 'purple' },
        { title: 'المعدل التراكمي (من 100)', value: gpa, icon: ICONS.SIGMA, color: 'green' },
        { title: 'مواد الفصل الحالي', value: `${currentSemesterEnrollments.length} مواد`, icon: ICONS.BOOK, color: 'blue' },
    ];

    return (
        <StudentLayout title="لوحة التحكم الرئيسية">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {summaryData.map(item => (
                        <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                            <div className="text-right">
                                <p className="text-gray-500 text-sm font-medium">{item.title}</p>
                                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-${item.color}-100 text-${item.color}-600`}>
                                <item.icon />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">
                            مواد الفصل الحالي {currentSemesterName && `(${currentSemesterName.replace('-', ' ')})`}
                        </h2>
                        <Link to="/student/register" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors text-sm">
                            تسجيل مواد جديدة
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b-2 border-gray-200">
                                <tr>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-500">رمز المادة</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-500">اسم المادة</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-500">الوحدات</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-500">الحالة</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-500">الدرجة النهائية</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSemesterEnrollments.length > 0 ? currentSemesterEnrollments.map(enrollment => (
                                    <tr key={enrollment.course.code} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-medium text-right">{enrollment.course.code}</td>
                                        <td className="py-4 px-4 text-right">{enrollment.course.name}</td>
                                        <td className="py-4 px-4 text-right">{enrollment.course.credits}</td>
                                        <td className="py-4 px-4 text-right"><StatusBadge status={enrollment.status} /></td>
                                        <td className="py-4 px-4 text-right"><GradeDisplay courseworkGrade={enrollment.courseworkGrade} finalGrade={enrollment.finalGrade} /></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">
                                            {currentSemesterName ? 'لم تقم بتسجيل أي مواد بعد.' : 'لا توجد بيانات فصول دراسية لعرضها.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                             {areAllGradesSubmitted && (
                                <tfoot>
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 px-4 border-t-2 border-gray-200">
                                            <span className="font-semibold text-green-700 bg-green-100 px-4 py-2 rounded-full">اكتمل الرصد لموادك</span>
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentDashboard;