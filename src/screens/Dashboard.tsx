import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card, { StatCard } from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { computeTotals, progressLevel } from '../lib/calc';
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

  const pie = [
    { key: 'fixed', name: 'ثابتة', value: t.fixed, color: SLICE_COLORS.fixed },
    { key: 'groceries', name: 'مشتريات', value: t.groceries, color: SLICE_COLORS.groceries },
    { key: 'variable', name: 'متوقّعة', value: t.variable, color: SLICE_COLORS.variable },
    {
      key: 'remaining',
      name: 'المتبقّي',
      value: Math.max(0, t.remaining),
      color: SLICE_COLORS.remaining,
    },
  ].filter((s) => s.value > 0);

  return (
    <div>
      <ScreenHeader emoji="🏠" title="الرئيسية" subtitle="نظرة سريعة على وضعك المالي هالشهر" />

      {/* الراتب */}
      <Card className="mb-3 bg-green text-white border-gold">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/75 text-sm font-bold mb-1">الراتب الشهري</div>
            <div className="text-3xl font-black num">{fmtUSD(t.salaryUSD)}</div>
            <div className="text-gold font-bold num">{fmtTRY(t.salaryTRY)}</div>
          </div>
          <div className="text-left">
            <div className="text-white/70 text-xs font-bold">سعر الصرف</div>
            <div className="text-lg font-black num">{rate} ₺/$</div>
          </div>
        </div>
      </Card>

      {/* الرصيد المتبقّي + شريط التقدّم */}
      <Card className="mb-3">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-muted text-sm font-bold mb-1">الرصيد المتبقّي</div>
            <div
              className={`text-3xl font-black num ${
                t.remaining < 0 ? 'text-danger' : 'text-green'
              }`}
            >
              {fmtTRY(t.remaining)}
            </div>
            <div className="text-muted font-bold num">{fmtUSD(toUSD(t.remaining, rate))}</div>
          </div>
          <div className="text-left">
            <div className="text-muted text-xs font-bold">صرفت</div>
            <div className="text-xl font-black num text-ink">
              {Math.round(t.spentPercent)}%
            </div>
          </div>
        </div>
        <ProgressBar percent={t.spentPercent} />
        <div className="text-xs font-bold text-muted mt-2 num">
          {fmtTRY(t.spent)} من {fmtTRY(t.salaryTRY)}
        </div>
      </Card>

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
          valueMain={fmtTRY(t.variable)}
          valueSub={fmtUSD(toUSD(t.variable, rate))}
          tone="danger"
        />
      </div>

      {/* دائرة التوزيع */}
      <Card>
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
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    <span className="font-bold text-ink flex-1">{s.name}</span>
                    <span className="font-black num text-muted">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Card>

      <Link
        to="/expenses"
        className="mt-3 block text-center text-sm font-bold text-green underline underline-offset-4"
      >
        إدارة المصاريف ←
      </Link>
    </div>
  );
}
