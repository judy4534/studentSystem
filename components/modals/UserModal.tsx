import React, { useState, useEffect } from 'react';
import type { User, Role } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdAt'> | User) => void;
  user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Role>('student');
    const [studentId, setStudentId] = useState('');
    const [status, setStatus] = useState<'نشط' | 'غير نشط'>('نشط');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
            setStudentId(user.studentId || '');
            setStatus(user.status || 'نشط');
        } else {
            setName('');
            setEmail('');
            setRole('student');
            setStudentId('');
            setStatus('نشط');
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userData = {
            name,
            email,
            role,
            studentId: role === 'student' ? studentId : undefined,
            status,
        };
        if (user) {
            onSave({ ...user, ...userData });
        } else {
            onSave(userData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose} aria-modal="true" role="dialog">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
                                <input id="user-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                                <input id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-md" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="user-role" className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                                <select id="user-role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full p-2 border rounded-md bg-white">
                                    <option value="student">طالب</option>
                                    <option value="professor">أستاذ</option>
                                    <option value="admin">مسؤول</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="user-status" className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                                <select id="user-status" value={status} onChange={(e) => setStatus(e.target.value as 'نشط' | 'غير نشط')} className="w-full p-2 border rounded-md bg-white">
                                    <option value="نشط">نشط</option>
                                    <option value="غير نشط">غير نشط</option>
                                </select>
                            </div>
                        </div>

                        {role === 'student' && (
                            <div>
                                <label htmlFor="student-id" className="block text-sm font-medium text-gray-700 mb-1">الرقم الجامعي</label>
                                <input id="student-id" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g. 123456789"/>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-4 space-x-reverse mt-8">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
                            إلغاء
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            {user ? 'حفظ التغييرات' : 'إضافة المستخدم'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;