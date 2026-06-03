import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { LANGS, LANG_META } from '../i18n';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { fmtTRY, fmtUSD, uid, todayISODate } from '../lib/format';
import { isValidImport } from '../lib/storage';
import { sha256 } from '../lib/crypto';
import { biometricAvailable, hasBiometricCredential, registerBiometric, clearBiometric } from '../lib/biometric';
import { isStandalone, notificationsSupported, notificationPermission, requestNotificationPermission } from '../lib/notifications';
import { Bell, AlertTriangle as Warn } from 'lucide-react';
import type { AppData, ThemeMode } from '../types';

export default function Settings() {
  const { t } = useTranslation();
  const { data, update, replace, resetForNewMonth, resetAll } = useApp();
  const rate = data.settings.exchangeRate;
  const salaryTRY = data.settings.salaryUSD * rate;
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const flash = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 2500);
  };

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
    flash(t('settings.exportDone'));
  };

  const onImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!isValidImport(parsed)) {
        flash(t('settings.invalidFile'));
        return;
      }
      replace(parsed as AppData);
      flash(t('settings.imported'));
    } catch {
      flash(t('settings.readFail'));
    }
  };

  return (
    <div>
      <ScreenHeader emoji="⚙️" title={t('nav.settings')} subtitle={t('settings.subtitle')} />

      {msg && <div className="mb-3 rounded-xl bg-green text-white px-4 py-2.5 font-bold text-sm text-center animate-pop">{msg}</div>}

      <ProfileCard />
      <LanguageCard />
      <ThemeCard />
      <SecurityCard />
      <NotificationsCard />

      {/* salary & rate */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-3">{t('settings.salaryCard')}</h2>
        <label className="block mb-3">
          <span className="text-sm font-bold text-muted">{t('settings.salaryUSD')}</span>
          <input
            type="number"
            inputMode="decimal"
            value={data.settings.salaryUSD || ''}
            onChange={(e) => update((d) => { d.settings.salaryUSD = Number(e.target.value) || 0; })}
            className="field mt-1 num"
            placeholder="1000"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-muted">{t('settings.rate')}</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={data.settings.exchangeRate || ''}
            onChange={(e) => update((d) => { d.settings.exchangeRate = Number(e.target.value) || 0; })}
            className="field mt-1 num"
            placeholder="45.8"
          />
        </label>
        <label className="block mt-3">
          <span className="text-sm font-bold text-muted">{t('settings.clothingBudget')}</span>
          <input
            type="number"
            inputMode="numeric"
            value={data.settings.monthlyClothingBudgetTRY || ''}
            onChange={(e) => update((d) => { d.settings.monthlyClothingBudgetTRY = Number(e.target.value) || 0; })}
            className="field mt-1 num"
            placeholder={t('settings.noLimit')}
          />
        </label>
        <div className="mt-3 bg-gold-soft rounded-xl px-3 py-2.5 flex items-center justify-between">
          <span className="font-bold text-green">{t('settings.salaryInTRY')}</span>
          <span className="font-black text-green num">{fmtTRY(salaryTRY)}</span>
        </div>
      </Card>

      {/* price list → dedicated page */}
      <Link to="/prices" className="mb-3 app-card flex items-center justify-between active:scale-[.99] transition">
        <span className="font-black text-green flex items-center gap-2">🏷️ {t('settings.pricesCard')}</span>
        <ChevronLeft size={20} className="text-muted ltr:rotate-180" />
      </Link>

      {/* backup */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-3">{t('settings.backup')}</h2>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={exportData} className="btn-primary flex items-center justify-center gap-2">
            <Download size={18} /> {t('settings.export')}
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-ghost flex items-center justify-center gap-2">
            <Upload size={18} /> {t('settings.import')}
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
          {t('settings.backupNote')}
        </p>
      </Card>

      {/* tools + reset */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-3">{t('settings.tools')}</h2>
        <Link to="/medicines" className="btn-ghost w-full mb-2 flex items-center justify-center gap-2">
          <Pill size={18} /> {t('settings.medicinesLink')}
        </Link>
        <button onClick={() => window.dispatchEvent(new Event('show-day-summary'))} className="btn-ghost w-full mb-2 flex items-center justify-center gap-2">
          <MoonIcon size={18} /> {t('settings.daySummary')}
        </button>
        <button onClick={() => window.dispatchEvent(new Event('show-install-hint'))} className="btn-ghost w-full mb-2 flex items-center justify-center gap-2">
          <Smartphone size={18} /> {t('settings.installHelp')}
        </button>
        <button
          onClick={() => {
            if (confirm(t('settings.confirmNewMonth'))) {
              resetForNewMonth();
              flash(t('settings.newMonthDone'));
            }
          }}
          className="w-full mb-2 rounded-xl px-4 py-3 font-bold border-2 border-warn text-[#9a7400] flex items-center justify-center gap-2 active:scale-[.98]"
        >
          <RotateCcw size={18} /> {t('settings.newMonth')}
        </button>
        <button
          onClick={() => {
            if (confirm(t('settings.confirmResetAll'))) {
              resetAll();
              flash(t('settings.resetAllDone'));
            }
          }}
          className="w-full rounded-xl px-4 py-3 font-bold border-2 border-danger text-danger flex items-center justify-center gap-2 active:scale-[.98]"
        >
          <AlertTriangle size={18} /> {t('settings.resetAll')}
        </button>
      </Card>

      <p className="text-center text-xs text-muted font-bold mb-2">
        {t('settings.footer')}
        <br />
        <span className="num">{fmtUSD(data.settings.salaryUSD)}</span> ≈ <span className="num">{fmtTRY(salaryTRY)}</span> ·{' '}
        <span className="num">{rate} ₺/$</span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- profile
function ProfileCard() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const name = data.settings.userName;
  const avatar = data.settings.userAvatar;

  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3">{t('settings.profile')}</h2>
      <div className="flex items-center gap-3">
        <button onClick={() => fileRef.current?.click()} className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-green text-white grid place-items-center text-2xl font-black overflow-hidden border-2 border-gold">
            {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : name ? name.charAt(0) : <Camera size={22} />}
          </div>
          <span className="absolute -bottom-1 ltr:-left-1 rtl:-right-1 w-6 h-6 rounded-full bg-gold text-green grid place-items-center">
            <Camera size={13} />
          </span>
        </button>
        <input
          value={name}
          onChange={(e) => update((d) => { d.settings.userName = e.target.value; })}
          placeholder={t('settings.namePh')}
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
              update((d) => { d.settings.userAvatar = a; });
            }
            e.target.value = '';
          }}
        />
      </div>

      <div className="mt-3">
        <span className="text-xs font-bold text-muted uppercase tracking-wide">{t('gender.label')}</span>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {(['male', 'female'] as const).map((g) => (
            <button
              key={g}
              onClick={() => update((d) => { d.settings.gender = g; })}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold border-2 transition ${
                data.settings.gender === g ? 'bg-green text-white border-green' : 'border-line text-muted'
              }`}
            >
              <span>{g === 'male' ? '👨' : '👩'}</span> {t(`gender.${g}`)}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- language
function LanguageCard() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const current = data.settings.language;
  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3">🌐 {t('settings.language')}</h2>
      <div className="grid grid-cols-3 gap-2">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => update((d) => { d.settings.language = l; })}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl font-bold border-2 transition ${current === l ? 'bg-green text-white border-green' : 'border-line text-muted'}`}
          >
            <span style={{ fontSize: 22 }}>{LANG_META[l].flag}</span>
            <span className="text-sm" dir={l === 'ar' ? 'rtl' : 'ltr'}>
              {LANG_META[l].native}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- theme
function ThemeCard() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const theme = data.settings.theme;
  const opts: { key: ThemeMode; label: string; Icon: typeof Sun }[] = [
    { key: 'light', label: t('settings.themeLight'), Icon: Sun },
    { key: 'dark', label: t('settings.themeDark'), Icon: Moon },
    { key: 'system', label: t('settings.themeSystem'), Icon: Monitor },
  ];
  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3">{t('settings.appearance')}</h2>
      <div className="grid grid-cols-3 gap-2">
        {opts.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => update((d) => { d.settings.theme = key; })}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl font-bold border-2 transition ${theme === key ? 'bg-green text-white border-green' : 'border-line text-muted'}`}
          >
            <Icon size={20} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- notifications
function NotificationsCard() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const [perm, setPerm] = useState<NotificationPermission>(notificationPermission());
  if (!notificationsSupported()) return null;

  const standalone = isStandalone();
  const rows: { key: 'notifyMorning' | 'notifyEvening' | 'notifyFriday'; label: string }[] = [
    { key: 'notifyMorning', label: t('notifSettings.morning') },
    { key: 'notifyEvening', label: t('notifSettings.evening') },
    { key: 'notifyFriday', label: t('notifSettings.friday') },
  ];

  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3 flex items-center gap-2">
        <Bell size={18} className="text-gold" /> {t('notifSettings.title')}
      </h2>

      {perm !== 'granted' && (
        <div className="mb-3">
          {!standalone && (
            <div className="flex items-start gap-2 bg-warn/10 border border-warn/40 rounded-xl p-2.5 mb-2">
              <Warn size={16} className="text-warn shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-[#9a7400]">{t('medicines.pwaWarn')}</p>
            </div>
          )}
          <button
            onClick={async () => setPerm(await requestNotificationPermission())}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Bell size={18} /> {perm === 'denied' ? t('medicines.denied') : t('medicines.allow')}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {rows.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => update((d) => { d.prayer[key] = !d.prayer[key]; })}
            className={`w-full flex items-center justify-between rounded-xl border-2 px-3 py-2.5 font-bold text-sm transition ${
              data.prayer[key] ? 'bg-green text-white border-green' : 'border-line text-muted'
            }`}
          >
            <span className="text-start">{label}</span>
            <span
              className={`w-10 h-6 rounded-full relative shrink-0 transition ${data.prayer[key] ? 'bg-gold' : 'bg-line'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${data.prayer[key] ? 'left-0.5' : 'left-[18px]'}`}
              />
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- security (PIN)
function SecurityCard() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const enabled = data.settings.pinEnabled && !!data.settings.pinHash;
  const [setup, setSetup] = useState(false);
  const [bioAvail, setBioAvail] = useState(false);
  const [bioOn, setBioOn] = useState(hasBiometricCredential());

  useEffect(() => {
    biometricAvailable().then(setBioAvail);
  }, []);

  const disable = () => {
    if (confirm(t('settings.confirmDisablePin'))) {
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
      if (!ok) alert(t('settings.bioFail'));
    }
  };

  return (
    <Card className="mb-3">
      <h2 className="font-black text-green mb-3">{t('settings.security')}</h2>
      {enabled ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-ok/10 border border-ok/30 rounded-xl px-3 py-2.5">
            <Lock size={18} className="text-ok" />
            <span className="font-bold text-ink flex-1">{t('settings.pinOn')}</span>
          </div>
          {bioAvail && (
            <button
              onClick={toggleBio}
              className={`w-full flex items-center justify-between rounded-xl border-2 px-3 py-2.5 font-bold ${bioOn ? 'bg-green text-white border-green' : 'border-line text-muted'}`}
            >
              <span className="flex items-center gap-2">
                <Fingerprint size={18} /> {t('settings.biometric')}
              </span>
              <span>{bioOn ? t('settings.on') : t('settings.off')}</span>
            </button>
          )}
          <button onClick={() => setSetup(true)} className="btn-ghost w-full">
            {t('settings.changePin')}
          </button>
          <button onClick={disable} className="w-full rounded-xl px-4 py-2.5 font-bold border-2 border-danger text-danger">
            {t('settings.disablePin')}
          </button>
        </div>
      ) : (
        <button onClick={() => setSetup(true)} className="btn-primary w-full flex items-center justify-center gap-2">
          <Lock size={18} /> {t('settings.enablePin')}
        </button>
      )}
      {setup && <PinSetupModal onClose={() => setSetup(false)} />}
    </Card>
  );
}

function PinSetupModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { update } = useApp();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [err, setErr] = useState('');

  const save = async () => {
    if (!/^\d{4}$/.test(pin)) return setErr(t('settings.pin4'));
    if (pin !== confirmPin) return setErr(t('settings.pinMismatch'));
    const hash = await sha256(pin);
    update((d) => {
      d.settings.pinHash = hash;
      d.settings.pinEnabled = true;
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={t('settings.pinSetTitle')}>
      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-bold text-muted">{t('settings.pinLabel')}</span>
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
          <span className="text-sm font-bold text-muted">{t('settings.pinConfirm')}</span>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
            className="field mt-1 num text-center text-2xl tracking-[0.5em]"
          />
        </label>
        {err && <p className="text-sm font-bold text-danger">{err}</p>}
        <button onClick={save} className="btn-primary w-full flex items-center justify-center gap-2">
          <ChevronLeft size={18} className="rtl:rotate-180" /> {t('settings.pinSave')}
        </button>
      </div>
    </Modal>
  );
}
