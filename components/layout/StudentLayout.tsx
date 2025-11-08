
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../App';
import LogoIcon from '../icons/LogoIcon';
import Notifications from '../common/Notifications';

const ICONS = {
  HOME: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  REGISTER: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
  GRADES: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  LOGOUT: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
};

const navLinks = [
  { to: '/student/dashboard', text: 'الصفحة الرئيسية', icon: ICONS.HOME },
  { to: '/student/register', text: 'تسجيل المواد', icon: ICONS.REGISTER },
  { to: '/student/grades', text: 'درجاتي', icon: ICONS.GRADES },
];

const StudentLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800" dir="rtl">
      <aside className="w-64 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
        <div className="h-20 flex items-center justify-center px-4 border-b">
            <div className="flex items-center gap-3">
                <LogoIcon className="h-10 w-10"/>
                <span className="text-xl font-bold text-gray-800">بوابة الطالب</span>
            </div>
        </div>
        <nav className="flex-grow px-4 py-4">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
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
            ))}
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

export default StudentLayout;
