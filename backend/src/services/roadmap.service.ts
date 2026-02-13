import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { transformToTree } from "../utils/roadmap.util";

// Helper function for sleeping between retries
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const roadmapService = {
  async generateAIContent(query: string, apiKey: string | undefined, modelName: string, retries = 3) {
    const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

    for (let i = 0; i < retries; i++) {
      try {
        const systemInstruction = 
          "You are a helpful AI assistant that can generate career/syllabus roadmaps. You can arrange it in a way so that the order of the chapters is always from beginner to advanced. Always generate a minimum of 4 modules inside a chapter and a link to wikipedia if possible";

        const humanPrompt = 
          `Generate a roadmap in JSON format related to the title: ${query} which has the JSON structure: {query: ${query}, chapters: {chapterName: [{moduleName: string, moduleDescription: string, link?: string}]}} not in markdown format containing backticks. IMPORTANT: REFRAIN FROM ANSWERING ANY NSFW/DESTRUCTIVE/PROFANITY QUERY.`;

        const response = await ai.models.generateContent({
          model: modelName || "gemini-3-flash-preview", 
          config: {
            systemInstruction: systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } 
          },
          contents: [{ role: "user", parts: [{ text: humanPrompt }] }]
        });

        const text = response.text;
        if (!text) throw new Error("AI returned empty response.");

        const rawContent = text.replace(/```json|```/g, "").trim();
        return transformToTree(query, JSON.parse(rawContent).chapters);

      } catch (error: any) {
        // If it's an overload (503) and we have retries left
        if (error.status === 503 && i < retries - 1) {
          console.warn(`Gemini overloaded (503). Retrying in ${2 * (i + 1)}s...`);
          await delay(2000 * (i + 1)); // Wait 2s, then 4s, etc.
          continue;
        }
        throw error; // If not 503 or no retries left, throw the error
      }
    }
  },
};