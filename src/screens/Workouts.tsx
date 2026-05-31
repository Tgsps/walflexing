import { useMemo, useState } from 'react';
import { Check, Flame, Pencil, Moon, Dumbbell } from 'lucide-react';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import { JS_DAY_TO_AR } from '../data/seed';
import { currentWeekDates } from '../lib/calc';

export default function Workouts() {
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

  // مؤشر الالتزام الأسبوعي
  const trainingDays = data.workout.schedule.filter((s) => !s.rest);
  const doneThisWeek = trainingDays.filter((s) => isDone(s.day)).length;
  const totalTraining = trainingDays.length;

  // عدّاد الأيام المتتالية (streak)
  const streak = useMemo(() => computeStreak(data.workout.schedule, doneByDate), [
    data.workout.schedule,
    doneByDate,
  ]);

  const todaySchedule = data.workout.schedule.find((s) => s.day === todayAr);

  return (
    <div>
      <ScreenHeader
        emoji="🏋️"
        title="التمارين"
        subtitle="جدولك الأسبوعي والتزامك"
        action={
          <button
            onClick={() => setEditing((v) => !v)}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm font-bold flex items-center gap-1 ${
              editing ? 'bg-green text-white' : 'border-2 border-gold/70 text-green'
            }`}
          >
            <Pencil size={15} /> {editing ? 'تم' : 'تعديل'}
          </button>
        }
      />

      {/* تمرين اليوم */}
      {todaySchedule && (
        <Card className="mb-3 bg-green text-white border-gold">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/75 text-sm font-bold mb-1">تمرين اليوم · {todayAr}</div>
              <div className="text-2xl font-black flex items-center gap-2">
                {todaySchedule.rest ? (
                  <>
                    <Moon size={22} className="text-gold" /> راحة 😴
                  </>
                ) : (
                  <>
                    <Dumbbell size={22} className="text-gold" /> {todaySchedule.focus}
                  </>
                )}
              </div>
            </div>
            {!todaySchedule.rest && (
              <button
                onClick={() => toggleDone(todayAr)}
                className={`w-16 h-16 rounded-2xl grid place-items-center transition active:scale-95 ${
                  isDone(todayAr) ? 'bg-gold text-green' : 'bg-white/15 text-white'
                }`}
                aria-label="تم التمرين"
              >
                <Check size={28} strokeWidth={3} />
              </button>
            )}
          </div>
        </Card>
      )}

      {/* مؤشرات الالتزام */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Card className="text-center">
          <div className="text-sm font-bold text-muted mb-1">التزام الأسبوع</div>
          <div className="text-2xl font-black text-green num">
            {doneThisWeek} / {totalTraining}
          </div>
          <div className="text-xs font-bold text-muted">أيام تمرين أنجزتها 💪</div>
        </Card>
        <Card className="text-center">
          <div className="text-sm font-bold text-muted mb-1">أيام متتالية</div>
          <div className="text-2xl font-black text-gold num flex items-center justify-center gap-1">
            <Flame size={22} className="text-gold" /> {streak}
          </div>
          <div className="text-xs font-bold text-muted">streak 🔥</div>
        </Card>
      </div>

      {/* الجدول الأسبوعي */}
      <h3 className="font-black text-green px-1 mb-2">الجدول الأسبوعي</h3>
      <ul className="space-y-2">
        {data.workout.schedule.map((s) => {
          const today = s.day === todayAr;
          const done = isDone(s.day);
          return (
            <li
              key={s.day}
              className={`rounded-2xl border p-3 flex items-center gap-3 transition ${
                today ? 'border-gold bg-gold-soft/40' : 'border-line bg-card'
              }`}
            >
              <div className="w-16 shrink-0">
                <div className="font-black text-green">{s.day}</div>
                {today && <div className="text-[11px] font-bold text-gold">اليوم</div>}
              </div>

              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={s.focus}
                      onChange={(e) => setFocus(s.day, e.target.value)}
                      className="field py-1.5 text-sm"
                      placeholder="تمرين اليوم"
                    />
                    <button
                      onClick={() => toggleRest(s.day)}
                      className={`shrink-0 rounded-lg px-2 py-1.5 text-xs font-bold border-2 ${
                        s.rest ? 'bg-green text-white border-green' : 'border-line text-muted'
                      }`}
                    >
                      راحة
                    </button>
                  </div>
                ) : s.rest ? (
                  <span className="font-bold text-muted flex items-center gap-1">
                    <Moon size={16} /> راحة
                  </span>
                ) : (
                  <span className="font-bold text-ink">{s.focus}</span>
                )}
              </div>

              {!editing && !s.rest && (
                <button
                  onClick={() => toggleDone(s.day)}
                  className={`w-9 h-9 shrink-0 rounded-full border-2 grid place-items-center transition ${
                    done ? 'bg-green border-green text-white' : 'border-line text-transparent'
                  }`}
                  aria-label="تم"
                >
                  <Check size={18} strokeWidth={3} />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-muted font-bold text-center mt-3">
        تقدر تعدّل أي يوم من زر «تعديل» فوق — حتى يوم السبت حدّده زي ما يناسبك.
      </p>
    </div>
  );
}

function computeStreak(
  schedule: { day: string; rest: boolean }[],
  doneByDate: Map<string, boolean>,
): number {
  const restByDay = new Map(schedule.map((s) => [s.day, s.rest]));
  let streak = 0;
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);
  for (let i = 0; i < 400; i++) {
    const dayName = JS_DAY_TO_AR[cur.getDay()];
    const iso = cur.toISOString().slice(0, 10);
    const rest = restByDay.get(dayName) === true;
    if (!rest) {
      if (doneByDate.get(iso) === true) {
        streak++;
      } else if (i !== 0) {
        // يوم تمرين فات بدون إنجاز -> ينقطع
        break;
      }
      // i===0 (اليوم) وغير منجز: لا نكسر، اليوم ما خلص بعد
    }
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}
