import React, { useState, useMemo } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../App';
import type { Course, Semester } from '../../types';

interface CourseRegistrationContentProps {
    openSemester: Semester;
}

const CourseRegistrationContent: React.FC<CourseRegistrationContentProps> = ({ openSemester }) => {
    const { user } = useAuth();
    const { 
        courses, 
        departments, 
        studentEnrollments, 
        enrollStudentInCourse, 
        createOverrideRequest, 
        unenrollStudentFromCourse,
    } = useData();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    
    const studentCompletedCourseCodes = useMemo(() => {
        const completedCourses = studentEnrollments
            .filter(e => e.studentId === user?.id && e.status === 'completed')
            .map(e => courses.find(c => c.id === e.courseId)?.code);
        return new Set(completedCourses.filter(Boolean) as string[]);
    }, [studentEnrollments, user, courses]);

    const studentEnrolledCourseIds = useMemo(() => {
        if (!user) {
            return new Set<string>();
        }
        return new Set(
            studentEnrollments
                .filter(e => e.studentId === user.id && e.status === 'enrolled' && e.semester === openSemester.id)
                .map(e => e.courseId)
        );
    }, [studentEnrollments, user, openSemester]);

    const getCourseStatus = (course: Course) => {
        const completedCourse = studentEnrollments.find(e => e.studentId === user?.id && e.courseId === course.id && e.status === 'completed');
        if (completedCourse) {
            const totalGrade = (completedCourse.courseworkGrade || 0) + (completedCourse.finalGrade || 0);
            return { status: 'مكتمل', action: null, message: `أنجزت هذه المادة بدرجة ${totalGrade}` };
        }

        if (studentEnrolledCourseIds.has(course.id)) {
            return { status: 'مسجل', action: 'drop', message: 'أنت مسجل حالياً في هذه المادة' };
        }

        const prereqsMet = course.prerequisites.every(prereqCode => studentCompletedCourseCodes.has(prereqCode));

        if (prereqsMet) {
            return { status: 'متاح', action: 'add', message: 'جميع المتطلبات مستوفاة' };
        } else {
            const unmetPrereqs = course.prerequisites.filter(p => !studentCompletedCourseCodes.has(p));
            return { status: 'يتطلب تجاوز', action: 'override', message: `المتطلبات غير المستوفاة: ${unmetPrereqs.join(', ')}` };
        }
    };
    
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  course.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
            return matchesSearch && matchesDepartment;
        });
    }, [courses, searchTerm, selectedDepartment]);

    const handleRegister = (courseId: string) => {
        if (user) enrollStudentInCourse(user.id, courseId);
    };
    
    const handleDrop = (courseId: string) => {
         if (user) unenrollStudentFromCourse(user.id, courseId);
    };

    const handleOverride = (courseId: string) => {
        if (user) createOverrideRequest(user.id, courseId);
    };

    return (
        <>
            <div className="bg-blue-50 border-r-4 border-blue-400 p-4 rounded-lg mb-8 flex items-start sm:items-center gap-4">
                <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-blue-800">
                        فترة التسجيل مفتوحة حالياً ({openSemester.name})
                    </h3>
                    <p className="text-sm text-blue-700">
                        يمكنك تسجيل المواد حتى تاريخ {openSemester.endDate}.
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full flex-grow flex items-center gap-4">
                        <div className="relative flex-grow">
                             <input
                                type="text"
                                placeholder="... بحث بالاسم أو كود المقرر"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full md:w-1/4 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">كل الأقسام</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                 <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                             <tr className="bg-gray-50 border-b">
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">المقرر الدراسي</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">الوحدات</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">المتطلبات</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">الحالة</th>
                                <th className="text-center py-3 px-4 font-semibold text-gray-600">الإجراءات</th>
                            </tr>
                        </thead>
                         <tbody>
                            {filteredCourses.map(course => {
                                const { status, action } = getCourseStatus(course);
                                
                                return (
                                    <tr key={course.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <p className="font-medium">{course.name}</p>
                                            <p className="text-sm text-gray-500">{course.code}</p>
                                        </td>
                                        <td className="py-3 px-4 text-center">{course.credits}</td>
                                        <td className="py-3 px-4">
                                            {course.prerequisites.length > 0 ? course.prerequisites.join(', ') : <span className="text-gray-400">لا يوجد</span>}
                                        </td>
                                        <td className="py-3 px-4">
                                            {status === 'مسجل' && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>}
                                            {status === 'مكتمل' && <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>}
                                            {status === 'متاح' && <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>}
                                            {status === 'يتطلب تجاوز' && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">غير مستوفاة</span>}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {action === 'add' && <button onClick={() => handleRegister(course.id)} className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-blue-700">تسجيل</button>}
                                            {action === 'drop' && <button onClick={() => handleDrop(course.id)} className="bg-red-500 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-red-600">حذف</button>}
                                            {action === 'override' && <button onClick={() => handleOverride(course.id)} className="bg-yellow-500 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-yellow-600">طلب تجاوز</button>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

const StudentCourseRegistration: React.FC = () => {
    const { semesters } = useData();
    const openSemester = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to the start of the day for accurate comparison
        return semesters.find(s => {
            if (s.status !== 'مفتوح') {
                return false;
            }
            const endDate = new Date(s.endDate);
            // The end date is inclusive
            return endDate >= today;
        });
    }, [semesters]);

    return (
        <StudentLayout title="تسجيل المواد الدراسية">
            <div className="container mx-auto">
                {openSemester ? (
                    <CourseRegistrationContent openSemester={openSemester} />
                ) : (
                    <div className="bg-red-50 border-r-4 border-red-500 p-8 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
                        <div className="flex-shrink-0 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-red-800 mb-2">
                                انتهى وقت التسجيل
                            </h3>
                            <p className="text-red-700">
                                فترة تسجيل المواد الدراسية مغلقة حالياً. يرجى مراجعة قسم التسجيل.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default StudentCourseRegistration;