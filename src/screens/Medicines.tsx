import { useState } from 'react';
import { Plus, Trash2, Check, Bell, BellOff, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { uid, todayISODate } from '../lib/format';
import {
  isStandalone,
  notificationsSupported,
  notificationPermission,
  requestNotificationPermission,
} from '../lib/notifications';

export default function Medicines() {
  const { data, update } = useApp();
  const today = todayISODate();
  const [adding, setAdding] = useState(false);
  const [perm, setPerm] = useState<NotificationPermission>(notificationPermission());

  const standalone = isStandalone();
  const meds = data.medicines.slice().sort((a, b) => a.time.localeCompare(b.time));
  const takenCount = meds.filter((m) => m.enabled && m.lastTakenDate === today).length;
  const enabledCount = meds.filter((m) => m.enabled).length;

  const toggleTaken = (id: string) =>
    update((d) => {
      const m = d.medicines.find((x) => x.id === id);
      if (m) m.lastTakenDate = m.lastTakenDate === today ? undefined : today;
    });

  const toggleEnabled = (id: string) =>
    update((d) => {
      const m = d.medicines.find((x) => x.id === id);
      if (m) m.enabled = !m.enabled;
    });

  const enableNotifs = async () => {
    const p = await requestNotificationPermission();
    setPerm(p);
  };

  return (
    <div>
      <ScreenHeader emoji="💊" title="الأدوية والفيتامينات" subtitle="تذكير يومي بمواعيدك" />

      <Card className="mb-3 bg-green text-white border-gold">
        <div className="flex items-center justify-between">
          <span className="font-black">أخذت اليوم</span>
          <span className="text-2xl font-black num">
            {takenCount} / {enabledCount}
          </span>
        </div>
      </Card>

      {/* الإشعارات */}
      {notificationsSupported() && perm !== 'granted' && (
        <Card className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="text-gold" size={18} />
            <span className="font-black text-green">فعّل التذكيرات</span>
          </div>
          {!standalone && (
            <div className="flex items-start gap-2 bg-warn/10 border border-warn/40 rounded-xl p-2.5 mb-2">
              <AlertTriangle size={16} className="text-warn shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-[#9a7400]">
                التذكيرات تشتغل بشكل أفضل لما تثبّت التطبيق على الشاشة الرئيسية (PWA). من المتصفّح العادي قد تكون محدودة.
              </p>
            </div>
          )}
          <button onClick={enableNotifs} className="btn-primary w-full flex items-center justify-center gap-2">
            <Bell size={18} /> {perm === 'denied' ? 'الإشعارات مرفوضة — فعّلها من إعدادات المتصفّح' : 'اسمح بالإشعارات'}
          </button>
        </Card>
      )}
      {perm === 'granted' && (
        <p className="text-xs font-bold text-ok mb-3 flex items-center gap-1">
          <Bell size={14} /> الإشعارات مفعّلة — التذكير يشتغل والتطبيق مفتوح.
        </p>
      )}

      <ul className="space-y-2">
        {meds.map((m) => {
          const taken = m.lastTakenDate === today;
          return (
            <li
              key={m.id}
              className={`rounded-2xl border p-3 flex items-center gap-3 transition ${
                !m.enabled ? 'bg-cream/60 border-line opacity-60' : taken ? 'bg-gold-soft/50 border-gold' : 'bg-card border-line'
              }`}
            >
              <button
                onClick={() => toggleTaken(m.id)}
                disabled={!m.enabled}
                className={`w-9 h-9 shrink-0 rounded-full border-2 grid place-items-center transition ${
                  taken ? 'bg-green border-green text-white' : 'border-line text-transparent'
                }`}
                aria-label="أخذتها"
              >
                <Check size={18} strokeWidth={3} />
              </button>
              <span className="text-2xl shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-bold ${taken ? 'line-through text-muted' : 'text-ink'}`}>{m.name}</div>
                <div className="text-xs text-muted font-bold flex items-center gap-1 num">
                  <Clock size={12} /> {m.time}
                </div>
              </div>
              <button
                onClick={() => toggleEnabled(m.id)}
                className={`w-8 h-8 grid place-items-center rounded-lg shrink-0 ${m.enabled ? 'text-green' : 'text-muted'}`}
                aria-label="تفعيل/تعطيل"
              >
                {m.enabled ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
              <button
                onClick={() =>
                  update((d) => {
                    d.medicines = d.medicines.filter((x) => x.id !== m.id);
                  })
                }
                className="w-8 h-8 grid place-items-center rounded-lg text-danger active:scale-95 shrink-0"
                aria-label="حذف"
              >
                <Trash2 size={18} />
              </button>
            </li>
          );
        })}
      </ul>

      {meds.length === 0 && <p className="text-center text-sm text-muted font-bold py-6">ما في أدوية بعد 💊</p>}

      <button onClick={() => setAdding(true)} className="btn-ghost w-full mt-3 flex items-center justify-center gap-2">
        <Plus size={18} /> أضف دواء / فيتامين
      </button>

      {adding && <AddMedicineModal onClose={() => setAdding(false)} />}
    </div>
  );
}

function AddMedicineModal({ onClose }: { onClose: () => void }) {
  const { update } = useApp();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💊');
  const [time, setTime] = useState('09:00');

  const save = () => {
    if (!name.trim()) return;
    update((d) => {
      d.medicines.push({
        id: uid('m'),
        name: name.trim(),
        emoji: emoji.trim() || '💊',
        time,
        enabled: true,
      });
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="دواء / فيتامين جديد">
      <div className="space-y-3">
        <div className="flex gap-2">
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="field w-16 text-center text-2xl" aria-label="إيموجي" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: أوميغا 3" className="field flex-1" autoFocus />
        </div>
        <label className="block">
          <span className="text-sm font-bold text-muted">وقت التذكير</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field mt-1 num" />
        </label>
        <button onClick={save} className="btn-primary w-full">
          إضافة
        </button>
      </div>
    </Modal>
  );
}
