
import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useData } from '../../context/DataContext';

const statusDisplayMap = {
    pending: 'قيد المراجعة',
    approved: 'تمت الموافقة',
    rejected: 'مرفوض',
};

const requestTypeDisplayMap = {
    add: 'إضافة مقرر',
    drop: 'حذف مقرر',
    override: 'تجاوز متطلب',
};

const StatusBadge = ({ status }: { status: keyof typeof statusDisplayMap }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    const text = statusDisplayMap[status];
    switch (status) {
        case 'pending':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{text}</span>;
        case 'approved':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{text}</span>;
        case 'rejected':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>{text}</span>;
        default:
            return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{text}</span>;
    }
};

const RequestManagement: React.FC = () => {
    const { registrationRequests, users, courses, approveRequest, rejectRequest } = useData();

    const overrideRequests = useMemo(() => 
        registrationRequests.filter(req => req.requestType === 'override'), 
        [registrationRequests]
    );

    const pendingCount = overrideRequests.filter(r => r.status === 'pending').length;
    const approvedCount = overrideRequests.filter(r => r.status === 'approved').length;
    const rejectedCount = overrideRequests.filter(r => r.status === 'rejected').length;

    return (
        <AdminLayout title="إدارة طلبات تجاوز المتطلبات">
            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">طلبات قيد المراجعة</h3>
                        <p className="text-3xl font-bold mt-2">{pendingCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">طلبات تمت الموافقة عليها</h3>
                        <p className="text-3xl font-bold mt-2">{approvedCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-gray-500">طلبات مرفوضة</h3>
                        <p className="text-3xl font-bold mt-2">{rejectedCount}</p>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                         <div className="relative w-1/2">
                            <input type="text" placeholder="... بحث بالاسم أو كود المقرر" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            + إضافة طلب تجاوز
                        </button>
                    </div>

                     <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">رقم الطلب</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">الطالب</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">المقرر</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">نوع الطلب</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">تاريخ الطلب</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">الحالة</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-600">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overrideRequests.map(req => {
                                    const student = users.find(u => u.id === req.studentId);
                                    const course = courses.find(c => c.id === req.courseId);
                                    const isPending = req.status === 'pending';
                                    return (
                                        <tr key={req.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium">{req.id}</td>
                                            <td className="py-3 px-4">{student?.name || 'غير معروف'}</td>
                                            <td className="py-3 px-4 text-gray-600">{course ? `${course.code} - ${course.name}` : 'غير معروف'}</td>
                                            <td className="py-3 px-4">{requestTypeDisplayMap[req.requestType]}</td>
                                            <td className="py-3 px-4 text-gray-600">{req.date}</td>
                                            <td className="py-3 px-4"><StatusBadge status={req.status} /></td>
                                            <td className="py-3 px-4">
                                                <div className="flex space-x-2 space-x-reverse">
                                                    <button 
                                                        title="موافقة" 
                                                        className="text-green-500 hover:text-green-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                                                        onClick={() => approveRequest(req.id)}
                                                        disabled={!isPending}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    </button>
                                                    <button 
                                                        title="رفض" 
                                                        className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                                                        onClick={() => rejectRequest(req.id)}
                                                        disabled={!isPending}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
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
        </AdminLayout>
    );
};

export default RequestManagement;
