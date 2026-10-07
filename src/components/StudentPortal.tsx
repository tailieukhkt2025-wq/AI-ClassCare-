import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Send,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Smile,
  Shield,
  MessageCircle,
  ArrowRight,
  ThumbsUp,
  RefreshCw,
  BookOpen,
  Star,
  Award,
} from 'lucide-react';
import { EmotionType, SituationScenario, SELActivity } from '../types';
import { EMOTION_OPTIONS } from '../data/mockData';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';

export const StudentPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checkin' | 'situations' | 'activities' | 'letter'>('checkin');

  // Check-In State
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [studentCodeInput, setStudentCodeInput] = useState('HS-04');
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
  });
  const [wantTeacherToKnow, setWantTeacherToKnow] = useState(true);
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Situation Scenario State
  const scenarios = storageService.getScenarios();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [customActionText, setCustomActionText] = useState('');
  const [scenarioFeedback, setScenarioFeedback] = useState<string | null>(null);
  const [isEvaluatingScenario, setIsEvaluatingScenario] = useState(false);

  // SEL Activities State
  const activities = storageService.getActivities();
  const [selectedActivity, setSelectedActivity] = useState<SELActivity | null>(activities[0] || null);

  // Secret Letter State
  const [letterContent, setLetterContent] = useState('');
  const [letterSubmitted, setLetterSubmitted] = useState(false);

  const handleEmotionSelect = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotion) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Save record
      storageService.addCheckInRecord({
        id: `rec-${Date.now()}`,
        studentCode: studentCodeInput.trim() || 'Học sinh ẩn danh',
        emotion: selectedEmotion,
        timestamp: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        answers: [
          { questionId: 'q-01', questionText: 'Hôm nay điều gì khiến em vui?', answerText: answers.q1 || 'Không có' },
          { questionId: 'q-02', questionText: 'Có điều gì chưa thoải mái?', answerText: answers.q2 || 'Không có' },
          { questionId: 'q-03', questionText: 'Muốn chia sẻ với cô/thầy?', answerText: answers.q3 || 'Không có' },
          { questionId: 'q-04', questionText: 'Em muốn được hỗ trợ điều gì?', answerText: answers.q4 || 'Không có' },
        ],
        wantTeacherToKnow,
        supportNeeded: answers.q4,
        teacherRead: false,
      });

      setIsSubmitting(false);
      setCheckInSubmitted(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0d9488', '#0284c7', '#38bdf8', '#fbbf24', '#f43f5e'],
        });
      } catch (err) {}
    }, 400);
  };

  const handleEvaluateScenario = async () => {
    if (!selectedOptionId && !customActionText.trim()) return;
    setIsEvaluatingScenario(true);

    const chosenOption = currentScenario.options.find((o) => o.id === selectedOptionId);
    const choiceLabel = chosenOption ? chosenOption.label : 'Em tự đề xuất cách xử lý riêng';

    try {
      const feedback = await aiService.evaluateSituationFeedback(
        currentScenario.title,
        currentScenario.description,
        choiceLabel,
        customActionText
      );
      setScenarioFeedback(feedback);
    } catch (e) {
      setScenarioFeedback('Thầy/cô ghi nhận sự cố gắng suy nghĩ thấu đáo của em!');
    } finally {
      setIsEvaluatingScenario(false);
    }
  };

  const handleSendLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterContent.trim()) return;

    // Save as special check-in record
    storageService.addCheckInRecord({
      id: `letter-${Date.now()}`,
      studentCode: studentCodeInput.trim() || 'Học sinh gửi thư',
      emotion: 'private',
      timestamp: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      answers: [
        {
          questionId: 'letter',
          questionText: 'Thư tâm sự bí mật gửi Thầy/Cô chủ nhiệm',
          answerText: letterContent,
        },
      ],
      wantTeacherToKnow: true,
      supportNeeded: 'Học sinh gửi tâm thư cần giáo viên đọc riêng',
      teacherRead: false,
    });

    setLetterSubmitted(true);
    setLetterContent('');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-8 animate-fade-in">
      {/* Friendly Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-700 p-6 sm:p-10 text-white shadow-xl shadow-teal-700/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-teal-100">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Khu vực dành riêng cho Học sinh • Sử dụng ngay không cần đăng nhập</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
            Chào mừng em đến với góc sẻ chia <br />
            <span className="text-amber-300">AI CLASSCARE!</span>
          </h1>
          <p className="text-sm sm:text-base text-teal-50 font-normal leading-relaxed">
            Nơi em được tự do thể hiện cảm xúc, lắng nghe, học cách giải quyết vấn đề và gửi gắm những lời nhắn chân thành đến thầy cô giáo.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4 text-emerald-300" />
              <span>Hoàn toàn bảo mật</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
              <Smile className="w-4 h-4 text-amber-300" />
              <span>Không phán xét</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
              <Heart className="w-4 h-4 text-rose-300" />
              <span>Luôn đồng hành</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Kids */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('checkin')}
          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer font-bold text-sm flex flex-col items-center gap-2 ${
            activeTab === 'checkin'
              ? 'bg-gradient-to-b from-teal-50 to-white border-teal-500 text-teal-900 shadow-md ring-2 ring-teal-500/20'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-3xl">💙</span>
          <span>Check-in Cảm xúc</span>
          <span className="text-[11px] text-teal-600 font-normal">Hôm nay em thế nào?</span>
        </button>

        <button
          onClick={() => setActiveTab('situations')}
          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer font-bold text-sm flex flex-col items-center gap-2 ${
            activeTab === 'situations'
              ? 'bg-gradient-to-b from-sky-50 to-white border-sky-500 text-sky-900 shadow-md ring-2 ring-sky-500/20'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-3xl">🧩</span>
          <span>Tình huống Thử tài</span>
          <span className="text-[11px] text-sky-600 font-normal">Đóng vai giải quyết</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer font-bold text-sm flex flex-col items-center gap-2 ${
            activeTab === 'activities'
              ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-500 text-indigo-900 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-3xl">🎮</span>
          <span>Góc Hoạt Động SEL</span>
          <span className="text-[11px] text-indigo-600 font-normal">Khám phá kỹ năng</span>
        </button>

        <button
          onClick={() => setActiveTab('letter')}
          className={`p-4 rounded-2xl border text-center transition-all cursor-pointer font-bold text-sm flex flex-col items-center gap-2 ${
            activeTab === 'letter'
              ? 'bg-gradient-to-b from-rose-50 to-white border-rose-500 text-rose-900 shadow-md ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-3xl">💌</span>
          <span>Hộp thư Tâm sự</span>
          <span className="text-[11px] text-rose-600 font-normal">Gửi riêng Thầy/Cô</span>
        </button>
      </div>

      {/* TAB 1: CHECK-IN CẢM XÚC */}
      {activeTab === 'checkin' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-8">
          {checkInSubmitted ? (
            <div className="text-center py-12 px-4 space-y-4 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner text-3xl">
                🎉
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 font-heading">
                Cảm ơn em đã chia sẻ cùng Thầy/Cô!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mọi cảm xúc của em dù vui, buồn hay lo lắng đều rất đáng trân trọng. Thầy cô chủ nhiệm sẽ luôn ở đây để lắng nghe và đồng hành cùng em. Chúc em một ngày học tập thật tuyệt vời!
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setCheckInSubmitted(false);
                    setSelectedEmotion(null);
                    setAnswers({ q1: '', q2: '', q3: '', q4: '' });
                  }}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-sm transition shadow-md shadow-teal-600/20 cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check-in lại lần nữa</span>
                </button>
                <button
                  onClick={() => setActiveTab('situations')}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition cursor-pointer"
                >
                  <span>Chơi thử tình huống</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckInSubmit} className="space-y-8">
              {/* Step 1: Select Emotion */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-heading">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                      <span>Hôm nay tâm trạng của em như thế nào?</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Bấm chọn 1 biểu tượng cảm xúc gần nhất với em lúc này nhé:</p>
                  </div>
                  <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                    Mã học sinh của em: 
                    <input
                      type="text"
                      value={studentCodeInput}
                      onChange={(e) => setStudentCodeInput(e.target.value)}
                      placeholder="HS-04"
                      className="ml-1.5 w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-teal-700 text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                  {EMOTION_OPTIONS.map((emo) => {
                    const isSelected = selectedEmotion === emo.type;
                    return (
                      <button
                        type="button"
                        key={emo.type}
                        onClick={() => handleEmotionSelect(emo.type)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 cursor-pointer ${
                          isSelected
                            ? `${emo.borderColor} bg-white shadow-lg scale-105 ring-2 ring-teal-500/30`
                            : `${emo.bgLight} border-slate-200/90 hover:scale-102`
                        }`}
                      >
                        <span className="text-4xl filter drop-shadow-sm">{emo.emoji}</span>
                        <span className="font-bold text-sm text-slate-800">{emo.label}</span>
                        <span className="text-[10px] text-slate-500 leading-tight line-clamp-2">
                          {emo.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: 3-5 Short Questions */}
              {selectedEmotion && (
                <div className="space-y-5 pt-4 border-t border-slate-100 animate-fade-in">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-heading">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                    <span>Cùng chia sẻ thêm đôi chút với Thầy/Cô nhé:</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        1. Hôm nay điều gì khiến em vui hoặc thoải mái?
                      </label>
                      <textarea
                        rows={2}
                        value={answers.q1}
                        onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
                        placeholder="Ví dụ: Được điểm tốt, giờ ra chơi vui cùng bạn, ăn món bánh ngon..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                      />
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        2. Có điều gì khiến em chưa thoải mái hoặc băn khoăn không?
                      </label>
                      <textarea
                        rows={2}
                        value={answers.q2}
                        onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
                        placeholder="Ví dụ: Bài tập hơi khó, có chút xích mích với bạn, mệt mỏi..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                      />
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        3. Em có muốn chia sẻ điều gì riêng với Thầy/Cô không?
                      </label>
                      <textarea
                        rows={2}
                        value={answers.q3}
                        onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
                        placeholder="Thầy/cô luôn giữ bí mật và sẵn sàng lắng nghe em..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                      />
                    </div>

                    <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        4. Em muốn được Thầy/Cô hoặc bạn bè hỗ trợ điều gì nhất?
                      </label>
                      <textarea
                        rows={2}
                        value={answers.q4}
                        onChange={(e) => setAnswers({ ...answers, q4: e.target.value })}
                        placeholder="Ví dụ: Giảng lại một bài học, có bạn cùng làm bài nhóm, đổi chỗ ngồi..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-2xl border border-teal-200 text-teal-900 text-xs">
                    <input
                      type="checkbox"
                      id="wantKnow"
                      checked={wantTeacherToKnow}
                      onChange={(e) => setWantTeacherToKnow(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="wantKnow" className="cursor-pointer font-medium select-none">
                      Em muốn Thầy/Cô chủ nhiệm đọc nội dung này để hỗ trợ em tốt hơn
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white rounded-2xl font-extrabold text-base shadow-xl shadow-teal-600/25 transition cursor-pointer flex items-center justify-center gap-2 mx-auto"
                    >
                      {isSubmitting ? (
                        <span>Đang gửi chia sẻ...</span>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>GỬI CHIA SẺ VỚI THẦY CÔ</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Thông tin được gửi an toàn trực tiếp tới giáo viên chủ nhiệm của em.
                    </p>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      )}

      {/* TAB 2: TÌNH HUỐNG THỬ TÀI SEL */}
      {activeTab === 'situations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Tình huống {currentScenarioIndex + 1} / {scenarios.length} • {currentScenario.category}
              </span>
              <h2 className="text-xl font-bold text-slate-800 font-heading mt-0.5">
                {currentScenario.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentScenarioIndex === 0}
                onClick={() => {
                  setCurrentScenarioIndex((prev) => prev - 1);
                  setSelectedOptionId(null);
                  setScenarioFeedback(null);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tình huống trước
              </button>
              <button
                disabled={currentScenarioIndex >= scenarios.length - 1}
                onClick={() => {
                  setCurrentScenarioIndex((prev) => prev + 1);
                  setSelectedOptionId(null);
                  setScenarioFeedback(null);
                }}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tình huống tiếp theo
              </button>
            </div>
          </div>

          {/* Scenario Content */}
          <div className="p-5 bg-gradient-to-r from-sky-50/80 to-teal-50/50 rounded-2xl border border-sky-100 space-y-2">
            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wide">
              Mô tả tình huống trong lớp:
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              "{currentScenario.description}"
            </p>
            <p className="text-xs text-slate-500 italic">
              Nhân vật: {currentScenario.characterRoles}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nếu là em, em sẽ chọn cách xử lý nào?
            </h4>
            <div className="space-y-2.5">
              {currentScenario.options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    selectedOptionId === opt.id
                      ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20 text-teal-950 font-semibold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    {selectedOptionId === opt.id && <div className="w-2.5 h-2.5 bg-teal-600 rounded-full" />}
                  </div>
                  <div className="text-xs leading-relaxed">{opt.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Hoặc em có cách xử lý nào sáng tạo hơn không? (Tùy chọn):
              </label>
              <input
                type="text"
                value={customActionText}
                onChange={(e) => setCustomActionText(e.target.value)}
                placeholder="Nhập suy nghĩ hoặc cách làm của riêng em..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Action button */}
          <div>
            <button
              onClick={handleEvaluateScenario}
              disabled={(!selectedOptionId && !customActionText.trim()) || isEvaluatingScenario}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-teal-600/20 cursor-pointer flex items-center gap-2"
            >
              {isEvaluatingScenario ? (
                <span>AI ClassCare đang phân tích...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Xem Phản Hồi Từ Thầy/Cô AI</span>
                </>
              )}
            </button>
          </div>

          {/* AI Feedback Output */}
          {scenarioFeedback && (
            <div className="mt-6 p-6 bg-emerald-50/70 border border-emerald-200 rounded-3xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>PHẢN HỒI SƯ PHẠM TỪ AI CLASSCARE</span>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/80 p-4 rounded-2xl border border-emerald-100">
                {scenarioFeedback}
              </div>
              <div className="p-3 bg-emerald-100/60 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                <span>Bài học rút ra: {currentScenario.coreLesson}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GÓC HOẠT ĐỘNG SEL */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List of activities */}
          <div className="space-y-2 md:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Danh sách hoạt động ({activities.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {activities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedActivity?.id === act.id
                      ? 'bg-indigo-50 border-indigo-500 shadow-sm text-indigo-950 font-bold'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {act.category}
                    </span>
                    <span className="text-slate-400">{act.durationMinutes} phút</span>
                  </div>
                  <h4 className="text-xs font-bold">{act.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Detail */}
          {selectedActivity && (
            <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                  Chủ đề: {selectedActivity.category} • Thời lượng: {selectedActivity.durationMinutes} phút
                </span>
                <span className="text-xs text-slate-500">{selectedActivity.targetGroup}</span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-800 font-heading">
                {selectedActivity.title}
              </h2>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-700">🎯 Mục tiêu hoạt động:</div>
                <p className="text-slate-600">{selectedActivity.objective}</p>
                <div className="font-bold text-slate-700 pt-1">🎒 Chuẩn bị:</div>
                <p className="text-slate-600">{selectedActivity.preparation}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                  Các bước thực hiện:
                </h4>
                <div className="space-y-2">
                  {selectedActivity.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Star className="w-4 h-4 text-amber-600" />
                  <span>Sản phẩm & Thông điệp:</span>
                </div>
                <p>{selectedActivity.expectedProduct}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HỘP THƯ TÂM SỰ BÍ MẬT */}
      {activeTab === 'letter' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              💌
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 font-heading">
              Hộp Thư Tâm Sự Với Thầy/Cô Chủ Nhiệm
            </h2>
            <p className="text-xs text-slate-500">
              Bức thư này sẽ được gửi trực tiếp và bảo mật 100% đến giáo viên chủ nhiệm của em. Thầy/cô luôn ở đây để lắng nghe em.
            </p>
          </div>

          {letterSubmitted ? (
            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-rose-600 mx-auto" />
              <h4 className="text-base font-bold text-rose-900">Thư của em đã được gửi an toàn!</h4>
              <p className="text-xs text-rose-700">
                Thầy/cô sẽ đọc thư trong thời gian sớm nhất và trò chuyện nhẹ nhàng với em khi thích hợp. Em cứ yên tâm nhé!
              </p>
              <button
                onClick={() => setLetterSubmitted(false)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Gửi thêm thư khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendLetter} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã học sinh của em (ví dụ: HS-04) hoặc để ẩn danh:
                </label>
                <input
                  type="text"
                  value={studentCodeInput}
                  onChange={(e) => setStudentCodeInput(e.target.value)}
                  placeholder="HS-04"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung tâm sự hoặc điều em muốn nhắn gửi Thầy/Cô:
                </label>
                <textarea
                  required
                  rows={6}
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  placeholder="Thưa Thầy/Cô, em muốn chia sẻ với Thầy/Cô điều này..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>GỬI THƯ TÂM SỰ BẢO MẬT</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
