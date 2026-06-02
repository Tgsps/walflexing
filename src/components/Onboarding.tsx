import { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera, Check } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { fmtTRY, uid } from '../lib/format';
import { fileToAvatar } from '../lib/image';
import LanguagePicker from './LanguagePicker';

export default function Onboarding() {
  const { data, update } = useApp();
  const [step, setStep] = useState(0); // 0 = اختيار اللغة

  const [name, setName] = useState(data.settings.userName || '');
  const [avatar, setAvatar] = useState<string | undefined>(data.settings.userAvatar);
  const [salary, setSalary] = useState(String(data.settings.salaryUSD || 1000));
  const [rate, setRate] = useState(String(data.settings.exchangeRate || 45.8));
  const [bills, setBills] = useState(
    data.fixedExpenses.map((f) => ({ ...f })),
  );
  const [hasGym, setHasGym] = useState(false);
  const [gymName, setGymName] = useState('اشتراك الجيم');
  const [gymAmount, setGymAmount] = useState('');

  const finish = () => {
    update((d) => {
      d.settings.userName = name.trim() || 'صديقي';
      d.settings.userAvatar = avatar;
      d.settings.salaryUSD = Number(salary) || 0;
      d.settings.exchangeRate = Number(rate) || 45.8;
      d.fixedExpenses = bills.map((b) => ({
        ...b,
        amountTRY: Number(b.amountTRY) || 0,
        dueDay: b.dueDay || undefined,
      }));
      if (hasGym && Number(gymAmount) > 0) {
        d.fixedExpenses.push({
          id: uid('f'),
          name: gymName.trim() || 'الجيم',
          emoji: '🏋️',
          amountTRY: Number(gymAmount),
        });
      }
      d.settings.onboardingDone = true;
    });
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  if (step === 0) return <LanguagePicker onConfirm={() => setStep(1)} />;

  return (
    <div className="fixed inset-0 z-[70] bg-cream overflow-y-auto">
      <div className="max-w-[480px] mx-auto px-5 py-8 safe-top min-h-full flex flex-col">
        {/* مؤشّر الخطوات */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-green' : i < step ? 'w-2 bg-green' : 'w-2 bg-line'
              }`}
            />
          ))}
        </div>

        <div className="flex-1">
          {step === 1 && (
            <Step title="مرحباً فيك! 👋" subtitle="خلّينا نتعرّف عليك">
              <div className="flex flex-col items-center gap-3 mb-4">
                <label className="cursor-pointer">
                  <div className="w-28 h-28 rounded-full bg-green text-white grid place-items-center text-4xl font-black overflow-hidden border-4 border-gold">
                    {avatar ? (
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    ) : name ? (
                      name.trim().charAt(0)
                    ) : (
                      <Camera size={32} />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) setAvatar(await fileToAvatar(f));
                    }}
                  />
                  <span className="block text-center text-xs font-bold text-green mt-2">صورة (اختياري)</span>
                </label>
              </div>
              <Labeled label="اسمك">
                <input value={name} onChange={(e) => setName(e.target.value)} className="field text-center text-lg" placeholder="اكتب اسمك" autoFocus />
              </Labeled>
            </Step>
          )}

          {step === 2 && (
            <Step title="راتبك 💰" subtitle="عشان نحسب ميزانيتك">
              <Labeled label="الراتب الشهري بالدولار ($)">
                <input type="number" inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} className="field num" />
              </Labeled>
              <Labeled label="سعر الصرف (₺ مقابل 1$)">
                <input type="number" inputMode="decimal" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="field num" />
              </Labeled>
              <div className="bg-gold-soft rounded-xl px-3 py-2.5 flex items-center justify-between mt-2">
                <span className="font-bold text-green">راتبك بالليرة</span>
                <span className="font-black text-green num">{fmtTRY((Number(salary) || 0) * (Number(rate) || 0))}</span>
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step title="الإيجار والفواتير 🏠" subtitle="المبلغ بالليرة + يوم الاستحقاق (اختياري)">
              <ul className="space-y-2">
                {bills.map((b, i) => (
                  <li key={b.id} className="bg-card rounded-2xl border border-line p-3 flex items-center gap-2">
                    <span className="text-xl shrink-0">{b.emoji}</span>
                    <span className="flex-1 font-bold text-ink min-w-0 truncate">{b.name}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={b.amountTRY || ''}
                      onChange={(e) =>
                        setBills((arr) => arr.map((x, j) => (j === i ? { ...x, amountTRY: Number(e.target.value) || 0 } : x)))
                      }
                      placeholder="₺"
                      className="w-20 bg-cream/60 border-2 border-line rounded-lg px-2 py-1.5 text-left font-black text-green num focus:border-gold focus:outline-none"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      value={b.dueDay || ''}
                      onChange={(e) =>
                        setBills((arr) => arr.map((x, j) => (j === i ? { ...x, dueDay: Number(e.target.value) || undefined } : x)))
                      }
                      placeholder="يوم"
                      className="w-14 bg-cream/60 border-2 border-line rounded-lg px-2 py-1.5 text-center font-bold text-muted num focus:border-gold focus:outline-none"
                    />
                  </li>
                ))}
              </ul>
            </Step>
          )}

          {step === 4 && (
            <Step title="الجيم 🏋️" subtitle="عندك اشتراك جيم؟">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setHasGym(true)}
                  className={`py-3 rounded-xl font-black border-2 ${hasGym ? 'bg-green text-white border-green' : 'border-line text-muted'}`}
                >
                  نعم 💪
                </button>
                <button
                  onClick={() => setHasGym(false)}
                  className={`py-3 rounded-xl font-black border-2 ${!hasGym ? 'bg-green text-white border-green' : 'border-line text-muted'}`}
                >
                  لا
                </button>
              </div>
              {hasGym && (
                <>
                  <Labeled label="اسم الجيم">
                    <input value={gymName} onChange={(e) => setGymName(e.target.value)} className="field" />
                  </Labeled>
                  <Labeled label="الاشتراك الشهري (₺)">
                    <input type="number" inputMode="numeric" value={gymAmount} onChange={(e) => setGymAmount(e.target.value)} className="field num" placeholder="مثلاً 800" />
                  </Labeled>
                  <p className="text-xs text-muted font-bold">بيضاف تلقائياً لمصاريفك الثابتة.</p>
                </>
              )}
            </Step>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex gap-2 mt-6">
          {step > 1 && (
            <button onClick={back} className="btn-ghost flex items-center gap-1">
              <ChevronRight size={18} /> رجوع
            </button>
          )}
          {step < 4 ? (
            <button onClick={next} className="btn-primary flex-1 flex items-center justify-center gap-1">
              التالي <ChevronLeft size={18} />
            </button>
          ) : (
            <button onClick={finish} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Check size={18} /> ابدأ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="animate-slideup">
      <h1 className="text-3xl font-black text-green mb-1">{title}</h1>
      <p className="text-muted font-bold mb-5">{subtitle}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
