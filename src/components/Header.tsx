import React from 'react';
import {
  Sparkles,
  Lock,
  LogOut,
  UserCheck,
  GraduationCap,
  Heart,
  Settings,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface HeaderProps {
  currentTab: 'home' | 'student' | 'teacher' | 'admin';
  onSelectTab: (tab: 'home' | 'student' | 'teacher' | 'admin') => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenAdminCMS: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isLoggedIn,
  onOpenLogin,
  onLogout,
  onOpenAdminCMS,
  onResetDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-indigo-900 text-white text-[11px] py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">
              Dự thi 2026
            </span>
            <span className="hidden sm:inline">Nhà giáo sáng tạo với Công nghệ số và Trí tuệ nhân tạo 2026</span>
            <span className="sm:hidden">Nhà giáo sáng tạo AI 2026</span>
          </div>
          <div className="flex items-center gap-4 text-teal-100">
            <span className="hidden md:inline italic">“Không để AI thay giáo viên – dùng AI để giáo viên hiểu học sinh hơn”</span>
            <button
              onClick={() => {
                if (confirm('Khôi phục toàn bộ dữ liệu minh họa ban đầu (30 học sinh, 10 tình huống, 10 hoạt động)?')) {
                  onResetDemo();
                }
              }}
              title="Đặt lại dữ liệu mẫu"
              className="flex items-center gap-1 hover:text-white transition cursor-pointer text-[10px] bg-white/10 px-2 py-0.5 rounded"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Dữ liệu Mẫu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-cyan-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition">
            <Heart className="w-5 h-5 fill-white/80" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-800 bg-clip-text text-transparent font-heading">
                AI CLASSCARE
              </span>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                v2.6 EdTech
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Trợ lý số đồng hành cùng giáo viên chủ nhiệm
            </p>
          </div>
        </div>

        {/* Center navigation tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/70 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'home'
                ? 'bg-white text-teal-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Trang Chủ</span>
          </button>

          <button
            onClick={() => onSelectTab('student')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'student'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-xs font-bold'
                : 'text-teal-700 hover:bg-teal-50 font-bold'
            }`}
          >
            <span>💙 Góc Học Sinh</span>
            <span className="hidden md:inline text-[9px] uppercase tracking-wider bg-white/20 px-1.5 py-0.2 rounded-full">
              Dùng ngay
            </span>
          </button>

          <button
            onClick={() => {
              if (isLoggedIn) {
                onSelectTab('teacher');
              } else {
                onOpenLogin();
              }
            }}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'teacher'
                ? 'bg-white text-indigo-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Giáo Viên</span>
          </button>
        </nav>

        {/* Right actions: Login / Admin */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdminCMS}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-200 cursor-pointer"
                title="Quản trị nội dung CMS"
              >
                <Settings className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Quản Trị CMS</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition border border-rose-200 cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-700 to-sky-700 hover:from-indigo-800 hover:to-sky-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer shadow-indigo-500/20"
            >
              <Lock className="w-3.5 h-3.5 text-sky-200" />
              <span>🔐 ADMIN / GIÁO VIÊN</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
