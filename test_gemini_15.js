const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env' });

async function listModels() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    // Using direct fetch to avoid SDK complexity for simple listing
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Available Models:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
