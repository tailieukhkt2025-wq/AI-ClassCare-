import React from 'react';
import {
  Heart,
  BrainCircuit,
  ShieldCheck,
  Sparkles,
  Users,
  Target,
  MessageSquareText,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Puzzle,
  Lightbulb,
  GraduationCap,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { EMOTION_OPTIONS, DEMO_DATA_DISCLAIMER } from '../data/mockData';

interface HomePageProps {
  onGoToStudent: () => void;
  onGoToTeacher: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onGoToStudent,
  onGoToTeacher,
  onOpenLogin,
  isLoggedIn,
}) => {
  const modules = storageService.getModules();

  const moduleIcons: { [key: string]: any } = {
    checkin: Heart,
    classroom_map: LayoutGrid,
    ai_analyst: BrainCircuit,
    ai_suggestions: Lightbulb,
    ai_chatbot: MessageSquareText,
    dialogue_script: BookOpen,
    care_plan: Target,
    sel_bank: Sparkles,
    situation_sim: Puzzle,
    parent_comm: Users,
    progress_report: TrendingUp,
  };

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      {/* ======================================================== */}
      {/* HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
        {/* Subtle decorative glowing mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-teal-400/15 via-cyan-400/20 to-purple-400/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-0 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-4 h-4 text-teal-600 animate-spin [animation-duration:8s]" />
            <span>Sản phẩm dự thi: Nhà giáo sáng tạo với Công nghệ số và Trí tuệ nhân tạo 2026</span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-slate-900 leading-tight">
              <span className="bg-gradient-to-r from-teal-700 via-cyan-700 to-indigo-800 bg-clip-text text-transparent">
                AI CLASSCARE
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-slate-700 font-heading">
              Trợ lý số đồng hành cùng giáo viên chủ nhiệm
            </p>
          </div>

          {/* Core pedagogical statement quote */}
          <div className="max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-teal-100 shadow-sm text-slate-800">
            <blockquote className="text-base sm:text-lg font-bold italic text-teal-900">
              “Không để AI thay giáo viên – dùng AI để giáo viên hiểu học sinh hơn.”
            </blockquote>
            <p className="text-xs text-slate-500 mt-1">
              Ưu tiên bối cảnh trường học Việt Nam • Phù hợp học sinh Tiểu học và THCS
            </p>
          </div>

          {/* Two Large Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-xl mx-auto">
            {/* Student Entrance */}
            <button
              onClick={onGoToStudent}
              className="w-full sm:w-1/2 p-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-2xl shadow-xl shadow-teal-600/25 transition-all hover:scale-103 active:scale-98 cursor-pointer flex flex-col items-center text-center gap-1.5 group border-2 border-white/50"
            >
              <div className="flex items-center gap-2 text-base font-extrabold font-heading">
                <span>💙 GÓC HỌC SINH</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
              <span className="text-[11px] text-teal-100 font-medium">
                Dùng ngay trên web • Không cần đăng nhập
              </span>
            </button>

            {/* Teacher Entrance */}
            <button
              onClick={() => {
                if (isLoggedIn) {
                  onGoToTeacher();
                } else {
                  onOpenLogin();
                }
              }}
              className="w-full sm:w-1/2 p-4 bg-gradient-to-r from-indigo-700 via-sky-800 to-slate-900 hover:from-indigo-800 hover:to-slate-950 text-white rounded-2xl shadow-xl shadow-indigo-900/20 transition-all hover:scale-103 active:scale-98 cursor-pointer flex flex-col items-center text-center gap-1.5 group border-2 border-white/30"
            >
              <div className="flex items-center gap-2 text-base font-extrabold font-heading">
                <span>👩‍🏫 DÀNH CHO GIÁO VIÊN</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
              <span className="text-[11px] text-indigo-200 font-medium">
                11 Module quản trị • Phân tích AI • Care Plan
              </span>
            </button>
          </div>

          {/* Emotion Quick Preview Bar */}
          <div className="pt-6">
            <p className="text-xs font-semibold text-slate-500 mb-2.5">
              Học sinh dễ dàng check-in cảm xúc hằng ngày chỉ với 1 chạm:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {EMOTION_OPTIONS.map((emo) => (
                <div
                  key={emo.type}
                  onClick={onGoToStudent}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white/95 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer hover:scale-105 transition ${emo.borderColor}`}
                >
                  <span className="text-base">{emo.emoji}</span>
                  <span>{emo.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3 HIGHLIGHT PILLARS */}
      {/* ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-teal-400 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-heading">
              Giao Dục Cảm Xúc - Xã Hội (SEL)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tạo không gian an toàn để học sinh nhận diện cảm xúc, rèn luyện thấu cảm, phòng ngừa bạo lực học đường và xây dựng lớp học hạnh phúc.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-cyan-400 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-heading">
              AI Đồng Hành Có Trách Nhiệm
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI chỉ nhận diện "Tín hiệu cần quan tâm", không dán nhãn, không chẩn đoán bệnh lý và có tính năng bắt buộc <strong>"AI Hỏi Ngược"</strong> trước khi áp dụng.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-indigo-400 transition space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-heading">
              Gắn Kết Ba Bên Toàn Diện
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trợ lý soạn tin nhắn Zalo/SMS phối hợp phụ huynh với 4 giọng điệu, kế hoạch Care Plan 4 giai đoạn theo dõi sự tiến bộ thực tế của từng học sinh.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11 CORE MODULES SHOWCASE GRID */}
      {/* ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
            Hệ sinh thái EdTech toàn diện
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            11 Module Trợ Lý Chuyên Sâu Cho Giáo Viên
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Được thiết kế tối ưu hóa cho công tác chủ nhiệm thực tế tại các trường học Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = moduleIcons[m.code] || Sparkles;
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (m.code === 'checkin') {
                    onGoToStudent();
                  } else {
                    if (isLoggedIn) onGoToTeacher();
                    else onOpenLogin();
                  }
                }}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Module {m.number}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 font-heading group-hover:text-teal-700 transition">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {m.shortDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                  <span className="text-[11px] text-slate-400 font-medium">{m.badge}</span>
                  <span className="group-hover:translate-x-1 transition flex items-center gap-1">
                    Khám phá →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* ETHICAL REVERSE QUESTIONING HIGHLIGHT */}
      {/* ======================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden space-y-6">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Tính năng bắt buộc độc quyền: "AI HỎI NGƯỢC"</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Bảo Vệ Quyết Định Sư Phạm – Chống Lạm Dụng AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Trước khi giáo viên tạo kế hoạch Care Plan từ bất kỳ đề xuất nào của AI, hệ thống luôn yêu cầu giáo viên xác nhận 5 câu hỏi kiểm chứng đạo đức:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-200">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Đã trực tiếp xác minh với học sinh</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Đủ dữ liệu khách quan từ nhiều nguồn</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Tìm cách giải thích tích cực cho hành vi</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Biện pháp phù hợp với cá tính học sinh</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Phối hợp cùng phụ huynh hoặc chuyên môn</span>
            </div>
            <div className="p-3 bg-teal-500/20 rounded-xl backdrop-blur-xs flex items-center justify-center font-bold text-teal-300 text-center">
              → Chỉ khi "Tôi đã kiểm tra thông tin" mới được áp dụng!
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
