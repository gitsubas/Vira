// lib/gemini.ts - Gemini API Client Configuration
// Initializes the Google Generative AI SDK

import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

// API Key from environment variables
// In production, use expo-secure-store or a backend proxy
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  Constants.expoConfig?.extra?.geminiApiKey ||
  'YOUR_API_KEY_HERE'; // Fallback for development

// Initialize the Gemini client
export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Model configuration - use gemini-2.0-flash-lite for multimodal analysis
export const MODEL_NAME = 'gemini-2.0-flash-lite';

// Get the generative model instance
export function getModel() {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json', // Force JSON output
    },
  });
}

// System prompt for viral content analysis
export const ANALYSIS_SYSTEM_PROMPT = `You are Viro, an expert viral content strategist specializing in TikTok, Instagram Reels, and YouTube Shorts.

Analyze the provided media content and return a JSON object with the following structure:
{
  "score": <number 0-100>,
  "viralPotential": "<Low|Moderate|High|Viral>",
  "hookStrength": "<Weak|Average|Strong>",
  "pacing": "<string describing pacing quality>",
  "keywords": [<array of relevant topic keywords>],
  "improvements": [<array of actionable improvement suggestions>],
  "seo": {
    "titles": [<3 catchy title suggestions>],
    "caption": "<ready-to-use engaging caption>",
    "hashtags": [<10-15 relevant hashtags without #>],
    "filename": "<SEO-friendly filename suggestion>"
  }
}

Be critical but constructive. Focus on:
- First 3 seconds hook effectiveness
- Pacing and viewer retention
- Audio/visual quality
- Trend alignment
- Call-to-action presence

Return ONLY valid JSON, no markdown formatting.`;
