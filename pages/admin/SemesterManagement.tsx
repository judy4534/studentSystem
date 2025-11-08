
import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useData } from '../../context/DataContext';
import type { Semester } from '../../types';

// --- Semester Modal Component ---
interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (semester: Omit<Semester, 'id'> | Semester) => void;
  semester: Semester | null;
}

const SemesterModal: React.FC<SemesterModalProps> = ({ isOpen, onClose, onSave, semester }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'مفتوح' | 'مغلق'>('مفتوح');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gradeSubmissionDeadline, setGradeSubmissionDeadline] = useState('');

  useEffect(() => {
    if (semester) {
      setName(semester.name);
      setStatus(semester.status);
      setStartDate(semester.startDate);
      setEndDate(semester.endDate);
      setGradeSubmissionDeadline(semester.gradeSubmissionDeadline || '');
    } else {
      setName('');
      setStatus('مفتوح');
      setStartDate('');
      setEndDate('');
      setGradeSubmissionDeadline('');
    }
  }, [semester, isOpen]);

  const isEndDateInPast = useMemo(() => {
    if (!endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    return end < today;
  }, [endDate]);

  useEffect(() => {
    if (isEndDateInPast) {
      setStatus('مغلق');
    }
  }, [isEndDateInPast, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const semesterData = { 
        name, 
        status: isEndDateInPast ? 'مغلق' : status, 
        startDate, 
        endDate,
        gradeSubmissionDeadline,
    };
    if (semester) {
      onSave({ ...semester, ...semesterData });
    } else {
      onSave(semesterData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">{semester ? 'تعديل الفصل الدراسي' : 'إضافة فصل دراسي جديد'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="sem-name" className="block text-sm font-medium text-gray-700 mb-1">اسم الفصل الدراسي (مثال: ربيع 2025)</label>
              <input
                id="sem-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="sem-start" className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</label>
                <input
                  id="sem-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
               <div>
                <label htmlFor="sem-end" className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                <input
                  id="sem-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="sem-deadline" className="block text-sm font-medium text-gray-700 mb-1">آخر موعد لتسليم الدرجات</label>
                    <input
                      id="sem-deadline"
                      type="date"
                      value={gradeSubmissionDeadline}
                      onChange={(e) => setGradeSubmissionDeadline(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                </div>
                <div>
                    <label htmlFor="sem-status" className="block text-sm font-medium text-gray-700 mb-1">حالة التسجيل</label>
                     <select 
                        id="sem-status" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value as 'مفتوح' | 'مغلق')} 
                        className="w-full p-2 border rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={isEndDateInPast}
                    >
                        <option value="مفتوح">مفتوح</option>
                        <option value="مغلق">مغلق</option>
                    </select>
                    {isEndDateInPast && <p className="text-xs text-red-600 mt-1">لا يمكن فتح التسجيل لفصل دراسي انتهى.</p>}
                </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 space-x-reverse mt-8">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
              إلغاء
            </button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              {semester ? 'حفظ التغييرات' : 'إضافة الفصل'}
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
    semesterName: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, semesterName }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose} aria-modal="true" role="dialog">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4 text-red-600">تأكيد الحذف</h2>
          <p className="text-gray-700 mb-6">
            هل أنت متأكد من رغبتك في حذف الفصل الدراسي "{semesterName}"؟ <br />
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

const StatusBadge = ({ status }: { status: 'مفتوح' | 'مغلق' }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
        case 'مفتوح':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        case 'مغلق':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
};


const SemesterManagement: React.FC = () => {
    const { semesters, addSemester, updateSemester, deleteSemester } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingSemester, setDeletingSemester] = useState<{ id: string; name: string } | null>(null);

    const filteredSemesters = semesters.filter(sem =>
        sem.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleInitiateDelete = (id: string, name: string) => {
        setDeletingSemester({ id, name });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingSemester) {
            deleteSemester(deletingSemester.id);
            handleCloseDeleteModal();
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingSemester(null);
    };


    const handleOpenAddModal = () => {
        setEditingSemester(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (semester: Semester) => {
        setEditingSemester(semester);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSemester(null);
    };

    const handleSaveSemester = (semesterData: Omit<Semester, 'id'> | Semester) => {
        if ('id' in semesterData) {
            updateSemester(semesterData);
        } else {
            addSemester(semesterData);
        }
        handleCloseModal();
    };

    return (
        <AdminLayout title="إدارة الفصول الدراسية">
            <div className="space-y-8">
                {/* Departments Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-1/2">
                            <input
                                type="text"
                                placeholder="... بحث باسم الفصل الدراسي"
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
                            إضافة فصل دراسي
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">الفصل الدراسي</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">حالة التسجيل</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">آخر موعد لتسليم الدرجات</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">تاريخ البدء</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">تاريخ الانتهاء</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSemesters.map(sem => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const endDate = new Date(sem.endDate);
                                    
                                    const isPast = endDate < today;
                                    const displayStatus = isPast ? 'مغلق' : sem.status;

                                    return (
                                        <tr key={sem.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{sem.name}</td>
                                            <td className="py-3 px-4 text-center"><StatusBadge status={displayStatus} /></td>
                                            <td className="py-3 px-4 text-gray-600">{sem.gradeSubmissionDeadline}</td>
                                            <td className="py-3 px-4 text-gray-600">{sem.startDate}</td>
                                            <td className="py-3 px-4 text-gray-600">{sem.endDate}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center space-x-2 space-x-reverse">
                                                    <button onClick={() => handleOpenEditModal(sem)} className="text-gray-500 hover:text-blue-600" title="تعديل"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                                    <button onClick={() => handleInitiateDelete(sem.id, sem.name)} className="text-gray-500 hover:text-red-600" title="حذف"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
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
            <SemesterModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveSemester}
                semester={editingSemester}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                semesterName={deletingSemester?.name || ''}
            />
        </AdminLayout>
    );
};

export default SemesterManagement;