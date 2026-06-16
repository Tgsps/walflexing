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

    // Step 1: analyze the clothing item
    const analyzeRes = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Analyze this clothing item photo. Return JSON with: name (short descriptive English name, e.g. "White Oxford Shirt"), type (exactly one of: top, bottom, layer, shoes, accessory), color (primary color in English, e.g. "Navy Blue").',
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
            type: { type: Type.STRING },
            color: { type: Type.STRING },
          },
          required: ['name', 'type', 'color'],
        },
      },
    });

    const analysisText = analyzeRes.text ?? '';
    if (!analysisText) throw new Error('Empty analysis response');
    const analysis = JSON.parse(analysisText) as { name: string; type: string; color: string };

    // Step 2: generate clean white-background product image
    let generatedImage: string | null = null;
    try {
      const imgRes = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `Professional product photo of a ${analysis.color} ${analysis.name}, isolated on pure white background, clean studio lighting, high quality fashion photography, no people, no mannequin, no shadows`,
        config: {
          numberOfImages: 1,
          aspectRatio: '1:1',
        },
      });
      const imageBytes = (imgRes as any).generatedImages?.[0]?.image?.imageBytes;
      if (imageBytes) {
        generatedImage = `data:image/png;base64,${imageBytes}`;
      }
    } catch (imgErr) {
      console.warn('Image generation failed, saving without image:', imgErr);
    }

    return res.status(200).json({ ...analysis, generatedImage });
  } catch (error: any) {
    console.error('Error analyzing clothing:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze clothing item' });
  }
}
