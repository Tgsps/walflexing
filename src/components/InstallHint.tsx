import { useEffect, useState } from 'react';
import { Share, Plus, X, Smartphone } from 'lucide-react';

const DISMISS_KEY = 'install_hint_dismissed_v1';

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (/Mac/.test(ua) && 'ontouchend' in document);
}

/** افتح التلميح يدوياً من أي مكان: window.dispatchEvent(new Event('show-install-hint')) */
export default function InstallHint() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === '1';
    if (!dismissed && !isStandalone()) {
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('show-install-hint', handler);
    return () => window.removeEventListener('show-install-hint', handler);
  }, []);

  if (!open) return null;

  const ios = isIOS();

  const close = (remember: boolean) => {
    if (remember) localStorage.setItem(DISMISS_KEY, '1');
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => close(false)} />
      <div className="relative w-full sm:max-w-md bg-cream rounded-t-3xl shadow-2xl animate-slideup nav-safe overflow-hidden">
        <div className="bg-green text-white px-4 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 grid place-items-center text-2xl">
            📲
          </div>
          <div className="flex-1">
            <h2 className="font-black text-lg">ثبّت التطبيق على الآيفون</h2>
            <p className="text-white/80 text-sm font-medium">يفتح بضغطة واحدة ويشتغل بدون إنترنت</p>
          </div>
          <button
            onClick={() => close(false)}
            className="w-9 h-9 grid place-items-center rounded-full bg-white/15"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {ios ? (
            <>
              <Step
                n={1}
                icon={<Share size={20} className="text-green" />}
                text="اضغط زر «مشاركة» في أسفل سفاري (المربّع مع السهم للأعلى)."
              />
              <Step
                n={2}
                icon={<Plus size={20} className="text-green" />}
                text="اختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen)."
              />
              <Step
                n={3}
                icon={<Smartphone size={20} className="text-green" />}
                text="اضغط «إضافة» — وبيطلع أيقونة التطبيق على شاشتك."
              />
              <p className="text-xs text-muted font-bold text-center pt-1">
                ملاحظة: لازم تفتح الموقع من <span className="text-green">Safari</span> مو من تطبيق ثاني.
              </p>
            </>
          ) : (
            <>
              <Step
                n={1}
                icon={<Plus size={20} className="text-green" />}
                text="افتح قائمة المتصفّح (⋮) واختر «تثبيت التطبيق» أو «Add to Home screen»."
              />
              <Step
                n={2}
                icon={<Smartphone size={20} className="text-green" />}
                text="أكّد التثبيت — وبيشتغل التطبيق بدون إنترنت."
              />
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button onClick={() => close(true)} className="btn-primary flex-1">
              تمام، فهمت
            </button>
            <button onClick={() => close(false)} className="btn-ghost">
              لاحقاً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, icon, text }: { n: number; icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 bg-card rounded-2xl border border-line p-3">
      <div className="w-8 h-8 shrink-0 rounded-full bg-gold text-green grid place-items-center font-black num">
        {n}
      </div>
      <div className="shrink-0">{icon}</div>
      <p className="text-sm font-bold text-ink leading-snug">{text}</p>
    </div>
  );
}
