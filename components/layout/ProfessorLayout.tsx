import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../App';
import LogoIcon from '../icons/LogoIcon';
import { useData } from '../../context/DataContext';
import type { Course } from '../../types';
import Notifications from '../common/Notifications';

const ICONS = {
    DASHBOARD: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    COURSES: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
    LOGOUT: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
};


const ProfessorLayout: React.FC<{ children: React.ReactNode; title: string; }> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { courses, professorCourseAssignments } = useData();
  const [profCourses, setProfCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (user) {
      const assignments = professorCourseAssignments.filter(a => a.professorId === user.id);
      const assignedCourses = assignments
        .map(a => courses.find(c => c.id === a.courseId))
        .filter((c): c is Course => c !== undefined);
      setProfCourses(assignedCourses);
    }
  }, [user, courses, professorCourseAssignments]);
  
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800" dir="rtl">
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-700 px-4">
            <div className="flex items-center gap-3">
                <LogoIcon className="h-8 w-8"/>
                <span className="text-xl font-semibold">بوابة الأستاذ</span>
            </div>
        </div>
        <nav className="flex-grow px-4 py-4">
          <ul>
              <li>
                <NavLink
                  to="/professor/dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                    }`
                  }
                >
                  <ICONS.DASHBOARD className="h-5 w-5" />
                  <span>لوحة التحكم</span>
                </NavLink>
              </li>
              {profCourses.length > 0 && (
                <>
                  <li className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    المقررات الدراسية
                  </li>
                  {profCourses.map(course => (
                    <li key={course.id}>
                      <NavLink
                        to={`/professor/course/${course.id}`}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors text-sm ${
                            isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                          }`
                        }
                      >
                        <ICONS.COURSES className="h-5 w-5" />
                        <span>{course.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </>
              )}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600/80 transition-colors text-red-300 hover:text-white"
          >
            <ICONS.LOGOUT className="h-5 w-5" />
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
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ProfessorLayout;