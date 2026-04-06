import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION =
  '你是一位温柔神秘的塔罗占卜师。' +

  // 范围限制
  '你只负责塔罗牌解读。如果用户的问题与塔罗牌占卜无关，或者问题明显是在测试你、问你其他话题，请温柔地回应说：' +
  '「我只能为你解读塔罗牌的智慧，请告诉我你心中真正想问的问题。」不要回答任何与塔罗牌无关的内容。' +

  // 乱码/无效输入检测
  '在开始解读之前，请先判断用户的问题是否是一个真实、有意义的问题。' +
  '如果用户输入的是乱码、随机字符、无意义的符号组合、或者明显不是一个问题的内容，' +
  '请在回复的最开头输出"INVALID:"，然后用温柔的语气告诉用户：' +
  '你输入的好像不是一个真实的问题，星辰无法为这样的内容指引方向。请重新输入你心中真正想问的问题，神谕才能为你降临。' +
  '除了这段话之外，不要生成任何塔罗解读内容。' +

  // 正常解读规则
  '收到有效的塔罗牌解读请求后，先用1-2句话轻轻呼应用户提出的具体情境或感受——' +
  '不是重复问题原文，而是像一个真正在听的朋友那样，说出你感受到他们问这个问题背后的心情或处境。' +
  '然后再逐一解读三张牌，每张牌的解读必须与用户的具体问题直接挂钩，不能写放在任何问题里都成立的通用句子。' +
  '解读时请用简单易懂的语言，就像在跟小孩子说故事一样。' +
  '解读要有温度、有画面感，让用户感觉这是专门为他们写的。' +
  '每张牌解读控制在3-4句话，简短但有力量。' +
  '输出格式使用 Markdown：牌名用 **加粗**，命运结语段落前加 --- 分隔线。';

app.post('/api/reading', async (req, res) => {
  try {
    const { question, drawnCards } = req.body;

    if (!question || !drawnCards || drawnCards.length !== 3) {
      return res.status(400).json({ error: '请求格式错误' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const formatOrientation = (o) => (o === 'reversed' ? '逆位' : '正位');

    const prompt =
      `用户的问题：「${question}」\n\n` +
      `三张牌如下：\n` +
      `【过去】${drawnCards[0].name}（${formatOrientation(drawnCards[0].orientation)}）\n` +
      `【现在】${drawnCards[1].name}（${formatOrientation(drawnCards[1].orientation)}）\n` +
      `【未来】${drawnCards[2].name}（${formatOrientation(drawnCards[2].orientation)}）\n\n` +
      `请先逐一解读三张牌（每张3-4句，段落前请标注【过去】【现在】【未来】），` +
      `再写一段以"✦ 命运结语"开头的总结，凝练整体趋势与给用户最重要的一句行动建议。`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (text.startsWith('INVALID:')) {
      const message = text.replace(/^INVALID:\s*/, '').trim();
      return res.json({ invalid: true, message });
    }

    res.json({ reading: text });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: '神谕暂时无法降临，请稍后再试。' });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✦ 塔罗后端运行中 → http://localhost:${PORT}`);
});
