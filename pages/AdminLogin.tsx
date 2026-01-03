
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ADMIN_URL_SLUG } from '../constants';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
  isAuthenticated: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, isAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={`/${ADMIN_URL_SLUG}/dashboard`} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      navigate(`/${ADMIN_URL_SLUG}/dashboard`);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Portal</h2>
          <p className="text-slate-500 mt-2 text-sm">Secure access required to manage templates</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Access Password</label>
            <input
              type="password"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
            {error && <p className="text-red-500 text-xs mt-2 font-medium">Incorrect password. Please try again.</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-700 active:scale-[0.98] transition-all shadow-lg"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-slate-400 text-sm hover:text-slate-600 transition-colors"
          >
            &larr; Return to Public Site
          </button>
        </div>
      </div>
    </div>
  );
};
