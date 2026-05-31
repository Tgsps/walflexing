import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, BellRing, Plus, X, StickyNote, CalendarClock } from 'lucide-react';
import { useApp } from '../state/AppContext';
import Card, { StatCard } from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import IdentityCard from '../components/IdentityCard';
import FxCard from '../components/FxCard';
import WeatherCard from '../components/WeatherCard';
import MetroCard from '../components/MetroCard';
import WordCard from '../components/WordCard';
import {
  computeTotals,
  progressLevel,
  upcomingBills,
  dailyAllowance,
  monthKey,
  PROGRESS_COLOR,
} from '../lib/calc';
import { fmtTRY, fmtUSD, toUSD } from '../lib/format';

const SLICE_COLORS = {
  fixed: '#0E4D3C',
  groceries: '#C9A227',
  variable: '#1C7A60',
  remaining: '#E7E1D3',
};

export default function Dashboard() {
  const { data } = useApp();
  const t = useMemo(() => computeTotals(data), [data]);
  const rate = t.rate;
  const level = progressLevel(t.spentPercent);
  const bills = useMemo(() => upcomingBills(data), [data]);
  const daily = useMemo(() => dailyAllowance(t.remaining, t.salaryTRY), [t.remaining, t.salaryTRY]);

  const pie = [
    { key: 'fixed', name: 'ثابتة', value: t.fixed, color: SLICE_COLORS.fixed },
    { key: 'groceries', name: 'مشتريات', value: t.groceries, color: SLICE_COLORS.groceries },
    { key: 'variable', name: 'متوقّعة', value: t.variablePlusClothing, color: SLICE_COLORS.variable },
    {
      key: 'remaining',
      name: 'المتبقّي',
      value: Math.max(0, t.remaining),
      color: SLICE_COLORS.remaining,
    },
  ].filter((s) => s.value > 0);

  return (
    <div>
      <IdentityCard />

      {bills.length > 0 && <BillReminders bills={bills} />}

      <FxCard />
      <WeatherCard />
      <MetroCard />
      <WordCard />

      {/* الرصيد المتبقّي + شريط التقدّم */}
      <Card className="mb-3">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-muted text-sm font-bold mb-1">الرصيد المتبقّي</div>
            <div
              className={`text-3xl font-black num ${t.remaining < 0 ? 'text-danger' : 'text-green'}`}
            >
              {fmtTRY(t.remaining)}
            </div>
            <div className="text-muted font-bold num">{fmtUSD(toUSD(t.remaining, rate))}</div>
          </div>
          <div className="text-left">
            <div className="text-muted text-xs font-bold">صرفت</div>
            <div className="text-xl font-black num text-ink">{Math.round(t.spentPercent)}%</div>
          </div>
        </div>
        <ProgressBar percent={t.spentPercent} />
        <div className="text-xs font-bold text-muted mt-2 num">
          {fmtTRY(t.spent)} من {fmtTRY(t.salaryTRY)}
        </div>
      </Card>

      {/* حاسبة اليوم */}
      <div
        className="mb-3 rounded-card p-4 flex items-center justify-between border"
        style={{ background: `${PROGRESS_COLOR[daily.level]}14`, borderColor: `${PROGRESS_COLOR[daily.level]}66` }}
      >
        <div className="flex items-center gap-3">
          <CalendarClock style={{ color: PROGRESS_COLOR[daily.level] }} />
          <div>
            <div className="text-sm font-bold text-muted">تقدر تصرف يومياً</div>
            <div className="text-xs text-muted font-bold num">
              لباقي {daily.daysLeft} يوم بالشهر
            </div>
          </div>
        </div>
        <div className="text-left">
          <div className="text-xl font-black num" style={{ color: PROGRESS_COLOR[daily.level] }}>
            {fmtTRY(Math.max(0, daily.perDay))}
          </div>
          <div className="text-xs font-bold text-muted num">
            {fmtUSD(toUSD(Math.max(0, daily.perDay), rate))} / يوم
          </div>
        </div>
      </div>

      {/* تنبيه ذكي */}
      {level === 'danger' && (
        <div className="mb-3 rounded-card bg-danger/10 border border-danger/40 p-4 flex items-center gap-3 animate-pop">
          <AlertTriangle className="text-danger shrink-0" />
          <div className="text-sm font-bold text-danger">
            انتبه! باقي لك <span className="num">{fmtUSD(toUSD(t.remaining, rate))}</span> (
            <span className="num">{fmtTRY(t.remaining)}</span>) لباقي الشهر.
          </div>
        </div>
      )}
      {level === 'warn' && (
        <div className="mb-3 rounded-card bg-warn/10 border border-warn/40 p-4 flex items-center gap-3 animate-pop">
          <TrendingUp className="text-warn shrink-0" />
          <div className="text-sm font-bold text-[#9a7400]">
            صرفت أكثر من 70% من راتبك — خفّف شوي للباقي.
          </div>
        </div>
      )}

      {/* 3 بطاقات سريعة */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatCard
          emoji="🧾"
          label="ثابتة"
          valueMain={fmtTRY(t.fixed)}
          valueSub={fmtUSD(toUSD(t.fixed, rate))}
          tone="green"
        />
        <StatCard
          emoji="🛒"
          label="مشتريات"
          valueMain={fmtTRY(t.groceries)}
          valueSub={fmtUSD(toUSD(t.groceries, rate))}
          tone="gold"
        />
        <StatCard
          emoji="💸"
          label="متوقّعة"
          valueMain={fmtTRY(t.variablePlusClothing)}
          valueSub={fmtUSD(toUSD(t.variablePlusClothing, rate))}
          tone="danger"
        />
      </div>

      {/* دائرة التوزيع */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-1">توزيع المصاريف</h2>
        {pie.length === 0 || t.salaryTRY <= 0 ? (
          <p className="text-sm text-muted font-bold py-6 text-center">
            أضف راتبك ومصاريفك عشان يظهر التوزيع 📊
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-1/2 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={72}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {pie.map((s) => (
                      <Cell key={s.key} fill={s.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-1/2 space-y-2">
              {pie.map((s) => {
                const pct = t.salaryTRY > 0 ? Math.round((s.value / t.salaryTRY) * 100) : 0;
                return (
                  <li key={s.key} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="font-bold text-ink flex-1">{s.name}</span>
                    <span className="font-black num text-muted">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Card>

      {/* ملاحظات سريعة */}
      <QuickNotes />

      <Link
        to="/expenses"
        className="mt-3 block text-center text-sm font-bold text-green underline underline-offset-4"
      >
        إدارة المصاريف ←
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------- تذكيرات الفواتير
function BillReminders({ bills }: { bills: ReturnType<typeof upcomingBills> }) {
  const { update } = useApp();
  const markPaid = (id: string) =>
    update((d) => {
      const e = d.fixedExpenses.find((x) => x.id === id);
      if (e) e.paidMonth = monthKey();
    });

  const label = (n: number) =>
    n < 0 ? `متأخّرة ${Math.abs(n)} يوم` : n === 0 ? 'تستحق اليوم' : n === 1 ? 'بكرا' : `بعد ${n} يوم`;

  return (
    <div className="mb-3 rounded-card bg-[#fff6e6] border border-warn/50 p-4 animate-pop">
      <div className="flex items-center gap-2 mb-2">
        <BellRing className="text-warn" size={20} />
        <h2 className="font-black text-[#9a7400]">تذكير فواتير</h2>
      </div>
      <ul className="space-y-2">
        {bills.map(({ expense, daysUntil }) => (
          <li key={expense.id} className="flex items-center gap-2 bg-card rounded-xl border border-line p-2.5">
            <span className="text-xl shrink-0">{expense.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink truncate">{expense.name}</div>
              <div
                className={`text-xs font-black num ${daysUntil < 0 ? 'text-danger' : 'text-warn'}`}
              >
                {label(daysUntil)} · {fmtTRY(expense.amountTRY)}
              </div>
            </div>
            <button
              onClick={() => markPaid(expense.id)}
              className="shrink-0 bg-green text-white rounded-lg px-3 py-1.5 text-sm font-bold active:scale-95"
            >
              دفعت ✓
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------- ملاحظات سريعة
function QuickNotes() {
  const { data, update } = useApp();
  const [draft, setDraft] = useState('');

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    update((d) => {
      d.notes.unshift(text);
    });
    setDraft('');
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="text-gold" size={20} />
        <h2 className="font-black text-green">ملاحظات سريعة</h2>
      </div>
      <div className="flex gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          placeholder="أضف ملاحظة…"
          className="field flex-1"
        />
        <button onClick={addNote} className="btn-primary px-4" aria-label="إضافة">
          <Plus size={18} />
        </button>
      </div>
      {data.notes.length === 0 ? (
        <p className="text-sm text-muted font-bold text-center py-2">ما في ملاحظات بعد 📝</p>
      ) : (
        <ul className="space-y-2">
          {data.notes.map((note, i) => (
            <li
              key={i}
              className="flex items-center gap-2 bg-gold-soft/40 border border-gold/30 rounded-xl px-3 py-2"
            >
              <input
                value={note}
                onChange={(e) =>
                  update((d) => {
                    d.notes[i] = e.target.value;
                  })
                }
                className="flex-1 bg-transparent font-bold text-ink focus:outline-none"
              />
              <button
                onClick={() =>
                  update((d) => {
                    d.notes.splice(i, 1);
                  })
                }
                className="w-7 h-7 grid place-items-center rounded-lg text-danger shrink-0 active:scale-95"
                aria-label="حذف"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
