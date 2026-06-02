import { useEffect } from 'react';
import { useApp } from '../state/AppContext';
import { notificationPermission, showNotification } from '../lib/notifications';
import { todayISODate } from '../lib/format';
import i18n from '../i18n';

/**
 * إشعارات الأذكار/الجمعة المجدولة (تعمل بأفضل شكل والتطبيق مفتوح/بالخلفية كـ PWA):
 * 5:00 ص أذكار الصباح · 5:00 م أذكار المساء · الجمعة 8:00 ص سورة الكهف.
 */
export default function PrayerScheduler() {
  const { data } = useApp();
  const { notifyMorning, notifyEvening, notifyFriday } = data.prayer;

  useEffect(() => {
    const tick = () => {
      if (notificationPermission() !== 'granted') return;
      const now = new Date();
      const hh = now.getHours();
      const mm = now.getMinutes();
      const today = todayISODate();
      const fire = (key: string, title: string, body: string) => {
        const fk = `notif_${key}_${today}`;
        if (localStorage.getItem(fk)) return;
        localStorage.setItem(fk, '1');
        showNotification(title, body);
      };
      if (notifyMorning && hh === 5 && mm < 3) fire('morning', i18n.t('notif.morningTitle'), i18n.t('notif.morningBody'));
      if (notifyEvening && hh === 17 && mm < 3) fire('evening', i18n.t('notif.eveningTitle'), i18n.t('notif.eveningBody'));
      if (notifyFriday && now.getDay() === 5 && hh === 8 && mm < 3) fire('friday', i18n.t('notif.fridayTitle'), i18n.t('notif.fridayBody'));
    };
    tick();
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, [notifyMorning, notifyEvening, notifyFriday]);

  return null;
}
