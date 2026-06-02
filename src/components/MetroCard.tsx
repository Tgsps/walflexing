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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="grid place-items-center text-white font-black"
            style={{
              width: 30,
              height: 30,
              borderRadius: 9999,
              fontSize: 12,
              background: '#009640',
              boxShadow: '0 0 0 2px rgb(var(--gold)), 0 2px 8px rgba(6,45,35,.2)',
            }}
          >
            M2
          </span>
          <span className="font-black text-green" style={{ fontSize: 15 }}>
            مترو إسطنبول
          </span>
        </div>
        <span className="font-black" style={{ fontSize: 12, color: running ? 'rgb(var(--ok))' : 'rgb(var(--danger))' }}>
          ● {running ? 'شغّال' : 'متوقّف'}
        </span>
      </div>

      <div className="flex gap-2 mb-2.5">
        {[
          ['⏰ أول مترو', M2.firstTrain],
          ['🌙 آخر مترو', M2.lastTrain],
        ].map(([l, v]) => (
          <div
            key={l}
            className="flex-1 text-center"
            style={{ background: 'rgb(var(--cream) / 0.6)', borderRadius: 14, padding: 10 }}
          >
            <div className="text-xs font-bold text-muted">{l}</div>
            <div className="num font-black text-green">{v}</div>
          </div>
        ))}
      </div>

      <div className="text-[13px] font-bold text-muted mb-2.5">🚇 {freq}</div>

      <label className="block">
        <span className="text-xs font-bold text-muted uppercase tracking-wide">محطتي الأقرب</span>
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
