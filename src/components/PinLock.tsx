import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Delete, Fingerprint, Lock } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { sha256 } from '../lib/crypto';
import { biometricAvailable, hasBiometricCredential, verifyBiometric, clearBiometric } from '../lib/biometric';

export default function PinLock({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);
  const [bioOn, setBioOn] = useState(false);

  useEffect(() => {
    (async () => {
      if (hasBiometricCredential() && (await biometricAvailable())) {
        setBioOn(true);
        const ok = await verifyBiometric();
        if (ok) onUnlock();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const press = async (digit: string) => {
    if (entry.length >= 4) return;
    const next = entry + digit;
    setEntry(next);
    if (next.length === 4) {
      const hash = await sha256(next);
      if (hash === data.settings.pinHash) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setEntry('');
          setError(false);
        }, 600);
      }
    }
  };

  const forgot = () => {
    if (confirm(t('pin.forgotConfirm'))) {
      clearBiometric();
      update((d) => {
        d.settings.pinEnabled = false;
        d.settings.pinHash = undefined;
      });
      onUnlock();
    }
  };

  const tryBio = async () => {
    if (await verifyBiometric()) onUnlock();
  };

  return (
    <div className="fixed inset-0 z-[80] bg-cream flex flex-col items-center justify-center px-8 safe-top">
      <div className="w-16 h-16 rounded-2xl bg-green text-white grid place-items-center mb-4 glow-green">
        <Lock size={30} />
      </div>
      <h1 className="text-2xl font-black text-green mb-1">{t('pin.locked')}</h1>
      <p className="text-muted font-bold mb-6">{t('pin.enter')}</p>

      {/* النقاط */}
      <div className={`flex gap-4 mb-8 ${error ? 'animate-pop' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              error
                ? 'bg-danger border-danger'
                : i < entry.length
                  ? 'bg-green border-green'
                  : 'border-line'
            }`}
          />
        ))}
      </div>

      {/* لوحة الأرقام */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
          <PadBtn key={n} onClick={() => press(n)}>
            {n}
          </PadBtn>
        ))}
        <div>
          {bioOn ? (
            <button
              onClick={tryBio}
              className="w-16 h-16 rounded-full grid place-items-center text-green active:scale-95"
              aria-label={t('settings.biometric')}
            >
              <Fingerprint size={28} />
            </button>
          ) : (
            <div className="w-16 h-16" />
          )}
        </div>
        <PadBtn onClick={() => press('0')}>0</PadBtn>
        <button
          onClick={() => setEntry((e) => e.slice(0, -1))}
          className="w-16 h-16 rounded-full grid place-items-center text-muted active:scale-95"
          aria-label={t('common.delete')}
        >
          <Delete size={26} />
        </button>
      </div>

      <button onClick={forgot} className="text-sm font-bold text-muted underline underline-offset-4">
        {t('pin.forgot')}
      </button>
    </div>
  );
}

function PadBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-16 h-16 rounded-full bg-card border border-line text-2xl font-black text-ink num active:scale-95 active:bg-gold-soft transition"
    >
      {children}
    </button>
  );
}
