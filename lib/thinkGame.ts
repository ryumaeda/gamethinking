import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY });

const thinkGame = async (content: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content }],
      temperature: 0.7,
    });
    const messageContent = response.choices[0].message.content;
    return messageContent;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
  }
};

export default thinkGame;
