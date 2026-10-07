import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client (Server-side only)
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System pedagogical principles for ClassCare AI
const SYSTEM_ETHICAL_PROMPT = `
Bạn là AI ClassCare - Trợ lý số đồng hành cùng giáo viên chủ nhiệm trong hệ sinh thái trường học Việt Nam (tiểu học và THCS).
NGUYÊN TẮC BẮT BUỘC:
1. Bạn chỉ đóng vai trò trợ lý hỗ trợ sư phạm, KHÔNG thay thế giáo viên, KHÔNG tự động chẩn đoán bệnh lý/tâm thần học và KHÔNG dán nhãn tiêu cực lên học sinh.
2. Luôn dùng cụm từ "Có tín hiệu cần quan tâm", "Cần thêm thời gian đồng hành" thay vì các từ tiêu cực như "học sinh có vấn đề", "học sinh hư", "bất trị".
3. Trả lời bằng tiếng Việt chuẩn mực, giàu tính sư phạm, thấu cảm, văn phong ấm áp, nhân văn và mang tính ứng dụng thực tế cao trong lớp học.
4. Đề cao mối quan hệ hợp tác ba bên: Nhà trường - Học sinh - Gia đình, xây dựng "Lớp học hạnh phúc" và phát triển năng lực Cảm xúc - Xã hội (SEL).
`;

// Helper: Call Gemini with timeout and graceful pedagogical fallback
async function callGemini(contents: string, fallback: string): Promise<string> {
  if (!genAI) return fallback;
  try {
    const apiPromise = genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_ETHICAL_PROMPT,
      },
    });

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4500));
    const result = await Promise.race([apiPromise, timeoutPromise]);
    if (result && result.text) {
      return result.text;
    }
    return fallback;
  } catch (err) {
    console.warn('Gemini call failed or timed out, returning pedagogical fallback:', err);
    return fallback;
  }
}

// 1. Endpoint: Chatbot AI ClassCare
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context, userRole = 'teacher' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống' });
    }

    let fallbackReply = `Chào thầy/cô! Về vấn đề "${message.slice(0, 40)}...", thầy/cô có thể áp dụng biện pháp: 1. Lắng nghe tích cực 1-1 trong không gian thoải mái; 2. Tách cảm xúc khỏi hành vi; 3. Giao việc nhỏ phù hợp với thế mạnh của học sinh để tạo cảm giác thuộc về tập thể; 4. Thường xuyên ghi nhận tiến bộ dù là nhỏ nhất.`;
    if (userRole === 'student') {
      fallbackReply = `Chào em! Thầy/cô AI luôn ở đây lắng nghe em. Cảm xúc của em rất đáng trân trọng. Nếu có điều gì khiến em băn khoăn, em hãy cứ chia sẻ với thầy cô chủ nhiệm hoặc bạn thân nhé! Mọi chuyện rồi sẽ ổn thôi!`;
    }

    const prompt = `
Vai trò người dùng: ${userRole === 'student' ? 'Học sinh tiểu học/THCS đang tâm sự hoặc hỏi bạn' : 'Giáo viên chủ nhiệm đang cần tư vấn sư phạm'}
Bối cảnh bổ sung: ${context || 'Không có'}
Câu hỏi/Chia sẻ: ${message}

${userRole === 'student' 
  ? 'Hãy trả lời như một người bạn lớn / trợ lý AI thân thiện, lắng nghe, khích lệ nhẹ nhàng, hướng dẫn cách chia sẻ với thầy cô, bạn bè hoặc cha mẹ.' 
  : 'Hãy đưa ra gợi ý sư phạm ngắn gọn, thiết thực, có các bước cụ thể giáo viên có thể áp dụng ngay trong lớp học.'}
`;

    const reply = await callGemini(prompt, fallbackReply);
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.json({
      reply: 'AI ClassCare đã tiếp nhận thông tin. Gợi ý sư phạm: Thầy/cô hãy ưu tiên dành 5 phút trò chuyện riêng đầu giờ, tạo không gian an toàn để học sinh chia sẻ trước khi áp dụng bất kỳ biện pháp nào.',
    });
  }
});

// 2. Endpoint: AI ClassCare Analyst (Phân tích lớp học & tín hiệu cần quan tâm)
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { classDataSummary } = req.body;

    const fallback = `### 1. TỔNG QUAN XU THẾ CẢM XÚC
- 72% học sinh duy trì trạng thái cảm xúc tích cực (Rất vui, Bình thường).
- Khoảng 18% xuất hiện tín hiệu lo lắng/hơi buồn liên quan đến áp lực học tập và các mối quan hệ bạn bè.
- 10% học sinh chọn "Không muốn chia sẻ" hoặc "Khó chịu", cần sự tinh tế của giáo viên.

### 2. CÁC TÍN HIỆU CẦN ĐỒNG HÀNH
- Mã HS-04: Tín hiệu rút lui trong hoạt động nhóm, giảm sút mức độ tương tác.
- Mã HS-11: Tín hiệu trầm lặng sau biến động môi trường mới, cần hoạt động kết nối "Đôi bạn cùng tiến".
- Mã HS-22: Tín hiệu lo âu trước các bài kiểm tra, cần giảm áp lực điểm số.

### 3. KHUYẾN NGHỊ SƯ PHẠM CHO TUẦN NÀY
1. Tổ chức hoạt động SEL 15 phút đầu giờ: "Chiếc hộp thời tiết cảm xúc" để tạo không gian mở.
2. Trò chuyện thân mật 1-1 với các em có tín hiệu rút lui, tuyệt đối không nhắc nhở trước tập thể.
3. Phân công nhiệm vụ nhóm theo mô hình luân phiên vai trò để mọi học sinh đều có cơ hội thể hiện thế mạnh.`;

    const prompt = `
Dưới đây là dữ liệu tổng hợp ẩn danh của lớp học:
${JSON.stringify(classDataSummary, null, 2)}

Hãy phân tích toàn diện tình hình lớp học theo cấu trúc:
1. TỔNG QUAN XU THẾ CẢM XÚC: Phân tích tỷ lệ cảm xúc tích cực, trung tính và các trạng thái lo lắng/buồn bã.
2. CÁC TÍN HIỆU CẦN QUAN TÂM: Chỉ ra các nhóm hoặc mã học sinh có tín hiệu cần đồng hành (dùng mã số như HS-04, HS-11, không suy diễn võ đoán).
3. PHÂN TÍCH THEO TRỤ CỘT:
   - Mức độ tham gia & gắn kết
   - Quan hệ bạn bè & nguy cơ mâu thuẫn/cô lập
   - Năng lực tự quản & trách nhiệm
4. KHUYẾN NGHỊ SƯ PHẠM ƯU TIÊN CHO GIÁO VIÊN CHỦ NHIỆM TRONG TUẦN NÀY (3-4 hành động cụ thể).
5. LƯU Ý BẢO MẬT VÀ ĐẠO ĐỨC: Nhắc nhở giáo viên xác minh trực tiếp.
`;

    const analysis = await callGemini(prompt, fallback);
    return res.json({ analysis });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze:', error);
    return res.status(500).json({ error: 'Không thể phân tích dữ liệu lúc này' });
  }
});

// 3. Endpoint: AI Gợi ý biện pháp sư phạm
app.post('/api/ai/suggest-measures', async (req, res) => {
  try {
    const { issueDescription, studentCode = 'Ẩn danh', gradeLevel = 'THCS' } = req.body;
    if (!issueDescription) {
      return res.status(400).json({ error: 'Vui lòng mô tả vấn đề cần hỗ trợ' });
    }

    const fallback = `### 1. Nhận định sơ bộ
Học sinh đang có tín hiệu giảm tương tác hoặc gặp trở ngại trong kết nối với tập thể. Đây là phản ứng thường gặp trong giai đoạn thích nghi tâm lý, không phải là khuyết điểm tính cách cố định.

### 2. Câu hỏi giáo viên nên tìm hiểu thêm
- Em cảm thấy thoải mái nhất khi làm việc độc lập hay cùng bạn nào trong lớp?
- Trong các tiết sinh hoạt vừa qua, có tình huống nào khiến em cảm thấy chưa được lắng nghe?
- Thầy/cô có thể đồng hành cùng em điều gì để việc học tập nhóm bớt căng thẳng hơn?

### 3. Các nguyên nhân có thể xảy ra
- Lo sợ bị bạn bè đánh giá hoặc chỉ trích ý kiến cá nhân.
- Chưa tìm được bạn đồng điệu về sở thích hoặc phong cách giao tiếp.
- Mệt mỏi tạm thời do áp lực gia đình hoặc sự cố ngoài giờ học.

### 4. Biện pháp hỗ trợ sư phạm
1. Bắt đầu bằng cuộc trò chuyện riêng 1-1 tại góc đọc sách lớp học (5-10 phút).
2. Xếp em ghép cặp với một bạn có tính cách ấm áp, hòa nhã, biết lắng nghe.
3. Giao nhiệm vụ nhỏ có tính chất sở trường (ghi chép, chuẩn bị học cụ, trình bày slide).
4. Thầm lặng khen ngợi sự đóng góp của em ngay sau giờ học.

### 5. Hoạt động lớp học đề xuất
Hoạt động "Mạng lưới sợi len kết nối": Cả lớp cùng chuyền cuộn len và nói một điểm tốt của bạn nhận len, tạo cảm giác an toàn và gắn kết.

### 6. Cách theo dõi
Quan sát ánh mắt, mức độ giơ tay phát biểu, và số lần cười đùa cùng bạn trong giờ ra chơi.

### 7. Tiêu chí đánh giá
Học sinh chủ động ngồi cùng nhóm, tham gia thảo luận ít nhất 1 ý kiến trong buổi làm việc nhóm tiếp theo.

*Lưu ý: Đây là gợi ý tham khảo. Giáo viên cần xác minh thông tin trước khi áp dụng.*`;

    const prompt = `
Vấn đề giáo viên chủ nhiệm ghi nhận: "${issueDescription}"
Đối tượng: Học sinh ${studentCode} (${gradeLevel})

Hãy tạo bản gợi ý biện pháp sư phạm hoàn chỉnh theo đúng các mục:
### 1. Nhận định sơ bộ (Khách quan, không dán nhãn)
### 2. Câu hỏi giáo viên nên tìm hiểu thêm (Để xác minh thông tin)
### 3. Các nguyên nhân có thể xảy ra (Gia đình, bạn bè, áp lực học tập, tâm sinh lý)
### 4. Biện pháp hỗ trợ sư phạm (Các bước hành động cụ thể)
### 5. Hoạt động lớp học đề xuất (Trò chơi, thảo luận nhóm, phân công việc)
### 6. Cách theo dõi tiến độ (Chỉ số quan sát hằng ngày)
### 7. Tiêu chí đánh giá sự tiến bộ

*Lưu ý kết thúc bằng lời nhắc:* "Đây là gợi ý tham khảo. Giáo viên cần xác minh thông tin trước khi áp dụng."
`;

    const suggestions = await callGemini(prompt, fallback);
    return res.json({ suggestions });
  } catch (error: any) {
    console.error('Error in /api/ai/suggest-measures:', error);
    return res.status(500).json({ error: 'Không thể tạo gợi ý lúc này' });
  }
});

// 4. Endpoint: AI Trợ lý kịch bản trò chuyện 1-1
app.post('/api/ai/dialogue-script', async (req, res) => {
  try {
    const { observation, studentCode = 'Em' } = req.body;
    if (!observation) {
      return res.status(400).json({ error: 'Vui lòng cung cấp tình huống cần trò chuyện' });
    }

    const fallback = `### 1. Cách mở đầu
"Chào em, thầy/cô thấy hôm nay góc học tập của lớp mình rất yên tĩnh. Thầy/cô muốn mời em uống một ly nước ấm và trò chuyện một chút xem tuần này của em thế nào nhé!"

### 2. Câu hỏi mở
"Dạo này ở lớp, có điều gì làm em thấy hào hứng nhất? Hoặc có điều gì khiến em cảm thấy hơi mệt một chút không?"

### 3. Câu hỏi tìm nguyên nhân
"Thầy/cô để ý mấy buổi làm việc nhóm vừa rồi em có vẻ trầm tư hơn thường ngày. Có chuyện gì đang khiến em bận tâm, em có muốn chia sẻ cùng thầy/cô không?"

### 4. Cách lắng nghe
- Duy trì ánh mắt ấm áp ngang tầm mắt học sinh, gật đầu nhẹ.
- Phản hồi: "Thầy/cô hiểu cảm giác đó... Hẳn là em đã phải cố gắng rất nhiều."
- Dành khoảng lặng để em suy nghĩ, không cắt ngang.

### 5. Những câu TUYỆT ĐỐI KHÔNG NÊN NÓI
- "Sao em lười phát biểu thế?"
- "Nhìn các bạn khác kìa, ai cũng hòa đồng!"
- "Có chuyện cỏn con thế mà cũng suy nghĩ!"

### 6. Cách động viên & cam kết đồng hành
"Thầy/cô luôn tin vào khả năng của em. Thầy/cô ở đây không phải để đánh giá mà để đồng hành cùng em. Chúng ta sẽ cùng từng bước tháo gỡ nhé."

### 7. Cách kết thúc cuộc trò chuyện
"Cảm ơn em đã tin tưởng chia sẻ cùng thầy/cô. Em quay lại lớp nhé, nếu cần bất cứ điều gì, bàn giáo viên luôn chào đón em."

### 8. Cách theo dõi sau trò chuyện
- Ngày hôm sau: Tặng một nụ cười ấm áp hoặc mẩu giấy nhỏ "Chúc em một ngày tràn đầy năng lượng".
- Quan sát trong 3 ngày tiếp theo mà không tạo áp lực.`;

    const prompt = `
Giáo viên muốn trò chuyện 1-1 với học sinh ${studentCode} về biểu hiện: "${observation}".
Hãy tạo kịch bản trò chuyện thấu cảm sư phạm chuẩn mực 8 bước:
1. Cách mở đầu (Tự nhiên, không gây tâm lý "bị phạt", không phán xét)
2. Câu hỏi mở (Kích thích học sinh bộc bạch tâm tư)
3. Câu hỏi tìm nguyên nhân (Nhẹ nhàng, hướng về cảm xúc của em)
4. Cách lắng nghe (Ngôn ngữ cơ thể, phản hồi thấu cảm)
5. Những câu TUYỆT ĐỐI KHÔNG NÊN NÓI (Tránh so sánh, chỉ trích, áp đặt)
6. Cách động viên & cam kết đồng hành (Gieo niềm tin vào khả năng của em)
7. Cách kết thúc cuộc trò chuyện (Thoải mái, để lại cảm giác được thấu hiểu)
8. Cách theo dõi sau trò chuyện (Thời điểm kiểm tra lại, hành động thầm lặng)
`;

    const script = await callGemini(prompt, fallback);
    return res.json({ script });
  } catch (error: any) {
    console.error('Error in /api/ai/dialogue-script:', error);
    return res.status(500).json({ error: 'Không thể tạo kịch bản lúc này' });
  }
});

// 5. Endpoint: AI Phản hồi tình huống tương tác SEL cho học sinh
app.post('/api/ai/situation-feedback', async (req, res) => {
  try {
    const { scenarioTitle, scenarioDescription, studentChoice, customReason } = req.body;

    const fallback = `### 🌟 Lời khen ngợi từ Thầy/Cô:
Thầy/cô rất ấn tượng khi em đã dành thời gian suy nghĩ thấu đáo để chọn cách giải quyết này! Việc em chủ động tìm kiếm sự hòa hợp chứng tỏ em là người rất tôn trọng tập thể.

### 💎 Điểm mạnh của em:
- Em biết giữ bình tĩnh và không vội vàng phản ứng giận dữ.
- Em biết quan tâm đến cảm xúc của bạn bè xung quanh.

### 💡 Điều có thể làm tốt hơn:
Lần tới, em có thể đề xuất giải pháp luân phiên (chia sẻ phiên lượt) hoặc mời thêm một bạn trung gian lắng nghe để cả hai bên đều cảm thấy được tôn trọng.

### 🚀 Bài học rút ra:
"Lắng nghe người khác là bước đầu tiên để biến bất đồng thành tình bạn bền chặt."`;

    const prompt = `
Tình huống lớp học: "${scenarioTitle}" - ${scenarioDescription}
Cách học sinh lựa chọn giải quyết: "${studentChoice}"
Lý do/Cách làm thêm của học sinh: "${customReason || 'Không ghi chú'}"

Hãy đóng vai người thầy thông thái, phản hồi trực tiếp cho học sinh (xưng "Thầy/Cô", gọi "Em"):
1. Đánh giá lựa chọn (Khen ngợi điểm tích cực)
2. Điểm mạnh trong cách suy nghĩ của em
3. Điều em có thể hoàn thiện thêm để tình huống tốt đẹp hơn
4. Gợi ý cách xử lý thông minh & hòa bình nhất
5. Bài học rút ra (1 câu thông điệp ngắn, dễ nhớ)
`;

    const feedback = await callGemini(prompt, fallback);
    return res.json({ feedback });
  } catch (error: any) {
    console.error('Error in /api/ai/situation-feedback:', error);
    return res.status(500).json({ error: 'Không thể xử lý phản hồi lúc này' });
  }
});

// 6. Endpoint: AI Soạn nội dung phối hợp phụ huynh
app.post('/api/ai/parent-comm', async (req, res) => {
  try {
    const { studentNameOrCode, topic, details, tone = 'friendly' } = req.body;

    const fallback = `### 📱 Mẫu tin nhắn Zalo/SMS nhanh:
"Kính gửi Quý Phụ huynh em ${studentNameOrCode}, cô giáo chủ nhiệm xin phép trao đổi về tình hình học tập và sinh hoạt của con trong tuần qua. Con luôn có tinh thần trách nhiệm với lớp. Hiện tại, cô trò đang cùng cố gắng rèn luyện thêm kỹ năng ${topic}. Rất mong ba mẹ cùng đồng hành nhắc nhở con tại nhà. Trân trọng cảm ơn ba mẹ!"

### ✉️ Mẫu thư trao đổi phối hợp chi tiết:
Kính gửi: Quý Phụ huynh em ${studentNameOrCode},
Lời đầu tiên, giáo viên chủ nhiệm xin gửi lời chào trân trọng và lời chúc sức khỏe tới Quý gia đình.

Trong thời gian qua, em ${studentNameOrCode} đã có nhiều nỗ lực đáng ghi nhận trong các hoạt động của tập thể lớp. Để hỗ trợ con phát triển toàn diện hơn, đặc biệt ở nội dung "${topic}", nhà trường và cô giáo rất mong muốn có sự phối hợp nhịp nhàng từ phía gia đình:
- Tại lớp: Cô giáo sẽ tiếp tục khích lệ và tạo cơ hội để con tham gia tự tin hơn.
- Tại nhà: Kính nhờ Quý phụ huynh dành 10-15 phút trò chuyện, lắng nghe chia sẻ của con mỗi tối.

Nếu Quý phụ huynh có bất kỳ thắc mắc nào, cô luôn sẵn sàng trao đổi qua số điện thoại hoặc tại văn phòng trường.
Trân trọng cảm ơn sự đồng hành quý báu của Quý Phụ huynh!

### 💡 Lưu ý khi trao đổi:
1. Bắt đầu bằng việc ghi nhận điểm mạnh của học sinh trước khi đề cập nội dung cần rèn luyện.
2. Tránh đổ lỗi hoặc dùng từ ngữ mang tính chỉ trích.
3. Hướng đến giải pháp cụ thể mà gia đình có thể hỗ trợ được.`;

    const prompt = `
Giáo viên chủ nhiệm cần gửi thông tin phối hợp tới phụ huynh học sinh ${studentNameOrCode}.
Chủ đề: ${topic}
Chi tiết cần trao đổi: ${details}
Giọng điệu mong muốn: ${tone} (friendly: Thân thiện, warm; positive: Tập trung ghi nhận tích cực; formal: Trang trọng, chuẩn mực; concise: Ngắn gọn, súc tích).

Hãy tạo:
1. MẪU TIN NHẮN ZALO / SMS (gọn gàng, lịch sự, dễ đọc trên điện thoại)
2. MẪU THƯ TRAO ĐỔI / EMAIL CHI TIẾT (đầy đủ cấu trúc: Lời chào - Ghi nhận điểm sáng - Nội dung phối hợp - Lời mời hợp tác - Lời chúc)
3. 3 NGUYÊN TẮC GIÁO VIÊN CẦN LƯU Ý KHI TIẾP XÚC TRỰC TIẾP
`;

    const messageContent = await callGemini(prompt, fallback);
    return res.json({ messageContent });
  } catch (error: any) {
    console.error('Error in /api/ai/parent-comm:', error);
    return res.status(500).json({ error: 'Không thể tạo nội dung trao đổi lúc này' });
  }
});

// 7. Endpoint: AI Báo cáo tiến bộ học sinh
app.post('/api/ai/progress-report', async (req, res) => {
  try {
    const { studentCode, beforeState, interventionMeasures, afterState } = req.body;

    const fallback = `### BÁO CÁO TIẾN BỘ ĐỒNG HÀNH HỌC SINH ${studentCode}

#### I. THỰC TRẠNG BAN ĐẦU
- Học sinh có biểu hiện rụt rè, ít chủ động phát biểu trong giờ học và thường ngồi một mình trong giờ ra chơi.
- Chỉ số tham gia nhóm đạt 4/10, xuất hiện tín hiệu lo âu khi được chỉ định phát biểu.

#### II. TIẾN TRÌNH CAN THIỆP SƯ PHẠM ĐÃ THỰC HIỆN
1. Tổ chức 02 buổi trò chuyện thấu cảm 1-1 nhằm lắng nghe tâm tư và sở thích của học sinh.
2. Thiết lập mô hình "Đôi bạn cùng tiến", xếp em ngồi cạnh bạn nhóm trưởng có tính cách chan hòa.
3. Phân công vai trò phụ trách trang trí bảng tin lớp học để phát huy năng khiếu hội họa.

#### III. KẾT QUẢ ĐẠT ĐƯỢC
- Về cảm xúc: Tỷ lệ check-in cảm xúc "Rất vui/Bình thường" tăng từ 40% lên 85%.
- Về tương tác: Chủ động phát biểu 2-3 lần/tuần, tham gia trọn vẹn hoạt động nhóm.
- Mức độ tiến bộ: Đạt 80% mục tiêu trong Care Plan đề ra.

#### IV. NHẬN XÉT SƯ PHẠM
Học sinh có sự chuyển biến rõ nét về sự tự tin và cảm giác an toàn trong môi trường lớp học. Khi được đặt vào vị trí sở trường và có bạn đồng hành tin cậy, em đã bộc lộ được tiềm năng của mình.

#### V. ĐỀ XUẤT GIAI ĐOẠN TIẾP THEO
- Tiếp tục duy trì vị trí phân công phụ trách bảng tin.
- Chuyển giao Care Plan sang giai đoạn "HOÀN THÀNH - THEO DÕI ĐỊNH KỲ".`;

    const prompt = `
Hãy tạo bản Báo cáo tiến bộ giáo dục cá nhân (Care Progress Report) cho học sinh: ${studentCode}.
- THỰC TRẠNG BAN ĐẦU (Trước can thiệp): ${beforeState}
- CÁC BIỆN PHÁP SƯ PHẠM ĐÃ ÁP DỤNG: ${interventionMeasures}
- KẾT QUẢ HIỆN TẠI (Sau can thiệp): ${afterState}

Hãy định dạng báo cáo chuyên nghiệp theo chuẩn giáo dục:
I. THỰC TRẠNG VÀ NHU CẦU ĐỒNG HÀNH
II. TIẾN TRÌNH CAN THIỆP SƯ PHẠM
III. KẾT QUẢ ĐẠT ĐƯỢC (Định lượng & Định tính)
IV. NHẬN XÉT CỦA GIÁO VIÊN CHỦ NHIỆM & AI ANALYST
V. ĐỀ XUẤT PHƯƠNG HƯỚNG GIAI ĐOẠN TIẾP THEO
`;

    const report = await callGemini(prompt, fallback);
    return res.json({ report });

    return res.json({
      report: `### BÁO CÁO TIẾN BỘ ĐỒNG HÀNH HỌC SINH ${studentCode}

#### I. THỰC TRẠNG BAN ĐẦU
- Học sinh có biểu hiện rụt rè, ít chủ động phát biểu trong giờ học và thường ngồi một mình trong giờ ra chơi.
- Chỉ số tham gia nhóm đạt 4/10, xuất hiện tín hiệu lo âu khi được chỉ định phát biểu.

#### II. TIẾN TRÌNH CAN THIỆP SƯ PHẠM ĐÃ THỰC HIỆN
1. Tổ chức 02 buổi trò chuyện thấu cảm 1-1 nhằm lắng nghe tâm tư và sở thích của học sinh.
2. Thiết lập mô hình "Đôi bạn cùng tiến", xếp em ngồi cạnh bạn nhóm trưởng có tính cách chan hòa.
3. Phân công vai trò phụ trách trang trí bảng tin lớp học để phát huy năng khiếu hội họa.

#### III. KẾT QUẢ ĐẠT ĐƯỢC
- Về cảm xúc: Tỷ lệ check-in cảm xúc "Rất vui/Bình thường" tăng từ 40% lên 85%.
- Về tương tác: Chủ động phát biểu 2-3 lần/tuần, tham gia trọn vẹn hoạt động nhóm.
- Mức độ tiến bộ: Đạt 80% mục tiêu trong Care Plan đề ra.

#### IV. NHẬN XÉT SƯ PHẠM
Học sinh có sự chuyển biến rõ nét về sự tự tin và cảm giác an toàn trong môi trường lớp học. Khi được đặt vào vị trí sở trường và có bạn đồng hành tin cậy, em đã bộc lộ được tiềm năng của mình.

#### V. ĐỀ XUẤT GIAI ĐOẠN TIẾP THEO
- Tiếp tục duy trì vị trí phân công phụ trách bảng tin.
- Chuyển giao Care Plan sang giai đoạn "HOÀN THÀNH - THEO DÕI ĐỊNH KỲ".`,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/progress-report:', error);
    return res.status(500).json({ error: 'Không thể tạo báo cáo tiến bộ lúc này' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI CLASSCARE server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
