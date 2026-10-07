import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { FloatingChatbot } from './components/FloatingChatbot';
import { LoginModal } from './components/LoginModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { storageService } from './services/storageService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'student' | 'teacher' | 'admin'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState<boolean>(false);
  const [dataVersion, setDataVersion] = useState<number>(1);

  // Check initial login session
  useEffect(() => {
    setIsLoggedIn(storageService.isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentTab('teacher');
  };

  const handleLogout = () => {
    storageService.logout();
    setIsLoggedIn(false);
    if (currentTab === 'teacher') {
      setCurrentTab('home');
    }
  };

  const handleResetDemo = () => {
    storageService.resetToDefaultDemoData();
    setDataVersion((v) => v + 1);
  };

  const handleDataChanged = () => {
    setDataVersion((v) => v + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'teacher' && !isLoggedIn) {
            setIsLoginModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenAdminCMS={() => setIsAdminCMSOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Container */}
      <main className="flex-1 w-full" key={dataVersion}>
        {currentTab === 'home' && (
          <HomePage
            onGoToStudent={() => setCurrentTab('student')}
            onGoToTeacher={() => {
              if (isLoggedIn) {
                setCurrentTab('teacher');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            isLoggedIn={isLoggedIn}
          />
        )}

        {currentTab === 'student' && <StudentPortal />}

        {currentTab === 'teacher' && (
          isLoggedIn ? (
            <TeacherPortal />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                🔐
              </div>
              <h3 className="text-xl font-bold text-slate-800 font-heading">
                Yêu cầu đăng nhập Giáo viên / Quản trị
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Để bảo vệ quyền riêng tư và dữ liệu lớp học, khu vực này yêu cầu đăng nhập tài khoản giáo viên chủ nhiệm.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-indigo-700 to-sky-700 hover:from-indigo-800 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Chatbot */}
      <FloatingChatbot userRole={currentTab === 'student' ? 'student' : 'teacher'} />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Admin CMS Modal */}
      <AdminCMSModal
        isOpen={isAdminCMSOpen}
        onClose={() => setIsAdminCMSOpen(false)}
        onDataChanged={handleDataChanged}
      />
    </div>
  );
}
