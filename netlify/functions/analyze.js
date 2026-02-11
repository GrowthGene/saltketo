import { GoogleGenerativeAI } from '@google/generative-ai';

export default async (req) => {
    // CORS Headers for local development
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Handle Preflight Options
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers });
    }

    try {
        // 1. Check API Key
        const API_KEY = Netlify.env.get('GEMINI_API_KEY') || process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return new Response(JSON.stringify({
                error: "API Key Not Found",
                details: "Netlify 설정에서 GEMINI_API_KEY를 추가해주세요."
            }), { status: 500, headers });
        }

        // 2. Parse Request
        const { image, prompt } = await req.json();
        if (!image) {
            return new Response(JSON.stringify({ error: "No image provided" }), { status: 400, headers });
        }

        // 3. Initialize Gemini
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 4. Generate Content
        // Image comes as base64 string (data:image/jpeg;base64,...)
        // We need to strip the prefix
        const base64Data = image.split(',')[1];

        const result = await model.generateContent([
            prompt || "Analyze this food. Return valid JSON only.",
            { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);

        const responseText = result.response.text();

        // 5. Clean and Parse JSON
        // Gemini sometimes adds ```json ... ``` fences
        const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        return new Response(JSON.stringify(data), { status: 200, headers });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return new Response(JSON.stringify({
            error: "Analysis Failed",
            details: error.message
        }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/analyze"
};
