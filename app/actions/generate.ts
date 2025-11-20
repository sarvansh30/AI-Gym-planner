"use server";

import { GoogleGenAI } from "@google/genai";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { UserProfile } from "@/lib/schemas";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. CORE PLAN GENERATOR (FIXED PROMPT)
export async function generatePlanAction(userData: UserProfile) {
  console.log("Generating core plan for:", userData.name);

  try {

    const systemInstruction = `
      You are an elite Fitness Coach & Nutritionist.
      Generate a strictly valid JSON response containing a 'workoutPlan' and 'dietPlan' based on the user's profile.
      
      CRITICAL OUTPUT STRUCTURE:
      You must return a JSON object with EXACTLY this structure:
      {
        "workoutPlan": [
          { 
            "day": "Monday", 
            "focus": "Push Day", 
            "exercises": [
              { "name": "Bench Press", "sets": 3, "reps": "10-12", "rest": "60s", "notes": "Focus on chest" }
            ] 
          }
        ],
        "dietPlan": {
          "breakfast": { "name": "Oats", "calories": "400 kcal", "ingredients": ["Oats", "Milk"], "macros": "20g Protein" },
          "lunch": { "name": "Chicken Salad", "calories": "600 kcal", "ingredients": ["Chicken", "Lettuce"], "macros": "40g Protein" },
          "dinner": { "name": "Fish", "calories": "500 kcal", "ingredients": ["Fish", "Rice"], "macros": "30g Protein" },
          "snacks": [
            { "name": "Apple", "calories": "100 kcal", "ingredients": ["Apple"], "macros": "20g Carbs" }
          ]
        }
      }
      
      Do NOT include motivation or tips in this response. Output JSON only.
    `;

    const prompt = `
      User Profile: ${JSON.stringify(userData)}
      
      Requirements:
      1. Workout: Detailed sets, reps, and rest times tailored to their goal (${userData.goal}).
      2. Diet: Specific meals with macros tailored to their dietary preference (${userData.dietaryPreference}).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from AI");

    const plan = JSON.parse(text);
    return { success: true, data: plan };

  } catch (error) {
    console.error("Plan Gen Error:", error);
    return { success: false, error: "Failed to generate plan" };
  }
}


// 2. MOTIVATION GENERATOR (Independent)
export async function generateMotivationAction(userName: string, goal: string) {
  try {
    const timestamp = new Date().toISOString(); 
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: `
        Context: Time is ${timestamp}.
        Task: Generate a JSON object with two keys:
        1. "quote": A creative, short, punchy motivational quote for ${goal}. (Do not repeat generic quotes).
        2. "tips": An array of 3 very specific, actionable habits for ${userName} to do right now.
        
        Make it sound like a tough but loving coach.
      `,
    });

    const text = response.text;
    return { success: true, data: JSON.parse(text!) };
  } catch (error) {
    console.error("Motivation Error:", error);
    // Return fallback data
    return { 
      success: false, 
      data: { 
        quote: "Consistency is the key to everything.", 
        tips: ["Drink water now", "Fix your posture", "Take a deep breath"] 
      } 
    };
  }
}


// 3. IMAGE GENERATOR (With Fallback)
export async function generateImageAction(description: string, type: "workout" | "food") {
  try {
    const context = type === "workout" 
      ? "gym workout, fitness, high quality, 4k, athletic person doing" 
      : "gourmet food, delicious, michelin star, 8k, professional photography of";
    
    const prompt = `${context} ${description}`;

    // ATTEMPT 1: Google Gemini (High Quality)
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
      });

      // FIX: Access parts through candidates array to satisfy TypeScript
      const candidates = response.candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                return { 
                    success: true, 
                    image: `data:image/png;base64,${part.inlineData.data}` 
                };
            }
        }
      }
    } catch (geminiError: any) {
       console.warn("Gemini Image Gen Failed (Quota or Error). Switching to fallback.", geminiError.message);
    }

    // ATTEMPT 2: Pollinations AI (Free Fallback)
    const encodedPrompt = encodeURIComponent(prompt);
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true`;
    
    return { success: true, image: fallbackUrl };

  } catch (error) {
    console.error("Fatal Image Gen Error:", error);
    return { success: false, error: "Failed to generate image" };
  }
}


// 4. TEXT TO SPEECH (ElevenLabs)

export async function generateSpeechAction(text: string) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error("Missing ElevenLabs API Key");
    }

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audioStream = await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
      outputFormat: "mp3_44100_128",
      text: text,
      modelId: "eleven_multilingual_v2",
    });

    const chunks: any = [];
    
    for await (const chunk of (audioStream as any)) {
      chunks.push(Buffer.from(chunk));
    }
    
    const buffer = Buffer.concat(chunks);
    const base64Audio = buffer.toString("base64");

    return { success: true, audio: `data:audio/mp3;base64,${base64Audio}` };

  } catch (error) {
    console.error("TTS Error:", error);
    return { success: false, error: "Failed to generate speech" };
  }
}