'use client';
import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { name: 'Electronics', icon: '📱', color: '#e8f4fd' },
  { name: 'Fashion', icon: '👗', color: '#fdf0f8' },
  { name: 'Food & Groceries', icon: '🛒', color: '#f0fdf4' },
  { name: 'Home & Living', icon: '🏠', color: '#fffbeb' },
  { name: 'Beauty', icon: '💄', color: '#fdf2f8' },
  { name: 'Agriculture', icon: '🌾', color: '#f0fdf4' },
  { name: 'Solar & Energy', icon: '☀️', color: '#fffbeb' },
  { name: 'Health', icon: '💊', color: '#f0f9ff' },
];

const products = [
  {
    id: 1, name: 'Itel A70 Smartphone 4G', price: 1850, oldPrice: 2200,
    rating: 4.5, reviews: 128, badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    category: 'Electronics', delivery: 'Free delivery'
  },
  {
    id: 2, name: 'African Print Chitenge Fabric 6 Yards', price: 420, oldPrice: 580,
    rating: 4.8, reviews: 94,
    image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&q=80',
    category: 'Fashion', delivery: 'Delivery K25'
  },
  {
    id: 3, name: 'Zambia Pure Wild Honey 500g', price: 180, oldPrice: 240,
    rating: 4.9, reviews: 203, badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
    category: 'Food & Groceries', delivery: 'Free delivery'
  },
  {
    id: 4, name: 'Kapenta Dried Fish 1kg Pack', price: 95, oldPrice: 130,
    rating: 4.6, reviews: 67,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
    category: 'Food & Groceries', delivery: 'Delivery K15'
  },
  {
    id: 5, name: 'Freshly Picked Tomatoes 5kg', price: 65, oldPrice: null,
    rating: 4.4, reviews: 45,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80',
    category: 'Food & Groceries', delivery: 'Free delivery'
  },
  {
    id: 6, name: '150W Solar Panel Kit Home System', price: 3200, oldPrice: 4100,
    rating: 4.7, reviews: 89, badge: 'New',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',
    category: 'Solar & Energy', delivery: 'Delivery K80'
  },
  {
    id: 7, name: 'Natural Shea Butter Cream 250ml', price: 120, oldPrice: 160,
    rating: 4.8, reviews: 312, badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80',
    category: 'Beauty', delivery: 'Free delivery'
  },
  {
    id: 8, name: 'Premium Maize Flour 25kg Bag', price: 280, oldPrice: 320,
    rating: 4.5, reviews: 156,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    category: 'Food & Groceries', delivery: 'Delivery K30'
  },
  {
    id: 9, name: 'Bluetooth Earbuds Wireless', price: 450, oldPrice: 650,
    rating: 4.3, reviews: 78,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
    category: 'Electronics', delivery: 'Free delivery'
  },
  {
    id: 10, name: 'Men's Formal Suit Navy Blue', price: 1200, oldPrice: 1800,
    rating: 4.6, reviews: 52,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    category: 'Fashion', delivery: 'Delivery K40'
  },
  {
    id: 11, name: 'Moringa Leaf Powder 200g', price: 85, oldPrice: 110,
    rating: 4.7, reviews: 198, badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&q=80',
    category: 'Health', delivery: 'Free delivery'
  },
  {
    id: 12, name: 'Wooden Dining Table Set (4 chairs)', price: 4500, oldPrice: 6000,
    rating: 4.5, reviews: 33,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    category: 'Home & Living', delivery: 'Delivery K150'
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#f5a623', fontSize: 13 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  );
}

export default function ShopPage() {
  const [cart, setCart] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [added, setAdded] = useState<number | null>(null);

  const addToCart = (id: number) => {
    setCart(prev => [...prev, id]);
    setAdded(id);
    setTimeout(() => setAdded(null), 1500);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const discount = (old: number, cur: number) => Math.round((1 - cur / old) * 100);

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>

      {/* ── TOP HEADER ── */}
      <header style={{ background: '#c8232c', padding: '0 16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
          <Link href="/" style={{ color: '#fff', fontWeight: 800, fontSize: 22, textDecoration: 'none', letterSpacing: 1 }}>
            🛍️ Peza
          </Link>
          <div style={{ flex: 1, display: 'flex', background: '#fff', borderRadius: 4, overflow: 'hidden', maxWidth: 600 }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search for products, brands, categories..."
              style={{ flex: 1, border: 'none', padding: '10px 14px', fontSize: 14, outline: 'none' }}
            />
            <button style={{ background: '#f5a623', border: 'none', padding: '0 18px', cursor: 'pointer', color: '#fff', fontWeight: 700 }}>
              🔍
            </button>
          </div>
          <div style={{ display: 'flex', gap: 16, color: '#fff', fontSize: 13 }}>
            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 22, position: 'relative' }}>
              🛒
              {cart.length > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -8, background: '#f5a623', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {cart.length}
                </span>
              )}
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Help</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Dial *384#</div>
            </div>
          </div>
        </div>
        {/* Sub-nav */}
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 20, paddingBottom: 8, overflowX: 'auto' }}>
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ background: 'none', border: 'none', color: activeCategory === cat ? '#f5a623' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: activeCategory === cat ? 700 : 400, whiteSpace: 'nowrap', paddingBottom: 2, borderBottom: activeCategory === cat ? '2px solid #f5a623' : 'none' }}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{ maxWidth: 1200, margin: '16px auto', padding: '0 16px' }}>
        <div style={{ borderRadius: 8, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #c8232c 0%, #8b0000 50%, #1a1a2e 100%)', minHeight: 200, display: 'flex', alignItems: 'center', padding: '32px 40px' }}>
          <div style={{ color: '#fff', zIndex: 2 }}>
            <div style={{ background: '#f5a623', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12, display: 'inline-block', marginBottom: 10, letterSpacing: 1 }}>⚡ FLASH SALE — ENDS TONIGHT</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>Shop Smart,<br />Save Big in Zambia</h1>
            <p style={{ fontSize: 15, opacity: 0.9, margin: '0 0 20px' }}>Up to 40% off on top products. Delivered to Lusaka, Ndola, Kitwe & more.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ background: '#f5a623', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Shop Now</button>
              <button style={{ background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: 4, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>USSD: *384#</button>
            </div>
          </div>
          <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', fontSize: 100, opacity: 0.15 }}>🛍️</div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>

        {/* ── TRUST BADGES ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { icon: '🚚', title: 'Fast Delivery', sub: 'Lusaka same-day' },
            { icon: '✅', title: 'Verified Sellers', sub: '100% authentic' },
            { icon: '💳', title: 'Easy Payment', sub: 'Airtel Money & cash' },
            { icon: '📞', title: 'USSD Support', sub: 'No internet needed' },
          ].map(b => (
            <div key={b.title} style={{ background: '#fff', borderRadius: 6, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
              <span style={{ fontSize: 24 }}>{b.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{b.title}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CATEGORY GRID ── */}
        <div style={{ background: '#fff', borderRadius: 8, padding: '20px', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#222' }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
            {categories.map(cat => (
              <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
                style={{ background: cat.color, border: activeCategory === cat.name ? '2px solid #c8232c' : '2px solid transparent', borderRadius: 8, padding: '16px 8px', cursor: 'pointer', textAlign: 'center', transition: 'all .2s' }}>
                <div style={{ fontSize: 28 }}>{cat.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#333', marginTop: 6 }}>{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── DEALS OF THE DAY ── */}
        <div style={{ background: '#c8232c', borderRadius: 8, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ color: '#fff' }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>⚡ Deals of the Day</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Hurry! Limited stock</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['08', '34', '22'].map((t, i) => (
              <div key={i} style={{ background: '#fff', color: '#c8232c', borderRadius: 4, padding: '6px 10px', fontWeight: 800, fontSize: 18, textAlign: 'center', minWidth: 44 }}>
                {t}<div style={{ fontSize: 9, color: '#888', fontWeight: 400 }}>{['HRS', 'MIN', 'SEC'][i]}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <button style={{ background: '#f5a623', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 700, cursor: 'pointer' }}>See All Deals →</button>
        </div>

        {/* ── PRODUCT GRID ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: 0 }}>
            {activeCategory === 'All' ? 'All Products' : activeCategory}
            <span style={{ fontSize: 13, color: '#888', fontWeight: 400, marginLeft: 8 }}>({filtered.length} items)</span>
          </h2>
          {activeCategory !== 'All' && (
            <button onClick={() => setActiveCategory('All')} style={{ background: 'none', border: 'none', color: '#c8232c', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Clear filter ×</button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {filtered.map(product => (
            <div key={product.id}
              style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.1)', transition: 'transform .2s, box-shadow .2s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,.1)'; }}
            >
              <div style={{ position: 'relative', background: '#f9f9f9' }}>
                <img src={product.image} alt={product.name} referrerPolicy="no-referrer"
                  style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                {product.badge && (
                  <span style={{ position: 'absolute', top: 10, left: 10, background: product.badge === 'Hot Deal' ? '#c8232c' : product.badge === 'Best Seller' ? '#f5a623' : product.badge === 'New' ? '#22c55e' : '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3, letterSpacing: 0.5 }}>
                    {product.badge}
                  </span>
                )}
                {product.oldPrice && (
                  <span style={{ position: 'absolute', top: 10, right: 10, background: '#c8232c', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 7px', borderRadius: 3 }}>
                    -{discount(product.oldPrice, product.price)}%
                  </span>
                )}
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <p style={{ fontSize: 13, color: '#333', margin: '0 0 8px', lineHeight: 1.4, fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <StarRating rating={product.rating} />
                  <span style={{ fontSize: 11, color: '#888' }}>({product.reviews})</span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#c8232c' }}>K{product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through', marginLeft: 8 }}>K{product.oldPrice.toLocaleString()}</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, marginBottom: 12 }}>📦 {product.delivery}</div>
                <button
                  onClick={() => addToCart(product.id)}
                  style={{
                    width: '100%', background: added === product.id ? '#22c55e' : '#c8232c',
                    color: '#fff', border: 'none', borderRadius: 4, padding: '10px',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background .3s'
                  }}>
                  {added === product.id ? '✓ Added!' : '+ Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>No products found</div>
            <div style={{ fontSize: 14 }}>Try a different search term or category</div>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} style={{ marginTop: 16, background: '#c8232c', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>Show All Products</button>
          </div>
        )}

        {/* ── USSD BANNER ── */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: 8, padding: '28px 32px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 32, color: '#fff' }}>
          <div style={{ fontSize: 56 }}>📱</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>No Smartphone? No Problem!</h3>
            <p style={{ margin: '0 0 12px', opacity: 0.85, fontSize: 14 }}>Order any product using USSD on any Airtel, MTN or Zamtel phone. Works on 2G.</p>
            <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
              <span style={{ background: 'rgba(255,255,255,.15)', borderRadius: 20, padding: '6px 16px' }}>1. Dial *384#</span>
              <span style={{ background: 'rgba(255,255,255,.15)', borderRadius: 20, padding: '6px 16px' }}>2. Select "Shop"</span>
              <span style={{ background: 'rgba(255,255,255,.15)', borderRadius: 20, padding: '6px 16px' }}>3. Browse & order</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#f5a623' }}>*384#</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Free to dial</div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#222', color: '#ccc', padding: '32px 16px', marginTop: 20 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, marginBottom: 12 }}>🛍️ Peza Shop</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Zambia's trusted marketplace. Quality products delivered to your door across Lusaka, Ndola, Kitwe and beyond.</p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Quick Links</div>
            {['All Products', 'Electronics', 'Fashion', 'Food & Groceries', 'Solar & Energy'].map(l => (
              <div key={l} style={{ marginBottom: 6 }}><button onClick={() => setActiveCategory(l === 'All Products' ? 'All' : l)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 13, padding: 0, textAlign: 'left' }}>{l}</button></div>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Delivery Cities</div>
            {['Lusaka (Same-day)', 'Ndola (1-2 days)', 'Kitwe (1-2 days)', 'Livingstone (2-3 days)', 'Chipata (3 days)'].map(c => (
              <div key={c} style={{ marginBottom: 6, fontSize: 13 }}>{c}</div>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Need Help?</div>
            <div style={{ marginBottom: 8, fontSize: 13 }}>📞 USSD: *384#</div>
            <div style={{ marginBottom: 8, fontSize: 13 }}>💬 WhatsApp: +260 97 000 0000</div>
            <div style={{ fontSize: 13 }}>🕐 Mon-Sat: 08:00 - 18:00</div>
            <div style={{ marginTop: 16 }}>
              <Link href="/" style={{ color: '#f5a623', fontSize: 13, fontWeight: 600 }}>← Back to Peza Home</Link>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '20px auto 0', borderTop: '1px solid #444', paddingTop: 16, textAlign: 'center', fontSize: 12, color: '#888' }}>
          © 2025 Peza / Kiyara Technologies · Made with ❤️ in Zambia
        </div>
      </footer>
    </div>
  );
}
