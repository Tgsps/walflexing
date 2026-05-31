import { useApp } from '../state/AppContext';
import { M2, metroFrequency, metroRunning } from '../data/metro';
import Card from './Card';

export default function MetroCard() {
  const { data, update } = useApp();
  const station = data.settings.metroStation;
  const running = metroRunning();
  const freq = metroFrequency();

  return (
    <Card className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-full grid place-items-center text-white text-xs font-black"
            style={{ background: M2.color }}
          >
            M2
          </span>
          <span className="font-black text-green">مترو إسطنبول</span>
        </div>
        <span className={`text-xs font-black ${running ? 'text-ok' : 'text-danger'}`}>
          {running ? '● شغّال' : '● متوقّف'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-cream/60 rounded-xl p-2.5 text-center">
          <div className="text-xs text-muted font-bold">⏰ أول مترو</div>
          <div className="font-black text-green num">{M2.firstTrain}</div>
        </div>
        <div className="bg-cream/60 rounded-xl p-2.5 text-center">
          <div className="text-xs text-muted font-bold">🌙 آخر مترو</div>
          <div className="font-black text-green num">{M2.lastTrain}</div>
        </div>
      </div>

      <div className="text-sm font-bold text-muted mb-2">🚇 {freq}</div>

      <label className="block">
        <span className="text-xs font-bold text-muted">محطتي الأقرب</span>
        <select
          value={station ?? ''}
          onChange={(e) =>
            update((d) => {
              d.settings.metroStation = e.target.value || undefined;
            })
          }
          className="field mt-1"
        >
          <option value="">اختر محطتك…</option>
          {M2.stations.map((s) => (
            <option key={s.id} value={s.ar}>
              {s.ar} — {s.tr}
            </option>
          ))}
        </select>
      </label>
    </Card>
  );
}
