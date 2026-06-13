import type { ReceiptData } from '../types';

export async function parseReceiptImage(base64Image: string): Promise<Omit<ReceiptData, 'id' | 'scannedAt'>> {
  const response = await fetch('/api/parse-receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64Image }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.error || 'Failed to parse receipt from the image. Please try again.');
  }

  const parsedData = await response.json() as Omit<ReceiptData, 'id' | 'scannedAt'>;
  return parsedData;
}
