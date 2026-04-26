 This is a Vercel Serverless Function
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { image } = req.body;
    const API_KEY = process.env.GEMINI_KEY;  This is hidden in Vercel settings

    try {
        const response = await fetch(`httpsgenerativelanguage.googleapis.comv1betamodelsgemini-1.5-flashgenerateContentkey=${API_KEY}`, {
            method 'POST',
            headers { 'Content-Type' 'applicationjson' },
            body JSON.stringify({
                contents [{
                    parts [
                        { text Analyze face. Return JSON {overallnum, potentialnum, tips[str,str,str]} },
                        { inline_data { mime_type imagejpeg, data image } }
                    ]
                }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text.replace(```json```g, ).trim();
        res.status(200).json(JSON.parse(aiText));

    } catch (error) {
        res.status(500).json({ error AI Limit Reached. Try again in 1 min. });
    }
}