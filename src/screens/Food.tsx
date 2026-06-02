import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, BookOpen, Check, Clock } from 'lucide-react';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { GROCERY_CATEGORIES } from '../data/categories';
import { RECIPE_BY_ID } from '../data/recipes';
import { WEEK_DAYS, JS_DAY_TO_AR } from '../data/seed';
import type { MealSlot } from '../types';
import { fmtTRY, fmtUSD, toUSD } from '../lib/format';
import { tMeal, tGroceryName, tGroceryQty, tDayName, getRecipe } from '../i18n/content';

type Tab = 'groceries' | 'meals';
const WEEKS = [1, 2, 3, 4];

export default function Food() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('groceries');
  return (
    <div>
      <ScreenHeader emoji="🍽️" title={t('nav.food')} subtitle={t('food.subtitle')} />

      <div className="grid grid-cols-2 gap-2 mb-4 bg-card rounded-2xl p-1 border border-line">
        <TabBtn active={tab === 'groceries'} onClick={() => setTab('groceries')}>
          {t('food.tabGroceries')}
        </TabBtn>
        <TabBtn active={tab === 'meals'} onClick={() => setTab('meals')}>
          {t('food.tabMeals')}
        </TabBtn>
      </div>

      {tab === 'groceries' ? <GroceriesTab /> : <MealsTab />}
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

function WeekPicker({ value, onChange }: { value: number; onChange: (w: number) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2 mb-3">
      {WEEKS.map((w) => (
        <button
          key={w}
          onClick={() => onChange(w)}
          className={`flex-1 py-2 rounded-xl font-black text-sm transition border-2 ${
            value === w ? 'bg-gold text-green border-gold' : 'bg-card text-muted border-line'
          }`}
        >
          {t('food.week', { n: w })}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- groceries
function GroceriesTab() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const rate = data.settings.exchangeRate;
  const [week, setWeek] = useState(1);

  const checked = useMemo(
    () => new Set(data.shopping.weeks.find((w) => w.week === week)?.checkedIds ?? []),
    [data.shopping.weeks, week],
  );

  const weekTotal = useMemo(() => {
    const byId = new Map(data.groceries.map((g) => [g.id, g.priceTRY]));
    let s = 0;
    checked.forEach((id) => (s += byId.get(id) ?? 0));
    return s;
  }, [checked, data.groceries]);

  const monthTotal = data.groceries.reduce((s, g) => s + g.priceTRY, 0);

  const toggle = (id: string) =>
    update((d) => {
      const wk = d.shopping.weeks.find((w) => w.week === week);
      if (!wk) return;
      wk.checkedIds = wk.checkedIds.includes(id) ? wk.checkedIds.filter((x) => x !== id) : [...wk.checkedIds, id];
    });

  const resetWeek = () =>
    update((d) => {
      const wk = d.shopping.weeks.find((w) => w.week === week);
      if (wk) wk.checkedIds = [];
    });

  const setPrice = (id: string, val: number) =>
    update((d) => {
      const g = d.groceries.find((x) => x.id === id);
      if (g) g.priceTRY = val;
    });

  return (
    <div>
      <WeekPicker value={week} onChange={setWeek} />

      <Card className="mb-3 bg-green text-white border-gold">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/75 text-sm font-bold">{t('food.groceriesSpent', { n: week })}</div>
            <div className="text-2xl font-black num">{fmtTRY(weekTotal)}</div>
            <div className="text-gold font-bold num">{fmtUSD(toUSD(weekTotal, rate))}</div>
          </div>
          <button onClick={resetWeek} className="flex flex-col items-center gap-1 bg-white/15 rounded-xl px-3 py-2 active:scale-95">
            <RotateCcw size={20} />
            <span className="text-xs font-bold">{t('food.resetWeek')}</span>
          </button>
        </div>
        <div className="text-xs text-white/70 font-bold mt-2 num">
          {t('food.monthList', { try: fmtTRY(monthTotal), usd: fmtUSD(toUSD(monthTotal, rate)) })}
        </div>
      </Card>

      {GROCERY_CATEGORIES.map((cat) => {
        const items = data.groceries.filter((g) => g.category === cat.key);
        if (items.length === 0) return null;
        const catTotal = items.reduce((s, g) => s + g.priceTRY, 0);
        return (
          <div key={cat.key} className="mb-4">
            <div className="flex items-center justify-between px-1 mb-2">
              <h3 className="font-black text-green">
                {cat.emoji} {t(`groceryCat.${cat.key}`)}
              </h3>
              <span className="text-xs font-bold text-muted num">{fmtTRY(catTotal)}</span>
            </div>
            <ul className="space-y-2">
              {items.map((g) => {
                const on = checked.has(g.id);
                return (
                  <li
                    key={g.id}
                    className={`rounded-2xl border p-3 flex items-center gap-3 transition ${on ? 'bg-gold-soft/60 border-gold' : 'bg-card border-line'}`}
                  >
                    <button
                      onClick={() => toggle(g.id)}
                      className={`w-7 h-7 shrink-0 rounded-full border-2 grid place-items-center transition ${on ? 'bg-gold border-gold text-green' : 'border-line text-transparent'}`}
                      aria-label={t('food.ateIt')}
                    >
                      <Check size={16} strokeWidth={3} />
                    </button>
                    <span className="text-xl shrink-0" aria-hidden>
                      {g.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold ${on ? 'line-through text-muted' : 'text-ink'}`}>{tGroceryName(g.id, t, g.name)}</div>
                      <div className="text-xs text-muted font-bold">{tGroceryQty(g.id, t, g.qty)}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={g.priceTRY || ''}
                        onChange={(e) => setPrice(g.id, Number(e.target.value) || 0)}
                        className="w-16 bg-cream/60 border-2 border-line rounded-lg px-2 py-1 text-end font-black text-green num focus:border-gold focus:outline-none"
                      />
                      <span className="text-muted font-black text-sm">₺</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- meal plan
const SLOTS: { key: MealSlot; emoji: string }[] = [
  { key: 'breakfast', emoji: '🥚' },
  { key: 'lunch', emoji: '🍗' },
  { key: 'dinner', emoji: '🥗' },
];

function MealsTab() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const todayAr = JS_DAY_TO_AR[new Date().getDay()];
  const [week, setWeek] = useState(1);
  const [day, setDay] = useState<string>(WEEK_DAYS.includes(todayAr as (typeof WEEK_DAYS)[number]) ? todayAr : 'السبت');
  const [recipeId, setRecipeId] = useState<string | null>(null);

  const weekData = data.meals.weeks.find((w) => w.week === week);
  const dayData = weekData?.days.find((d) => d.day === day);

  const toggleDone = (slot: MealSlot) =>
    update((d) => {
      const wd = d.meals.weeks.find((w) => w.week === week)?.days.find((x) => x.day === day);
      if (wd) wd.done[slot] = !wd.done[slot];
    });

  const doneCount = dayData ? SLOTS.filter((s) => dayData.done[s.key]).length : 0;

  return (
    <div>
      <WeekPicker value={week} onChange={setWeek} />

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
        {WEEK_DAYS.map((dname) => {
          const isToday = dname === todayAr;
          const active = dname === day;
          return (
            <button
              key={dname}
              onClick={() => setDay(dname)}
              className={`chip shrink-0 relative ${active ? 'bg-green text-white border-green' : 'bg-card text-ink border-line'}`}
            >
              {tDayName(dname, t)}
              {isToday && <span className="absolute -top-1 ltr:-left-1 rtl:-right-1 w-2.5 h-2.5 rounded-full bg-gold border border-white" />}
            </button>
          );
        })}
      </div>

      {dayData && (
        <>
          <Card className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-muted">
                {t('food.mealsHeader', { week, day: tDayName(day, t) })}
                {day === todayAr && <span className="text-gold">{t('food.todayTag')}</span>}
              </div>
              <div className="font-black text-green">{t('food.ateCount', { n: doneCount })}</div>
            </div>
            <div className="text-2xl">{doneCount === 3 ? '🎉' : '🍽️'}</div>
          </Card>

          <div className="space-y-3">
            {SLOTS.map((slot) => {
              const text = dayData[slot.key];
              const rid = dayData.recipes[slot.key];
              const hasRecipe = rid && RECIPE_BY_ID[rid];
              const done = dayData.done[slot.key];
              return (
                <div
                  key={slot.key}
                  className={`rounded-card border p-4 transition ${done ? 'bg-gold-soft/50 border-gold' : 'bg-card border-line shadow-soft'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl" aria-hidden>
                      {slot.emoji}
                    </span>
                    <span className="font-black text-green">{t(`slots.${slot.key}`)}</span>
                  </div>
                  <p className={`font-bold mb-3 ${done ? 'text-muted line-through' : 'text-ink'}`}>{tMeal(text, t)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleDone(slot.key)}
                      className={`flex-1 rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition ${done ? 'bg-green text-white' : 'border-2 border-line text-muted'}`}
                    >
                      <Check size={16} strokeWidth={3} /> {done ? t('food.ateIt') : t('food.markAte')}
                    </button>
                    {hasRecipe && (
                      <button onClick={() => setRecipeId(rid!)} className="btn-gold px-4 py-2.5 text-sm flex items-center gap-2">
                        <BookOpen size={16} /> {t('food.recipe')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <RecipeModal recipeId={recipeId} onClose={() => setRecipeId(null)} />
    </div>
  );
}

function RecipeModal({ recipeId, onClose }: { recipeId: string | null; onClose: () => void }) {
  const { t } = useTranslation();
  if (!recipeId) return null;
  const meta = RECIPE_BY_ID[recipeId];
  if (!meta) return null;
  const recipe = getRecipe(recipeId, meta.emoji, t);
  return (
    <Modal open onClose={onClose} title={recipe.title}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{recipe.emoji}</span>
          <div>
            <div className="font-bold text-green">{recipe.subtitle}</div>
            <div className="text-sm text-muted font-bold flex items-center gap-1">
              <Clock size={14} /> {recipe.time}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-black text-green mb-2">{t('food.ingredients')}</h3>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-bold text-ink">
                <span className="text-gold mt-0.5">•</span>
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-black text-green mb-2">{t('food.steps')}</h3>
          <ol className="space-y-2">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-bold text-ink">
                <span className="w-6 h-6 shrink-0 rounded-full bg-green text-white grid place-items-center text-xs num">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-gold-soft border border-gold rounded-2xl p-3 text-sm font-bold text-[#6b5800]">
          💡 <span className="font-black">{t('food.tip')}</span> {recipe.tip}
        </div>
      </div>
    </Modal>
  );
}
