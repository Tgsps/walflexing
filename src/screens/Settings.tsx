import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Info,
  Smartphone,
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
  Lock,
  Fingerprint,
  Pill,
  Camera,
  Moon as MoonIcon,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { fmtTRY, fmtUSD, toUSD, uid, todayISODate } from '../lib/format';
import { isValidImport } from '../lib/storage';
import { sha256 } from '../lib/crypto';
import {
  biometricAvailable,
  hasBiometricCredential,
  registerBiometric,
  clearBiometric,
} from '../lib/biometric';
import type { AppData, ThemeMode } from '../types';

export default function Settings() {
  const { data, update, replace, resetForNewMonth, resetAll } = useApp();
  const rate = data.settings.exchangeRate;
  const salaryTRY = data.settings.salaryUSD * rate;
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const flash = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 2500);
  };

  // ---- export / import
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bachelor-istanbul-${todayISODate()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash('تم تصدير نسخة احتياطية ✅');
  };

  const onImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!isValidImport(parsed)) {
        flash('الملف غير صالح ❌');
        return;
      }
      replace(parsed as AppData);
      flash('تم استيراد البيانات ✅');
    } catch {
      flash('تعذّر قراءة الملف ❌');
    }
  };

  return (
    <div>
      <ScreenHeader emoji="⚙️" title="الإعدادات" subtitle="الراتب، سعر الصرف، الأسعار، والبيانات" />

      {msg && (
        <div className="mb-3 rounded-xl bg-green text-white px-4 py-2.5 font-bold text-sm text-center animate-pop">
          {msg}
        </div>
      )}

      <ProfileCard />
      <ThemeCard />
      <SecurityCard />

      {/* الراتب وسعر الصرف */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-3">💰 الراتب وسعر الصرف</h2>
        <label className="block mb-3">
          <span className="text-sm font-bold text-muted">الراتب الشهري بالدولار ($)</span>
          <input
            type="number"
            inputMode="decimal"
            value={data.settings.salaryUSD || ''}
            onChange={(e) =>
              update((d) => {
                d.settings.salaryUSD = Number(e.target.value) || 0;
              })
            }
            className="field mt-1 num"
            placeholder="1000"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-muted">سعر الصرف (₺ مقابل 1$)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={data.settings.exchangeRate || ''}
            onChange={(e) =>
              update((d) => {
                d.settings.exchangeRate = Number(e.target.value) || 0;
              })
            }
            className="field mt-1 num"
            placeholder="45.8"
          />
        </label>
        <label className="block mt-3">
          <span className="text-sm font-bold text-muted">ميزانية الملابس الشهرية (₺)</span>
          <input
            type="number"
            inputMode="numeric"
            value={data.settings.monthlyClothingBudgetTRY || ''}
            onChange={(e) =>
              update((d) => {
                d.settings.monthlyClothingBudgetTRY = Number(e.target.value) || 0;
              })
            }
            className="field mt-1 num"
            placeholder="0 = بدون حد"
          />
        </label>
        <div className="mt-3 bg-gold-soft rounded-xl px-3 py-2.5 flex items-center justify-between">
          <span className="font-bold text-green">الراتب بالليرة</span>
          <span className="font-black text-green num">{fmtTRY(salaryTRY)}</span>
        </div>
      </Card>

      {/* جدول الأسعار */}
      <Card className="mb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-green">🏷️ جدول الأسعار</h2>
          <button
            onClick={() =>
              update((d) => {
                d.prices.unshift({
                  id: uid('p'),
                  emoji: '🛒',
                  name: 'منتج جديد',
                  unit: '1 وحدة',
                  priceTRY: 0,
                });
              })
            }
            className="text-sm font-bold text-green flex items-center gap-1 border-2 border-gold/70 rounded-lg px-2 py-1"
          >
            <Plus size={15} /> منتج
          </button>
        </div>
        <p className="text-xs text-muted font-bold mb-3">
          عدّل الأسعار يدوياً حسب السوق. (الأسعار تقديرية من 101A و SOK — نيسان/أيار 2026)
        </p>
        <ul className="space-y-2">
          {data.prices.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <input
                value={p.emoji}
                onChange={(e) =>
                  update((d) => {
                    const it = d.prices.find((x) => x.id === p.id);
                    if (it) it.emoji = e.target.value;
                  })
                }
                className="w-10 text-center text-xl bg-cream/60 border-2 border-line rounded-lg py-1.5 focus:border-gold focus:outline-none"
                aria-label="إيموجي"
              />
              <div className="flex-1 min-w-0">
                <input
                  value={p.name}
                  onChange={(e) =>
                    update((d) => {
                      const it = d.prices.find((x) => x.id === p.id);
                      if (it) it.name = e.target.value;
                    })
                  }
                  className="w-full bg-transparent font-bold text-ink focus:outline-none truncate"
                />
                <input
                  value={p.unit}
                  onChange={(e) =>
                    update((d) => {
                      const it = d.prices.find((x) => x.id === p.id);
                      if (it) it.unit = e.target.value;
                    })
                  }
                  className="w-full bg-transparent text-xs text-muted font-bold focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  inputMode="numeric"
                  value={p.priceTRY || ''}
                  onChange={(e) =>
                    update((d) => {
                      const it = d.prices.find((x) => x.id === p.id);
                      if (it) it.priceTRY = Number(e.target.value) || 0;
                    })
                  }
                  className="w-16 bg-cream/60 border-2 border-line rounded-lg px-2 py-1.5 text-left font-black text-green num focus:border-gold focus:outline-none"
                />
                <span className="text-muted font-black text-sm">₺</span>
              </div>
              <button
                onClick={() =>
                  update((d) => {
                    d.prices = d.prices.filter((x) => x.id !== p.id);
                  })
                }
                className="w-7 h-7 grid place-items-center rounded-lg text-danger active:scale-95 shrink-0"
                aria-label="حذف"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      {/* النسخ الاحتياطي */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-3">💾 النسخ الاحتياطي</h2>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={exportData} className="btn-primary flex items-center justify-center gap-2">
            <Download size={18} /> تصدير
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-ghost flex items-center justify-center gap-2"
          >
            <Upload size={18} /> استيراد
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImportFile(f);
            e.target.value = '';
          }}
        />
        <p className="text-xs text-muted font-bold mt-2 flex items-start gap-1">
          <Info size={14} className="mt-0.5 shrink-0" />
          كل بياناتك محفوظة على جهازك فقط (localStorage) — بدون سيرفر وبدون إنترنت.
        </p>
      </Card>

      {/* تثبيت + تصفير */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-3">🔧 أدوات</h2>
        <Link to="/medicines" className="btn-ghost w-full mb-2 flex items-center justify-center gap-2">
          <Pill size={18} /> الأدوية والفيتامينات
        </Link>
        <button
          onClick={() => window.dispatchEvent(new Event('show-day-summary'))}
          className="btn-ghost w-full mb-2 flex items-center justify-center gap-2"
        >
          <MoonIcon size={18} /> ملخّص نهاية اليوم
        </button>
        <button
          onClick={() => window.dispatchEvent(new Event('show-install-hint'))}
          className="btn-ghost w-full mb-2 flex items-center justify-center gap-2"
        >
          <Smartphone size={18} /> طريقة التثبيت على الآيفون
        </button>
        <button
          onClick={() => {
            if (confirm('تصفير شهر جديد؟ بينحذف سجل المصاريف المتوقّعة وعلامات المشتريات والوجبات. الثوابت والأسعار بتبقى.')) {
              resetForNewMonth();
              flash('تم التصفير لشهر جديد ✅');
            }
          }}
          className="w-full mb-2 rounded-xl px-4 py-3 font-bold border-2 border-warn text-[#9a7400] flex items-center justify-center gap-2 active:scale-[.98]"
        >
          <RotateCcw size={18} /> تصفير لشهر جديد
        </button>
        <button
          onClick={() => {
            if (confirm('إرجاع كل شيء للبيانات الأولية؟ بينحذف كل تعديلاتك ويرجّع البذور الأصلية.')) {
              resetAll();
              flash('تم الإرجاع للبيانات الأولية ✅');
            }
          }}
          className="w-full rounded-xl px-4 py-3 font-bold border-2 border-danger text-danger flex items-center justify-center gap-2 active:scale-[.98]"
        >
          <AlertTriangle size={18} /> إرجاع كل شيء للأصل
        </button>
      </Card>

      <p className="text-center text-xs text-muted font-bold mb-2">
        عازب في إسطنبول · يعمل بدون إنترنت 📲
        <br />
        <span className="num">{fmtUSD(data.settings.salaryUSD)}</span> ≈{' '}
        <span className="num">{fmtTRY(salaryTRY)}</span> · صرف{' '}
        <span className="num">{rate}</span> · المتبقّي بالدولار{' '}
        <span className="num">{fmtUSD(toUSD(salaryTRY, rate))}</span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- الملف الشخصي
function ProfileCard() {
  const { data, update } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const name = data.settings.userName;
  const avatar = data.settings.userAvatar;

  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3">🪪 ملفّي الشخصي</h2>
      <div className="flex items-center gap-3">
        <button onClick={() => fileRef.current?.click()} className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-green text-white grid place-items-center text-2xl font-black overflow-hidden border-2 border-gold">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : name ? (
              name.charAt(0)
            ) : (
              <Camera size={22} />
            )}
          </div>
          <span className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-gold text-green grid place-items-center">
            <Camera size={13} />
          </span>
        </button>
        <input
          value={name}
          onChange={(e) =>
            update((d) => {
              d.settings.userName = e.target.value;
            })
          }
          placeholder="اسمك"
          className="field flex-1"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) {
              const { fileToAvatar } = await import('../lib/image');
              const a = await fileToAvatar(f);
              update((d) => {
                d.settings.userAvatar = a;
              });
            }
            e.target.value = '';
          }}
        />
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- الثيم
function ThemeCard() {
  const { data, update } = useApp();
  const theme = data.settings.theme;
  const opts: { key: ThemeMode; label: string; Icon: typeof Sun }[] = [
    { key: 'light', label: 'فاتح', Icon: Sun },
    { key: 'dark', label: 'داكن', Icon: Moon },
    { key: 'system', label: 'تلقائي', Icon: Monitor },
  ];
  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3">🌓 المظهر</h2>
      <div className="grid grid-cols-3 gap-2">
        {opts.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() =>
              update((d) => {
                d.settings.theme = key;
              })
            }
            className={`flex flex-col items-center gap-1 py-3 rounded-xl font-bold border-2 transition ${
              theme === key ? 'bg-green text-white border-green' : 'border-line text-muted'
            }`}
          >
            <Icon size={20} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- الأمان (PIN)
function SecurityCard() {
  const { data, update } = useApp();
  const enabled = data.settings.pinEnabled && !!data.settings.pinHash;
  const [setup, setSetup] = useState(false);
  const [bioAvail, setBioAvail] = useState(false);
  const [bioOn, setBioOn] = useState(hasBiometricCredential());

  useEffect(() => {
    biometricAvailable().then(setBioAvail);
  }, []);

  const disable = () => {
    if (confirm('تعطيل قفل الرمز؟')) {
      clearBiometric();
      setBioOn(false);
      update((d) => {
        d.settings.pinEnabled = false;
        d.settings.pinHash = undefined;
      });
    }
  };

  const toggleBio = async () => {
    if (bioOn) {
      clearBiometric();
      setBioOn(false);
    } else {
      const ok = await registerBiometric(data.settings.userName || 'user');
      setBioOn(ok);
      if (!ok) alert('تعذّر تفعيل البصمة على هذا الجهاز.');
    }
  };

  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3">🔐 الأمان</h2>
      {enabled ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-ok/10 border border-ok/30 rounded-xl px-3 py-2.5">
            <Lock size={18} className="text-ok" />
            <span className="font-bold text-ink flex-1">قفل الرمز مفعّل</span>
          </div>
          {bioAvail && (
            <button
              onClick={toggleBio}
              className={`w-full flex items-center justify-between rounded-xl border-2 px-3 py-2.5 font-bold ${
                bioOn ? 'bg-green text-white border-green' : 'border-line text-muted'
              }`}
            >
              <span className="flex items-center gap-2">
                <Fingerprint size={18} /> فتح بالبصمة / الوجه
              </span>
              <span>{bioOn ? 'مفعّل' : 'معطّل'}</span>
            </button>
          )}
          <button onClick={() => setSetup(true)} className="btn-ghost w-full">
            تغيير الرمز
          </button>
          <button onClick={disable} className="w-full rounded-xl px-4 py-2.5 font-bold border-2 border-danger text-danger">
            تعطيل القفل
          </button>
        </div>
      ) : (
        <button onClick={() => setSetup(true)} className="btn-primary w-full flex items-center justify-center gap-2">
          <Lock size={18} /> فعّل قفل الرمز
        </button>
      )}
      {setup && <PinSetupModal onClose={() => setSetup(false)} />}
    </Card>
  );
}

function PinSetupModal({ onClose }: { onClose: () => void }) {
  const { update } = useApp();
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');

  const save = async () => {
    if (!/^\d{4}$/.test(pin)) return setErr('الرمز لازم 4 أرقام.');
    if (pin !== confirm) return setErr('الرمزان غير متطابقين.');
    const hash = await sha256(pin);
    update((d) => {
      d.settings.pinHash = hash;
      d.settings.pinEnabled = true;
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="ضبط الرمز السري">
      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-bold text-muted">الرمز (4 أرقام)</span>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className="field mt-1 num text-center text-2xl tracking-[0.5em]"
            autoFocus
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-muted">أعد الرمز</span>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ''))}
            className="field mt-1 num text-center text-2xl tracking-[0.5em]"
          />
        </label>
        {err && <p className="text-sm font-bold text-danger">{err}</p>}
        <button onClick={save} className="btn-primary w-full flex items-center justify-center gap-2">
          <ChevronLeft size={18} className="rotate-180" /> حفظ الرمز
        </button>
      </div>
    </Modal>
  );
}
