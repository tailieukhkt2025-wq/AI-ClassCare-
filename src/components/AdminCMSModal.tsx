import React, { useState } from 'react';
import {
  X,
  Settings,
  LayoutGrid,
  HelpCircle,
  Puzzle,
  Sparkles,
  KeyRound,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ModuleConfig,
  CheckInQuestion,
  SituationScenario,
  SELActivity,
  AppSettings,
} from '../types';
import { storageService } from '../services/storageService';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({ isOpen, onClose, onDataChanged }) => {
  const [activeTab, setActiveTab] = useState<
    'modules' | 'questions' | 'scenarios' | 'activities' | 'settings' | 'backup'
  >('modules');

  // State
  const [modules, setModules] = useState<ModuleConfig[]>(storageService.getModules());
  const [questions, setQuestions] = useState<CheckInQuestion[]>(storageService.getQuestions());
  const [scenarios, setScenarios] = useState<SituationScenario[]>(storageService.getScenarios());
  const [activities, setActivities] = useState<SELActivity[]>(storageService.getActivities());
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ text: string; success: boolean } | null>(null);

  // New question form state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionPlaceholder, setNewQuestionPlaceholder] = useState('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2500);
  };

  if (!isOpen) return null;

  // Module toggle & rename
  const toggleModule = (id: string) => {
    const updated = modules.map((m) => (m.id === id ? { ...m, active: !m.active } : m));
    setModules(updated);
    storageService.saveModules(updated);
    onDataChanged();
    showToast('Đã cập nhật trạng thái module!');
  };

  const moveModule = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const clone = [...modules];
    const temp = clone[index];
    clone[index] = clone[targetIndex];
    clone[targetIndex] = temp;

    setModules(clone);
    storageService.saveModules(clone);
    onDataChanged();
  };

  // Questions actions
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: CheckInQuestion = {
      id: `q-${Date.now()}`,
      text: newQuestionText.trim(),
      placeholder: newQuestionPlaceholder.trim() || 'Nhập câu trả lời...',
      order: questions.length + 1,
      active: true,
      isCustom: true,
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    storageService.saveQuestions(updated);
    setNewQuestionText('');
    setNewQuestionPlaceholder('');
    onDataChanged();
    showToast('Đã thêm câu hỏi check-in mới!');
  };

  const toggleQuestion = (id: string) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, active: !q.active } : q));
    setQuestions(updated);
    storageService.saveQuestions(updated);
    onDataChanged();
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    storageService.saveQuestions(updated);
    onDataChanged();
    showToast('Đã xóa câu hỏi!');
  };

  // Change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword !== settings.adminPasswordHash) {
      setPwdMsg({ text: 'Mật khẩu hiện tại không đúng!', success: false });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({ text: 'Mật khẩu mới phải có ít nhất 6 ký tự!', success: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: 'Mật khẩu xác nhận không khớp!', success: false });
      return;
    }

    const updated = {
      ...settings,
      adminPasswordHash: newPassword,
      hasChangedDefaultPassword: true,
    };
    setSettings(updated);
    storageService.saveSettings(updated);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwdMsg({ text: 'Đổi mật khẩu thành công!', success: true });
    showToast('Mật khẩu quản trị đã được cập nhật thành công!');
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const jsonStr = storageService.exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_ClassCare_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file sao lưu JSON thành công!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const ok = storageService.importAllDataJSON(content);
      if (ok) {
        setModules(storageService.getModules());
        setQuestions(storageService.getQuestions());
        setScenarios(storageService.getScenarios());
        setActivities(storageService.getActivities());
        setSettings(storageService.getSettings());
        onDataChanged();
        showToast('Đã khôi phục dữ liệu từ file JSON!');
      } else {
        alert('File JSON không đúng định dạng sao lưu của AI ClassCare!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (confirm('Khôi phục toàn bộ hệ thống về dữ liệu mẫu ban đầu?')) {
      storageService.resetToDefaultDemoData();
      setModules(storageService.getModules());
      setQuestions(storageService.getQuestions());
      setScenarios(storageService.getScenarios());
      setActivities(storageService.getActivities());
      setSettings(storageService.getSettings());
      onDataChanged();
      showToast('Đã đặt lại dữ liệu mẫu ban đầu!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Toast */}
        {toast && (
          <div className="absolute top-4 right-16 z-50 bg-teal-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-teal-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">BẢNG QUẢN TRỊ ADMIN / CMS</h2>
              <p className="text-xs text-slate-300">Tùy biến nội dung, bật/tắt module, câu hỏi, tình huống & sao lưu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 overflow-x-auto flex gap-2">
          {[
            { id: 'modules', label: 'Quản Lý 11 Module', icon: LayoutGrid },
            { id: 'questions', label: 'Câu Hỏi Check-in', icon: HelpCircle },
            { id: 'scenarios', label: 'Ngân Hàng Tình Huống', icon: Puzzle },
            { id: 'activities', label: 'Hoạt Động SEL', icon: Sparkles },
            { id: 'settings', label: 'Đổi Mật Khẩu & Cài Đặt', icon: KeyRound },
            { id: 'backup', label: 'Sao Lưu & Khôi Phục', icon: Download },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          {/* TAB 1: MODULES */}
          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Cấu hình trạng thái 11 Module</h3>
                  <p className="text-xs text-slate-500">Bật/tắt module hiển thị và thay đổi thứ tự ưu tiên</p>
                </div>
              </div>

              <div className="space-y-2">
                {modules.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{m.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{m.shortDesc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => moveModule(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                        title="Di chuyển lên"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveModule(idx, 'down')}
                        disabled={idx === modules.length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                        title="Di chuyển xuống"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleModule(m.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                          m.active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {m.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{m.active ? 'Đang bật' : 'Đang ẩn'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Add form */}
              <form onSubmit={handleAddQuestion} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-teal-600" />
                  <span>Thêm câu hỏi check-in mới</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Nội dung câu hỏi (Ví dụ: Em muốn chia sẻ điều gì?)"
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={newQuestionPlaceholder}
                    onChange={(e) => setNewQuestionPlaceholder(e.target.value)}
                    placeholder="Gợi ý trả lời cho học sinh..."
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Lưu câu hỏi
                </button>
              </form>

              {/* List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Danh sách câu hỏi hiện tại ({questions.length})
                </h4>
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-slate-800">{q.text}</span>
                      {q.placeholder && (
                        <p className="text-[11px] text-slate-400 mt-0.5 italic">Gợi ý: {q.placeholder}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleQuestion(q.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          q.active ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {q.active ? 'Kích hoạt' : 'Tạm ẩn'}
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SCENARIOS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Quản lý Ngân hàng Tình huống ({scenarios.length})</h3>
                  <p className="text-xs text-slate-500">Các tình huống giải quyết xung đột và rèn luyện cảm xúc</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {scenarios.map((sc, i) => (
                  <div key={sc.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        #{i + 1} • {sc.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">{sc.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-1">{sc.description}</p>
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold shrink-0">
                      {sc.options.length} lựa chọn
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Ngân hàng Hoạt động Chủ nhiệm ({activities.length})</h3>
                  <p className="text-xs text-slate-500">Giáo án các tiết sinh hoạt lớp & hoạt động trải nghiệm</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activities.map((act) => (
                  <div key={act.id} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-[10px]">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                        {act.category}
                      </span>
                      <span className="text-slate-400">{act.durationMinutes} phút</span>
                    </div>
                    <h4 className="font-bold text-slate-800">{act.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{act.objective}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & PASSWORD */}
          {activeTab === 'settings' && (
            <div className="max-w-md mx-auto space-y-6">
              <form onSubmit={handleChangePassword} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3.5">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-teal-600" />
                  <span>Đổi Mật Khẩu Đăng Nhập Giáo Viên</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Mật khẩu mặc định là <code className="bg-slate-100 px-1 rounded font-bold">ClassCare@2026</code>. Thầy/cô nên đổi sau lần đăng nhập đầu tiên.
                </p>

                {pwdMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      pwdMsg.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {pwdMsg.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu hiện tại:</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới:</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới:</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cập nhật mật khẩu mới
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Download className="w-4 h-4 text-teal-600" />
                  <span>Xuất File Sao Lưu Dữ Liệu (Backup JSON)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Tải về toàn bộ danh sách 30 học sinh, nhật ký cảm xúc, Care Plan và các tùy biến cấu hình hệ thống.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file sao lưu (.JSON)</span>
                </button>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-sky-600" />
                  <span>Khôi Phục Dữ Liệu Từ File (Restore JSON)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Nhập file sao lưu đã lưu trữ trước đó để đồng bộ lại dữ liệu.
                </p>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                />
              </div>

              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  <span>Khôi Phục Dữ Liệu Mẫu Ban Đầu (Reset Demo)</span>
                </h4>
                <p className="text-xs text-amber-800">
                  Đặt lại toàn bộ 30 học sinh demo, 10 tình huống, 10 hoạt động và 5 Care Plan mẫu phục vụ trình diễn.
                </p>
                <button
                  onClick={handleResetDemo}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Reset Về Dữ Liệu Mẫu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
