import React from 'react';
import { Heart, ShieldCheck, Award, Sparkles, AlertCircle } from 'lucide-react';
import { DEMO_DATA_DISCLAIMER } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Upper disclaimer box */}
        <div className="mb-8 p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-amber-300 tracking-wide">{DEMO_DATA_DISCLAIMER}</span>
              <p className="mt-0.5 text-slate-400">
                Toàn bộ dữ liệu hiển thị (mã học sinh, nhật ký cảm xúc, tình huống, hồ sơ Care Plan) đều phục vụ mục đích minh họa giải pháp công nghệ giáo dục.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-teal-950/60 text-teal-300 px-3 py-1.5 rounded-xl border border-teal-800/60 shrink-0 font-medium text-[11px]">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>AI có trách nhiệm (Responsible AI)</span>
          </div>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <h4 className="text-base font-extrabold text-white tracking-tight font-heading">
                AI CLASSCARE
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trợ lý số đồng hành cùng giáo viên chủ nhiệm trường tiểu học & THCS trong quản lý lớp học, chăm sóc cảm xúc học sinh và phát triển năng lực Cảm xúc - Xã hội (SEL).
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nguyên Tắc Cốt Lõi</span>
            </h5>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span>Không dán nhãn hay chẩn đoán tâm lý học sinh</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span>Bảo mật tối đa, mã hóa ẩn danh thông tin</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span>Cơ chế "AI Hỏi Ngược" bảo vệ quyết định sư phạm</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                <span>Học sinh tiếp cận không cần đăng nhập hay cài đặt</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Hệ Thống Module (11 Module)</span>
            </h5>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-400">
              <span>1. Check-in Cảm xúc</span>
              <span>2. Bản đồ lớp học</span>
              <span>3. AI Analyst</span>
              <span>4. AI Gợi ý biện pháp</span>
              <span>5. Chatbot ClassCare</span>
              <span>6. Kịch bản 1-1</span>
              <span>7. Care Plan</span>
              <span>8. Ngân hàng SEL</span>
              <span>9. Tình huống AI</span>
              <span>10. Phụ huynh</span>
              <span>11. Báo cáo tiến bộ</span>
              <span className="text-teal-300 font-semibold">+ AI Hỏi Ngược</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright as required in prompt */}
        <div className="pt-6 text-center text-xs text-slate-400 space-y-2">
          <p className="text-sm font-bold text-white tracking-wide">
            AI CLASSCARE – Trợ lý số đồng hành cùng giáo viên chủ nhiệm
          </p>
          <p className="italic text-teal-300 font-medium">
            “Không để AI thay giáo viên – dùng AI để giáo viên hiểu học sinh hơn.”
          </p>
          <div className="inline-block mt-1 px-4 py-1.5 bg-slate-800/90 rounded-full border border-slate-700 text-amber-300 text-xs font-semibold">
            Sản phẩm dự thi: Nhà giáo sáng tạo với Công nghệ số và Trí tuệ nhân tạo 2026
          </div>
          <p className="text-[11px] text-slate-500 pt-2">
            Bản quyền giải pháp © 2026 AI ClassCare EdTech. Phát triển trên nền tảng React 19, TypeScript, Tailwind CSS & Google Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  );
};
