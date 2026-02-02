const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env' });

async function testMetadataGeneration() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    // Testing the model currently set in gemini.ts
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `Generate optimized SEO metadata for TikTok, Instagram Reels, and YouTube Shorts based on the user's topic.
Return a JSON object with this EXACT structure:
{
  "seo": {
    "platforms": {
      "tiktok": {
        "title": "<Catchy, viral hook title>",
        "description": "<Short, trend-focused description with keywords>",
        "tags": [<5-7 trending hashtags>]
      },
      "instagram": {
        "title": "<Aesthetic/Engaging title>",
        "description": "<Longer, value-driven caption with spacing>",
        "tags": [<10-15 mixed niche/broad hashtags>]
      },
      "youtube": {
        "title": "<Search-optimized clickbait-style title>",
        "description": "<Detailed description with keywords + Call to Action>",
        "tags": [<10-15 keyword-rich tags for SEO>]
      }
    }
  }
}

Topic: Summer Roadtrip`;

    try {
        console.log('Generating metadata...');
        const result = await model.generateContent(prompt);
        console.log('Success!');
        console.log(result.response.text());
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testMetadataGeneration();
