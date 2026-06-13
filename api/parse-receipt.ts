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
      return res.status(500).json({ error: 'Server configuration error: Gemini API key missing' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Analyze this receipt and extract the items, total, date, store name, category, tax, and currency. Return a structured JSON object." },
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg'
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storeName: { type: Type.STRING },
            date: { type: Type.STRING, description: "Format YYYY-MM-DD. Return null if missing." },
            category: { 
              type: Type.STRING, 
              description: "MUST be one of: 'Food/Restaurants', 'Shopping', 'Entertainment', 'Supplies', 'Clothing', 'Home Bills', 'Other'." 
            },
            currency: { type: Type.STRING, description: "3-letter ISO 4217 code (e.g., USD)." },
            tax: { type: Type.NUMBER, description: "Total tax/VAT. Null if not found." },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  quantity: { type: Type.NUMBER }
                },
                required: ["name", "price", "quantity"]
              }
            },
            total: { type: Type.NUMBER },
            summary: { type: Type.STRING, description: "Short 1-sentence summary of the receipt." }
          },
          required: ["storeName", "items", "summary"]
        }
      }
    });

    const text = response.text ? response.text() : '';
    if (!text) {
      throw new Error('Empty response from GenAI');
    }

    const parsedData = JSON.parse(text);

    return res.status(200).json(parsedData);

  } catch (error: any) {
    console.error('Error parsing receipt:', error);
    return res.status(500).json({ error: error.message || 'Failed to process receipt' });
  }
}
