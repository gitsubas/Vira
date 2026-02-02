// Using global fetch (Node 18+)
require('dotenv').config({ path: '.env' });

async function listModels() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found in .env');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        // Use built-in fetch if available (Node 18+)
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log('No models found or error:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

listModels();
