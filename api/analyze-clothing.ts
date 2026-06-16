import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key missing' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Analyze this clothing item photo. Return a JSON object with: name (short descriptive name in English, e.g. "White Oxford Shirt"), type (exactly one of: top, bottom, layer, shoes, accessory), color (main color in English, e.g. "Navy Blue").',
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg',
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'Short descriptive name of the clothing item',
            },
            type: {
              type: Type.STRING,
              description: 'One of: top, bottom, layer, shoes, accessory',
            },
            color: {
              type: Type.STRING,
              description: 'Primary color of the item',
            },
          },
          required: ['name', 'type', 'color'],
        },
      },
    });

    const text = response.text ?? '';
    if (!text) throw new Error('Empty response from AI');

    const parsed = JSON.parse(text);
    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Error analyzing clothing:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze clothing item' });
  }
}
