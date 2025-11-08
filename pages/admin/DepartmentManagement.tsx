
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useData } from '../../context/DataContext';
import type { Department } from '../../types';

// --- Department Modal Component ---
interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (department: Omit<Department, 'id'> | Department) => void;
  department: Department | null;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onClose, onSave, department }) => {
  const [name, setName] = useState('');
  const [head, setHead] = useState('');
  const [courseCount, setCourseCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    if (department) {
      setName(department.name);
      setHead(department.head === 'غير موجود' ? '' : department.head);
      setCourseCount(department.courseCount);
      setStudentCount(department.studentCount);
    } else {
      setName('');
      setHead('');
      setCourseCount(0);
      setStudentCount(0);
    }
  }, [department, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const departmentData = { 
        name, 
        head: head.trim() === '' ? 'غير موجود' : head, 
        courseCount, 
        studentCount 
    };
    if (department) {
      onSave({ ...department, ...departmentData });
    } else {
      onSave(departmentData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">{department ? 'تعديل قسم' : 'إضافة قسم جديد'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="dept-name" className="block text-sm font-medium text-gray-700 mb-1">اسم القسم</label>
              <input
                id="dept-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="dept-head" className="block text-sm font-medium text-gray-700 mb-1">رئيس القسم</label>
              <input
                id="dept-head"
                type="text"
                value={head}
                onChange={(e) => setHead(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dept-courses" className="block text-sm font-medium text-gray-700 mb-1">عدد المواد</label>
                <input
                  id="dept-courses"
                  type="number"
                  value={courseCount}
                  onChange={(e) => setCourseCount(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  required
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="dept-students" className="block text-sm font-medium text-gray-700 mb-1">عدد الطلاب</label>
                <input
                  id="dept-students"
                  type="number"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                  required
                  min="0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 space-x-reverse mt-8">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
              إلغاء
            </button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              {department ? 'حفظ التغييرات' : 'إضافة القسم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Delete Confirmation Modal ---
interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    departmentName: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, departmentName }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose} aria-modal="true" role="dialog">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4 text-red-600">تأكيد الحذف</h2>
          <p className="text-gray-700 mb-6">
            هل أنت متأكد من رغبتك في حذف قسم "{departmentName}"؟ <br />
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

const DepartmentManagement: React.FC = () => {
    const { departments, addDepartment, updateDepartment, deleteDepartment } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingDepartment, setDeletingDepartment] = useState<{ id: string; name: string } | null>(null);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const totalStudents = departments.reduce((sum, dept) => sum + dept.studentCount, 0);
    const totalCourses = departments.reduce((sum, dept) => sum + dept.courseCount, 0);
    
    const handleInitiateDelete = (id: string, name: string) => {
        setDeletingDepartment({ id, name });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingDepartment) {
            deleteDepartment(deletingDepartment.id);
            handleCloseDeleteModal();
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingDepartment(null);
    };


    const handleOpenAddModal = () => {
        setEditingDepartment(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (department: Department) => {
        setEditingDepartment(department);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDepartment(null);
    };

    const handleSaveDepartment = (departmentData: Omit<Department, 'id'> | Department) => {
        if ('id' in departmentData) {
            updateDepartment(departmentData);
        } else {
            addDepartment(departmentData);
        }
        handleCloseModal();
    };

    return (
        <AdminLayout title="إدارة الأقسام الأكاديمية">
            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">إجمالي الأقسام</h3>
                        <p className="text-3xl font-bold mt-2">{departments.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">إجمالي الطلاب</h3>
                        <p className="text-3xl font-bold mt-2">{totalStudents.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">إجمالي المواد</h3>
                        <p className="text-3xl font-bold mt-2">{totalCourses.toLocaleString()}</p>
                    </div>
                </div>

                {/* Departments Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-1/2">
                            <input
                                type="text"
                                placeholder="... بحث باسم القسم او رئيسه"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                        <button 
                            onClick={handleOpenAddModal}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            إضافة قسم جديد
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">اسم القسم</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">رئيس القسم</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">عدد المواد</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">عدد الطلاب</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDepartments.map(dept => (
                                    <tr key={dept.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{dept.name}</td>
                                        <td className="py-3 px-4 text-gray-600">{dept.head}</td>
                                        <td className="py-3 px-4 text-center">{dept.courseCount}</td>
                                        <td className="py-3 px-4 text-center">{dept.studentCount}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center space-x-2 space-x-reverse">
                                                <button onClick={() => handleOpenEditModal(dept)} className="text-gray-500 hover:text-blue-600" title="تعديل"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                                <button onClick={() => handleInitiateDelete(dept.id, dept.name)} className="text-gray-500 hover:text-red-600" title="حذف"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <DepartmentModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveDepartment}
                department={editingDepartment}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                departmentName={deletingDepartment?.name || ''}
            />
        </AdminLayout>
    );
};

export default DepartmentManagement;