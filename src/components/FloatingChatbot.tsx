import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Heart,
  BookOpen,
  Users,
  Target,
  ShieldAlert,
  Home,
  Dice5,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { aiService } from '../services/aiService';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface FloatingChatbotProps {
  userRole?: 'teacher' | 'student';
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ userRole = 'teacher' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text:
        userRole === 'student'
          ? 'Chào em! Thầy/cô AI ClassCare đây. Em có điều gì băn khoăn về bài học, bạn bè hay muốn tâm sự điều gì hôm nay không?'
          : 'Xin chào! Tôi là trợ lý AI ClassCare. Tôi có thể hỗ trợ thầy/cô về công tác chủ nhiệm và tâm lý học đường. Thầy/cô muốn hỗ trợ vấn đề gì hôm nay?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: '💙 Cảm xúc học sinh', text: 'Làm gì khi học sinh bỗng nhiên thu mình và ít nói chuyện trong lớp?' },
    { label: '📚 Học tập', text: 'Làm sao để tạo động lực cho học sinh mất tập trung và sợ bị điểm kém?' },
    { label: '🤝 Quan hệ bạn bè', text: 'Xử lý mâu thuẫn giữa hai học sinh khi tranh nhau một món đồ hoặc vị trí nhóm trưởng?' },
    { label: '🎯 Tự quản', text: 'Gợi ý hoạt động giúp học sinh phát triển năng lực tự quản và giữ trật tự lớp?' },
    { label: '🛡️ Phòng chống bắt nạt', text: 'Cách phát hiện sớm tín hiệu bắt nạt ngầm hoặc cô lập trong lớp học?' },
    { label: '👨‍👩‍👧 Phụ huynh', text: 'Cách trao đổi tế nhị với phụ huynh khi học sinh có biểu hiện mệt mỏi ở trường?' },
    { label: '🎲 Hoạt động lớp', text: 'Gợi ý hoạt động khởi động SEL 10 phút đầu giờ giúp lớp tràn đầy năng lượng?' },
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const replyText = await aiService.chatWithAI(query.trim(), undefined, userRole);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white rounded-full shadow-xl shadow-teal-700/30 hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-sm border-2 border-white/60"
        >
          <div className="relative">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span>🤖 AI ClassCare</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`w-96 sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-teal-100 flex flex-col overflow-hidden transition-all duration-200 ${
            isMinimized ? 'h-16' : 'h-[560px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-800 p-4 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Bot className="w-5 h-5 text-cyan-200" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5 font-heading">
                  <span>Trợ Lý AI ClassCare</span>
                  <span className="text-[10px] bg-emerald-400 text-slate-900 px-1.5 py-0.2 rounded-full font-bold">
                    Trực tuyến
                  </span>
                </h4>
                <p className="text-[11px] text-teal-100">
                  {userRole === 'student' ? 'Bạn đồng hành học sinh' : 'Cố vấn sư phạm 24/7'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition"
                title={isMinimized ? 'Phóng to' : 'Thu nhỏ'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition"
                title="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Prompts Bar */}
              <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 overflow-x-auto flex gap-1.5 scrollbar-none text-[11px]">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp.text)}
                    className="whitespace-nowrap bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 hover:border-teal-300 font-medium transition cursor-pointer shrink-0 shadow-2xs"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-slate-50/50 to-white">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{m.text}</div>
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          m.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>

                    {m.sender === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 items-center text-xs text-slate-500">
                    <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-400 font-medium ml-1">AI đang suy nghĩ...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-3 bg-white border-t border-slate-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      userRole === 'student'
                        ? 'Em muốn tâm sự hoặc hỏi điều gì...'
                        : 'Nhập câu hỏi sư phạm cần hỗ trợ...'
                    }
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-2 rounded-xl transition ${
                      input.trim() && !isLoading
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:scale-105 cursor-pointer shadow-md shadow-teal-600/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[9px] text-center text-slate-400 mt-1.5">
                  AI chỉ đưa ra gợi ý sư phạm tham khảo, không dán nhãn học sinh.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
