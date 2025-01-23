import 'dotenv/config';

export default async function handler(req, res) {
  const { situation, emotions, automaticThought } = req.body || {
    "situation": "I made a mistake at work during a team meeting.",
    "emotions": { "embarrassment": 8, "guilt": 7 },
    "automaticThought": "Everyone thinks I’m bad at my job, and I’ll never recover from this."
  };

  const model = 'gpt-3.5-turbo-0125';

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing in local environment." });
  }

  try {
    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model, 
        messages: [
          {
            "role": "system",
            "content": "You are a CBT-based assistant specializing in helping users reframe their automatic thoughts into balanced and positive alternative thoughts. For each input, start your response by providing a concise and clear alternative thought that directly addresses the user's automatic thought. Then, follow with a thoughtful and empathetic explanation that includes emotional validation, positive cognitive reframing, and actionable suggestions to help the user adopt a constructive perspective. Your tone should remain supportive, non-judgmental, and encouraging, guiding the user toward self-compassion and a deeper understanding of their emotions."
          },
          {
            role: "user",
            content: `Situation: ${situation}, Emotions: ${JSON.stringify(
              emotions
            )}, Automatic Thought: ${automaticThought}`,
          },
        ],
      }),
    });

    // 응답 확인
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from OpenAI:", errorData);
      return res.status(response.status).json({ error: errorData });
    }

    // 응답 데이터 파싱 및 반환
    const responseData = await response.json();
    res.status(200).json(responseData);
  } catch (error) {
    // 에러 처리
    console.error("OpenAI API Response:", error.message);
    res.status(500).json({ error: error.message });
  }
}
