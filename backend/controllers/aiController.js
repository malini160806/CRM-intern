const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

if (!process.env.GROQ_API_KEY) {
  console.error("CRITICAL: GROQ_API_KEY is not defined in environment variables!");
}

const chatWithAI = async (req, res, next) => {
  const { message, history } = req.body;

  try {
    console.log("Groq AI Request received:", message);

    const formattedHistory = (history || []).map(m => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.parts[0].text
    }));

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional AI CRM Assistant. Help users manage their business, leads, and sales." },
        ...formattedHistory,
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = chatCompletion.choices[0].message.content;

    console.log("Groq response success");
    res.json({ message: text });
  } catch (error) {
    console.error("FULL GROQ ERROR:", error);
    res.status(500).json({ message: "AI service temporarily unavailable" });
  }
};

module.exports = { chatWithAI };
