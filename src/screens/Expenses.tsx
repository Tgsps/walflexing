import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Calendar, Camera, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { VARIABLE_CATEGORIES } from '../data/categories';
import type { MonthlySnapshot, VariableCategory } from '../types';
import { fmtTRY, fmtUSD, toUSD, uid, fmtDayMonth } from '../lib/format';
import { filterByDate, totalFixed, monthKey, snapshotForCurrentMonth, type DateFilter } from '../lib/calc';
import { tFixedName } from '../i18n/content';

type Tab = 'fixed' | 'variable' | 'compare';

export default function Expenses() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('fixed');
  return (
    <div>
      <ScreenHeader emoji="💸" title={t('nav.expenses')} subtitle={t('expenses.subtitle')} />

      <div className="grid grid-cols-3 gap-2 mb-4 bg-card rounded-2xl p-1 border border-line">
        <TabBtn active={tab === 'fixed'} onClick={() => setTab('fixed')}>
          {t('expenses.tabFixed')}
        </TabBtn>
        <TabBtn active={tab === 'variable'} onClick={() => setTab('variable')}>
          {t('expenses.tabVariable')}
        </TabBtn>
        <TabBtn active={tab === 'compare'} onClick={() => setTab('compare')}>
          {t('expenses.tabCompare')}
        </TabBtn>
      </div>

      <div className="mb-4">
        <Link to="/scanner" className="btn-ghost w-full flex items-center justify-center gap-2 bg-green/10 text-green border-green/20">
          <Camera size={18} /> مسح الفواتير بالذكاء الاصطناعي
        </Link>
      </div>

      {tab === 'fixed' && <FixedTab />}
      {tab === 'variable' && <VariableTab />}
      {tab === 'compare' && <CompareTab />}
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

// ---------------------------------------------------------------- fixed
function FixedTab() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const rate = data.settings.exchangeRate;
  const total = totalFixed(data);
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <Card className="mb-3 bg-gold-soft border-gold">
        <div className="flex items-center justify-between">
          <span className="font-black text-green">{t('expenses.totalFixed')}</span>
          <div className="text-end">
            <div className="text-xl font-black text-green num">{fmtTRY(total)}</div>
            <div className="text-sm font-bold text-green/70 num">{fmtUSD(toUSD(total, rate))}</div>
          </div>
        </div>
      </Card>

      <ul className="space-y-2">
        {data.fixedExpenses.map((e) => (
          <li key={e.id} className="bg-card rounded-2xl border border-line p-3 flex items-center gap-3">
            <span className="text-2xl shrink-0" aria-hidden>
              {e.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink truncate">{tFixedName(e.id, t, e.name)}</div>
              {e.dueDay ? (
                <div className="text-xs text-muted font-bold flex items-center gap-1">
                  <Calendar size={12} /> {t('expenses.dueOn', { n: e.dueDay })}
                </div>
              ) : (
                <div className="text-xs text-muted font-bold num">{fmtUSD(toUSD(e.amountTRY, rate))}</div>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                inputMode="numeric"
                value={e.amountTRY || ''}
                onChange={(ev) =>
                  update((d) => {
                    const item = d.fixedExpenses.find((x) => x.id === e.id);
                    if (item) item.amountTRY = Number(ev.target.value) || 0;
                  })
                }
                className="w-20 bg-cream/60 border-2 border-line rounded-lg px-2 py-1.5 text-end font-black text-green num focus:border-gold focus:outline-none"
              />
              <span className="text-muted font-black">₺</span>
              <button
                onClick={() =>
                  update((d) => {
                    d.fixedExpenses = d.fixedExpenses.filter((x) => x.id !== e.id);
                  })
                }
                className="w-8 h-8 grid place-items-center rounded-lg text-danger active:scale-95"
                aria-label={t('common.delete')}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => setAdding(true)} className="btn-ghost w-full mt-3 flex items-center justify-center gap-2">
        <Plus size={18} /> {t('expenses.addCustom')}
      </button>

      {adding && <AddFixedModal onClose={() => setAdding(false)} />}
    </div>
  );
}

function AddFixedModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { update } = useApp();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📌');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('');

  const save = () => {
    if (!name.trim()) return;
    update((d) => {
      d.fixedExpenses.push({
        id: uid('f'),
        name: name.trim(),
        emoji: emoji.trim() || '📌',
        amountTRY: Number(amount) || 0,
        dueDay: dueDay ? Number(dueDay) : undefined,
      });
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={t('expenses.newFixed')}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="field w-16 text-center text-2xl" aria-label="emoji" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('expenses.itemName')} className="field flex-1" />
        </div>
        <label className="block">
          <span className="text-sm font-bold text-muted">{t('expenses.amountLira')}</span>
          <input type="number" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="field mt-1 num" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-muted">{t('expenses.dueDayOpt')}</span>
          <input type="number" inputMode="numeric" value={dueDay} onChange={(e) => setDueDay(e.target.value)} placeholder={t('expenses.dueDayPh')} className="field mt-1 num" />
        </label>
        <button onClick={save} className="btn-primary w-full">
          {t('common.add')}
        </button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------- variable
function VariableTab() {
  const { t, i18n } = useTranslation();
  const { data, update } = useApp();
  const rate = data.settings.exchangeRate;
  const [cat, setCat] = useState<VariableCategory>('coffee');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState<DateFilter>('month');

  const catMeta = (k: VariableCategory) => VARIABLE_CATEGORIES.find((c) => c.key === k);

  const add = () => {
    const val = Number(amount);
    if (!val || val <= 0) return;
    update((d) => {
      d.variableExpenses.push({ id: uid('v'), category: cat, amountTRY: val, date: new Date().toISOString(), note: note.trim() || undefined });
    });
    setAmount('');
    setNote('');
  };

  const filtered = useMemo(
    () => filterByDate(data.variableExpenses, filter).slice().sort((a, b) => b.date.localeCompare(a.date)),
    [data.variableExpenses, filter],
  );
  const total = filtered.reduce((s, e) => s + e.amountTRY, 0);
  const perCat = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of filtered) m[e.category] = (m[e.category] || 0) + e.amountTRY;
    return m;
  }, [filtered]);

  return (
    <div>
      <Card className="mb-3">
        <div className="text-sm font-black text-green mb-2">{t('expenses.quickAdd')}</div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2">
          {VARIABLE_CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`chip shrink-0 ${cat === c.key ? 'bg-green text-white border-green' : 'bg-cream text-ink border-line'}`}
            >
              {c.emoji} {t(`varCat.${c.key}`)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('expenses.amountPh')}
            className="field flex-1 num"
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <button onClick={add} className="btn-primary px-5 flex items-center gap-1">
            <Plus size={18} /> {t('common.add')}
          </button>
        </div>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('expenses.notePh')} className="field mt-2" />
      </Card>

      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1 bg-card rounded-xl p-1 border border-line">
          {([
            ['today', t('common.today')],
            ['week', t('common.week')],
            ['month', t('common.month')],
          ] as [DateFilter, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${filter === k ? 'bg-gold text-green' : 'text-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="text-end">
          <div className="text-lg font-black text-danger num">{fmtTRY(total)}</div>
          <div className="text-xs font-bold text-muted num">{fmtUSD(toUSD(total, rate))}</div>
        </div>
      </div>

      {Object.keys(perCat).length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
          {Object.entries(perCat)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => (
              <div key={k} className="shrink-0 bg-card border border-line rounded-xl px-3 py-2 text-center">
                <div className="text-sm font-bold">
                  {catMeta(k as VariableCategory)?.emoji} {t(`varCat.${k}`)}
                </div>
                <div className="text-sm font-black text-green num">{fmtTRY(v)}</div>
              </div>
            ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted font-bold py-8">{t('expenses.emptyVariable')}</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((e) => {
            const meta = catMeta(e.category);
            const d = new Date(e.date);
            const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            const day = fmtDayMonth(d, i18n.language);
            return (
              <li key={e.id} className="bg-card rounded-2xl border border-line p-3 flex items-center gap-3">
                <span className="text-2xl shrink-0" aria-hidden>
                  {meta?.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink">{t(`varCat.${e.category}`)}</div>
                  <div className="text-xs text-muted font-bold">
                    {e.note ? `${e.note} · ` : ''}
                    <span className="num">
                      {day} · {time}
                    </span>
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <div className="font-black text-danger num">{fmtTRY(e.amountTRY)}</div>
                  <div className="text-[11px] text-muted font-bold num">{fmtUSD(toUSD(e.amountTRY, rate))}</div>
                </div>
                <button
                  onClick={() =>
                    update((dd) => {
                      dd.variableExpenses = dd.variableExpenses.filter((x) => x.id !== e.id);
                    })
                  }
                  className="w-8 h-8 grid place-items-center rounded-lg text-danger active:scale-95 shrink-0"
                  aria-label={t('common.delete')}
                >
                  <Trash2 size={18} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- compare
const COMPARE_ROWS: {
  key: keyof Pick<MonthlySnapshot, 'fixed' | 'variable' | 'shopping' | 'clothing'>;
  labelKey: string;
  emoji: string;
}[] = [
  { key: 'fixed', labelKey: 'dash.sliceFixed', emoji: '🧾' },
  { key: 'variable', labelKey: 'dash.sliceVariable', emoji: '💸' },
  { key: 'shopping', labelKey: 'dash.sliceGroceries', emoji: '🛒' },
  { key: 'clothing', labelKey: 'nav.clothes', emoji: '👕' },
];

function CompareTab() {
  const { t } = useTranslation();
  const { data, snapshotMonth } = useApp();
  const [msg, setMsg] = useState<string | null>(null);
  const curKey = monthKey();
  const current = useMemo(() => snapshotForCurrentMonth(data), [data]);

  const prev = useMemo(() => {
    const past = data.monthlyHistory.filter((m) => m.month < curKey);
    return past.length ? past[past.length - 1] : null;
  }, [data.monthlyHistory, curKey]);

  const save = () => {
    snapshotMonth();
    setMsg(t('expenses.snapDone'));
    setTimeout(() => setMsg(null), 2200);
  };

  return (
    <div>
      <Card className="mb-3">
        <h2 className="font-black text-green mb-2">{t('expenses.snapTitle')}</h2>
        <p className="text-xs text-muted font-bold mb-3">{t('expenses.snapDesc')}</p>
        <button onClick={save} className="btn-primary w-full flex items-center justify-center gap-2">
          <Camera size={18} /> {t('expenses.snapBtn')}
        </button>
        {msg && <div className="text-center text-sm font-bold text-green mt-2 animate-pop">{msg}</div>}
      </Card>

      {!prev ? (
        <Card className="text-center py-8">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm text-muted font-bold whitespace-pre-line">{t('expenses.noPrev')}</p>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-green">{t('expenses.compare')}</h2>
            <div className="text-xs font-bold text-muted num" dir="ltr">
              {prev.month} → {curKey}
            </div>
          </div>
          <ul className="space-y-2">
            {COMPARE_ROWS.map((row) => {
              const prevVal = prev[row.key];
              const curVal = current[row.key];
              const delta = curVal - prevVal;
              return (
                <li key={row.key} className="bg-cream/60 rounded-xl border border-line p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-ink">
                      {row.emoji} {t(row.labelKey)}
                    </span>
                    <DeltaBadge delta={delta} />
                  </div>
                  <div className="flex items-center justify-between text-sm num">
                    <span className="text-muted font-bold">{t('expenses.prev', { v: fmtTRY(prevVal) })}</span>
                    <span className="text-green font-black">{t('expenses.curr', { v: fmtTRY(curVal) })}</span>
                  </div>
                </li>
              );
            })}
            {(() => {
              const prevTotal = prev.fixed + prev.variable + prev.shopping + prev.clothing;
              const curTotal = current.fixed + current.variable + current.shopping + current.clothing;
              const delta = curTotal - prevTotal;
              return (
                <li className="bg-green text-white rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black">{t('expenses.total')}</span>
                    <DeltaBadge delta={delta} inverted />
                  </div>
                  <div className="flex items-center justify-between text-sm num">
                    <span className="text-white/75 font-bold">{t('expenses.prev', { v: fmtTRY(prevTotal) })}</span>
                    <span className="font-black text-gold">{t('expenses.curr', { v: fmtTRY(curTotal) })}</span>
                  </div>
                </li>
              );
            })()}
          </ul>
        </Card>
      )}
    </div>
  );
}

function DeltaBadge({ delta, inverted = false }: { delta: number; inverted?: boolean }) {
  const { t } = useTranslation();
  if (Math.abs(delta) < 1) {
    return (
      <span className="flex items-center gap-1 text-xs font-black text-muted num">
        <Minus size={14} /> {t('expenses.flat')}
      </span>
    );
  }
  const up = delta > 0;
  const good = !up;
  const color = good ? '#2E9E6B' : '#D9534F';
  const bg = inverted ? 'bg-white/15' : '';
  return (
    <span
      className={`flex items-center gap-1 text-xs font-black num px-2 py-0.5 rounded-full ${bg}`}
      style={{ color: inverted ? (good ? '#9be8c2' : '#ffc9c7') : color }}
    >
      {up ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
      {fmtTRY(Math.abs(delta))}
    </span>
  );
}
