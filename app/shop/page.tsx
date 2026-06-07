/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { name: 'Electronics', icon: '📱', bg: '#e8f4fd' },
  { name: 'Fashion', icon: '👗', bg: '#fdf0f8' },
  { name: 'Food & Groceries', icon: '🛒', bg: '#f0fdf4' },
  { name: 'Home & Living', icon: '🏠', bg: '#fffbeb' },
  { name: 'Beauty', icon: '💄', bg: '#fdf2f8' },
  { name: 'Agriculture', icon: '🌾', bg: '#f0fdf4' },
  { name: 'Solar & Energy', icon: '☀️', bg: '#fffbeb' },
  { name: 'Health', icon: '💊', bg: '#f0f9ff' },
];

const products = [
  { id: 1, name: 'Itel A70 Smartphone 4G LTE', price: 1850, oldPrice: 2200, rating: 4.5, reviews: 128, badge: 'Hot Deal', badgeColor: '#c8232c', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', category: 'Electronics', delivery: 'Free delivery', inStock: true },
  { id: 2, name: 'African Chitenge Print Fabric 6 Yards', price: 420, oldPrice: 580, rating: 4.8, reviews: 94, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&q=80', category: 'Fashion', delivery: 'Delivery K25', inStock: true },
  { id: 3, name: 'Zambia Pure Wild Honey 500g', price: 180, oldPrice: 240, rating: 4.9, reviews: 203, badge: 'Best Seller', badgeColor: '#f5a623', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', category: 'Food & Groceries', delivery: 'Free delivery', inStock: true },
  { id: 4, name: 'Kapenta Dried Fish 1kg Pack', price: 95, oldPrice: 130, rating: 4.6, reviews: 67, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80', category: 'Food & Groceries', delivery: 'Delivery K15', inStock: true },
  { id: 5, name: 'Fresh Tomatoes 5kg Basket', price: 65, oldPrice: 0, rating: 4.4, reviews: 45, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', category: 'Food & Groceries', delivery: 'Free delivery', inStock: true },
  { id: 6, name: '150W Solar Panel Kit Home System', price: 3200, oldPrice: 4100, rating: 4.7, reviews: 89, badge: 'New', badgeColor: '#22c55e', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80', category: 'Solar & Energy', delivery: 'Delivery K80', inStock: true },
  { id: 7, name: 'Natural Shea Butter Cream 250ml', price: 120, oldPrice: 160, rating: 4.8, reviews: 312, badge: 'Top Rated', badgeColor: '#7c3aed', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80', category: 'Beauty', delivery: 'Free delivery', inStock: true },
  { id: 8, name: 'Premium Maize Flour 25kg Bag', price: 280, oldPrice: 320, rating: 4.5, reviews: 156, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Food & Groceries', delivery: 'Delivery K30', inStock: true },
  { id: 9, name: 'Wireless Bluetooth Earbuds', price: 450, oldPrice: 650, rating: 4.3, reviews: 78, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', category: 'Electronics', delivery: 'Free delivery', inStock: true },
  { id: 10, name: "Men's Formal Suit Navy Blue", price: 1200, oldPrice: 1800, rating: 4.6, reviews: 52, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', category: 'Fashion', delivery: 'Delivery K40', inStock: true },
  { id: 11, name: 'Moringa Leaf Powder 200g', price: 85, oldPrice: 110, rating: 4.7, reviews: 198, badge: 'Popular', badgeColor: '#f5a623', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&q=80', category: 'Health', delivery: 'Free delivery', inStock: true },
  { id: 12, name: 'Wooden Dining Table Set 4-Seater', price: 4500, oldPrice: 6000, rating: 4.5, reviews: 33, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', category: 'Home & Living', delivery: 'Delivery K150', inStock: true },
];

export default function ShopPage() {
  const [cart, setCart] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [justAdded, setJustAdded] = useState<number | null>(null);

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
    setJustAdded(id);
    setTimeout(() => setJustAdded(null), 1500);
  };

  const pct = (old: number, cur: number) => Math.round((1 - cur / old) * 100);

  const filtered = products.filter((p) => {
    const matchS = p.name.toLowerCase().includes(search.toLowerCase());
    const matchC = activeCategory === 'All' || p.category === activeCategory;
    return matchS && matchC;
  });

  const s = {
    page: { fontFamily: 'Inter,Arial,sans-serif', background: '#f5f5f5', minHeight: '100vh' } as React.CSSProperties,
    header: { background: '#c8232c', position: 'sticky' as const, top: 0, zIndex: 50, padding: '0 16px' } as React.CSSProperties,
    headerInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' } as React.CSSProperties,
    logo: { color: '#fff', fontWeight: 800, fontSize: 22, textDecoration: 'none', letterSpacing: 1 } as React.CSSProperties,
    searchWrap: { flex: 1, display: 'flex', background: '#fff', borderRadius: 4, overflow: 'hidden', maxWidth: 600 } as React.CSSProperties,
    searchInput: { flex: 1, border: 'none', padding: '10px 14px', fontSize: 14, outline: 'none' } as React.CSSProperties,
    searchBtn: { background: '#f5a623', border: 'none', padding: '0 18px', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 16 } as React.CSSProperties,
    cartBtn: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 22, position: 'relative' as const } as React.CSSProperties,
    cartBadge: { position: 'absolute' as const, top: -6, right: -8, background: '#f5a623', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 } as React.CSSProperties,
    subNav: { maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 20, paddingBottom: 8, overflowX: 'auto' as const } as React.CSSProperties,
    hero: { background: 'linear-gradient(135deg,#c8232c 0%,#8b0000 50%,#1a1a2e 100%)', borderRadius: 8, padding: '32px 40px', display: 'flex', alignItems: 'center', position: 'relative' as const, overflow: 'hidden', minHeight: 200 } as React.CSSProperties,
    heroBadge: { background: '#f5a623', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12, display: 'inline-block', marginBottom: 10, letterSpacing: 1 } as React.CSSProperties,
    heroH1: { fontSize: 32, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2, color: '#fff' } as React.CSSProperties,
    heroP: { fontSize: 15, opacity: 0.9, margin: '0 0 20px', color: '#fff' } as React.CSSProperties,
    heroBtns: { display: 'flex', gap: 12 } as React.CSSProperties,
    heroBtn1: { background: '#f5a623', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
    heroBtn2: { background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: 4, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' } as React.CSSProperties,
    heroDeco: { position: 'absolute' as const, right: 40, top: '50%', transform: 'translateY(-50%)', fontSize: 100, opacity: 0.12 } as React.CSSProperties,
    trustGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 } as React.CSSProperties,
    trustCard: { background: '#fff', borderRadius: 6, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)' } as React.CSSProperties,
    catBox: { background: '#fff', borderRadius: 8, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,.08)' } as React.CSSProperties,
    catGrid: { display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 10 } as React.CSSProperties,
    dealBar: { background: '#c8232c', borderRadius: 8, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 } as React.CSSProperties,
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 } as React.CSSProperties,
    card: { background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.1)', cursor: 'pointer' } as React.CSSProperties,
    cardImg: { width: '100%', height: 200, objectFit: 'cover' as const, display: 'block' } as React.CSSProperties,
    cardBody: { padding: '12px 14px 14px' } as React.CSSProperties,
    cardName: { fontSize: 13, color: '#333', margin: '0 0 8px', lineHeight: 1.4, fontWeight: 500, height: 38, overflow: 'hidden' } as React.CSSProperties,
    price: { fontSize: 18, fontWeight: 800, color: '#c8232c' } as React.CSSProperties,
    oldPrice: { fontSize: 12, color: '#aaa', textDecoration: 'line-through', marginLeft: 8 } as React.CSSProperties,
    delivery: { fontSize: 11, color: '#22c55e', fontWeight: 600, marginBottom: 12, marginTop: 4 } as React.CSSProperties,
    ussdBanner: { background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)', borderRadius: 8, padding: '28px 32px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 32, color: '#fff' } as React.CSSProperties,
    footer: { background: '#222', color: '#ccc', padding: '32px 16px', marginTop: 20 } as React.CSSProperties,
    footerGrid: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 } as React.CSSProperties,
    footerBottom: { maxWidth: 1200, margin: '20px auto 0', borderTop: '1px solid #444', paddingTop: 16, textAlign: 'center' as const, fontSize: 12, color: '#888' } as React.CSSProperties,
  };

  return (
    <div style={s.page}>

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <Link href="/" style={s.logo}>🛍️ Peza</Link>
          <div style={s.searchWrap}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, categories..."
              style={s.searchInput}
            />
            <button style={s.searchBtn}>🔍</button>
          </div>
          <button style={s.cartBtn}>
            🛒
            {cart.length > 0 && <span style={s.cartBadge}>{cart.length}</span>}
          </button>
          <div style={{ color: '#fff', textAlign: 'center', fontSize: 12 }}>
            <div style={{ opacity: 0.75, fontSize: 11 }}>No internet?</div>
            <div style={{ fontWeight: 700 }}>Dial *384#</div>
          </div>
        </div>
        <nav style={s.subNav}>
          {['All', ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: activeCategory === cat ? '#f5a623' : '#fff',
                fontWeight: activeCategory === cat ? 700 : 400,
                fontSize: 13, whiteSpace: 'nowrap', paddingBottom: 4,
                borderBottom: activeCategory === cat ? '2px solid #f5a623' : '2px solid transparent',
              }}
            >{cat}</button>
          ))}
        </nav>
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{ maxWidth: 1200, margin: '16px auto', padding: '0 16px' }}>
        <div style={s.hero}>
          <div style={{ zIndex: 2 }}>
            <div style={s.heroBadge}>⚡ FLASH SALE — ENDS TONIGHT</div>
            <h1 style={s.heroH1}>Shop Smart,<br />Save Big in Zambia</h1>
            <p style={s.heroP}>Up to 40% off. Delivered to Lusaka, Ndola, Kitwe &amp; more.</p>
            <div style={s.heroBtns}>
              <button style={s.heroBtn1} onClick={() => setActiveCategory('All')}>Shop All Products</button>
              <button style={s.heroBtn2}>USSD: *384#</button>
            </div>
          </div>
          <div style={s.heroDeco}>🛍️</div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>

        {/* ── TRUST BADGES ── */}
        <div style={s.trustGrid}>
          {[
            { icon: '🚚', title: 'Fast Delivery', sub: 'Lusaka same-day available' },
            { icon: '✅', title: 'Verified Sellers', sub: '100% authentic products' },
            { icon: '💳', title: 'Easy Payment', sub: 'Airtel Money & cash' },
            { icon: '📞', title: 'USSD *384#', sub: 'No internet needed' },
          ].map((b) => (
            <div key={b.title} style={s.trustCard}>
              <span style={{ fontSize: 24 }}>{b.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{b.title}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CATEGORY GRID ── */}
        <div style={s.catBox}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#222' }}>Shop by Category</h2>
          <div style={s.catGrid}>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  background: cat.bg,
                  border: activeCategory === cat.name ? '2px solid #c8232c' : '2px solid transparent',
                  borderRadius: 8, padding: '14px 8px', cursor: 'pointer', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 28 }}>{cat.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#333', marginTop: 6 }}>{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── DEALS BAR ── */}
        <div style={s.dealBar}>
          <div style={{ color: '#fff' }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>⚡ Deals of the Day</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Hurry! Limited stock</div>
          </div>
          {['08 HRS', '34 MIN', '22 SEC'].map((t) => (
            <div key={t} style={{ background: '#fff', color: '#c8232c', borderRadius: 4, padding: '6px 12px', fontWeight: 800, fontSize: 16 }}>{t}</div>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ background: '#f5a623', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 700, cursor: 'pointer' }}>See All Deals →</button>
        </div>

        {/* ── PRODUCT HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: 0 }}>
            {activeCategory === 'All' ? 'All Products' : activeCategory}
            <span style={{ fontSize: 13, color: '#888', fontWeight: 400, marginLeft: 8 }}>({filtered.length} items)</span>
          </h2>
          {activeCategory !== 'All' && (
            <button onClick={() => setActiveCategory('All')} style={{ background: 'none', border: 'none', color: '#c8232c', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Clear ×</button>
          )}
        </div>

        {/* ── PRODUCT GRID ── */}
        <div style={s.grid}>
          {filtered.map((product) => (
            <div key={product.id} style={s.card}>
              <div style={{ position: 'relative', background: '#f9f9f9' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  style={s.cardImg}
                />
                {product.badge && (
                  <span style={{ position: 'absolute', top: 10, left: 10, background: product.badgeColor, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>
                    {product.badge}
                  </span>
                )}
                {product.oldPrice > 0 && (
                  <span style={{ position: 'absolute', top: 10, right: 10, background: '#c8232c', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 7px', borderRadius: 3 }}>
                    -{pct(product.oldPrice, product.price)}%
                  </span>
                )}
              </div>
              <div style={s.cardBody}>
                <p style={s.cardName}>{product.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ color: '#f5a623', fontSize: 13 }}>
                    {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                  </span>
                  <span style={{ fontSize: 11, color: '#888' }}>({product.reviews})</span>
                </div>
                <div>
                  <span style={s.price}>K{product.price.toLocaleString()}</span>
                  {product.oldPrice > 0 && <span style={s.oldPrice}>K{product.oldPrice.toLocaleString()}</span>}
                </div>
                <div style={s.delivery}>📦 {product.delivery}</div>
                <button
                  onClick={() => addToCart(product.id)}
                  style={{
                    width: '100%',
                    background: justAdded === product.id ? '#22c55e' : '#c8232c',
                    color: '#fff', border: 'none', borderRadius: 4, padding: '10px',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {justAdded === product.id ? '✓ Added to Cart!' : '+ Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>No products found</div>
            <div style={{ fontSize: 14 }}>Try a different search or category</div>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} style={{ marginTop: 16, background: '#c8232c', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>
              Show All Products
            </button>
          </div>
        )}

        {/* ── USSD BANNER ── */}
        <div style={s.ussdBanner}>
          <div style={{ fontSize: 56 }}>📱</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>No Smartphone? No Problem!</h3>
            <p style={{ margin: '0 0 12px', opacity: 0.85, fontSize: 14 }}>Order any product using USSD on any Airtel, MTN or Zamtel phone. Works on basic 2G.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
              {['1. Dial *384#', '2. Select Shop', '3. Browse & Order', '4. Pay via Airtel Money'].map((step) => (
                <span key={step} style={{ background: 'rgba(255,255,255,.15)', borderRadius: 20, padding: '6px 16px', fontSize: 13 }}>{step}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#f5a623' }}>*384#</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Free to dial</div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerGrid}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, marginBottom: 12 }}>🛍️ Peza Shop</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Zambia&apos;s trusted marketplace. Quality products delivered to Lusaka, Ndola, Kitwe and beyond.</p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Quick Links</div>
            {['All Products', 'Electronics', 'Fashion', 'Food & Groceries', 'Solar & Energy'].map((l) => (
              <div key={l} style={{ marginBottom: 6 }}>
                <button onClick={() => setActiveCategory(l === 'All Products' ? 'All' : l)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 13, padding: 0 }}>{l}</button>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Delivery Cities</div>
            {['Lusaka (Same-day)', 'Ndola (1-2 days)', 'Kitwe (1-2 days)', 'Livingstone (2-3 days)', 'Chipata (3 days)'].map((c) => (
              <div key={c} style={{ marginBottom: 6, fontSize: 13 }}>{c}</div>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Need Help?</div>
            <div style={{ marginBottom: 8, fontSize: 13 }}>📞 USSD: *384#</div>
            <div style={{ marginBottom: 8, fontSize: 13 }}>💬 WhatsApp: +260 97 000 0000</div>
            <div style={{ marginBottom: 16, fontSize: 13 }}>🕐 Mon–Sat: 08:00–18:00</div>
            <Link href="/" style={{ color: '#f5a623', fontSize: 13, fontWeight: 600 }}>← Back to Peza Home</Link>
          </div>
        </div>
        <div style={s.footerBottom}>
          © 2025 Peza / Kiyara Technologies · Made with ❤️ in Zambia
        </div>
      </footer>
    </div>
  );
}
