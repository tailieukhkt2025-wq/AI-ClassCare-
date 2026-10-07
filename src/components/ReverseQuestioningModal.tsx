import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckSquare, Square, X, Sparkles } from 'lucide-react';

interface ReverseQuestioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentCode?: string;
  contextTitle?: string;
}

export const ReverseQuestioningModal: React.FC<ReverseQuestioningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studentCode = 'Học sinh',
  contextTitle = 'Áp dụng đề xuất sư phạm và lập Care Plan',
}) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false,
  });

  if (!isOpen) return null;

  const questions = [
    { id: 'q1', text: `Tôi đã trực tiếp lắng nghe và xác minh thông tin với ${studentCode} chưa?` },
    { id: 'q2', text: 'Tôi có đủ dữ liệu khách quan từ nhiều nguồn để đưa ra nhận định không?' },
    { id: 'q3', text: 'Có cách giải thích hoặc góc nhìn tích cực khác cho hành vi này không?' },
    { id: 'q4', text: `Biện pháp sư phạm này có tôn trọng tâm lý lứa tuổi và cá tính của ${studentCode} không?` },
    { id: 'q5', text: 'Tôi có cần trao đổi phối hợp thêm với phụ huynh hoặc bộ phận tư vấn tâm lý học đường không?' },
  ];

  const allChecked = Object.values(checkedItems).filter(Boolean).length === 5;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    setCheckedItems({
      q1: true,
      q2: true,
      q3: true,
      q4: true,
      q5: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">AI CLASSCARE HỎI GIÁO VIÊN</h3>
                <p className="text-xs text-teal-100">Cơ chế xác thực đạo đức và sư phạm có trách nhiệm</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800">Cam kết trước khi áp dụng: {contextTitle}</p>
              <p className="text-xs text-amber-700 mt-0.5">
                AI chỉ đưa ra gợi ý tham khảo. Thầy/cô là người thấu hiểu học sinh nhất và giữ vai trò quyết định cuối cùng.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Vui lòng kiểm tra và xác nhận 5 câu hỏi sau:</span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-teal-600 hover:text-teal-700 font-semibold cursor-pointer hover:underline"
              >
                Chọn tất cả
              </button>
            </div>

            {questions.map((q) => {
              const isChecked = !!checkedItems[q.id];
              return (
                <div
                  key={q.id}
                  onClick={() => toggleCheck(q.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-teal-50/70 border-teal-400 text-teal-950 font-medium'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="mt-0.5 text-teal-600 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-teal-600 fill-teal-100" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <span className="text-sm select-none">{q.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium hover:bg-slate-200 rounded-xl transition"
          >
            Quay lại xem xét
          </button>
          <button
            type="button"
            disabled={!allChecked}
            onClick={() => {
              if (allChecked) {
                onConfirm();
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md ${
              allChecked
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-teal-500/20 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Tôi đã kiểm tra thông tin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
