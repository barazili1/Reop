import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartDescription = async (inputContext: string): Promise<string> => {
  if (!inputContext.trim()) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an IT security administrator. 
      Transform the following rough user input into a professional, concise technical description for an API Key.
      Do not include quotes. Keep it under 15 words.
      
      User Input: "${inputContext}"`,
    });

    return response.text?.trim() || inputContext;
  } catch (error) {
    console.error("Failed to generate smart description", error);
    return inputContext;
  }
};
