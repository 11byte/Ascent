import { GoogleGenAI } from "@google/genai";

export const trackerService = {
  async predictUserDomain(
    aggregatedTelemetry: any,
    apiKey: string | undefined,
  ) {
    // Initialize using your existing dynamic key pattern
    const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

    const systemInstruction = `
      You are an expert Behavioral Data Scientist and Career Assessor.
      Your task is to analyze raw telemetry data from Gamified Cognitive Assessments and predict the user's true technical domain aptitude.

      The possible domains are: "WebDev", "Cybersecurity", "AIML", and "DataScience".

      How to interpret the metrics:
      - speed_sec / avg_reaction_sec: Lower is better (faster cognitive processing).
      - accuracy_pct: Higher is better (up to 100).
      - misclicks / total_attempts: Lower is better.
      - undos_hesitations: Higher means lower confidence in that specific task.
      - choice_pattern: Positive numbers mean the user inherently likes tasks in that domain; negative means they dislike them.

      Analyze the JSON payload. Weigh their gut instincts (choice_pattern) against their actual performance (accuracy and speed). 
      
      Since this is Phase 1 of the assessment, you MUST eliminate the weakest domain and shortlist the top 3 domains.
      
      You MUST return a STRICT JSON object using this exact structure:
      {
        "phase": 1,
        "eliminated_domain": "string (The 1 domain they are worst at)",
        "shortlisted_domains": [
          {
            "rank": 1,
            "domain": "string (Top Domain Name)",
            "confidence_score": number (0-100),
            "reasoning": "string (Why they are best suited here based on metrics)"
          },
          {
            "rank": 2,
            "domain": "string (Second Best Domain)",
            "confidence_score": number (0-100),
            "reasoning": "string (Why this is a strong alternate)"
          },
          {
            "rank": 3,
            "domain": "string (Third Best Domain)",
            "confidence_score": number (0-100),
            "reasoning": "string (Why this made the cut, but just barely)"
          }
        ],
        "overall_analysis": "string (A brief 2-sentence summary of their cognitive profile)"
      }
    `;

    const humanPrompt = JSON.stringify(aggregatedTelemetry);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Flash is perfect for fast JSON data parsing
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2, // Low temp for analytical consistency
          responseMimeType: "application/json", // Native JSON enforcement in the new SDK
        },
        contents: [{ role: "user", parts: [{ text: humanPrompt }] }],
      });

      const text = response.text;
      if (!text) throw new Error("AI returned empty response.");

      // Since responseMimeType is set, text is guaranteed to be parsable JSON
      return JSON.parse(text);
    } catch (error) {
      console.error("Tracker AI Prediction Error:", error);
      throw error;
    }
  },
};
