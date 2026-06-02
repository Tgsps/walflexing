import { useEffect } from 'react';
import { useApp } from '../state/AppContext';
import { notificationPermission, showNotification } from '../lib/notifications';
import { todayISODate } from '../lib/format';
import i18n from '../i18n';

const pad = (n: number) => String(n).padStart(2, '0');

/** يطلق إشعار تذكير عند حلول وقت الدواء (يعمل فقط والتطبيق مفتوح/بالخلفية). */
export default function MedicineScheduler() {
  const { data } = useApp();
  const meds = data.medicines;

  useEffect(() => {
    const tick = () => {
      if (notificationPermission() !== 'granted') return;
      const now = new Date();
      const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const today = todayISODate();
      for (const m of meds) {
        if (!m.enabled || m.time !== hhmm || m.lastTakenDate === today) continue;
        const fkey = `medfire_${m.id}_${today}`;
        if (localStorage.getItem(fkey)) continue;
        localStorage.setItem(fkey, '1');
        showNotification(i18n.t('medicines.notifTitle'), i18n.t('medicines.notifBody', { name: m.name, time: m.time }));
      }
    };
    tick();
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, [meds]);

  return null;
}
