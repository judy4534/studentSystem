import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import type { Course } from '../../types';
import { useData } from '../../context/DataContext';

// --- Delete Confirmation Modal ---
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    courseName: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, courseName }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose} aria-modal="true" role="dialog">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4 text-red-600">تأكيد الحذف</h2>
          <p className="text-gray-700 mb-6">
            هل أنت متأكد من رغبتك في حذف مقرر "{courseName}"؟ <br />
            لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              تأكيد الحذف
            </button>
          </div>
        </div>
      </div>
    );
};


const CourseManagement: React.FC = () => {
    const { courses, departments, deleteCourse, professorCourseAssignments, users } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState<{ id: string; name: string } | null>(null);

    const getProfessorName = (courseId: string) => {
        const assignment = professorCourseAssignments.find(a => a.courseId === courseId);
        if (!assignment) return 'غير مسند';
        
        const professor = users.find(u => u.id === assignment.professorId);
        return professor ? professor.name : 'غير مسند';
    };

    const getDepartmentName = (departmentId: string) => {
        return departments.find(d => d.id === departmentId)?.name || departmentId;
    };
    
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              course.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === 'all' || course.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    const handleInitiateDelete = (courseId: string, courseName: string) => {
        setDeletingCourse({ id: courseId, name: courseName });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingCourse) {
            deleteCourse(deletingCourse.id);
            handleCloseDeleteModal();
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingCourse(null);
    };

    return (
        <AdminLayout title="إدارة المقررات الدراسية">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <div className="flex-grow flex items-center gap-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="... بحث عن مقرر"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                        <div className="w-1/4">
                            <select
                                id="department-filter"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="تصفية حسب القسم"
                            >
                                <option value="all">كل الأقسام</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/course/new')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex-shrink-0"
                    >
                        إضافة مقرر جديد
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">كود المقرر</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">اسم المقرر</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">الوحدات</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">القسم</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">المتطلبات السابقة</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">أستاذ المادة</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map(course => (
                                <tr key={course.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{course.code}</td>
                                    <td className="py-3 px-4">{course.name}</td>
                                    <td className="py-3 px-4">{course.credits}</td>
                                    <td className="py-3 px-4">{getDepartmentName(course.department)}</td>
                                    <td className="py-3 px-4">
                                        {course.prerequisites.length > 0 ? (
                                            course.prerequisites.map(prereq => (
                                                <span key={prereq} className="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{prereq}</span>
                                            ))
                                        ) : (
                                            <span>لا يوجد</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">{getProfessorName(course.id)}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-start space-x-2 space-x-reverse">
                                            <button onClick={() => navigate(`/admin/course/${course.id}`)} className="text-gray-500 hover:text-blue-600" title="تعديل">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button onClick={() => handleInitiateDelete(course.id, course.name)} className="text-gray-500 hover:text-red-600" title="حذف">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                courseName={deletingCourse?.name || ''}
            />
        </AdminLayout>
    );
};

export default CourseManagement;