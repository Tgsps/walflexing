import React, { useState } from 'react';
import { Camera, Download, Trash2, Receipt, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import { useApp } from '../state/AppContext';
import { compressImage } from '../lib/image';
import { parseReceiptImage } from '../lib/gemini';
import { uid } from '../lib/format';
import type { ReceiptData, VariableCategory } from '../types';

const CATEGORY_MAP: Record<string, VariableCategory> = {
  'Food/Restaurants': 'readyFood',
  'Shopping': 'shopping',
  'Entertainment': 'entertainment',
  'Supplies': 'shopping',
  'Clothing': 'shopping',
  'Home Bills': 'unexpected',
  'Other': 'unexpected',
};

export default function ReceiptScanner() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedExpense, setAddedExpense] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsScanning(true);
      setError(null);
      const base64Image = await compressImage(file);
      const result = await parseReceiptImage(base64Image);

      const newReceipt: ReceiptData = {
        ...result,
        id: uid('r'),
        scannedAt: Date.now(),
      };

      const category = CATEGORY_MAP[result.category || ''] ?? 'unexpected';
      const rate = data.settings.exchangeRate;
      let amountTRY = result.total ?? 0;
      if (result.currency === 'USD') amountTRY = amountTRY * rate;

      update((d) => {
        d.receipts = [newReceipt, ...d.receipts];
        d.variableExpenses.unshift({
          id: uid('e'),
          category,
          amountTRY,
          date: new Date().toISOString(),
          note: result.storeName,
        });
      });

      setAddedExpense(category);
      setTimeout(() => setAddedExpense(null), 3000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء معالجة الفاتورة.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportCSV = () => {
    if (!data.receipts || data.receipts.length === 0) return;
    const headers = ['Date', 'Store', 'Category', 'Tax', 'Total', 'Currency', 'Summary'];
    const csvContent = [
      headers.join(','),
      ...data.receipts.map((h) => [
        h.date || 'N/A',
        `"${h.storeName || ''}"`,
        h.category || 'Other',
        h.tax || 0,
        h.total || 0,
        h.currency || 'USD',
        `"${(h.summary || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const receipts = data.receipts || [];

  return (
    <div>
      <ScreenHeader emoji="🧾" title="مسح الفواتير" subtitle="قراءة الفواتير باستخدام الذكاء الاصطناعي" />
      
      <Card className="mb-4">
        <label className={`btn-primary w-full flex items-center justify-center gap-2 cursor-pointer ${isScanning ? 'opacity-70 pointer-events-none' : ''}`}>
          <Camera size={18} /> {isScanning ? 'جاري التحليل...' : 'تصوير أو اختيار فاتورة'}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} disabled={isScanning} />
        </label>
        {error && <div className="text-sm font-bold text-danger mt-3 text-center bg-danger/10 p-2 rounded-xl border border-danger/30">{error}</div>}
        {addedExpense && (
          <div className="flex items-center gap-2 mt-3 bg-green/10 border border-green/30 rounded-xl px-3 py-2.5 animate-pop">
            <CheckCircle2 size={16} className="text-green shrink-0" />
            <span className="text-sm font-bold text-green">Added to expenses as <span className="capitalize">{addedExpense}</span></span>
          </div>
        )}
      </Card>

      {receipts.length > 0 && (
        <div className="flex justify-between items-center mb-2 px-1">
          <h2 className="font-black text-green">السجل</h2>
          <button onClick={handleExportCSV} className="text-green flex items-center gap-1 text-sm font-bold bg-green/10 px-3 py-1 rounded-full active:scale-95 transition">
            <Download size={14} /> تصدير CSV
          </button>
        </div>
      )}

      <ul className="space-y-3">
        {receipts.map((r) => (
          <li key={r.id} className="bg-card rounded-2xl border border-line p-3 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-2">
                <h3 className="font-black text-ink text-lg leading-tight mb-0.5">{r.storeName}</h3>
                <p className="text-xs text-muted font-bold flex gap-1 items-center">
                  <Receipt size={12}/> {r.date || 'تاريخ غير محدد'} · {r.category || 'أخرى'}
                </p>
              </div>
              <div className="text-end shrink-0">
                <div className="font-black text-green num text-lg">{r.total} <span className="text-xs text-muted">{r.currency}</span></div>
                <button
                  onClick={() => {
                    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
                      update(d => { d.receipts = d.receipts.filter(x => x.id !== r.id) });
                    }
                  }}
                  className="text-danger mt-1 p-1 bg-danger/10 rounded-lg active:scale-95 transition inline-block"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {r.summary && <p className="text-sm text-ink mb-3 font-bold">{r.summary}</p>}
            
            {r.items && r.items.length > 0 && (
              <div className="bg-cream/50 rounded-xl p-2 text-xs border border-line">
                {r.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-line/50 last:border-0 py-1.5">
                    <span className="font-bold text-muted flex-1 pl-2">{item.quantity}x {item.name}</span>
                    <span className="font-black text-ink num shrink-0">{item.price}</span>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
        {receipts.length === 0 && (
          <div className="text-center py-8">
            <Receipt size={32} className="mx-auto text-line mb-2" />
            <p className="text-sm text-muted font-bold">لا توجد فواتير ممسوحة بعد.</p>
          </div>
        )}
      </ul>
    </div>
  );
}
