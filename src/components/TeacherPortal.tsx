import React, { useState } from 'react';
import {
  Heart,
  LayoutGrid,
  BrainCircuit,
  Lightbulb,
  MessageSquareText,
  MessagesSquare,
  Target,
  Sparkles,
  Puzzle,
  Users,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Printer,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  FileText,
  UserCheck,
  Calendar,
  Clock,
  Award,
  Sparkle,
  Sliders,
  Copy,
} from 'lucide-react';
import {
  Student,
  CheckInRecord,
  CarePlan,
  SELActivity,
  SituationScenario,
  SELCategory,
  ProgressStage,
} from '../types';
import { EMOTION_OPTIONS, DEMO_DATA_DISCLAIMER } from '../data/mockData';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { ReverseQuestioningModal } from './ReverseQuestioningModal';

export const TeacherPortal: React.FC = () => {
  const [activeModuleCode, setActiveModuleCode] = useState<string>('classroom_map');

  // Shared Data from storage
  const [students, setStudents] = useState<Student[]>(storageService.getStudents());
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>(storageService.getCheckIns());
  const [carePlans, setCarePlans] = useState<CarePlan[]>(storageService.getCarePlans());
  const [activities, setActivities] = useState<SELActivity[]>(storageService.getActivities());
  const [scenarios, setScenarios] = useState<SituationScenario[]>(storageService.getScenarios());

  // Search & Filter state for classroom map
  const [searchTerm, setSearchTerm] = useState('');
  const [signalFilter, setSignalFilter] = useState<'all' | 'concern' | 'stable' | 'positive'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Module 3: AI Analyst State
  const [analystResult, setAnalystResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Module 4: Suggest Measures State
  const [issueInput, setIssueInput] = useState('Một học sinh gần đây ít tham gia hoạt động nhóm và thường ngồi một mình cuối giờ.');
  const [measureTargetCode, setMeasureTargetCode] = useState('HS-04');
  const [suggestedMeasures, setSuggestedMeasures] = useState<string | null>(null);
  const [isGeneratingMeasures, setIsGeneratingMeasures] = useState(false);

  // Module 6: Dialogue Script State
  const [dialogueObservation, setDialogueObservation] = useState('Học sinh ít giao tiếp với các bạn và có dấu hiệu lo lắng trước các giờ kiểm tra.');
  const [dialogueStudentCode, setDialogueStudentCode] = useState('HS-04');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  // Module 7: Care Plan State & Reverse Questioning Modal
  const [isReverseModalOpen, setIsReverseModalOpen] = useState(false);
  const [pendingCarePlan, setPendingCarePlan] = useState<Partial<CarePlan> | null>(null);
  const [newPlanForm, setNewPlanForm] = useState({
    studentCode: 'HS-07',
    strengths: 'Chăm chú nghe giảng, có tư duy logic tốt.',
    needsSupport: 'Lo âu trước các bài kiểm tra, sợ bị điểm kém.',
    goal: 'Giảm bớt áp lực điểm số, ngủ đủ giấc trước ngày thi.',
    pedagogicalMeasures: '1. Trò chuyện 1-1 giải tỏa tâm lý. 2. Lập sơ đồ tư duy ôn tập có kế hoạch. 3. Phối hợp phụ huynh giảm kỳ vọng.',
    collaborators: 'Phụ huynh, Giáo viên bộ môn.',
    timeline: '4 tuần',
  });

  // Module 10: Parent Comm State
  const [parentTopic, setParentTopic] = useState('Kỹ năng làm việc nhóm & Tương tác bạn bè');
  const [parentStudentCode, setParentStudentCode] = useState('HS-04');
  const [parentDetails, setParentDetails] = useState('Em đã có tiến bộ về hội họa nhưng còn rụt rè khi thảo luận nhóm. Thầy cô muốn phối hợp cùng gia đình khích lệ con tự tin hơn.');
  const [parentTone, setParentTone] = useState<'friendly' | 'positive' | 'formal' | 'concise'>('friendly');
  const [parentDraft, setParentDraft] = useState<string | null>(null);
  const [isGeneratingParentComm, setIsGeneratingParentComm] = useState(false);

  // Module 11: Progress Report State
  const [reportStudentCode, setReportStudentCode] = useState('HS-04');
  const [reportBefore, setReportBefore] = useState('Rụt rè, ít phát biểu, ngồi một mình giờ ra chơi. Điểm tham gia nhóm 4/10.');
  const [reportMeasures, setReportMeasures] = useState('02 buổi trò chuyện 1-1, phân công vẽ bảng tin nhóm, mô hình Đôi bạn cùng tiến.');
  const [reportAfter, setReportAfter] = useState('Chủ động nhận việc vẽ sơ đồ, tỷ lệ cảm xúc tích cực tăng từ 40% lên 80%, phát biểu 2 lần/tuần.');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Emotion summary computation
  const emotionStats = {
    joy: students.filter((s) => s.emotionStatus === 'joy').length,
    neutral: students.filter((s) => s.emotionStatus === 'neutral').length,
    sad: students.filter((s) => s.emotionStatus === 'sad').length,
    anxious: students.filter((s) => s.emotionStatus === 'anxious').length,
    annoyed: students.filter((s) => s.emotionStatus === 'annoyed').length,
    private: students.filter((s) => s.emotionStatus === 'private').length,
  };

  const concernCount = students.filter((s) => s.careSignal === 'concern').length;
  const stableCount = students.filter((s) => s.careSignal === 'stable').length;
  const positiveCount = students.filter((s) => s.careSignal === 'positive').length;

  // Filtered students for Classroom Map
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameMasked.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.recentNotes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSignal = signalFilter === 'all' || s.careSignal === signalFilter;
    return matchesSearch && matchesSignal;
  });

  // Action handlers
  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const summary = {
        totalStudents: students.length,
        emotionBreakdown: emotionStats,
        concernSignalsCount: concernCount,
        concernStudents: students
          .filter((s) => s.careSignal === 'concern')
          .map((s) => ({ code: s.code, reason: s.careSignalReason, emotion: s.emotionStatus })),
      };
      const res = await aiService.analyzeClassData(summary);
      setAnalystResult(res);
      showToast('AI ClassCare đã hoàn tất phân tích dữ liệu lớp học!');
    } catch (e) {
      showToast('Có lỗi xảy ra khi phân tích.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateMeasures = async () => {
    setIsGeneratingMeasures(true);
    try {
      const res = await aiService.suggestPedagogicalMeasures(issueInput, measureTargetCode);
      setSuggestedMeasures(res);
      showToast('Đã tạo gợi ý biện pháp sư phạm 7 bước thành công!');
    } catch (e) {
      showToast('Không thể tạo gợi ý lúc này.');
    } finally {
      setIsGeneratingMeasures(false);
    }
  };

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await aiService.generateDialogueScript(dialogueObservation, dialogueStudentCode);
      setGeneratedScript(res);
      showToast('Đã tạo kịch bản đối thoại 1-1 thấu cảm!');
    } catch (e) {
      showToast('Không thể tạo kịch bản lúc này.');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleTriggerReverseCheck = (planDraft: Partial<CarePlan>) => {
    setPendingCarePlan(planDraft);
    setIsReverseModalOpen(true);
  };

  const handleConfirmCarePlan = () => {
    if (!pendingCarePlan) return;
    const newPlan: CarePlan = {
      id: `cp-${Date.now()}`,
      studentCode: pendingCarePlan.studentCode || 'HS-Mới',
      strengths: pendingCarePlan.strengths || '',
      needsSupport: pendingCarePlan.needsSupport || '',
      goal: pendingCarePlan.goal || '',
      pedagogicalMeasures: pendingCarePlan.pedagogicalMeasures || '',
      collaborators: pendingCarePlan.collaborators || 'Giáo viên, Phụ huynh',
      timeline: pendingCarePlan.timeline || '4 tuần',
      progressStage: 'start',
      progressPercent: 25,
      results: 'Mới thiết lập sau khi xác minh thông tin qua AI Hỏi Ngược.',
      notes: 'Đã hoàn thành kiểm duyệt đạo đức sư phạm.',
      verifiedEthicalCheck: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    storageService.addCarePlan(newPlan);
    setCarePlans(storageService.getCarePlans());
    setIsReverseModalOpen(false);
    setPendingCarePlan(null);
    showToast('Đã xác thực và tạo Care Plan thành công!');
  };

  const handleGenerateParentComm = async () => {
    setIsGeneratingParentComm(true);
    try {
      const res = await aiService.generateParentCommunication(
        parentStudentCode,
        parentTopic,
        parentDetails,
        parentTone
      );
      setParentDraft(res);
      showToast('Đã tạo thông điệp phối hợp phụ huynh!');
    } catch (e) {
      showToast('Không thể tạo nội dung trao đổi.');
    } finally {
      setIsGeneratingParentComm(false);
    }
  };

  const handleGenerateProgressReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await aiService.generateProgressReport(
        reportStudentCode,
        reportBefore,
        reportMeasures,
        reportAfter
      );
      setGeneratedReport(res);
      showToast('Đã tạo Báo cáo tiến bộ cá nhân hóa thành công!');
    } catch (e) {
      showToast('Không thể tạo báo cáo lúc này.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const modulesNav = [
    { code: 'classroom_map', title: '2. Bản Đồ Lớp Học', icon: LayoutGrid },
    { code: 'checkin', title: '1. Check-in Cảm Xúc', icon: Heart },
    { code: 'ai_analyst', title: '3. AI Analyst', icon: BrainCircuit, badge: 'AI' },
    { code: 'ai_suggestions', title: '4. AI Gợi Ý Biện Pháp', icon: Lightbulb, badge: 'AI' },
    { code: 'ai_chatbot', title: '5. Chatbot ClassCare', icon: MessageSquareText },
    { code: 'dialogue_script', title: '6. Kịch Bản 1-1', icon: MessagesSquare, badge: 'AI' },
    { code: 'care_plan', title: '7. Care Plan', icon: Target, badge: 'Hỏi Ngược' },
    { code: 'sel_bank', title: '8. Ngân Hàng SEL', icon: Sparkles },
    { code: 'situation_sim', title: '9. Tình Huống AI', icon: Puzzle },
    { code: 'parent_comm', title: '10. Phụ Huynh', icon: Users, badge: 'AI' },
    { code: 'progress_report', title: '11. Báo Cáo Tiến Bộ', icon: TrendingUp, badge: 'AI' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome & KPI Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
              <span>Không gian Giáo viên Chủ nhiệm</span>
              <span>•</span>
              <span className="text-slate-500">Năm học 2026 - 2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-heading mt-1">
              Bảng Điều Khiển Sư Phạm & Trợ Lý AI
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi tình hình lớp, phát hiện sớm tín hiệu cần quan tâm và đồng hành cùng 30 học sinh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAIAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>{isAnalyzing ? 'Đang phân tích...' : 'Phân Tích AI Toàn Lớp'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition text-xs font-semibold cursor-pointer border border-slate-200"
              title="In báo cáo nhanh"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium">Sĩ số lớp</span>
            <div className="text-2xl font-extrabold text-slate-800 font-heading mt-1">
              {students.length} <span className="text-xs font-normal text-slate-500">học sinh</span>
            </div>
            <span className="text-[10px] text-teal-600 font-semibold">100% đã được mã hóa ẩn danh</span>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80">
            <span className="text-xs text-amber-800 font-medium">Tín hiệu cần quan tâm</span>
            <div className="text-2xl font-extrabold text-amber-900 font-heading mt-1">
              {concernCount} <span className="text-xs font-normal text-amber-700">học sinh</span>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold">Cần đồng hành tinh tế</span>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
            <span className="text-xs text-emerald-800 font-medium">Cảm xúc tích cực hôm nay</span>
            <div className="text-2xl font-extrabold text-emerald-900 font-heading mt-1">
              {Math.round(((emotionStats.joy + emotionStats.neutral) / students.length) * 100)}%
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {emotionStats.joy} Vui • {emotionStats.neutral} Bình thường
            </span>
          </div>

          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/80">
            <span className="text-xs text-indigo-800 font-medium">Care Plan đang kích hoạt</span>
            <div className="text-2xl font-extrabold text-indigo-900 font-heading mt-1">
              {carePlans.length} <span className="text-xs font-normal text-indigo-700">kế hoạch</span>
            </div>
            <span className="text-[10px] text-indigo-700 font-semibold">Đã qua AI Hỏi Ngược</span>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs overflow-x-auto flex gap-1.5 scrollbar-none">
        {modulesNav.map((m) => {
          const Icon = m.icon;
          const isActive = activeModuleCode === m.code;
          return (
            <button
              key={m.code}
              onClick={() => setActiveModuleCode(m.code)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-teal-700 via-cyan-800 to-indigo-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.title}</span>
              {m.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-amber-400 text-slate-900' : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  {m.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* MODULE 2: BẢN ĐỒ LỚP HỌC (CLASSROOM MAP) */}
      {/* ======================================================== */}
      {activeModuleCode === 'classroom_map' && (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã học sinh, tên viết tắt, ghi chú..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs font-semibold">
              <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Lọc tín hiệu:</span>
              <button
                onClick={() => setSignalFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  signalFilter === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả (30)
              </button>
              <button
                onClick={() => setSignalFilter('concern')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                  signalFilter === 'concern'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Cần quan tâm ({concernCount})</span>
              </button>
              <button
                onClick={() => setSignalFilter('stable')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  signalFilter === 'stable'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                Ổn định ({stableCount})
              </button>
              <button
                onClick={() => setSignalFilter('positive')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  signalFilter === 'positive'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Tích cực ({positiveCount})
              </button>
            </div>
          </div>

          {/* Grid of 30 Students */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {filteredStudents.map((stu) => {
              const currentEmotion = EMOTION_OPTIONS.find((e) => e.type === stu.emotionStatus);
              const isConcern = stu.careSignal === 'concern';
              return (
                <div
                  key={stu.id}
                  onClick={() => setSelectedStudent(stu)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md relative ${
                    isConcern
                      ? 'border-amber-300 ring-2 ring-amber-300/40 bg-gradient-to-b from-amber-50/20 to-white'
                      : 'border-slate-200 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      {stu.code}
                    </span>
                    <span className="text-xl" title={currentEmotion?.label}>
                      {currentEmotion?.emoji || '🙂'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-base">
                      {stu.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{stu.nameMasked}</h4>
                      <p className="text-[10px] text-slate-400">Tham gia: {stu.participationScore}/10</p>
                    </div>
                  </div>

                  {/* Micro metric bars */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[10px]">
                    <div className="flex justify-between text-slate-500">
                      <span>Gắn kết bạn bè</span>
                      <span className="font-semibold text-slate-700">{stu.peerBondingIndex}/10</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          stu.peerBondingIndex < 5 ? 'bg-amber-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${stu.peerBondingIndex * 10}%` }}
                      />
                    </div>
                  </div>

                  {/* Signal Tag */}
                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        isConcern
                          ? 'bg-amber-100 text-amber-800'
                          : stu.careSignal === 'positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {isConcern ? '⚠️ Cần quan tâm' : stu.careSignal === 'positive' ? '⭐ Tích cực' : 'Ổn định'}
                    </span>
                    <span className="text-teal-600 font-bold hover:underline">Chi tiết →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Drawer Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
              <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedStudent.avatar}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 font-heading">
                        {selectedStudent.nameMasked} ({selectedStudent.code})
                      </h3>
                      <p className="text-xs text-slate-500">Mã hóa ẩn danh danh tính học sinh</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px]">Chuyên cần</span>
                    <div className="text-base font-extrabold text-slate-800 mt-0.5">{selectedStudent.attendanceRate}%</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px]">Mức độ tham gia</span>
                    <div className="text-base font-extrabold text-teal-700 mt-0.5">{selectedStudent.participationScore}/10</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px]">Năng lực tự quản</span>
                    <div className="text-base font-extrabold text-indigo-700 mt-0.5">{selectedStudent.autonomyRating}/10</div>
                  </div>
                </div>

                {selectedStudent.careSignalReason && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Tín hiệu ghi nhận cần đồng hành:</span>
                    </div>
                    <p className="leading-relaxed">{selectedStudent.careSignalReason}</p>
                  </div>
                )}

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700">Ghi chú quan sát gần nhất:</span>
                  <p className="text-slate-600">{selectedStudent.recentNotes}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700">Lịch sử cảm xúc 7 ngày gần đây:</span>
                  <div className="flex gap-2">
                    {selectedStudent.emotionHistory.map((h, i) => {
                      const emo = EMOTION_OPTIONS.find((e) => e.type === h.emotion);
                      return (
                        <div key={i} className="flex-1 text-center p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-lg">{emo?.emoji || '🙂'}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5">{h.date.slice(5)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setMeasureTargetCode(selectedStudent.code);
                      setIssueInput(`Học sinh ${selectedStudent.code}: ${selectedStudent.careSignalReason || selectedStudent.recentNotes}`);
                      setActiveModuleCode('ai_suggestions');
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Lập gợi ý biện pháp AI</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 1: CHECK-IN CẢM XÚC THỐNG KÊ CHI TIẾT */}
      {/* ======================================================== */}
      {activeModuleCode === 'checkin' && (
        <div className="space-y-6">
          {/* Emotion Distribution Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-heading">
                  Phân Bố Cảm Xúc Lớp Học Hôm Nay
                </h3>
                <p className="text-xs text-slate-500">Cập nhật theo dữ liệu học sinh check-in</p>
              </div>
              <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200">
                Tổng 30 học sinh
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {EMOTION_OPTIONS.map((emo) => {
                const count = emotionStats[emo.type];
                const pct = Math.round((count / students.length) * 100);
                return (
                  <div key={emo.type} className={`p-4 rounded-2xl border text-center ${emo.bgLight} ${emo.borderColor}`}>
                    <span className="text-3xl">{emo.emoji}</span>
                    <h5 className="text-xs font-bold text-slate-800 mt-1">{emo.label}</h5>
                    <div className="text-lg font-extrabold text-slate-900 mt-1">{count} <span className="text-xs font-normal text-slate-500">({pct}%)</span></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Check-In Records Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Nhật Ký Chia Sẻ Mới Nhất Từ Học Sinh</span>
            </h3>

            <div className="space-y-3">
              {checkIns.map((rec) => {
                const emo = EMOTION_OPTIONS.find((e) => e.type === rec.emotion);
                return (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition space-y-2.5 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{emo?.emoji || '🙂'}</span>
                        <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {rec.studentCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${emo?.badgeColor}`}>
                          {emo?.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{rec.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {rec.answers.map((ans, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                            {ans.questionText}
                          </span>
                          <span className="text-slate-700">{ans.answerText}</span>
                        </div>
                      ))}
                    </div>

                    {rec.supportNeeded && (
                      <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span><strong>Yêu cầu hỗ trợ:</strong> {rec.supportNeeded}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 3: AI CLASSCARE ANALYST */}
      {/* ======================================================== */}
      {activeModuleCode === 'ai_analyst' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full mb-1">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>AI ClassCare Analyst Core Engine</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 font-heading">
                Phân Tích Dữ Liệu Lớp Học Toàn Diện
              </h2>
              <p className="text-xs text-slate-500">
                AI nhận dữ liệu ẩn danh, nhận diện xu thế cảm xúc và phát hiện các tín hiệu cần đồng hành.
              </p>
            </div>
            <button
              onClick={handleRunAIAnalysis}
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Đang phân tích...' : 'Cập Nhật Phân Tích Mới'}</span>
            </button>
          </div>

          <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 text-xs text-teal-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-teal-800">Nguyên tắc sư phạm có trách nhiệm:</p>
              <p className="text-teal-700 mt-0.5">
                AI chỉ đưa ra "Tín hiệu cần quan tâm", tuyệt đối không đưa ra kết luận tâm lý, không dán nhãn bệnh lý và nhắc nhở giáo viên xác minh thực tế trước khi áp dụng bất kỳ biện pháp nào.
              </p>
            </div>
          </div>

          {analystResult ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700">Kết quả phân tích từ AI:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analystResult);
                    showToast('Đã sao chép kết quả phân tích!');
                  }}
                  className="flex items-center gap-1 text-teal-600 font-semibold hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </button>
              </div>
              <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-line bg-white p-5 rounded-xl border border-slate-200">
                {analystResult}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-4 space-y-3">
              <BrainCircuit className="w-12 h-12 text-teal-500 mx-auto opacity-70" />
              <h4 className="text-base font-bold text-slate-700">Chưa tạo báo cáo phân tích mới</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Bấm vào nút "Phân Tích AI Toàn Lớp" để hệ thống tổng hợp dữ liệu 30 học sinh và đưa ra các khuyến nghị sư phạm ưu tiên.
              </p>
              <button
                onClick={handleRunAIAnalysis}
                className="px-6 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-teal-700 transition cursor-pointer"
              >
                Bắt đầu phân tích ngay
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 4: AI GỢI Ý BIỆN PHÁP SƯ PHẠM */}
      {/* ======================================================== */}
      {activeModuleCode === 'ai_suggestions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Module 4</span>
            <h2 className="text-xl font-bold text-slate-800 font-heading mt-0.5">
              AI Gợi Ý Biện Pháp Sư Phạm 7 Bước
            </h2>
            <p className="text-xs text-slate-500">
              Nhập vấn đề thực tế giáo viên quan sát được trong lớp để nhận bộ giải pháp sư phạm chuẩn mực.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã học sinh liên quan:</label>
                <input
                  type="text"
                  value={measureTargetCode}
                  onChange={(e) => setMeasureTargetCode(e.target.value)}
                  placeholder="HS-04"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả biểu hiện / Vấn đề cần hỗ trợ:</label>
                <textarea
                  rows={4}
                  value={issueInput}
                  onChange={(e) => setIssueInput(e.target.value)}
                  placeholder="Ví dụ: Một học sinh gần đây ít tham gia hoạt động nhóm..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <button
                onClick={handleGenerateMeasures}
                disabled={isGeneratingMeasures || !issueInput.trim()}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{isGeneratingMeasures ? 'AI đang tạo giải pháp...' : 'Tạo Gợi Ý Sư Phạm'}</span>
              </button>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                <strong>Luôn nhớ:</strong> Đây là gợi ý tham khảo. Thầy/cô cần xác minh thông tin trực tiếp trước khi áp dụng.
              </div>
            </div>

            <div className="md:col-span-2">
              {suggestedMeasures ? (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>GIẢI PHÁP SƯ PHẠM 7 BƯỚC ĐỀ XUẤT</span>
                    </span>
                    <button
                      onClick={() =>
                        handleTriggerReverseCheck({
                          studentCode: measureTargetCode,
                          needsSupport: issueInput,
                          goal: 'Tăng cường tham gia nhóm và cảm giác an toàn trong lớp.',
                          pedagogicalMeasures: suggestedMeasures.slice(0, 300) + '...',
                        })
                      }
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Chuyển thành Care Plan (Qua AI Hỏi Ngược)</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200">
                    {suggestedMeasures}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Nhập vấn đề cần giải quyết bên trái và bấm nút "Tạo Gợi Ý Sư Phạm".
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 5: CHATBOT AI CLASSCARE */}
      {/* ======================================================== */}
      {activeModuleCode === 'ai_chatbot' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Module 5</span>
              <h2 className="text-xl font-bold text-slate-800 font-heading">
                Cố Vấn Sư Phạm AI ClassCare
              </h2>
              <p className="text-xs text-slate-500">
                Hỏi đáp 24/7 về các tình huống thực tế, hoạt động SEL, kỹ năng giao tiếp với học sinh và phối hợp phụ huynh.
              </p>
            </div>
            <div className="text-xs text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 font-semibold">
              Ngôn ngữ sư phạm Việt Nam
            </div>
          </div>

          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 text-xs text-sky-900 space-y-1">
            <strong>Gợi ý các chủ đề thường hỏi:</strong>
            <p className="text-sky-800">
              • Làm gì khi học sinh mất động lực? • Xử lý mâu thuẫn giữa hai học sinh như thế nào? • Gợi ý hoạt động SEL 15 phút đầu tuần. • Cách xây dựng lớp học đoàn kết, tôn trọng sự khác biệt.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
            <MessageSquareText className="w-10 h-10 text-teal-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">Chatbot AI ClassCare luôn sẵn sàng tại góc phải màn hình!</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Thầy/cô có thể bấm trực tiếp vào nút tròn <strong>"🤖 AI ClassCare"</strong> ở góc phải bên dưới để mở giao diện đối thoại tức thời bất kỳ lúc nào.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 6: AI TRỢ LÝ TRÒ CHUYỆN 1-1 */}
      {/* ======================================================== */}
      {activeModuleCode === 'dialogue_script' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Module 6</span>
            <h2 className="text-xl font-bold text-slate-800 font-heading mt-0.5">
              AI Trợ Lý Kịch Bản Trò Chuyện 1-1 Thấu Cảm
            </h2>
            <p className="text-xs text-slate-500">
              Tạo kịch bản đối thoại sư phạm 8 bước chuẩn mực: mở đầu tự nhiên, câu hỏi mở, cách lắng nghe, những câu KHÔNG NÊN NÓI và cách theo dõi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã học sinh:</label>
                <input
                  type="text"
                  value={dialogueStudentCode}
                  onChange={(e) => setDialogueStudentCode(e.target.value)}
                  placeholder="HS-04"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tình huống / Biểu hiện cần trò chuyện:</label>
                <textarea
                  rows={4}
                  value={dialogueObservation}
                  onChange={(e) => setDialogueObservation(e.target.value)}
                  placeholder="Học sinh ít giao tiếp với các bạn..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                onClick={handleGenerateScript}
                disabled={isGeneratingScript || !dialogueObservation.trim()}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <MessagesSquare className="w-4 h-4" />
                <span>{isGeneratingScript ? 'Đang soạn kịch bản...' : 'Tạo Kịch Bản 1-1 Chuẩn Mực'}</span>
              </button>
            </div>

            <div className="md:col-span-2">
              {generatedScript ? (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                    <span>KỊCH BẢN ĐỐI THOẠI 1-1 (8 BƯỚC SƯ PHẠM)</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedScript);
                        showToast('Đã sao chép kịch bản!');
                      }}
                      className="text-teal-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200">
                    {generatedScript}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Nhập tình huống cần trao đổi và bấm "Tạo Kịch Bản 1-1 Chuẩn Mực".
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 7: CARE PLAN - KẾ HOẠCH ĐỒNG HÀNH & AI HỎI NGƯỢC */}
      {/* ======================================================== */}
      {activeModuleCode === 'care_plan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cơ chế kiểm soát "AI Hỏi Ngược" bắt buộc</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 font-heading">
                  Care Plan – Kế Hoạch Đồng Hành Cá Nhân Hóa
                </h2>
                <p className="text-xs text-slate-500">
                  Kế hoạch hỗ trợ theo 4 giai đoạn tiến độ: BẮT ĐẦU → ĐANG THỰC HIỆN → TIẾN BỘ → HOÀN THÀNH.
                </p>
              </div>

              <button
                onClick={() =>
                  handleTriggerReverseCheck({
                    studentCode: newPlanForm.studentCode,
                    strengths: newPlanForm.strengths,
                    needsSupport: newPlanForm.needsSupport,
                    goal: newPlanForm.goal,
                    pedagogicalMeasures: newPlanForm.pedagogicalMeasures,
                    collaborators: newPlanForm.collaborators,
                    timeline: newPlanForm.timeline,
                  })
                }
                className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-700 hover:from-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Kế Hoạch Đồng Hành Mới</span>
              </button>
            </div>

            {/* List of active Care Plans */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Các kế hoạch đang triển khai ({carePlans.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carePlans.map((plan) => {
                  const stageLabels: { [key in ProgressStage]: { label: string; color: string } } = {
                    start: { label: 'BẮT ĐẦU', color: 'bg-slate-100 text-slate-700 border-slate-300' },
                    in_progress: { label: 'ĐANG THỰC HIỆN', color: 'bg-sky-100 text-sky-800 border-sky-300' },
                    improving: { label: 'TIẾN BỘ RÕ RỆT', color: 'bg-amber-100 text-amber-800 border-amber-300' },
                    completed: { label: 'HOÀN THÀNH', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                  };
                  const currentStage = stageLabels[plan.progressStage] || stageLabels.in_progress;

                  return (
                    <div
                      key={plan.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 transition space-y-3.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {plan.studentCode}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentStage.color}`}>
                            {currentStage.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{plan.timeline}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Tiến độ can thiệp</span>
                          <span className="font-bold text-teal-700">{plan.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: `${plan.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs space-y-1.5 pt-1">
                        <div>
                          <strong className="text-slate-700">Mục tiêu:</strong>{' '}
                          <span className="text-slate-600">{plan.goal}</span>
                        </div>
                        <div>
                          <strong className="text-slate-700">Biện pháp:</strong>{' '}
                          <span className="text-slate-600 line-clamp-2">{plan.pedagogicalMeasures}</span>
                        </div>
                        <div>
                          <strong className="text-slate-700">Kết quả ghi nhận:</strong>{' '}
                          <span className="text-emerald-700 font-medium">{plan.results}</span>
                        </div>
                      </div>

                      {/* Stage update controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>Đã xác minh AI Hỏi Ngược</span>
                        </span>
                        <div className="flex gap-1">
                          {(['start', 'in_progress', 'improving', 'completed'] as ProgressStage[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                const pcts: { [k in ProgressStage]: number } = {
                                  start: 25,
                                  in_progress: 50,
                                  improving: 75,
                                  completed: 100,
                                };
                                const updated = { ...plan, progressStage: st, progressPercent: pcts[st] };
                                storageService.updateCarePlan(updated);
                                setCarePlans(storageService.getCarePlans());
                                showToast(`Đã chuyển trạng thái sang: ${stageLabels[st].label}`);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                plan.progressStage === st
                                  ? 'bg-teal-700 text-white'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {st === 'start' ? '1' : st === 'in_progress' ? '2' : st === 'improving' ? '3' : '4'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 8: NGÂN HÀNG HOẠT ĐỘNG CHỦ NHIỆM */}
      {/* ======================================================== */}
      {activeModuleCode === 'sel_bank' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Module 8</span>
            <h2 className="text-xl font-bold text-slate-800 font-heading mt-0.5">
              Ngân Hàng Hoạt Động Chủ Nhiệm & SEL
            </h2>
            <p className="text-xs text-slate-500">
              Giáo án hoạt động theo 9 nhóm: Cảm xúc, Đoàn kết, Giao tiếp, Tự quản, Giải quyết xung đột, Phòng chống bắt nạt, Kỹ năng số, Công dân số, Lớp học hạnh phúc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((act) => (
              <div key={act.id} className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 transition space-y-3 bg-slate-50/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded-full">
                    {act.category}
                  </span>
                  <span className="text-slate-400 font-medium">{act.durationMinutes} phút</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{act.objective}</p>

                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-xs">
                  <div className="font-bold text-slate-700">Các bước chính:</div>
                  <ol className="list-decimal list-inside text-slate-600 space-y-0.5 text-[11px]">
                    {act.steps.slice(0, 3).map((s, idx) => (
                      <li key={idx} className="line-clamp-1">{s}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 9: TÌNH HUỐNG AI */}
      {/* ======================================================== */}
      {activeModuleCode === 'situation_sim' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Module 9</span>
            <h2 className="text-xl font-bold text-slate-800 font-heading mt-0.5">
              Ngân Hàng Tình Huống AI & Mô Phỏng Sư Phạm
            </h2>
            <p className="text-xs text-slate-500">
              Bộ 10 tình huống thực tế dùng trong tiết sinh hoạt lớp để hướng dẫn học sinh kỹ năng thấu cảm và giải quyết xung đột.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((sc, idx) => (
              <div key={sc.id} className="p-5 rounded-2xl border border-slate-200 hover:border-sky-400 transition space-y-3 bg-white shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    Tình huống {idx + 1}: {sc.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">{sc.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{sc.description}"</p>

                <div className="space-y-1.5 pt-1 text-xs">
                  <span className="font-bold text-slate-700 block">Các lựa chọn giải quyết:</span>
                  {sc.options.map((opt) => (
                    <div key={opt.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                      • {opt.label}
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
                  Bài học cốt lõi: {sc.coreLesson}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 10: PHỐI HỢP PHỤ HUYNH */}
      {/* ======================================================== */}
      {activeModuleCode === 'parent_comm' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Module 10</span>
            <h2 className="text-xl font-bold text-slate-800 font-heading mt-0.5">
              AI Soạn Nội Dung Phối Hợp Phụ Huynh
            </h2>
            <p className="text-xs text-slate-500">
              Tạo thông báo, tin nhắn Zalo hoặc thư trao đổi chi tiết với 4 phong cách giọng điệu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã/Tên học sinh:</label>
                <input
                  type="text"
                  value={parentStudentCode}
                  onChange={(e) => setParentStudentCode(e.target.value)}
                  placeholder="HS-04"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề trao đổi:</label>
                <input
                  type="text"
                  value={parentTopic}
                  onChange={(e) => setParentTopic(e.target.value)}
                  placeholder="Kỹ năng tự quản & chuẩn bị bài..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chi tiết tình hình:</label>
                <textarea
                  rows={4}
                  value={parentDetails}
                  onChange={(e) => setParentDetails(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giọng điệu mong muốn:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'friendly', label: 'Thân thiện' },
                    { id: 'positive', label: 'Tích cực' },
                    { id: 'formal', label: 'Trang trọng' },
                    { id: 'concise', label: 'Ngắn gọn' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setParentTone(t.id as any)}
                      className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                        parentTone === t.id
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateParentComm}
                disabled={isGeneratingParentComm || !parentDetails.trim()}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>{isGeneratingParentComm ? 'Đang tạo nội dung...' : 'Soạn Thông Điệp Phối Hợp'}</span>
              </button>
            </div>

            <div className="md:col-span-2">
              {parentDraft ? (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                    <span>MẪU TIN NHẮN & THƯ TRAO ĐỔI PHỤ HUYNH</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(parentDraft);
                        showToast('Đã sao chép nội dung trao đổi!');
                      }}
                      className="text-teal-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200 font-sans">
                    {parentDraft}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Nhập thông tin trao đổi và chọn giọng điệu để AI tạo tin nhắn mẫu Zalo/SMS.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE 11: BÁO CÁO TIẾN BỘ */}
      {/* ======================================================== */}
      {activeModuleCode === 'progress_report' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Module 11</span>
            <h2 className="text-xl font-bold text-slate-800 font-heading mt-0.5">
              Báo Cáo Tiến Bộ Trước & Sau Can Thiệp
            </h2>
            <p className="text-xs text-slate-500">
              So sánh chuyển biến định lượng và định tính: Thực trạng → Can thiệp → Kết quả → Nhận xét → Đề xuất tiếp theo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã học sinh:</label>
                <input
                  type="text"
                  value={reportStudentCode}
                  onChange={(e) => setReportStudentCode(e.target.value)}
                  placeholder="HS-04"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trước can thiệp (Thực trạng ban đầu):</label>
                <textarea
                  rows={2}
                  value={reportBefore}
                  onChange={(e) => setReportBefore(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Biện pháp sư phạm đã áp dụng:</label>
                <textarea
                  rows={2}
                  value={reportMeasures}
                  onChange={(e) => setReportMeasures(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sau can thiệp (Kết quả chuyển biến):</label>
                <textarea
                  rows={2}
                  value={reportAfter}
                  onChange={(e) => setReportAfter(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                onClick={handleGenerateProgressReport}
                disabled={isGeneratingReport}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>{isGeneratingReport ? 'AI đang tổng hợp báo cáo...' : 'Tạo Báo Cáo Tiến Bộ'}</span>
              </button>
            </div>

            <div className="md:col-span-2">
              {generatedReport ? (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                    <span>BÁO CÁO TIẾN BỘ SƯ PHẠM (CARE PROGRESS REPORT)</span>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In báo cáo</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-5 rounded-xl border border-slate-200">
                    {generatedReport}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Nhập các giai đoạn trước và sau can thiệp để AI tạo bản báo cáo sư phạm hoàn chỉnh.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REVERSE QUESTIONING MODAL */}
      <ReverseQuestioningModal
        isOpen={isReverseModalOpen}
        onClose={() => setIsReverseModalOpen(false)}
        onConfirm={handleConfirmCarePlan}
        studentCode={pendingCarePlan?.studentCode || 'Học sinh'}
        contextTitle="Lập kế hoạch đồng hành Care Plan"
      />
    </div>
  );
};
