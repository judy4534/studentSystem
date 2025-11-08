import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import type { User, Role } from '../../types';
import { useData } from '../../context/DataContext';
import UserModal from '../../components/modals/UserModal';

const roleDisplayMap: Record<Role, string> = {
    admin: 'مسؤول',
    student: 'طالب',
    professor: 'أستاذ',
};

const UserManagement: React.FC = () => {
    const { users, deleteUser, addUser, updateUser } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const handleDelete = (userId: string, userName: string) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف المستخدم "${userName}"؟`)) {
            deleteUser(userId);
        }
    };

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = (userData: Omit<User, 'id' | 'createdAt'> | User) => {
        if ('id' in userData) {
            updateUser(userData);
        } else {
            addUser(userData);
        }
        handleCloseModal();
    };

    return (
        <AdminLayout title="إدارة المستخدمين">
            <div className="container mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold mb-8">إدارة المستخدمين</h1>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-700 whitespace-nowrap">قائمة المستخدمين</h2>
                            <div className="w-full md:w-auto flex-grow flex flex-col sm:flex-row items-center gap-2">
                                <div className="relative w-full sm:flex-grow">
                                    <input
                                        type="text"
                                        placeholder="... بحث بالاسم أو البريد"
                                        className="border rounded-md px-3 py-2 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                                <select 
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value as Role | 'all')}
                                    className="border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                                >
                                    <option value="all">كل الأدوار</option>
                                    <option value="student">طالب</option>
                                    <option value="professor">أستاذ</option>
                                    <option value="admin">مسؤول</option>
                                </select>
                            </div>
                            <button 
                                onClick={handleOpenAddModal}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex-shrink-0 whitespace-nowrap"
                            >
                                إضافة مستخدم جديد
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="text-right py-3 px-4 font-semibold text-gray-600">اسم المستخدم</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-600">البريد الإلكتروني</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-600">الدور</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-600">الحالة</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-600">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">
                                                {user.role === 'student' ? (
                                                    <Link to={`/admin/grade-reports/${user.id}`} className="text-blue-600 hover:underline">
                                                        {user.name}
                                                    </Link>
                                                ) : (
                                                    user.name
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                            <td className="py-3 px-4">{roleDisplayMap[user.role]}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    user.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>{user.status}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-center space-x-2 space-x-reverse">
                                                    {user.role === 'student' && (
                                                        <Link to={`/admin/grade-reports/${user.id}`} className="text-gray-500 hover:text-green-600" title="عرض صحيفة الدرجات">
                                                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                                                        </Link>
                                                    )}
                                                    <button onClick={() => handleOpenEditModal(user)} className="text-gray-500 hover:text-blue-600" title="تعديل"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                                    <button onClick={() => handleDelete(user.id, user.name)} className="text-gray-500 hover:text-red-600" title="حذف"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <UserModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveUser}
                user={editingUser}
            />
        </AdminLayout>
    );
};

export default UserManagement;
