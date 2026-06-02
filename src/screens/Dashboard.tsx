import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { computeTotals, progressLevel, upcomingBills, dailyAllowance, monthKey, PROGRESS_COLOR } from '../lib/calc';
import { fmtTRY, fmtUSD, toUSD } from '../lib/format';
import { tFixedName } from '../i18n/content';

const SLICE_COLORS = {
  fixed: '#062D23',
  groceries: '#C49418',
  variable: '#0E5541',
  remaining: '#E1DAC8',
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { data } = useApp();
  const tot = useMemo(() => computeTotals(data), [data]);
  const rate = tot.rate;
  const level = progressLevel(tot.spentPercent);
  const bills = useMemo(() => upcomingBills(data), [data]);
  const daily = useMemo(() => dailyAllowance(tot.remaining, tot.salaryTRY), [tot.remaining, tot.salaryTRY]);

  const pie = [
    { key: 'fixed', name: t('dash.sliceFixed'), value: tot.fixed, color: SLICE_COLORS.fixed },
    { key: 'groceries', name: t('dash.sliceGroceries'), value: tot.groceries, color: SLICE_COLORS.groceries },
    { key: 'variable', name: t('dash.sliceVariable'), value: tot.variablePlusClothing, color: SLICE_COLORS.variable },
    { key: 'remaining', name: t('dash.sliceRemaining'), value: Math.max(0, tot.remaining), color: SLICE_COLORS.remaining },
  ].filter((s) => s.value > 0);

  return (
    <div>
      <IdentityCard />

      {bills.length > 0 && <BillReminders bills={bills} />}

      <FxCard />
      <WeatherCard />
      <MetroCard />
      <WordCard />

      {/* remaining balance + progress */}
      <Card className="mb-3">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-muted text-sm font-bold mb-1">{t('dash.remaining')}</div>
            <div className={`text-3xl font-black num ${tot.remaining < 0 ? 'text-danger' : 'text-green'}`}>
              {fmtTRY(tot.remaining)}
            </div>
            <div className="text-muted font-bold num">{fmtUSD(toUSD(tot.remaining, rate))}</div>
          </div>
          <div className="text-end">
            <div className="text-muted text-xs font-bold">{t('dash.spent')}</div>
            <div className="text-xl font-black num text-ink">{Math.round(tot.spentPercent)}%</div>
          </div>
        </div>
        <ProgressBar percent={tot.spentPercent} />
        <div className="text-xs font-bold text-muted mt-2 num">
          {t('dash.spentOf', { spent: fmtTRY(tot.spent), salary: fmtTRY(tot.salaryTRY) })}
        </div>
      </Card>

      {/* daily allowance */}
      <div
        className="mb-3 rounded-card p-4 flex items-center justify-between border"
        style={{ background: `${PROGRESS_COLOR[daily.level]}14`, borderColor: `${PROGRESS_COLOR[daily.level]}66` }}
      >
        <div className="flex items-center gap-3">
          <CalendarClock style={{ color: PROGRESS_COLOR[daily.level] }} />
          <div>
            <div className="text-sm font-bold text-muted">{t('dash.dailyTitle')}</div>
            <div className="text-xs text-muted font-bold num">{t('dash.dailyDays', { days: daily.daysLeft })}</div>
          </div>
        </div>
        <div className="text-end">
          <div className="text-xl font-black num" style={{ color: PROGRESS_COLOR[daily.level] }}>
            {fmtTRY(Math.max(0, daily.perDay))}
          </div>
          <div className="text-xs font-bold text-muted num">
            {fmtUSD(toUSD(Math.max(0, daily.perDay), rate))} {t('dash.perDayUnit')}
          </div>
        </div>
      </div>

      {/* smart alert */}
      {level === 'danger' && (
        <div className="mb-3 rounded-card bg-danger/10 border border-danger/40 p-4 flex items-center gap-3 animate-pop">
          <AlertTriangle className="text-danger shrink-0" />
          <div className="text-sm font-bold text-danger">
            {t('dash.dangerLeft', { usd: fmtUSD(toUSD(tot.remaining, rate)), try: fmtTRY(tot.remaining) })}
          </div>
        </div>
      )}
      {level === 'warn' && (
        <div className="mb-3 rounded-card bg-warn/10 border border-warn/40 p-4 flex items-center gap-3 animate-pop">
          <TrendingUp className="text-warn shrink-0" />
          <div className="text-sm font-bold text-[#9a7400]">{t('dash.warn70')}</div>
        </div>
      )}

      {/* 3 stat cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <StatCard emoji="🧾" label={t('dash.statFixed')} valueMain={fmtTRY(tot.fixed)} valueSub={fmtUSD(toUSD(tot.fixed, rate))} tone="green" />
        <StatCard emoji="🛒" label={t('dash.statGroceries')} valueMain={fmtTRY(tot.groceries)} valueSub={fmtUSD(toUSD(tot.groceries, rate))} tone="gold" />
        <StatCard emoji="💸" label={t('dash.statVariable')} valueMain={fmtTRY(tot.variablePlusClothing)} valueSub={fmtUSD(toUSD(tot.variablePlusClothing, rate))} tone="danger" />
      </div>

      {/* donut */}
      <Card className="mb-3">
        <h2 className="font-black text-green mb-1">{t('dash.donutTitle')}</h2>
        {pie.length === 0 || tot.salaryTRY <= 0 ? (
          <p className="text-sm text-muted font-bold py-6 text-center">{t('dash.donutEmpty')}</p>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-1/2 h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={42} outerRadius={72} paddingAngle={2} stroke="none">
                    {pie.map((s) => (
                      <Cell key={s.key} fill={s.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-1/2 space-y-2">
              {pie.map((s) => {
                const pct = tot.salaryTRY > 0 ? Math.round((s.value / tot.salaryTRY) * 100) : 0;
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

      {/* quick notes */}
      <QuickNotes />

      <Link to="/expenses" className="mt-3 block text-center text-sm font-bold text-green underline underline-offset-4">
        {t('dash.manageExpenses')}
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------- bill reminders
function BillReminders({ bills }: { bills: ReturnType<typeof upcomingBills> }) {
  const { t } = useTranslation();
  const { update } = useApp();
  const markPaid = (id: string) =>
    update((d) => {
      const e = d.fixedExpenses.find((x) => x.id === id);
      if (e) e.paidMonth = monthKey();
    });

  const label = (n: number) =>
    n < 0 ? t('bills.overdue', { n: Math.abs(n) }) : n === 0 ? t('bills.today') : n === 1 ? t('bills.tomorrow') : t('bills.inDays', { n });

  return (
    <div className="mb-3 rounded-card bg-[#fff6e6] border border-warn/50 p-4 animate-pop">
      <div className="flex items-center gap-2 mb-2">
        <BellRing className="text-warn" size={20} />
        <h2 className="font-black text-[#9a7400]">{t('bills.title')}</h2>
      </div>
      <ul className="space-y-2">
        {bills.map(({ expense, daysUntil }) => (
          <li key={expense.id} className="flex items-center gap-2 bg-card rounded-xl border border-line p-2.5">
            <span className="text-xl shrink-0">{expense.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink truncate">{tFixedName(expense.id, t, expense.name)}</div>
              <div className={`text-xs font-black num ${daysUntil < 0 ? 'text-danger' : 'text-warn'}`}>
                {label(daysUntil)} · {fmtTRY(expense.amountTRY)}
              </div>
            </div>
            <button onClick={() => markPaid(expense.id)} className="shrink-0 bg-green text-white rounded-lg px-3 py-1.5 text-sm font-bold active:scale-95">
              {t('bills.paid')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------- quick notes
function QuickNotes() {
  const { t } = useTranslation();
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
        <h2 className="font-black text-green">{t('notes.title')}</h2>
      </div>
      <div className="flex gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          placeholder={t('notes.placeholder')}
          className="field flex-1"
        />
        <button onClick={addNote} className="btn-primary px-4" aria-label={t('common.add')}>
          <Plus size={18} />
        </button>
      </div>
      {data.notes.length === 0 ? (
        <p className="text-sm text-muted font-bold text-center py-2">{t('notes.empty')}</p>
      ) : (
        <ul className="space-y-2">
          {data.notes.map((note, i) => (
            <li key={i} className="flex items-center gap-2 bg-gold-soft/40 border border-gold/30 rounded-xl px-3 py-2">
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
                aria-label={t('common.delete')}
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
