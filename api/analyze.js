export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { image } = req.body;
    const API_KEY = process.env.GEMINI_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key is missing in Vercel settings.' });
    }

    const systemPrompt = `
        You are GLOMAXER Biometric AI. 
        Analyze the uploaded portrait for these 6 aesthetic biometric categories.
        You must return ONLY a strict JSON object with this exact format:
        {
          "stats": {
            "hairline": number (0-100),
            "skin": number (0-100),
            "masculinity": number (0-100),
            "jawline": number (0-100),
            "eyes": number (0-100),
            "cheekbones": number (0-100)
          },
          "overall_score": number (0-100, average of the stats),
          "glowup_tips": ["tip1", "tip2", "tip3"]
        }
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: systemPrompt },
                        { inline_data: { mime_type: "image/jpeg", data: image } }
                    ]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const aiText = data.candidates[0].content.parts[0].text;
        const cleanJson = aiText.replace(/```json|```/g, "").trim();
        
        res.status(200).json(JSON.parse(cleanJson));

    } catch (error) {
        res.status(500).json({ error: "The AI is processing another biometric scan. Try again in 60s." });
    }
}
