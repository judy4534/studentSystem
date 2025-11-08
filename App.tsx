
import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { User, Role } from './types';
import { DataProvider, useData } from './context/DataContext';
import { ToastProvider, useToast } from './context/ToastContext';
import ToastContainer from './components/common/ToastContainer';

// Import Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManagement from './pages/admin/CourseManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import SemesterManagement from './pages/admin/SemesterManagement';
import CourseDetails from './pages/admin/CourseDetails';
import UserManagement from './pages/admin/UserManagement';
import RequestManagement from './pages/admin/RequestManagement';
import StudentResults from './pages/admin/StudentResults';
import GradeReports from './pages/admin/GradeReports';
import StudentGradeReport from './pages/admin/StudentGradeReport';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentGrades from './pages/student/StudentGrades';
import StudentCourseRegistration from './pages/student/StudentCourseRegistration';
import ProfessorDashboard from './pages/professor/ProfessorDashboard';

const API_BASE_URL = 'http://localhost:5000/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isApiAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token && token !== 'dummy-token-for-dev') {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await response.json();
          if (!response.ok || !result.success) {
            throw new Error(result.message || 'Session expired');
          }
          setUser(result.data);
        } catch (error) {
          if (error instanceof Error && error.message.includes('Failed to fetch')) {
            setIsApiAvailable(false);
          } else {
            console.error('Session check failed:', error);
          }
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const performFallbackLogin = () => {
        if (email === 'admin@example.com' || email === 'student@example.com' || email === 'professor@example.com') {
           const role = email.split('@')[0] as Role;
           const dummyUser: User = { 
              id: role === 'admin' ? 'user-admin-1' : (role === 'student' ? 'user-student-1' : 'user-prof-1'), 
              name: role === 'admin' ? 'Admin Fallback' : (role === 'student' ? 'Student Fallback' : 'Professor Fallback'), 
              email, 
              role,
              studentId: role === 'student' ? 'S001' : undefined,
              status: 'نشط'
           };
           setUser(dummyUser);
           localStorage.setItem('authToken', 'dummy-token-for-dev');
        } else {
           throw new Error('Invalid credentials for offline mode. Use one of the hint emails.');
        }
    };
    
    if (!isApiAvailable) {
        performFallbackLogin();
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: `Login failed: ${response.statusText}` }));
        throw new Error(errorResult.message || 'Login failed. Invalid credentials.');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Login failed. Invalid credentials.');
      }
      
      const { token, user: userData } = result.data;
      localStorage.setItem('authToken', token);
      setUser(userData);
      if (!isApiAvailable) setIsApiAvailable(true);

    } catch (error) {
       if (error instanceof Error && error.message.includes('Failed to fetch')) {
            if (isApiAvailable) { // Only show toast on the first failure
              addToast('Server not found. Switched to offline mode.', 'warning');
            }
            setIsApiAvailable(false);
            performFallbackLogin();
       } else {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            throw new Error(errorMessage);
       }
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, loading, isApiAvailable }), [user, loading, isApiAvailable]);
  
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <p className="text-xl font-semibold">Loading Application...</p>
            </div>
        </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
          <DataProvider>
              <MainApp />
          </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const { loading: dataLoading } = useData();

  if (dataLoading && user) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <p className="text-xl font-semibold">Loading University Data...</p>
                <p className="text-gray-500">Please wait a moment.</p>
            </div>
        </div>
    );
  }

  const renderRoutesByRole = (role: Role) => {
    switch (role) {
      case 'admin':
        return (
          <>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<CourseManagement />} />
            <Route path="/admin/departments" element={<DepartmentManagement />} />
            <Route path="/admin/semesters" element={<SemesterManagement />} />
            <Route path="/admin/course/:id" element={<CourseDetails />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/requests" element={<RequestManagement />} />
            <Route path="/admin/results" element={<StudentResults />} />
            <Route path="/admin/grade-reports" element={<GradeReports />} />
            <Route path="/admin/grade-reports/:studentId" element={<StudentGradeReport />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </>
        );
      case 'student':
        return (
          <>
            <Route path="/" element={<Navigate to="/student/dashboard" />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/grades" element={<StudentGrades />} />
            <Route path="/student/register" element={<StudentCourseRegistration />} />
            <Route path="*" element={<Navigate to="/student/dashboard" />} />
          </>
        );
      case 'professor':
        return (
          <>
            <Route path="/" element={<Navigate to="/professor/dashboard" />} />
            <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
            <Route path="/professor/course/:courseId" element={<ProfessorDashboard />} />
            <Route path="*" element={<Navigate to="/professor/dashboard" />} />
          </>
        );
      default:
        return <Route path="*" element={<Navigate to="/login" />} />;
    }
  };

  return (
    <HashRouter>
      <ToastContainer />
      <Routes>
        {user ? (
          renderRoutesByRole(user.role)
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default App;