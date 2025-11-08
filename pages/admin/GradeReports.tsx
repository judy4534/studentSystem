
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { useData } from '../../context/DataContext';

// Component to render a single grade, possibly with color coding
const GradeDisplay = ({ courseworkGrade, finalGrade }: { courseworkGrade: number | null, finalGrade: number | null }) => {
    if (courseworkGrade === null || finalGrade === null) {
        return <span className="text-gray-500">-</span>;
    }
    const totalGrade = courseworkGrade + finalGrade;
    const colorClass = totalGrade < 50 ? 'text-red-600 font-bold' : 'text-green-700 font-bold';
    return <span className={colorClass}>{totalGrade}</span>;
};

const GradeReports: React.FC = () => {
    const { users, courses, studentEnrollments } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEnrollments = useMemo(() => {
        const baseEnrollments = studentEnrollments
            .filter(e => e.status === 'completed') // Only show completed courses with grades
            .map(enrollment => {
                const student = users.find(u => u.id === enrollment.studentId);
                const course = courses.find(c => c.id === enrollment.courseId);
                return { ...enrollment, student, course };
            })
            .filter((e): e is typeof e & { student: NonNullable<typeof e.student>, course: NonNullable<typeof e.course> } => !!e.student && !!e.course);
        
        if (!searchTerm.trim()) {
            return baseEnrollments;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase();

        return baseEnrollments.filter(({ student }) => 
            student.name.toLowerCase().includes(lowercasedSearchTerm) ||
            (student.studentId && student.studentId.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [studentEnrollments, users, courses, searchTerm]);
    
    const summaryStats = useMemo(() => {
        const gradedEnrollments = filteredEnrollments.filter(e => e.courseworkGrade !== null && e.finalGrade !== null);
        if (gradedEnrollments.length === 0) {
            return { count: 0, average: 'N/A', pass: 0, fail: 0 };
        }
        const totalGrades = gradedEnrollments.reduce((sum, e) => sum + (e.courseworkGrade || 0) + (e.finalGrade || 0), 0);
        const average = (totalGrades / gradedEnrollments.length).toFixed(2);
        const pass = gradedEnrollments.filter(e => ((e.courseworkGrade || 0) + (e.finalGrade || 0)) >= 50).length;
        const fail = gradedEnrollments.length - pass;
        return { count: gradedEnrollments.length, average, pass, fail };
    }, [filteredEnrollments]);

    const handleExportToCSV = () => {
        if (filteredEnrollments.length === 0) {
            alert('لا توجد بيانات لتصديرها بناءً على التصفية الحالية.');
            return;
        }

        const headers = [
            'اسم الطالب',
            'الرقم الجامعي',
            'رمز المقرر',
            'اسم المقرر',
            'الفصل الدراسي',
            'درجة الأعمال',
            'الدرجة النهائية',
            'المجموع'
        ];

        const csvRows = [headers.join(',')]; // Header row

        filteredEnrollments.forEach(e => {
            const totalGrade = (e.courseworkGrade ?? 0) + (e.finalGrade ?? 0);
            const row = [
                `"${e.student?.name || ''}"`,
                `"${e.student?.studentId || ''}"`,
                `"${e.course?.code || ''}"`,
                `"${e.course?.name || ''}"`,
                `"${e.semester || ''}"`,
                e.courseworkGrade !== null ? e.courseworkGrade : 'N/A',
                e.finalGrade !== null ? e.finalGrade : 'N/A',
                (e.courseworkGrade !== null && e.finalGrade !== null) ? totalGrade : 'N/A'
            ].join(',');
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'grade_reports.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <AdminLayout title="تقارير الدرجات (بحث وتحليل)">
            <div className="space-y-6">
                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">إجمالي النتائج المرصودة</h3>
                        <p className="text-3xl font-bold mt-2">{summaryStats.count}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">متوسط الدرجات</h3>
                        <p className="text-3xl font-bold mt-2">{summaryStats.average}</p>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">عدد الناجحين</h3>
                        <p className="text-3xl font-bold mt-2 text-green-600">{summaryStats.pass}</p>
                    </div>
                     <div className="bg-white p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">عدد الراسبين</h3>
                        <p className="text-3xl font-bold mt-2 text-red-600">{summaryStats.fail}</p>
                    </div>
                </div>

                {/* Results Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-bold">جدول النتائج المفصلة</h2>
                            <p className="text-sm text-gray-500 mt-1">انقر على اسم الطالب لعرض صحيفة درجاته الكاملة.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="بحث بالاسم أو الرقم الجامعي..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border rounded-md px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleExportToCSV}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 flex-shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                <span>تصدير إلى CSV</span>
                            </button>
                        </div>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">اسم الطالب</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">الرقم الجامعي</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">المقرر</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">الفصل الدراسي</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">الدرجة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEnrollments.length > 0 ? filteredEnrollments.map(e => (
                                    <tr key={`${e.studentId}-${e.courseId}-${e.semester}`} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">
                                            <Link to={`/admin/grade-reports/${e.student?.id}`} className="text-blue-600 hover:underline">
                                                {e.student?.name}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{e.student?.studentId}</td>
                                        <td className="py-3 px-4 text-gray-600">{e.course?.code} - {e.course?.name}</td>
                                        <td className="py-3 px-4 text-gray-600">{e.semester}</td>
                                        <td className="py-3 px-4 text-center">
                                            <GradeDisplay courseworkGrade={e.courseworkGrade} finalGrade={e.finalGrade} />
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">
                                            لا توجد نتائج مطابقة لخيارات التصفية المحددة.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default GradeReports;