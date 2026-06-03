import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Camera, Check, Loader2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { fmtTRY, uid } from '../lib/format';
import { getRate } from '../lib/fx';
import { fileToAvatar } from '../lib/image';
import { tFixedName } from '../i18n/content';
import type { Gender } from '../types';
import LanguagePicker from './LanguagePicker';

const LAST = 5; // 1=gender · 2=name · 3=salary · 4=bills · 5=gym

export default function Onboarding() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const [step, setStep] = useState(0); // 0 = language picker

  const [gender, setGender] = useState<Gender>(data.settings.gender || 'male');
  const [name, setName] = useState(data.settings.userName || '');
  const [avatar, setAvatar] = useState<string | undefined>(data.settings.userAvatar);
  const [salary, setSalary] = useState(String(data.settings.salaryUSD || 1000));
  const [rate, setRate] = useState<number>(data.settings.exchangeRate || 45.8);
  const [rateLoading, setRateLoading] = useState(true);
  const [bills, setBills] = useState(data.fixedExpenses.map((f) => ({ ...f })));
  const [hasGym, setHasGym] = useState(false);
  const [gymName, setGymName] = useState('');
  const [gymAmount, setGymAmount] = useState('');

  // سعر الصرف يُجلب تلقائياً من API (Frankfurter) — fetch-once-cache-fallback، يرجع للافتراضي إن تعذّر
  useEffect(() => {
    let alive = true;
    getRate().then((d) => {
      if (!alive) return;
      if (d?.rate) setRate(Math.round(d.rate * 100) / 100);
      setRateLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const finish = () => {
    update((d) => {
      d.settings.gender = gender;
      d.settings.userName = name.trim();
      d.settings.userAvatar = avatar;
      d.settings.salaryUSD = Number(salary) || 0;
      d.settings.exchangeRate = rate || 45.8;
      d.fixedExpenses = bills.map((b) => ({
        ...b,
        amountTRY: Number(b.amountTRY) || 0,
        dueDay: b.dueDay || undefined,
      }));
      if (hasGym && Number(gymAmount) > 0) {
        d.fixedExpenses.push({
          id: uid('f'),
          name: gymName.trim() || t('onboarding.gymDefault'),
          emoji: '🏋️',
          amountTRY: Number(gymAmount),
        });
      }
      d.settings.onboardingDone = true;
    });
  };

  const next = () => setStep((s) => Math.min(LAST, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  if (step === 0) return <LanguagePicker onConfirm={() => setStep(1)} />;

  return (
    <div className="fixed inset-0 z-[70] bg-cream overflow-y-auto">
      <div className="max-w-[480px] mx-auto px-5 py-8 safe-top min-h-full flex flex-col">
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
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
            <Step title={t('gender.title')} subtitle="">
              <div className="grid grid-cols-2 gap-3">
                {(['male', 'female'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex flex-col items-center gap-2 py-8 rounded-2xl border-2 transition active:scale-[.98] ${
                      gender === g ? 'bg-green text-white border-green shadow-soft' : 'bg-card border-line text-ink'
                    }`}
                  >
                    <span style={{ fontSize: 48 }}>{g === 'male' ? '👨' : '👩'}</span>
                    <span className="font-black text-lg">{t(`gender.${g}`)}</span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 2 && (
            <Step title={t('onboarding.s1Title')} subtitle={t('onboarding.s1Sub')}>
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
                  <span className="block text-center text-xs font-bold text-green mt-2">
                    {t('onboarding.photoOptional')}
                  </span>
                </label>
              </div>
              <Labeled label={t('onboarding.name')}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field text-center text-lg"
                  placeholder={t('onboarding.namePlaceholder')}
                  autoFocus
                />
              </Labeled>
            </Step>
          )}

          {step === 3 && (
            <Step title={t('onboarding.s2Title')} subtitle={t('onboarding.s2Sub')}>
              <Labeled label={t('onboarding.salaryUSD')}>
                <input type="number" inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} className="field num" />
              </Labeled>
              <div className="flex items-center justify-between mt-1 px-1 text-xs font-bold text-muted">
                <span>💱 {t('onboarding.rateAuto')}</span>
                {rateLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <span className="num text-green">$1 = {rate.toFixed(2)} ₺</span>
                )}
              </div>
              <div className="bg-gold-soft rounded-xl px-3 py-2.5 flex items-center justify-between mt-2">
                <span className="font-bold text-green">{t('onboarding.salaryInTRY')}</span>
                <span className="font-black text-green num">{fmtTRY((Number(salary) || 0) * rate)}</span>
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step title={t('onboarding.s3Title')} subtitle={t('onboarding.s3Sub')}>
              <ul className="space-y-2">
                {bills.map((b, i) => (
                  <li key={b.id} className="bg-card rounded-2xl border border-line p-3 flex items-center gap-2">
                    <span className="text-xl shrink-0">{b.emoji}</span>
                    <span className="flex-1 font-bold text-ink min-w-0 truncate">{tFixedName(b.id, t, b.name)}</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={b.amountTRY || ''}
                      onChange={(e) =>
                        setBills((arr) => arr.map((x, j) => (j === i ? { ...x, amountTRY: Number(e.target.value) || 0 } : x)))
                      }
                      placeholder={t('onboarding.amountShort')}
                      className="w-20 bg-cream/60 border-2 border-line rounded-lg px-2 py-1.5 text-end font-black text-green num focus:border-gold focus:outline-none"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      value={b.dueDay || ''}
                      onChange={(e) =>
                        setBills((arr) => arr.map((x, j) => (j === i ? { ...x, dueDay: Number(e.target.value) || undefined } : x)))
                      }
                      placeholder={t('onboarding.dayShort')}
                      className="w-14 bg-cream/60 border-2 border-line rounded-lg px-2 py-1.5 text-center font-bold text-muted num focus:border-gold focus:outline-none"
                    />
                  </li>
                ))}
              </ul>
            </Step>
          )}

          {step === 5 && (
            <Step title={t('onboarding.s4Title')} subtitle={t('onboarding.s4Sub')}>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setHasGym(true)}
                  className={`py-3 rounded-xl font-black border-2 ${hasGym ? 'bg-green text-white border-green' : 'border-line text-muted'}`}
                >
                  {t('onboarding.yes')}
                </button>
                <button
                  onClick={() => setHasGym(false)}
                  className={`py-3 rounded-xl font-black border-2 ${!hasGym ? 'bg-green text-white border-green' : 'border-line text-muted'}`}
                >
                  {t('onboarding.no')}
                </button>
              </div>
              {hasGym && (
                <>
                  <Labeled label={t('onboarding.gymName')}>
                    <input value={gymName} onChange={(e) => setGymName(e.target.value)} placeholder={t('onboarding.gymDefault')} className="field" />
                  </Labeled>
                  <Labeled label={t('onboarding.gymFee')}>
                    <input type="number" inputMode="numeric" value={gymAmount} onChange={(e) => setGymAmount(e.target.value)} className="field num" placeholder="800" />
                  </Labeled>
                  <p className="text-xs text-muted font-bold">{t('onboarding.gymNote')}</p>
                </>
              )}
            </Step>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          {step > 1 && (
            <button onClick={back} className="btn-ghost flex items-center gap-1">
              <ChevronRight size={18} className="rtl:rotate-0 ltr:rotate-180" /> {t('common.back')}
            </button>
          )}
          {step < LAST ? (
            <button onClick={next} className="btn-primary flex-1 flex items-center justify-center gap-1">
              {t('common.next')} <ChevronLeft size={18} className="rtl:rotate-0 ltr:rotate-180" />
            </button>
          ) : (
            <button onClick={finish} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Check size={18} /> {t('common.start')}
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
