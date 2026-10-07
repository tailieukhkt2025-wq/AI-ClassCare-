import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('ClassCare@2026');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const ok = storageService.login(username.trim(), password);
      setIsLoading(false);
      if (ok) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại!');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-900 via-sky-800 to-teal-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 mx-auto mb-3 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
            <Lock className="w-7 h-7 text-cyan-200" />
          </div>
          <h3 className="text-xl font-bold font-heading">ĐĂNG NHẬP GIÁO VIÊN / ADMIN</h3>
          <p className="text-xs text-sky-200 mt-1">Truy cập toàn quyền quản trị nội dung & dữ liệu lớp học</p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">Tài khoản quản trị mặc định:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-teal-600 font-bold hover:underline cursor-pointer"
              >
                Nhập nhanh
              </button>
            </div>
            <p className="text-slate-600">Username: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-teal-700">admin</code></p>
            <p className="text-slate-600">Password: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-teal-700">ClassCare@2026</code></p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên đăng nhập (Username)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu (Password)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-500/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>ĐĂNG NHẬP HỆ THỐNG</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
