
import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { useData } from '../../context/DataContext';
import type { AuditLogEntry } from '../../types';

// Icons for management cards for better visual distinction
const ICONS = {
  COURSES: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  DEPARTMENTS: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-13l9-7 9 7v13h-4v-6h-2v6H9v-6H7v6H3zm6-2H7v-4h2v4zm8 0h-2v-4h2v4z"/><path d="M12 4L3 11v9h18v-9L12 4z"/></svg>,
};

const AdminDashboard: React.FC = () => {
    const { auditLogs } = useData();
    return (
        <AdminLayout title="لوحة التحكم الرئيسية">
            <div className="space-y-8">
                {/* Management Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ManagementCard 
                        title="إدارة المواد الدراسية" 
                        description="تعديل تفاصيل المواد والمتطلبات" 
                        linkTo="/admin/courses"
                        actionText="إدارة المواد"
                        icon={ICONS.COURSES}
                    />
                    <ManagementCard 
                        title="إدارة الأقسام الأكاديمية" 
                        description="تكوين الأقسام وتعديل بياناتها" 
                        linkTo="/admin/departments"
                        actionText="إدارة الأقسام"
                        icon={ICONS.DEPARTMENTS}
                    />
                </div>
                
                {/* Audit Log Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">آخر نشاطات المستخدمين</h2>
                        <button className="text-sm text-blue-600 hover:underline font-semibold">عرض السجل الكامل</button>
                    </div>
                    <AuditLog logs={auditLogs} />
                </div>
            </div>
        </AdminLayout>
    );
};

interface ManagementCardProps {
    title: string;
    description: string;
    linkTo: string;
    actionText: string;
    disabled?: boolean;
    icon: React.FC<any>;
}

const ManagementCard: React.FC<ManagementCardProps> = ({ title, description, linkTo, actionText, disabled, icon: Icon }) => {
    const cardClasses = "bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center";
    const linkClasses = `mt-4 inline-block w-full text-center px-6 py-2 rounded-md font-semibold transition-colors ${
        disabled 
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
        : 'bg-blue-600 text-white hover:bg-blue-700'
    }`;

    const content = (
        <>
            <div className="mb-4 p-4 bg-blue-100 rounded-full">
                <Icon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600 mb-auto flex-grow">{description}</p>
            {disabled ? (
                <span className={linkClasses}>{actionText}</span>
            ) : (
                <Link to={linkTo} className={linkClasses}>
                    {actionText}
                </Link>
            )}
        </>
    );

    return <div className={cardClasses}>{content}</div>;
}

const AuditLog: React.FC<{ logs: AuditLogEntry[] }> = ({ logs }) => {
    const formatTimestamp = (isoString: string) => {
        const date = new Date(isoString);
        const datePart = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const timePart = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        return `${datePart} ${timePart}`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-right py-2 px-4 font-semibold text-gray-600">المستخدم</th>
                        <th className="text-right py-2 px-4 font-semibold text-gray-600">الإجراء</th>
                        <th className="text-right py-2 px-4 font-semibold text-gray-600">التاريخ والوقت</th>
                        <th className="text-right py-2 px-4 font-semibold text-gray-600"></th>
                    </tr>
                </thead>
                <tbody>
                    {logs.slice(0, 5).map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{log.user}</td>
                            <td className="py-3 px-4">{log.action}</td>
                            <td className="py-3 px-4 text-sm text-gray-500">{formatTimestamp(log.timestamp)}</td>
                            <td className="py-3 px-4">
                                <button className="text-blue-500 hover:underline text-sm">تفاصيل</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default AdminDashboard;
