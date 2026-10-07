import {
  Student,
  CheckInQuestion,
  SituationScenario,
  SELActivity,
  CarePlan,
  ModuleConfig,
  CheckInRecord,
  AppSettings,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_CHECK_IN_QUESTIONS,
  INITIAL_SITUATION_SCENARIOS,
  INITIAL_SEL_ACTIVITIES,
  INITIAL_CARE_PLANS,
  INITIAL_MODULES_CONFIG,
  INITIAL_CHECK_IN_RECORDS,
} from '../data/mockData';

const STORAGE_KEYS = {
  STUDENTS: 'classcare_students_v1',
  QUESTIONS: 'classcare_questions_v1',
  SCENARIOS: 'classcare_scenarios_v1',
  ACTIVITIES: 'classcare_activities_v1',
  CARE_PLANS: 'classcare_care_plans_v1',
  MODULES: 'classcare_modules_v1',
  CHECK_INS: 'classcare_check_ins_v1',
  SETTINGS: 'classcare_settings_v1',
  AUTH: 'classcare_auth_session_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  adminUsername: 'admin',
  adminPasswordHash: 'ClassCare@2026',
  hasChangedDefaultPassword: false,
  schoolName: 'Trường Tiểu học & THCS Hòa Bình',
  className: 'Lớp 6A - Khóa 2026',
  academicYear: 'Năm học 2026 - 2027',
};

export const storageService = {
  // Students
  getStudents: (): Student[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse students from localStorage', e);
    }
    return INITIAL_STUDENTS;
  },

  saveStudents: (students: Student[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  updateStudent: (student: Student) => {
    const list = storageService.getStudents();
    const idx = list.findIndex((s) => s.id === student.id || s.code === student.code);
    if (idx !== -1) {
      list[idx] = student;
    } else {
      list.push(student);
    }
    storageService.saveStudents(list);
  },

  // Check-In Records
  getCheckIns: (): CheckInRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse check-ins', e);
    }
    return INITIAL_CHECK_IN_RECORDS;
  },

  saveCheckIns: (records: CheckInRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(records));
  },

  addCheckInRecord: (record: CheckInRecord) => {
    const list = storageService.getCheckIns();
    list.unshift(record);
    storageService.saveCheckIns(list);

    // Also update student's current emotionStatus and history
    const students = storageService.getStudents();
    const student = students.find((s) => s.code === record.studentCode);
    if (student) {
      student.emotionStatus = record.emotion;
      const todayStr = new Date().toISOString().split('T')[0];
      student.emotionHistory.push({ date: todayStr, emotion: record.emotion });
      if (student.emotionHistory.length > 7) {
        student.emotionHistory = student.emotionHistory.slice(-7);
      }
      storageService.saveStudents(students);
    }
  },

  // Questions
  getQuestions: (): CheckInQuestion[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_CHECK_IN_QUESTIONS;
  },

  saveQuestions: (questions: CheckInQuestion[]) => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  // Situation Scenarios
  getScenarios: (): SituationScenario[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_SITUATION_SCENARIOS;
  },

  saveScenarios: (scenarios: SituationScenario[]) => {
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarios));
  },

  // SEL Activities
  getActivities: (): SELActivity[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_SEL_ACTIVITIES;
  },

  saveActivities: (activities: SELActivity[]) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  },

  // Care Plans
  getCarePlans: (): CarePlan[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARE_PLANS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_CARE_PLANS;
  },

  saveCarePlans: (plans: CarePlan[]) => {
    localStorage.setItem(STORAGE_KEYS.CARE_PLANS, JSON.stringify(plans));
  },

  addCarePlan: (plan: CarePlan) => {
    const list = storageService.getCarePlans();
    list.unshift(plan);
    storageService.saveCarePlans(list);
  },

  updateCarePlan: (plan: CarePlan) => {
    const list = storageService.getCarePlans();
    const idx = list.findIndex((p) => p.id === plan.id);
    if (idx !== -1) {
      list[idx] = plan;
      storageService.saveCarePlans(list);
    }
  },

  deleteCarePlan: (id: string) => {
    const list = storageService.getCarePlans().filter((p) => p.id !== id);
    storageService.saveCarePlans(list);
  },

  // Modules Configuration
  getModules: (): ModuleConfig[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MODULES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_MODULES_CONFIG;
  },

  saveModules: (modules: ModuleConfig[]) => {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
  },

  // Settings
  getSettings: (): AppSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return DEFAULT_SETTINGS;
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Authentication
  isAuthenticated: (): boolean => {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  login: (username: string, pass: string): boolean => {
    const settings = storageService.getSettings();
    if (username === settings.adminUsername && pass === settings.adminPasswordHash) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },

  logout: () => {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // Backup & Restore
  exportAllDataJSON: (): string => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      students: storageService.getStudents(),
      checkIns: storageService.getCheckIns(),
      questions: storageService.getQuestions(),
      scenarios: storageService.getScenarios(),
      activities: storageService.getActivities(),
      carePlans: storageService.getCarePlans(),
      modules: storageService.getModules(),
      settings: storageService.getSettings(),
    };
    return JSON.stringify(fullBackup, null, 2);
  },

  importAllDataJSON: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.students && Array.isArray(parsed.students)) {
        storageService.saveStudents(parsed.students);
      }
      if (parsed.checkIns && Array.isArray(parsed.checkIns)) {
        storageService.saveCheckIns(parsed.checkIns);
      }
      if (parsed.questions && Array.isArray(parsed.questions)) {
        storageService.saveQuestions(parsed.questions);
      }
      if (parsed.scenarios && Array.isArray(parsed.scenarios)) {
        storageService.saveScenarios(parsed.scenarios);
      }
      if (parsed.activities && Array.isArray(parsed.activities)) {
        storageService.saveActivities(parsed.activities);
      }
      if (parsed.carePlans && Array.isArray(parsed.carePlans)) {
        storageService.saveCarePlans(parsed.carePlans);
      }
      if (parsed.modules && Array.isArray(parsed.modules)) {
        storageService.saveModules(parsed.modules);
      }
      if (parsed.settings) {
        storageService.saveSettings(parsed.settings);
      }
      return true;
    } catch (e) {
      console.error('Failed to import data', e);
      return false;
    }
  },

  resetToDefaultDemoData: () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.SCENARIOS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.CARE_PLANS);
    localStorage.removeItem(STORAGE_KEYS.MODULES);
    localStorage.removeItem(STORAGE_KEYS.CHECK_INS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
