export const aiService = {
  chatWithAI: async (message: string, context?: string, userRole: 'teacher' | 'student' = 'teacher') => {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, userRole }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.reply as string;
    } catch (e) {
      console.error('aiService.chatWithAI error:', e);
      return userRole === 'student'
        ? 'Thầy/cô AI luôn lắng nghe em. Cảm xúc của em rất đáng được trân trọng. Hãy mạnh dạn chia sẻ thêm với thầy cô chủ nhiệm nhé!'
        : 'Gợi ý sư phạm: Thầy/cô hãy ưu tiên dành 5 phút trò chuyện riêng 1-1 để hiểu nhu cầu học sinh trước khi can thiệp.';
    }
  },

  analyzeClassData: async (classDataSummary: any) => {
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classDataSummary }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.analysis as string;
    } catch (e) {
      console.error('aiService.analyzeClassData error:', e);
      return 'Không thể phân tích dữ liệu lúc này. Vui lòng thử lại.';
    }
  },

  suggestPedagogicalMeasures: async (issueDescription: string, studentCode?: string, gradeLevel?: string) => {
    try {
      const res = await fetch('/api/ai/suggest-measures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueDescription, studentCode, gradeLevel }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.suggestions as string;
    } catch (e) {
      console.error('aiService.suggestPedagogicalMeasures error:', e);
      return 'Không thể tạo gợi ý lúc này. Vui lòng thử lại sau.';
    }
  },

  generateDialogueScript: async (observation: string, studentCode?: string) => {
    try {
      const res = await fetch('/api/ai/dialogue-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observation, studentCode }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.script as string;
    } catch (e) {
      console.error('aiService.generateDialogueScript error:', e);
      return 'Không thể tạo kịch bản lúc này. Vui lòng thử lại sau.';
    }
  },

  evaluateSituationFeedback: async (
    scenarioTitle: string,
    scenarioDescription: string,
    studentChoice: string,
    customReason?: string
  ) => {
    try {
      const res = await fetch('/api/ai/situation-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioTitle, scenarioDescription, studentChoice, customReason }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.feedback as string;
    } catch (e) {
      console.error('aiService.evaluateSituationFeedback error:', e);
      return 'Thầy/cô ghi nhận sự cố gắng suy nghĩ thấu đáo của em. Việc chủ động tìm giải pháp hòa bình là bài học quý giá!';
    }
  },

  generateParentCommunication: async (
    studentNameOrCode: string,
    topic: string,
    details: string,
    tone: 'friendly' | 'positive' | 'formal' | 'concise' = 'friendly'
  ) => {
    try {
      const res = await fetch('/api/ai/parent-comm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentNameOrCode, topic, details, tone }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.messageContent as string;
    } catch (e) {
      console.error('aiService.generateParentCommunication error:', e);
      return 'Không thể tạo nội dung trao đổi lúc này.';
    }
  },

  generateProgressReport: async (
    studentCode: string,
    beforeState: string,
    interventionMeasures: string,
    afterState: string
  ) => {
    try {
      const res = await fetch('/api/ai/progress-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentCode, beforeState, interventionMeasures, afterState }),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return data.report as string;
    } catch (e) {
      console.error('aiService.generateProgressReport error:', e);
      return 'Không thể tạo báo cáo tiến bộ lúc này.';
    }
  },
};
