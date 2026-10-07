export type EmotionType = 'joy' | 'neutral' | 'sad' | 'anxious' | 'annoyed' | 'private';

export interface EmotionOption {
  type: EmotionType;
  emoji: string;
  label: string;
  badgeColor: string;
  bgLight: string;
  borderColor: string;
  description: string;
}

export type CareSignal = 'concern' | 'stable' | 'positive';

export interface Student {
  id: string;
  code: string; // e.g. HS-01
  nameMasked: string; // e.g. "Học sinh A.T."
  gender: 'male' | 'female' | 'other';
  avatar: string;
  emotionStatus: EmotionType;
  emotionHistory: { date: string; emotion: EmotionType }[];
  attendanceRate: number; // e.g. 96
  participationScore: number; // 1-10
  peerBondingIndex: number; // 1-10
  autonomyRating: number; // 1-10
  careSignal: CareSignal;
  careSignalReason?: string;
  recentNotes: string;
  tags: string[];
}

export interface CheckInRecord {
  id: string;
  studentCode: string;
  emotion: EmotionType;
  timestamp: string;
  answers: {
    questionId: string;
    questionText: string;
    answerText: string;
  }[];
  wantTeacherToKnow: boolean;
  supportNeeded?: string;
  teacherRead?: boolean;
}

export interface CheckInQuestion {
  id: string;
  text: string;
  placeholder?: string;
  order: number;
  active: boolean;
  isCustom?: boolean;
}

export interface SituationOption {
  id: string;
  label: string;
  feedbackPreview: string;
  isEmpathetic: boolean;
}

export interface SituationScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  characterRoles: string;
  options: SituationOption[];
  coreLesson: string;
  aiPromptGuide?: string;
}

export type SELCategory = 
  | 'Cảm xúc'
  | 'Đoàn kết'
  | 'Giao tiếp'
  | 'Tự quản'
  | 'Giải quyết xung đột'
  | 'Phòng chống bắt nạt'
  | 'Kỹ năng số'
  | 'Công dân số'
  | 'Lớp học hạnh phúc';

export interface SELActivity {
  id: string;
  title: string;
  category: SELCategory;
  durationMinutes: number;
  targetGroup: string;
  objective: string;
  preparation: string;
  steps: string[];
  discussionQuestions: string[];
  expectedProduct: string;
  assessmentCriteria: string;
}

export type ProgressStage = 'start' | 'in_progress' | 'improving' | 'completed';

export interface CarePlan {
  id: string;
  studentCode: string;
  strengths: string;
  needsSupport: string;
  goal: string;
  pedagogicalMeasures: string;
  collaborators: string;
  timeline: string;
  progressStage: ProgressStage;
  progressPercent: number;
  results: string;
  notes: string;
  verifiedEthicalCheck: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleConfig {
  id: string;
  number: number;
  code: string;
  title: string;
  shortDesc: string;
  icon: string;
  badge: string;
  active: boolean;
  order: number;
}

export interface AppSettings {
  adminUsername: string;
  adminPasswordHash: string;
  hasChangedDefaultPassword?: boolean;
  schoolName: string;
  className: string;
  academicYear: string;
}
