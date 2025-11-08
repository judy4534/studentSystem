
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';
import LogoIcon from '../icons/LogoIcon';
import Notifications from '../common/Notifications';

const ICONS = {
  DASHBOARD: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  COURSES: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  DEPARTMENTS: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-13l9-7 9 7v13h-4v-6h-2v6H9v-6H7v6H3zm6-2H7v-4h2v4zm8 0h-2v-4h2v4z"/><path d="M12 4L3 11v9h18v-9L12 4z"/></svg>,
  USERS: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  REQUESTS: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  RESULTS: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>,
  GRADE_REPORTS: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg>,
  SEMESTERS: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  LOGOUT: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
};

const navLinks = [
    { to: '/admin/dashboard', text: 'لوحة التحكم', icon: ICONS.DASHBOARD },
    { 
      id: 'courses',
      text: 'إدارة المواد', 
      icon: ICONS.COURSES,
      children: [
        { to: '/admin/courses', text: 'قائمة المواد', icon: ICONS.COURSES },
        { to: '/admin/semesters', text: 'إدارة الفصول الدراسية', icon: ICONS.SEMESTERS },
        { to: '/admin/requests', text: 'إدارة الطلبات', icon: ICONS.REQUESTS },
        { to: '/admin/results', text: 'نتائج الطلاب', icon: ICONS.RESULTS },
        { to: '/admin/grade-reports', text: 'تقارير الدرجات', icon: ICONS.GRADE_REPORTS },
      ]
    },
    { to: '/admin/departments', text: 'إدارة الأقسام', icon: ICONS.DEPARTMENTS },
    { to: '/admin/users', text: 'إدارة المستخدمين', icon: ICONS.USERS },
];

const AdminLayout: React.FC<{ children: React.ReactNode; title: string; }> = ({ children, title }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    useEffect(() => {
        const currentParent = navLinks.find(link => 
            link.children?.some(child => location.pathname.startsWith(child.to))
        );
        if (currentParent) {
            setExpandedMenu(currentParent.id!);
        }
    }, [location.pathname]);

    const handleMenuToggle = (id: string) => {
        setExpandedMenu(expandedMenu === id ? null : id);
    };
    
    return (
      <div className="flex h-screen bg-gray-100 text-gray-800" dir="rtl">
        <aside className="w-64 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
          <div className="h-20 flex items-center justify-center px-4 border-b">
              <div className="flex items-center gap-3">
                  <LogoIcon className="h-10 w-10"/>
                  <span className="text-xl font-bold text-gray-800">لوحة تحكم المسؤول</span>
              </div>
          </div>
          <nav className="flex-grow px-4 py-4">
            <ul>
              {navLinks.map((link) => {
                const isParentActive = link.children?.some(child => location.pathname.startsWith(child.to));

                return link.children ? (
                  <li key={link.id}>
                    <div
                      onClick={() => handleMenuToggle(link.id!)}
                      className={`flex items-center justify-between w-full gap-4 px-4 py-3 my-2 rounded-lg transition-colors text-gray-600 font-semibold cursor-pointer ${
                        isParentActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <link.icon className="h-6 w-6" />
                        <span>{link.text}</span>
                      </div>
                      <svg className={`h-5 w-5 transition-transform ${expandedMenu === link.id ? '' : '-rotate-90'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {expandedMenu === link.id && (
                      <ul className="pr-6">
                        {link.children.map(child => (
                           <li key={child.to}>
                             <NavLink
                               to={child.to}
                               className={({ isActive }) =>
                                 `flex items-center gap-3 px-4 py-2 my-1 rounded-lg transition-colors text-gray-500 font-medium text-sm ${
                                   isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'
                                 }`
                               }
                             >
                               <child.icon className="h-5 w-5" />
                               <span>{child.text}</span>
                             </NavLink>
                           </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={link.to}>
                    <NavLink
                      to={link.to!}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-4 py-3 my-2 rounded-lg transition-colors text-gray-600 font-semibold ${
                          isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                        }`
                      }
                    >
                      <link.icon className="h-6 w-6" />
                      <span>{link.text}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-500 font-semibold"
            >
              <ICONS.LOGOUT className="h-6 w-6" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </aside>
        
        <main className="flex-1 flex flex-col overflow-hidden">
            <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <div className="flex items-center gap-6">
                    <Notifications />
                    <div className="text-right">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>
            </header>
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    );
  };
  
  export default AdminLayout;
