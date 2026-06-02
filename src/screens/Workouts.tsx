import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Flame, Pencil, Moon, Dumbbell, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import { JS_DAY_TO_AR } from '../data/seed';
import { currentWeekDates } from '../lib/calc';
import { todayISODate, fmtFullDate } from '../lib/format';
import { tFocus, tDayName, tTodayName } from '../i18n/content';

type Tab = 'schedule' | 'weight';

export default function Workouts() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('schedule');
  return (
    <div>
      <ScreenHeader emoji="🏋️" title={t('nav.workouts')} subtitle={t('workouts.subtitle')} />

      <div className="grid grid-cols-2 gap-2 mb-4 bg-card rounded-2xl p-1 border border-line">
        <TabBtn active={tab === 'schedule'} onClick={() => setTab('schedule')}>
          {t('workouts.tabSchedule')}
        </TabBtn>
        <TabBtn active={tab === 'weight'} onClick={() => setTab('weight')}>
          {t('workouts.tabWeight')}
        </TabBtn>
      </div>

      {tab === 'schedule' ? <ScheduleTab /> : <WeightTab />}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`py-2.5 rounded-xl font-black text-sm transition ${active ? 'bg-green text-white shadow-soft' : 'text-muted'}`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------- schedule
function ScheduleTab() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const todayAr = JS_DAY_TO_AR[new Date().getDay()];
  const weekDates = useMemo(() => currentWeekDates(), []);
  const [editing, setEditing] = useState(false);

  const doneByDate = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const e of data.workout.log) m.set(e.date, e.done);
    return m;
  }, [data.workout.log]);

  const isDone = (dayName: string) => {
    const date = weekDates[dayName];
    return date ? doneByDate.get(date) === true : false;
  };

  const toggleDone = (dayName: string) =>
    update((d) => {
      const date = weekDates[dayName];
      if (!date) return;
      const existing = d.workout.log.find((e) => e.date === date);
      if (existing) existing.done = !existing.done;
      else d.workout.log.push({ date, day: dayName, done: true });
    });

  const setFocus = (dayName: string, focus: string) =>
    update((d) => {
      const day = d.workout.schedule.find((s) => s.day === dayName);
      if (day) day.focus = focus;
    });

  const toggleRest = (dayName: string) =>
    update((d) => {
      const day = d.workout.schedule.find((s) => s.day === dayName);
      if (day) {
        day.rest = !day.rest;
        if (day.rest && (day.focus === '' || day.focus === 'حدّده بنفسك')) day.focus = 'راحة';
      }
    });

  const trainingDays = data.workout.schedule.filter((s) => !s.rest);
  const doneThisWeek = trainingDays.filter((s) => isDone(s.day)).length;
  const totalTraining = trainingDays.length;
  const streak = useMemo(() => computeStreak(data.workout.schedule, doneByDate), [data.workout.schedule, doneByDate]);
  const todaySchedule = data.workout.schedule.find((s) => s.day === todayAr);

  return (
    <div>
      <div className="flex justify-end -mt-1 mb-2">
        <button
          onClick={() => setEditing((v) => !v)}
          className={`rounded-xl px-3 py-2 text-sm font-bold flex items-center gap-1 ${editing ? 'bg-green text-white' : 'border-2 border-gold/70 text-green'}`}
        >
          <Pencil size={15} /> {editing ? t('common.done') : t('workouts.edit')}
        </button>
      </div>

      {todaySchedule && (
        <Card className="mb-3 bg-green text-white border-gold">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/75 text-sm font-bold mb-1">{t('workouts.todayWorkout', { day: tTodayName(t) })}</div>
              <div className="text-2xl font-black flex items-center gap-2">
                {todaySchedule.rest ? (
                  <>
                    <Moon size={22} className="text-gold" /> {t('workouts.restDay')}
                  </>
                ) : (
                  <>
                    <Dumbbell size={22} className="text-gold" /> {tFocus(todaySchedule.focus, t)}
                  </>
                )}
              </div>
            </div>
            {!todaySchedule.rest && (
              <button
                onClick={() => toggleDone(todayAr)}
                className={`w-16 h-16 rounded-2xl grid place-items-center transition active:scale-95 ${isDone(todayAr) ? 'bg-gold text-green' : 'bg-white/15 text-white'}`}
                aria-label={t('workouts.doneToggle')}
              >
                <Check size={28} strokeWidth={3} />
              </button>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Card className="text-center">
          <div className="text-sm font-bold text-muted mb-1">{t('workouts.commitment')}</div>
          <div className="text-2xl font-black text-green num">
            {doneThisWeek} / {totalTraining}
          </div>
          <div className="text-xs font-bold text-muted">{t('workouts.commitmentSub')}</div>
        </Card>
        <Card className="text-center">
          <div className="text-sm font-bold text-muted mb-1">{t('workouts.streak')}</div>
          <div className="text-2xl font-black text-gold num flex items-center justify-center gap-1">
            <Flame size={22} className="text-gold" /> {streak}
          </div>
          <div className="text-xs font-bold text-muted">{t('workouts.streakSub')}</div>
        </Card>
      </div>

      <h3 className="font-black text-green px-1 mb-2">{t('workouts.weekly')}</h3>
      <ul className="space-y-2">
        {data.workout.schedule.map((s) => {
          const today = s.day === todayAr;
          const done = isDone(s.day);
          return (
            <li key={s.day} className={`rounded-2xl border p-3 flex items-center gap-3 transition ${today ? 'border-gold bg-gold-soft/40' : 'border-line bg-card'}`}>
              <div className="w-20 shrink-0">
                <div className="font-black text-green">{tDayName(s.day, t)}</div>
                {today && <div className="text-[11px] font-bold text-gold">{t('common.today')}</div>}
              </div>

              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input value={s.focus} onChange={(e) => setFocus(s.day, e.target.value)} className="field py-1.5 text-sm" />
                    <button
                      onClick={() => toggleRest(s.day)}
                      className={`shrink-0 rounded-lg px-2 py-1.5 text-xs font-bold border-2 ${s.rest ? 'bg-green text-white border-green' : 'border-line text-muted'}`}
                    >
                      {t('workouts.rest')}
                    </button>
                  </div>
                ) : s.rest ? (
                  <span className="font-bold text-muted flex items-center gap-1">
                    <Moon size={16} /> {t('workouts.rest')}
                  </span>
                ) : (
                  <span className="font-bold text-ink">{tFocus(s.focus, t)}</span>
                )}
              </div>

              {!editing && !s.rest && (
                <button
                  onClick={() => toggleDone(s.day)}
                  className={`w-9 h-9 shrink-0 rounded-full border-2 grid place-items-center transition ${done ? 'bg-green border-green text-white' : 'border-line text-transparent'}`}
                  aria-label={t('workouts.doneToggle')}
                >
                  <Check size={18} strokeWidth={3} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-muted font-bold text-center mt-3">{t('workouts.editHint')}</p>
    </div>
  );
}

function computeStreak(schedule: { day: string; rest: boolean }[], doneByDate: Map<string, boolean>): number {
  const restByDay = new Map(schedule.map((s) => [s.day, s.rest]));
  let streak = 0;
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  for (let i = 0; i < 400; i++) {
    const dayName = JS_DAY_TO_AR[cur.getDay()];
    const iso = cur.toISOString().slice(0, 10);
    const rest = restByDay.get(dayName) === true;
    if (!rest) {
      if (doneByDate.get(iso) === true) streak++;
      else if (i !== 0) break;
    }
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

// ---------------------------------------------------------------- weight
function WeightTab() {
  const { t, i18n } = useTranslation();
  const { data, update } = useApp();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(todayISODate());
  const kg = t('workouts.kg');

  const log = useMemo(() => data.workout.weightLog.slice().sort((a, b) => a.date.localeCompare(b.date)), [data.workout.weightLog]);

  const addEntry = () => {
    const w = Number(weight);
    if (!w || w <= 0) return;
    update((d) => {
      const existing = d.workout.weightLog.find((e) => e.date === date);
      if (existing) existing.weightKg = w;
      else d.workout.weightLog.push({ date, weightKg: w });
    });
    setWeight('');
  };

  const removeEntry = (d0: string) =>
    update((d) => {
      d.workout.weightLog = d.workout.weightLog.filter((e) => e.date !== d0);
    });

  const chartData = log.map((e) => {
    const dt = new Date(e.date);
    return { label: `${dt.getDate()}/${dt.getMonth() + 1}`, weightKg: e.weightKg };
  });

  const first = log[0]?.weightKg;
  const current = log[log.length - 1]?.weightKg;
  const diff = first != null && current != null ? current - first : 0;
  const weights = log.map((e) => e.weightKg);
  const yMin = weights.length ? Math.floor(Math.min(...weights) - 1) : 0;
  const yMax = weights.length ? Math.ceil(Math.max(...weights) + 1) : 100;

  return (
    <div>
      <Card className="mb-3">
        <h2 className="font-black text-green mb-3">{t('workouts.logWeight')}</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            placeholder={t('workouts.weightPh')}
            className="field flex-1 num"
          />
          <button onClick={addEntry} className="btn-primary px-5 flex items-center gap-1">
            <Plus size={18} /> {t('common.add')}
          </button>
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field num" />
      </Card>

      {log.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Card className="text-center">
            <div className="text-sm font-bold text-muted mb-1">{t('workouts.current')}</div>
            <div className="text-2xl font-black text-green num">
              {current} {kg}
            </div>
          </Card>
          <Card className="text-center">
            <div className="text-sm font-bold text-muted mb-1">{t('workouts.diffStart')}</div>
            <div className={`text-2xl font-black num flex items-center justify-center gap-1 ${diff < 0 ? 'text-ok' : diff > 0 ? 'text-danger' : 'text-muted'}`}>
              {diff < 0 ? <TrendingDown size={20} /> : diff > 0 ? <TrendingUp size={20} /> : null}
              {diff > 0 ? '+' : ''}
              {diff.toFixed(1)} {kg}
            </div>
          </Card>
        </div>
      )}

      {log.length >= 2 ? (
        <Card className="mb-3">
          <h3 className="font-black text-green mb-2">{t('workouts.trend')}</h3>
          <div className="h-[200px] ltr:-ml-3 rtl:-mr-3" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1DAC8" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#627068' }} />
                <YAxis domain={[yMin, yMax]} tick={{ fontSize: 11, fill: '#627068' }} width={32} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E1DAC8', fontWeight: 700 }}
                  labelStyle={{ fontWeight: 800 }}
                  formatter={(v: number) => [`${v} ${kg}`, '']}
                />
                <Line type="monotone" dataKey="weightKg" stroke="#062D23" strokeWidth={3} dot={{ r: 4, fill: '#C49418', stroke: '#062D23', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card className="text-center py-6 mb-3">
          <div className="text-3xl mb-2">📈</div>
          <p className="text-sm text-muted font-bold">{t('workouts.needTwo')}</p>
        </Card>
      )}

      {log.length > 0 && (
        <>
          <h3 className="font-black text-green px-1 mb-2">{t('workouts.history')}</h3>
          <ul className="space-y-2">
            {log
              .slice()
              .reverse()
              .map((e) => {
                const dt = new Date(e.date);
                return (
                  <li key={e.date} className="bg-card rounded-2xl border border-line p-3 flex items-center gap-3">
                    <span className="text-xl">⚖️</span>
                    <div className="flex-1">
                      <div className="font-black text-green num">
                        {e.weightKg} {kg}
                      </div>
                      <div className="text-xs text-muted font-bold num">{fmtFullDate(dt, i18n.language)}</div>
                    </div>
                    <button onClick={() => removeEntry(e.date)} className="w-8 h-8 grid place-items-center rounded-lg text-danger active:scale-95" aria-label={t('common.delete')}>
                      <Trash2 size={18} />
                    </button>
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </div>
  );
}
