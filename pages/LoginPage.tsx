
import React, { useState } from 'react';
import { useAuth } from '../App';
import LogoIcon from '../components/icons/LogoIcon';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // Navigation is handled automatically by the router in App.tsx
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      addToast(errorMessage, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="max-w-md w-full p-8 space-y-8 bg-primary-container shadow-lg rounded-lg border border-secondary">
        <div className="flex flex-col items-center">
          <div className="nav-header w-full -mx-8 -mt-8 mb-8 pb-6">
            <LogoIcon className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-center text-3xl font-bold text-primary font-serif">
              نظام تسجيل المواد الجامعي
            </h2>
          </div>
          <p className="text-center text-sm text-on-surface-variant">
            سجل دخولك للمتابعة
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field w-full px-0 py-3 text-on-surface placeholder-on-surface-variant"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field w-full px-0 py-3 text-on-surface placeholder-on-surface-variant"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs label-caps text-on-surface-variant">
                Hint: `admin@example.com`, `student@example.com`, or `professor@example.com`
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
