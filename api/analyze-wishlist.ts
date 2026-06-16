import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key missing' });

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Step 1: extract item details from the photo (item + price tag)
    const analyzeRes = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are analyzing a store photo that may show a clothing item, its price tag, or label.
Extract the following information and return as JSON:
- name: item name (e.g. "Slim Fit Chino Pants"). If brand is visible, include it like "Zara Slim Chino".
- brand: brand/store name (e.g. "Zara", "H&M", "Nike"). Use "—" if not visible.
- priceTRY: price as a number in Turkish Lira. If the price is in another currency convert it roughly (1 USD ≈ 38 TRY). Return 0 if not found.
- size: clothing size (e.g. "M", "L", "32", "42"). Return null if not visible.
- type: one of: top, bottom, layer, shoes, accessory.`,
            },
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            brand: { type: Type.STRING },
            priceTRY: { type: Type.NUMBER },
            size: { type: Type.STRING },
            type: { type: Type.STRING },
          },
          required: ['name', 'brand', 'priceTRY', 'type'],
        },
      },
    });

    const analysisText = analyzeRes.text ?? '';
    if (!analysisText) throw new Error('Empty analysis response');
    const analysis = JSON.parse(analysisText) as {
      name: string;
      brand: string;
      priceTRY: number;
      size?: string;
      type: string;
    };

    // Step 2: generate clean white-background product image
    let generatedImage: string | null = null;
    try {
      const imgRes = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `Professional product photo of ${analysis.name}, isolated on pure white background, clean studio lighting, high quality fashion photography, no people, no mannequin, no shadows, no price tag`,
        config: { numberOfImages: 1, aspectRatio: '1:1' },
      });
      const imageBytes = (imgRes as any).generatedImages?.[0]?.image?.imageBytes;
      if (imageBytes) {
        generatedImage = `data:image/png;base64,${imageBytes}`;
      }
    } catch (imgErr) {
      console.warn('Image generation failed, continuing without image:', imgErr);
    }

    return res.status(200).json({ ...analysis, generatedImage });
  } catch (error: any) {
    console.error('Error analyzing wishlist item:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze item' });
  }
}
