const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export async function callGemini(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

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
