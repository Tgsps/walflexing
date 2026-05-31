import { useMemo, useState } from 'react';
import { Plus, Trash2, ShoppingBag, Check, Store, ChevronDown } from 'lucide-react';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { WARDROBE_STORES } from '../data/seed';
import { clothingThisMonth } from '../lib/calc';
import { fmtTRY, fmtUSD, toUSD, uid } from '../lib/format';
import type { OwnedItem, Priority, WardrobeCategory, WardrobeStatus, WishlistItem } from '../types';

type Tab = 'owned' | 'wishlist';

const CATEGORIES: WardrobeCategory[] = ['قمصان', 'بنطلونات', 'طبقات', 'أحذية', 'إكسسوار'];
const CAT_EMOJI: Record<WardrobeCategory, string> = {
  قمصان: '👕',
  بنطلونات: '👖',
  طبقات: '🧥',
  أحذية: '👟',
  إكسسوار: '⌚',
};
const STATUS_LABEL: Record<WardrobeStatus, string> = { owned: 'موجود', sold: 'مُباع', damaged: 'تالف' };
const PRIORITY_LABEL: Record<Priority, string> = { high: 'عالية', medium: 'متوسطة', low: 'منخفضة' };
const PRIORITY_STYLE: Record<Priority, string> = {
  high: 'bg-danger/10 text-danger border-danger/40',
  medium: 'bg-warn/10 text-[#9a7400] border-warn/40',
  low: 'bg-ok/10 text-ok border-ok/40',
};
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function guessCategory(name: string): WardrobeCategory {
  if (/بوت|سنيكر|حذاء|كندرة|چلسي/.test(name)) return 'أحذية';
  if (/جينز|چينو|بنطل|شورت/.test(name)) return 'بنطلونات';
  if (/بليزر|كنزة|جاكيت|معطف|طبق|سترة/.test(name)) return 'طبقات';
  if (/قميص|تيشيرت|تي شيرت|بلوزة/.test(name)) return 'قمصان';
  return 'إكسسوار';
}

export default function Clothes() {
  const { data } = useApp();
  const rate = data.settings.exchangeRate;
  const [tab, setTab] = useState<Tab>('owned');

  const spent = useMemo(() => clothingThisMonth(data), [data]);
  const budget = data.settings.monthlyClothingBudgetTRY;
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = budget > 0 && spent > budget;

  return (
    <div>
      <ScreenHeader emoji="👔" title="الملابس" subtitle="خزانتك وقائمة الشراء بستايل أنيق" />

      {/* ميزانية الملابس */}
      <Card className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-green">صرفت على الملابس هالشهر</span>
          <div className="text-left">
            <div className={`font-black num ${over ? 'text-danger' : 'text-green'}`}>{fmtTRY(spent)}</div>
            <div className="text-xs text-muted font-bold num">{fmtUSD(toUSD(spent, rate))}</div>
          </div>
        </div>
        {budget > 0 ? (
          <>
            <div className="w-full h-2.5 rounded-full bg-line overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: over ? '#D9534F' : '#0E4D3C' }}
              />
            </div>
            <div className="text-xs font-bold text-muted mt-1.5 num">
              من ميزانية {fmtTRY(budget)} {over ? '· تجاوزت! ⚠️' : ''}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted font-bold">
            حدّد ميزانية ملابس شهرية من الإعدادات عشان يطلع شريط التتبّع.
          </p>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-4 bg-card rounded-2xl p-1 border border-line">
        <TabBtn active={tab === 'owned'} onClick={() => setTab('owned')}>
          👔 خزانتي
        </TabBtn>
        <TabBtn active={tab === 'wishlist'} onClick={() => setTab('wishlist')}>
          🛍️ قائمة الشراء
        </TabBtn>
      </div>

      {tab === 'owned' ? <OwnedTab /> : <WishlistTab />}

      <StoresCard />
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-2.5 rounded-xl font-black text-sm transition ${
        active ? 'bg-green text-white shadow-soft' : 'text-muted'
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------- خزانتي
function OwnedTab() {
  const { data, update } = useApp();
  const rate = data.settings.exchangeRate;
  const [adding, setAdding] = useState(false);

  const cycleStatus = (id: string) =>
    update((d) => {
      const it = d.wardrobe.owned.find((x) => x.id === id);
      if (!it) return;
      it.status = it.status === 'owned' ? 'sold' : it.status === 'sold' ? 'damaged' : 'owned';
    });

  return (
    <div>
      {CATEGORIES.map((cat) => {
        const items = data.wardrobe.owned.filter((o) => o.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-4">
            <h3 className="font-black text-green px-1 mb-2">
              {CAT_EMOJI[cat]} {cat} <span className="text-muted font-bold num">({items.length})</span>
            </h3>
            <ul className="space-y-2">
              {items.map((o) => (
                <li
                  key={o.id}
                  className={`rounded-2xl border p-3 flex items-center gap-3 ${
                    o.status === 'owned' ? 'bg-card border-line' : 'bg-cream/60 border-line opacity-70'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink truncate">{o.name}</div>
                    <div className="text-xs text-muted font-bold">
                      {o.color}
                      {o.store ? ` · ${o.store}` : ''}
                      {o.pricePaid ? ` · ${fmtTRY(o.pricePaid)}` : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => cycleStatus(o.id)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-black border-2 ${
                      o.status === 'owned'
                        ? 'border-ok/50 text-ok'
                        : o.status === 'sold'
                          ? 'border-muted/40 text-muted'
                          : 'border-danger/50 text-danger'
                    }`}
                  >
                    {STATUS_LABEL[o.status]}
                  </button>
                  <button
                    onClick={() =>
                      update((d) => {
                        d.wardrobe.owned = d.wardrobe.owned.filter((x) => x.id !== o.id);
                      })
                    }
                    className="w-8 h-8 grid place-items-center rounded-lg text-danger active:scale-95 shrink-0"
                    aria-label="حذف"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {data.wardrobe.owned.length === 0 && (
        <p className="text-center text-sm text-muted font-bold py-6">خزانتك فاضية 👔</p>
      )}

      <button onClick={() => setAdding(true)} className="btn-ghost w-full flex items-center justify-center gap-2">
        <Plus size={18} /> أضف قطعة
      </button>

      {adding && <AddOwnedModal rate={rate} onClose={() => setAdding(false)} />}
    </div>
  );
}

function AddOwnedModal({ rate, onClose }: { rate: number; onClose: () => void }) {
  const { update } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WardrobeCategory>('قمصان');
  const [color, setColor] = useState('');
  const [store, setStore] = useState('');
  const [price, setPrice] = useState('');
  const countAsSpend = true;

  const save = () => {
    if (!name.trim()) return;
    const pricePaid = Number(price) || 0;
    update((d) => {
      const item: OwnedItem = {
        id: uid('w'),
        name: name.trim(),
        category,
        color: color.trim() || '—',
        store: store.trim() || undefined,
        pricePaid: pricePaid || undefined,
        purchaseDate: pricePaid && countAsSpend ? new Date().toISOString() : undefined,
        status: 'owned',
      };
      d.wardrobe.owned.push(item);
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="قطعة جديدة للخزانة">
      <div className="space-y-3">
        <Labeled label="الاسم">
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="مثلاً: قميص أسود fitted" />
        </Labeled>
        <Labeled label="الفئة">
          <select value={category} onChange={(e) => setCategory(e.target.value as WardrobeCategory)} className="field">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CAT_EMOJI[c]} {c}
              </option>
            ))}
          </select>
        </Labeled>
        <div className="grid grid-cols-2 gap-2">
          <Labeled label="اللون">
            <input value={color} onChange={(e) => setColor(e.target.value)} className="field" placeholder="أسود" />
          </Labeled>
          <Labeled label="المتجر (اختياري)">
            <input value={store} onChange={(e) => setStore(e.target.value)} className="field" placeholder="Tudors" />
          </Labeled>
        </div>
        <Labeled label="السعر المدفوع ₺ (اختياري)">
          <input
            type="number"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="field num"
            placeholder="0"
          />
        </Labeled>
        <p className="text-xs text-muted font-bold">
          لو حطّيت سعراً، بينحسب ضمن مصاريف هذا الشهر ({rate} ₺/$).
        </p>
        <button onClick={save} className="btn-primary w-full">
          إضافة للخزانة
        </button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------- قائمة الشراء
function WishlistTab() {
  const { data, update } = useApp();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState<WishlistItem | null>(null);

  const sorted = useMemo(
    () =>
      data.wardrobe.wishlist
        .slice()
        .sort(
          (a, b) =>
            Number(a.bought) - Number(b.bought) ||
            PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
        ),
    [data.wardrobe.wishlist],
  );

  return (
    <div>
      <ul className="space-y-2 mb-3">
        {sorted.map((item) => (
          <li
            key={item.id}
            className={`rounded-2xl border p-3 ${
              item.bought ? 'bg-cream/60 border-line opacity-70' : 'bg-card border-line'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className={`font-bold ${item.bought ? 'line-through text-muted' : 'text-ink'}`}>
                {item.name}
              </span>
              <span className={`chip shrink-0 text-xs ${PRIORITY_STYLE[item.priority]}`}>
                {PRIORITY_LABEL[item.priority]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted font-bold">
                <Store size={12} className="inline ml-1" />
                {item.store} · <span className="num">{fmtTRY(item.budgetMinTRY)}–{fmtTRY(item.budgetMaxTRY)}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!item.bought && (
                  <button
                    onClick={() => setBuying(item)}
                    className="bg-green text-white rounded-lg px-3 py-1.5 text-sm font-bold active:scale-95 flex items-center gap-1"
                  >
                    <Check size={14} strokeWidth={3} /> اشتريتها
                  </button>
                )}
                <button
                  onClick={() =>
                    update((d) => {
                      d.wardrobe.wishlist = d.wardrobe.wishlist.filter((x) => x.id !== item.id);
                    })
                  }
                  className="w-8 h-8 grid place-items-center rounded-lg text-danger active:scale-95"
                  aria-label="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {data.wardrobe.wishlist.length === 0 && (
        <p className="text-center text-sm text-muted font-bold py-6">قائمة الشراء فاضية 🛍️</p>
      )}

      <button onClick={() => setAdding(true)} className="btn-ghost w-full flex items-center justify-center gap-2">
        <Plus size={18} /> أضف للقائمة
      </button>

      {adding && <AddWishlistModal onClose={() => setAdding(false)} />}
      {buying && <BuyModal item={buying} onClose={() => setBuying(null)} />}
    </div>
  );
}

function AddWishlistModal({ onClose }: { onClose: () => void }) {
  const { update } = useApp();
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [store, setStore] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const save = () => {
    if (!name.trim()) return;
    update((d) => {
      d.wardrobe.wishlist.push({
        id: uid('wl'),
        name: name.trim(),
        priority,
        store: store.trim() || '—',
        budgetMinTRY: Number(min) || 0,
        budgetMaxTRY: Number(max) || Number(min) || 0,
        bought: false,
      });
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="قطعة لقائمة الشراء">
      <div className="space-y-3">
        <Labeled label="الاسم">
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="مثلاً: 🥾 چلسي بوت أسود" />
        </Labeled>
        <Labeled label="الأولوية">
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="field">
            <option value="high">عالية</option>
            <option value="medium">متوسطة</option>
            <option value="low">منخفضة</option>
          </select>
        </Labeled>
        <Labeled label="المتجر المقترح">
          <input value={store} onChange={(e) => setStore(e.target.value)} className="field" placeholder="FLO / Koton" />
        </Labeled>
        <div className="grid grid-cols-2 gap-2">
          <Labeled label="أقل ميزانية ₺">
            <input type="number" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} className="field num" placeholder="800" />
          </Labeled>
          <Labeled label="أعلى ميزانية ₺">
            <input type="number" inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} className="field num" placeholder="1500" />
          </Labeled>
        </div>
        <button onClick={save} className="btn-primary w-full">
          إضافة للقائمة
        </button>
      </div>
    </Modal>
  );
}

function BuyModal({ item, onClose }: { item: WishlistItem; onClose: () => void }) {
  const { update } = useApp();
  const [price, setPrice] = useState(String(item.budgetMinTRY || ''));
  const [category, setCategory] = useState<WardrobeCategory>(guessCategory(item.name));

  const confirm = () => {
    const pricePaid = Number(price) || 0;
    update((d) => {
      const wl = d.wardrobe.wishlist.find((x) => x.id === item.id);
      if (wl) wl.bought = true;
      d.wardrobe.owned.push({
        id: uid('w'),
        name: item.name,
        category,
        color: '—',
        store: item.store,
        pricePaid: pricePaid || undefined,
        purchaseDate: pricePaid ? new Date().toISOString() : undefined,
        status: 'owned',
      });
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="اشتريتها 🎉">
      <div className="space-y-3">
        <p className="font-bold text-ink">{item.name}</p>
        <Labeled label="السعر الفعلي ₺">
          <input
            type="number"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="field num"
            autoFocus
          />
        </Labeled>
        <Labeled label="الفئة">
          <select value={category} onChange={(e) => setCategory(e.target.value as WardrobeCategory)} className="field">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CAT_EMOJI[c]} {c}
              </option>
            ))}
          </select>
        </Labeled>
        <p className="text-xs text-muted font-bold">
          بتنتقل لخزانتك، والسعر بينحسب ضمن مصاريف هذا الشهر.
        </p>
        <button onClick={confirm} className="btn-primary w-full flex items-center justify-center gap-2">
          <ShoppingBag size={18} /> أكّد الشراء
        </button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------- المتاجر
function StoresCard() {
  const [open, setOpen] = useState(false);
  return (
    <Card className="mt-4">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between">
        <span className="font-black text-green flex items-center gap-2">
          <Store size={18} /> متاجر مقترحة في إسطنبول
        </span>
        <ChevronDown size={20} className={`text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="mt-3 space-y-2 animate-pop">
          {WARDROBE_STORES.map((s) => (
            <li key={s.name} className="flex items-center justify-between bg-cream/60 rounded-xl border border-line px-3 py-2">
              <div>
                <div className="font-black text-ink">{s.name}</div>
                <div className="text-xs text-muted font-bold">{s.spec}</div>
              </div>
              <div className="text-gold text-sm" aria-label={`${s.stars} نجوم`}>
                {'★'.repeat(s.stars)}
                <span className="text-line">{'★'.repeat(5 - s.stars)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted font-bold mt-3 text-center">
        ستايل مرجعي: مينيمال أنيق — أسود · أبيض · كحلي · زيتي · قصّات مظبوطة بدون شعارات.
      </p>
    </Card>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
