// Force valid key in DEV mode to bypass stale env vars. Env var used in PROD.
const defaultKey = import.meta.env.DEV ? "AIzaSyBEq2HBFcSAjrmQdMX3tQugsLUrr4rrqLE" : import.meta.env.VITE_GEMINI_API_KEY;

export async function callGemini(prompt, apiKeyOverride = null) {
    const keyToUse = apiKeyOverride || defaultKey;
    try {
        // Using gemini-2.0-flash as verified by model list
        const model = 'gemini-2.0-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keyToUse}`;
        console.log("Calling Gemini API:", url); // Debug log

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Request Failed:", response.status, errorText);
            return null;
        }

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return null;
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}
