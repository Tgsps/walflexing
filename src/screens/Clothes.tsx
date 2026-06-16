import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ShoppingBag, Check, Store, ChevronDown, Camera, Loader2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { WARDROBE_STORES } from '../data/seed';
import { clothingThisMonth } from '../lib/calc';
import { fmtTRY, fmtUSD, toUSD, uid } from '../lib/format';
import { compressImage } from '../lib/image';
import { tWardrobeCat, tColor, tOwnedName, tWishName, tStoreSpec } from '../i18n/content';
import type { OwnedItem, Priority, WardrobeCategory, WishlistItem } from '../types';

const TYPE_TO_CAT: Record<string, WardrobeCategory> = {
  top: 'قمصان',
  bottom: 'بنطلونات',
  layer: 'طبقات',
  shoes: 'أحذية',
  accessory: 'إكسسوار',
};

type Tab = 'owned' | 'wishlist';

const CATEGORIES: WardrobeCategory[] = ['قمصان', 'بنطلونات', 'طبقات', 'أحذية', 'إكسسوار'];
const CAT_EMOJI: Record<WardrobeCategory, string> = { قمصان: '👕', بنطلونات: '👖', طبقات: '🧥', أحذية: '👟', إكسسوار: '⌚' };
const PRIORITY_STYLE: Record<Priority, string> = {
  high: 'bg-danger/10 text-danger border-danger/40',
  medium: 'bg-warn/10 text-[#9a7400] border-warn/40',
  low: 'bg-ok/10 text-ok border-ok/40',
};
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function guessCategory(name: string): WardrobeCategory {
  if (/بوت|سنيكر|حذاء|كندرة|چلسي|boot|sneaker|shoe|chelsea/i.test(name)) return 'أحذية';
  if (/جينز|چينو|بنطل|شورت|jean|chino|pant|short/i.test(name)) return 'بنطلونات';
  if (/بليزر|كنزة|جاكيت|معطف|طبق|سترة|blazer|sweater|jacket|coat|ceket|kazak/i.test(name)) return 'طبقات';
  if (/قميص|تيشيرت|تي شيرت|بلوزة|shirt|tee|gömlek/i.test(name)) return 'قمصان';
  return 'إكسسوار';
}

export default function Clothes() {
  const { t } = useTranslation();
  const { data } = useApp();
  const rate = data.settings.exchangeRate;
  const [tab, setTab] = useState<Tab>('owned');

  const spent = useMemo(() => clothingThisMonth(data), [data]);
  const budget = data.settings.monthlyClothingBudgetTRY;
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = budget > 0 && spent > budget;

  return (
    <div>
      <ScreenHeader emoji="👔" title={t('clothes.title')} subtitle={t('clothes.subtitle')} />

      <Card className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-green">{t('clothes.spentThisMonth')}</span>
          <div className="text-end">
            <div className={`font-black num ${over ? 'text-danger' : 'text-green'}`}>{fmtTRY(spent)}</div>
            <div className="text-xs text-muted font-bold num">{fmtUSD(toUSD(spent, rate))}</div>
          </div>
        </div>
        {budget > 0 ? (
          <>
            <div className="w-full h-2.5 rounded-full bg-line overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: over ? '#D9534F' : '#062D23' }} />
            </div>
            <div className="text-xs font-bold text-muted mt-1.5 num">
              {t('clothes.budgetOf', { budget: fmtTRY(budget) })}
              {over ? t('clothes.over') : ''}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted font-bold">{t('clothes.noBudget')}</p>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-4 bg-card rounded-2xl p-1 border border-line">
        <TabBtn active={tab === 'owned'} onClick={() => setTab('owned')}>
          {t('clothes.tabWardrobe')}
        </TabBtn>
        <TabBtn active={tab === 'wishlist'} onClick={() => setTab('wishlist')}>
          {t('clothes.tabWishlist')}
        </TabBtn>
      </div>

      {tab === 'owned' ? <OwnedTab /> : <WishlistTab />}

      <StoresCard />
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`py-2.5 rounded-xl font-black text-sm transition ${active ? 'bg-green text-white shadow-soft' : 'text-muted'}`}>
      {children}
    </button>
  );
}

function CatSelect({ value, onChange }: { value: WardrobeCategory; onChange: (c: WardrobeCategory) => void }) {
  const { t } = useTranslation();
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as WardrobeCategory)} className="field">
      {CATEGORIES.map((c) => (
        <option key={c} value={c}>
          {CAT_EMOJI[c]} {tWardrobeCat(c, t)}
        </option>
      ))}
    </select>
  );
}

// ---------------------------------------------------------------- wardrobe
interface ScanResult {
  name: string;
  category: WardrobeCategory;
  color: string;
}

function OwnedTab() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const rate = data.settings.exchangeRate;
  const [adding, setAdding] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<ScanResult | null>(null);
  const scanRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setScanError(null);
    setScanning(true);
    try {
      const base64Image = await compressImage(file, 800, 0.75);
      const res = await fetch('/api/analyze-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
      const data = await res.json();
      setPrefill({
        name: data.name ?? '',
        category: TYPE_TO_CAT[data.type] ?? 'قمصان',
        color: data.color ?? '',
      });
      setAdding(true);
    } catch (err: any) {
      setScanError(err.message || 'Could not analyze the photo');
    } finally {
      setScanning(false);
    }
  };

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
              {CAT_EMOJI[cat]} {tWardrobeCat(cat, t)} <span className="text-muted font-bold num">({items.length})</span>
            </h3>
            <ul className="space-y-2">
              {items.map((o) => (
                <li key={o.id} className={`rounded-2xl border p-3 flex items-center gap-3 ${o.status === 'owned' ? 'bg-card border-line' : 'bg-cream/60 border-line opacity-70'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink truncate">{tOwnedName(o.id, t, o.name)}</div>
                    <div className="text-xs text-muted font-bold">
                      {tColor(o.color, t)}
                      {o.store ? ` · ${o.store}` : ''}
                      {o.pricePaid ? ` · ${fmtTRY(o.pricePaid)}` : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => cycleStatus(o.id)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-black border-2 ${
                      o.status === 'owned' ? 'border-ok/50 text-ok' : o.status === 'sold' ? 'border-muted/40 text-muted' : 'border-danger/50 text-danger'
                    }`}
                  >
                    {t(`wardrobeStatus.${o.status}`)}
                  </button>
                  <button
                    onClick={() =>
                      update((d) => {
                        d.wardrobe.owned = d.wardrobe.owned.filter((x) => x.id !== o.id);
                      })
                    }
                    className="w-8 h-8 grid place-items-center rounded-lg text-danger active:scale-95 shrink-0"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {data.wardrobe.owned.length === 0 && <p className="text-center text-sm text-muted font-bold py-6">{t('clothes.emptyWardrobe')}</p>}

      {scanError && (
        <p className="text-sm font-bold text-danger text-center bg-danger/10 border border-danger/30 rounded-xl px-3 py-2 mb-2">
          {scanError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => scanRef.current?.click()}
          disabled={scanning}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {scanning ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
          {scanning ? t('common.loading', 'Analyzing…') : t('clothes.scanItem', 'Scan Item')}
        </button>
        <button onClick={() => { setPrefill(null); setAdding(true); }} className="btn-ghost flex items-center justify-center gap-2">
          <Plus size={18} /> {t('clothes.addPiece')}
        </button>
      </div>

      <input
        ref={scanRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleScan}
      />

      {adding && (
        <AddOwnedModal
          rate={rate}
          initialName={prefill?.name}
          initialCategory={prefill?.category}
          initialColor={prefill?.color}
          onClose={() => { setAdding(false); setPrefill(null); }}
        />
      )}
    </div>
  );
}

function AddOwnedModal({
  rate,
  onClose,
  initialName = '',
  initialCategory = 'قمصان',
  initialColor = '',
}: {
  rate: number;
  onClose: () => void;
  initialName?: string;
  initialCategory?: WardrobeCategory;
  initialColor?: string;
}) {
  const { t } = useTranslation();
  const { update } = useApp();
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState<WardrobeCategory>(initialCategory);
  const [color, setColor] = useState(initialColor);
  const [store, setStore] = useState('');
  const [price, setPrice] = useState('');

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
        purchaseDate: pricePaid ? new Date().toISOString() : undefined,
        status: 'owned',
      };
      d.wardrobe.owned.push(item);
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={t('clothes.newPiece')}>
      <div className="space-y-3">
        <Labeled label={t('clothes.name')}>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder={t('clothes.namePh')} />
        </Labeled>
        <Labeled label={t('clothes.category')}>
          <CatSelect value={category} onChange={setCategory} />
        </Labeled>
        <div className="grid grid-cols-2 gap-2">
          <Labeled label={t('clothes.color')}>
            <input value={color} onChange={(e) => setColor(e.target.value)} className="field" placeholder={t('clothes.colorPh')} />
          </Labeled>
          <Labeled label={t('clothes.storeOpt')}>
            <input value={store} onChange={(e) => setStore(e.target.value)} className="field" placeholder="Tudors" />
          </Labeled>
        </div>
        <Labeled label={t('clothes.pricePaidOpt')}>
          <input type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="field num" placeholder="0" />
        </Labeled>
        <p className="text-xs text-muted font-bold">{t('clothes.priceCountsNote', { rate })}</p>
        <button onClick={save} className="btn-primary w-full">
          {t('clothes.addToWardrobe')}
        </button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------- wishlist
function WishlistTab() {
  const { t } = useTranslation();
  const { data, update } = useApp();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState<WishlistItem | null>(null);

  const sorted = useMemo(
    () => data.wardrobe.wishlist.slice().sort((a, b) => Number(a.bought) - Number(b.bought) || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]),
    [data.wardrobe.wishlist],
  );

  return (
    <div>
      <ul className="space-y-2 mb-3">
        {sorted.map((item) => (
          <li key={item.id} className={`rounded-2xl border p-3 ${item.bought ? 'bg-cream/60 border-line opacity-70' : 'bg-card border-line'}`}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className={`font-bold ${item.bought ? 'line-through text-muted' : 'text-ink'}`}>{tWishName(item.id, t, item.name)}</span>
              <span className={`chip shrink-0 text-xs ${PRIORITY_STYLE[item.priority]}`}>{t(`priority.${item.priority}`)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted font-bold">
                <Store size={12} className="inline mx-1" />
                {item.store} ·{' '}
                <span className="num">
                  {fmtTRY(item.budgetMinTRY)}–{fmtTRY(item.budgetMaxTRY)}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!item.bought && (
                  <button onClick={() => setBuying(item)} className="bg-green text-white rounded-lg px-3 py-1.5 text-sm font-bold active:scale-95 flex items-center gap-1">
                    <Check size={14} strokeWidth={3} /> {t('clothes.boughtIt')}
                  </button>
                )}
                <button
                  onClick={() =>
                    update((d) => {
                      d.wardrobe.wishlist = d.wardrobe.wishlist.filter((x) => x.id !== item.id);
                    })
                  }
                  className="w-8 h-8 grid place-items-center rounded-lg text-danger active:scale-95"
                  aria-label={t('common.delete')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {data.wardrobe.wishlist.length === 0 && <p className="text-center text-sm text-muted font-bold py-6">{t('clothes.emptyWishlist')}</p>}

      <button onClick={() => setAdding(true)} className="btn-ghost w-full flex items-center justify-center gap-2">
        <Plus size={18} /> {t('clothes.addToList')}
      </button>

      {adding && <AddWishlistModal onClose={() => setAdding(false)} />}
      {buying && <BuyModal item={buying} onClose={() => setBuying(null)} />}
    </div>
  );
}

function AddWishlistModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
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
    <Modal open onClose={onClose} title={t('clothes.newWish')}>
      <div className="space-y-3">
        <Labeled label={t('clothes.name')}>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder={t('clothes.wishNamePh')} />
        </Labeled>
        <Labeled label={t('clothes.priority')}>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="field">
            <option value="high">{t('priority.high')}</option>
            <option value="medium">{t('priority.medium')}</option>
            <option value="low">{t('priority.low')}</option>
          </select>
        </Labeled>
        <Labeled label={t('clothes.suggestedStore')}>
          <input value={store} onChange={(e) => setStore(e.target.value)} className="field" placeholder="FLO / Koton" />
        </Labeled>
        <div className="grid grid-cols-2 gap-2">
          <Labeled label={t('clothes.minBudget')}>
            <input type="number" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} className="field num" placeholder="800" />
          </Labeled>
          <Labeled label={t('clothes.maxBudget')}>
            <input type="number" inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} className="field num" placeholder="1500" />
          </Labeled>
        </div>
        <button onClick={save} className="btn-primary w-full">
          {t('clothes.addToList')}
        </button>
      </div>
    </Modal>
  );
}

function BuyModal({ item, onClose }: { item: WishlistItem; onClose: () => void }) {
  const { t } = useTranslation();
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
    <Modal open onClose={onClose} title={t('clothes.boughtTitle')}>
      <div className="space-y-3">
        <p className="font-bold text-ink">{tWishName(item.id, t, item.name)}</p>
        <Labeled label={t('clothes.actualPrice')}>
          <input type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="field num" autoFocus />
        </Labeled>
        <Labeled label={t('clothes.category')}>
          <CatSelect value={category} onChange={setCategory} />
        </Labeled>
        <p className="text-xs text-muted font-bold">{t('clothes.buyNote')}</p>
        <button onClick={confirm} className="btn-primary w-full flex items-center justify-center gap-2">
          <ShoppingBag size={18} /> {t('clothes.confirmBuy')}
        </button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------- stores
function StoresCard() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <Card className="mt-4">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between">
        <span className="font-black text-green flex items-center gap-2">
          <Store size={18} /> {t('clothes.storesTitle')}
        </span>
        <ChevronDown size={20} className={`text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="mt-3 space-y-2 animate-pop">
          {WARDROBE_STORES.map((s) => (
            <li key={s.name} className="flex items-center justify-between bg-cream/60 rounded-xl border border-line px-3 py-2">
              <div>
                <div className="font-black text-ink">{s.name}</div>
                <div className="text-xs text-muted font-bold">{tStoreSpec(s.name, t, s.spec)}</div>
              </div>
              <div className="text-gold text-sm">
                {'★'.repeat(s.stars)}
                <span className="text-line">{'★'.repeat(5 - s.stars)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted font-bold mt-3 text-center">{t('clothes.styleNote')}</p>
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
