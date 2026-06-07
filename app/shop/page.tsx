/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useRef } from 'react';
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
  { id: 1, name: 'Itel A70 Smartphone 4G LTE', price: 1850, oldPrice: 2200, rating: 4.5, reviews: 128, badge: 'Hot Deal', badgeColor: '#c8232c', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', category: 'Electronics', delivery: 'Free delivery' },
  { id: 2, name: 'African Chitenge Print Fabric 6 Yards', price: 420, oldPrice: 580, rating: 4.8, reviews: 94, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&q=80', category: 'Fashion', delivery: 'Delivery K25' },
  { id: 3, name: 'Zambia Pure Wild Honey 500g', price: 180, oldPrice: 240, rating: 4.9, reviews: 203, badge: 'Best Seller', badgeColor: '#f5a623', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', category: 'Food & Groceries', delivery: 'Free delivery' },
  { id: 4, name: 'Kapenta Dried Fish 1kg Pack', price: 95, oldPrice: 130, rating: 4.6, reviews: 67, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80', category: 'Food & Groceries', delivery: 'Delivery K15' },
  { id: 5, name: 'Fresh Tomatoes 5kg Basket', price: 65, oldPrice: 0, rating: 4.4, reviews: 45, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', category: 'Food & Groceries', delivery: 'Free delivery' },
  { id: 6, name: '150W Solar Panel Kit Home System', price: 3200, oldPrice: 4100, rating: 4.7, reviews: 89, badge: 'New', badgeColor: '#22c55e', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80', category: 'Solar & Energy', delivery: 'Delivery K80' },
  { id: 7, name: 'Natural Shea Butter Cream 250ml', price: 120, oldPrice: 160, rating: 4.8, reviews: 312, badge: 'Top Rated', badgeColor: '#7c3aed', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80', category: 'Beauty', delivery: 'Free delivery' },
  { id: 8, name: 'Premium Maize Flour 25kg Bag', price: 280, oldPrice: 320, rating: 4.5, reviews: 156, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Food & Groceries', delivery: 'Delivery K30' },
  { id: 9, name: 'Wireless Bluetooth Earbuds', price: 450, oldPrice: 650, rating: 4.3, reviews: 78, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', category: 'Electronics', delivery: 'Free delivery' },
  { id: 10, name: "Men's Formal Suit Navy Blue", price: 1200, oldPrice: 1800, rating: 4.6, reviews: 52, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', category: 'Fashion', delivery: 'Delivery K40' },
  { id: 11, name: 'Moringa Leaf Powder 200g', price: 85, oldPrice: 110, rating: 4.7, reviews: 198, badge: 'Popular', badgeColor: '#f5a623', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&q=80', category: 'Health', delivery: 'Free delivery' },
  { id: 12, name: 'Wooden Dining Table Set 4-Seater', price: 4500, oldPrice: 6000, rating: 4.5, reviews: 33, badge: '', badgeColor: '', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', category: 'Home & Living', delivery: 'Delivery K150' },
];

type Product = typeof products[0];

export default function ShopPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState('');
  const productsRef = useRef<HTMLDivElement>(null);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    setJustAdded(product.id);
    setToast(product.name.substring(0, 28) + '... added!');
    setTimeout(() => setJustAdded(null), 1500);
    setTimeout(() => setToast(''), 3000);
  };

  const removeFromCart = (idx: number) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const pct = (old: number, cur: number) => Math.round((1 - cur / old) * 100);

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const filtered = products.filter((p) => {
    const matchS = p.name.toLowerCase().includes(search.toLowerCase());
    const matchC = activeCategory === 'All' || p.category === activeCategory;
    return matchS && matchC;
  });

  const cartTotal = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={{ fontFamily: 'Inter,Arial,sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,.2)', whiteSpace: 'nowrap' as const }}>
          ✓ {toast}
        </div>
      )}

      {/* CART DRAWER */}
      {showCart && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: 360, height: '100vh', background: '#fff', zIndex: 200, boxShadow: '-4px 0 20px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column' as const }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>🛒 Cart ({cart.length})</h3>
            <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#666' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' as const, padding: '16px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center' as const, padding: '40px 20px', color: '#888' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                <div style={{ marginBottom: 16 }}>Your cart is empty</div>
                <button onClick={() => setShowCart(false)} style={{ background: '#c8232c', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>Continue Shopping</button>
              </div>
            ) : (
              cart.map((product, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 16, padding: '12px', background: '#f9f9f9', borderRadius: 8 }}>
                  <img src={product.image} alt={product.name} referrerPolicy="no-referrer" style={{ width: 64, height: 64, objectFit: 'cover' as const, borderRadius: 6 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{product.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#c8232c' }}>K{product.price.toLocaleString()}</div>
                  </div>
                  <button onClick={() => removeFromCart(idx)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 20, alignSelf: 'flex-start' as const }}>×</button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 16, fontWeight: 700 }}>
                <span>Total:</span><span style={{ color: '#c8232c' }}>K{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '10px 12px', marginBottom: 12, fontSize: 13, color: '#166534' }}>
                💬 To complete your order, WhatsApp us or dial *384#
              </div>
              <a href="https://wa.me/260570230160?text=Hi%2C%20I%20want%20to%20order%20from%20Peza%20Shop" target="_blank" rel="noreferrer" style={{ display: 'block', background: '#25D366', color: '#fff', textDecoration: 'none', borderRadius: 6, padding: '12px', textAlign: 'center' as const, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
                💬 Order via WhatsApp
              </a>
              <button onClick={() => { setCart([]); setShowCart(false); }} style={{ width: '100%', background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '10px', cursor: 'pointer', color: '#888', fontSize: 13 }}>Clear Cart</button>
            </div>
          )}
        </div>
      )}
      {showCart && <div onClick={() => setShowCart(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 199 }} />}

      {/* HEADER */}
      <header style={{ background: '#c8232c', position: 'sticky' as const, top: 0, zIndex: 50, padding: '0 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
          <Link href="/" style={{ color: '#fff', fontWeight: 800, fontSize: 22, textDecoration: 'none', letterSpacing: 1 }}>🛍️ Peza</Link>
          <div style={{ flex: 1, display: 'flex', background: '#fff', borderRadius: 4, overflow: 'hidden', maxWidth: 600 }}>
            <input value={search} onChange={(e) => { setSearch(e.target.value); scrollToProducts(); }} placeholder="Search products, brands, categories..." style={{ flex: 1, border: 'none', padding: '10px 14px', fontSize: 14, outline: 'none' }} />
            <button style={{ background: '#f5a623', border: 'none', padding: '0 18px', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 16 }} onClick={scrollToProducts}>🔍</button>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 22, position: 'relative' as const }} onClick={() => setShowCart(true)}>
            🛒{cart.length > 0 && <span style={{ position: 'absolute' as const, top: -6, right: -8, background: '#f5a623', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cart.length}</span>}
          </button>
          <div style={{ color: '#fff', textAlign: 'center' as const, fontSize: 12 }}>
            <div style={{ opacity: 0.75, fontSize: 11 }}>No internet?</div>
            <div style={{ fontWeight: 700 }}>Dial *384#</div>
          </div>
        </div>
        <nav style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 20, paddingBottom: 8, overflowX: 'auto' as const }}>
          {['All', ...categories.map((c) => c.name)].map((cat) => (
            <button key={cat} onClick={() => { setActiveCategory(cat); scrollToProducts(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeCategory === cat ? '#f5a623' : '#fff', fontWeight: activeCategory === cat ? 700 : 400, fontSize: 13, whiteSpace: 'nowrap' as const, paddingBottom: 4, borderBottom: activeCategory === cat ? '2px solid #f5a623' : '2px solid transparent' }}>{cat}</button>
          ))}
        </nav>
      </header>

      {/* HERO */}
      <div style={{ maxWidth: 1200, margin: '16px auto', padding: '0 16px' }}>
        <div style={{ background: 'linear-gradient(135deg,#c8232c 0%,#8b0000 50%,#1a1a2e 100%)', borderRadius: 8, padding: '32px 40px', display: 'flex', alignItems: 'center', position: 'relative' as const, overflow: 'hidden', minHeight: 200 }}>
          <div style={{ zIndex: 2 }}>
            <div style={{ background: '#f5a623', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12, display: 'inline-block', marginBottom: 10 }}>⚡ FLASH SALE — ENDS TONIGHT</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2, color: '#fff' }}>Shop Smart,<br />Save Big in Zambia</h1>
            <p style={{ fontSize: 15, opacity: 0.9, margin: '0 0 20px', color: '#fff' }}>Up to 40% off. Delivered to Lusaka, Ndola, Kitwe &amp; more.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ background: '#f5a623', color: '#fff', border: 'none', borderRadius: 4, padding: '12px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }} onClick={() => { setActiveCategory('All'); scrollToProducts(); }}>Shop All Products</button>
              <button style={{ background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: 4, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowCart(true)}>🛒 View Cart</button>
            </div>
          </div>
          <div style={{ position: 'absolute' as const, right: 40, top: '50%', transform: 'translateY(-50%)', fontSize: 100, opacity: 0.12 }}>🛍️</div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>

        {/* TRUST BADGES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[{icon:'🚚',title:'Fast Delivery',sub:'Lusaka same-day'},{icon:'✅',title:'Verified Sellers',sub:'100% authentic'},{icon:'💳',title:'Easy Payment',sub:'Airtel Money & cash'},{icon:'📞',title:'USSD *384#',sub:'No internet needed'}].map((b) => (
            <div key={b.title} style={{ background: '#fff', borderRadius: 6, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
              <span style={{ fontSize: 24 }}>{b.icon}</span>
              <div><div style={{ fontWeight: 700, fontSize: 13 }}>{b.title}</div><div style={{ fontSize: 11, color: '#888' }}>{b.sub}</div></div>
            </div>
          ))}
        </div>

        {/* CATEGORY GRID */}
        <div style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#222' }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 10 }}>
            {categories.map((cat) => (
              <button key={cat.name} onClick={() => { setActiveCategory(cat.name); scrollToProducts(); }} style={{ background: cat.bg, border: activeCategory === cat.name ? '2px solid #c8232c' : '2px solid transparent', borderRadius: 8, padding: '14px 8px', cursor: 'pointer', textAlign: 'center' as const }}>
                <div style={{ fontSize: 28 }}>{cat.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#333', marginTop: 6 }}>{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* DEALS BAR */}
        <div style={{ background: '#c8232c', borderRadius: 8, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ color: '#fff' }}><div style={{ fontWeight: 800, fontSize: 16 }}>⚡ Deals of the Day</div><div style={{ fontSize: 12, opacity: 0.8 }}>Hurry! Limited stock</div></div>
          {['08 HRS','34 MIN','22 SEC'].map((t) => (<div key={t} style={{ background: '#fff', color: '#c8232c', borderRadius: 4, padding: '6px 12px', fontWeight: 800, fontSize: 16 }}>{t}</div>))}
          <div style={{ flex: 1 }} />
          <button onClick={scrollToProducts} style={{ background: '#f5a623', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 700, cursor: 'pointer' }}>See All Deals →</button>
        </div>

        {/* PRODUCTS */}
        <div ref={productsRef} style={{ scrollMarginTop: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#222', margin: 0 }}>
              {activeCategory === 'All' ? 'All Products' : activeCategory}
              <span style={{ fontSize: 13, color: '#888', fontWeight: 400, marginLeft: 8 }}>({filtered.length} items)</span>
            </h2>
            {(activeCategory !== 'All' || search) && (
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} style={{ background: 'none', border: 'none', color: '#c8232c', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Clear filters ×</button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }}>
            {filtered.map((product) => (
              <div key={product.id} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.1)', cursor: 'pointer' }}>
                <div style={{ position: 'relative' as const, background: '#f9f9f9' }}>
                  <img src={product.image} alt={product.name} referrerPolicy="no-referrer" style={{ width: '100%', height: 200, objectFit: 'cover' as const, display: 'block' }} />
                  {product.badge && <span style={{ position: 'absolute' as const, top: 10, left: 10, background: product.badgeColor, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3 }}>{product.badge}</span>}
                  {product.oldPrice > 0 && <span style={{ position: 'absolute' as const, top: 10, right: 10, background: '#c8232c', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 7px', borderRadius: 3 }}>-{pct(product.oldPrice, product.price)}%</span>}
                </div>
                <div style={{ padding: '12px 14px 14px' }}>
                  <p style={{ fontSize: 13, color: '#333', margin: '0 0 8px', lineHeight: 1.4, fontWeight: 500, height: 38, overflow: 'hidden' }}>{product.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ color: '#f5a623', fontSize: 13 }}>{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span style={{ fontSize: 11, color: '#888' }}>({product.reviews})</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#c8232c' }}>K{product.price.toLocaleString()}</span>
                    {product.oldPrice > 0 && <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through', marginLeft: 8 }}>K{product.oldPrice.toLocaleString()}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, marginBottom: 12, marginTop: 4 }}>📦 {product.delivery}</div>
                  <button onClick={() => addToCart(product)} style={{ width: '100%', background: justAdded === product.id ? '#22c55e' : '#c8232c', color: '#fff', border: 'none', borderRadius: 4, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    {justAdded === product.id ? '✓ Added to Cart!' : '+ Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center' as const, padding: '60px 20px', color: '#888' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>No products found</div>
              <div style={{ fontSize: 14 }}>Try a different search or category</div>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} style={{ marginTop: 16, background: '#c8232c', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 }}>Show All Products</button>
            </div>
          )}
        </div>

        {/* SELL BANNER */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ fontSize: 48 }}>🏪</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', color: '#92400e' }}>Sell Your Products on Peza</h3>
            <p style={{ margin: 0, color: '#78350f', fontSize: 14 }}>Join hundreds of Zambian businesses. List products for free and get paid via Airtel Money.</p>
          </div>
          <Link href="/dashboard" style={{ background: '#f5a623', color: '#fff', textDecoration: 'none', borderRadius: 6, padding: '12px 24px', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' as const }}>Open Your Shop →</Link>
        </div>

        {/* USSD BANNER */}
        <div style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)', borderRadius: 8, padding: '28px 32px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 32, color: '#fff' }}>
          <div style={{ fontSize: 56 }}>📱</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>No Smartphone? No Problem!</h3>
            <p style={{ margin: '0 0 12px', opacity: 0.85, fontSize: 14 }}>Order via USSD on any Airtel, MTN or Zamtel phone. Works on basic 2G.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
              {['1. Dial *384#','2. Select Shop','3. Browse & Order','4. Pay via Airtel Money'].map((step) => (
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

      {/* FOOTER */}
      <footer style={{ background: '#222', color: '#ccc', padding: '32px 16px', marginTop: 20 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, marginBottom: 12 }}>🛍️ Peza Shop</div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>Zambia&apos;s trusted marketplace. Delivered to Lusaka, Ndola, Kitwe and beyond.</p>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Quick Links</div>
            {[{label:'All Products',cat:'All'},{label:'Electronics',cat:'Electronics'},{label:'Fashion',cat:'Fashion'},{label:'Food & Groceries',cat:'Food & Groceries'},{label:'Solar & Energy',cat:'Solar & Energy'}].map((l) => (
              <div key={l.label} style={{ marginBottom: 6 }}>
                <button onClick={() => { setActiveCategory(l.cat); scrollToProducts(); }} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 13, padding: 0 }}>{l.label}</button>
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Delivery Cities</div>
            {['Lusaka (Same-day)','Ndola (1-2 days)','Kitwe (1-2 days)','Livingstone (2-3 days)','Chipata (3 days)'].map((c) => (
              <div key={c} style={{ marginBottom: 6, fontSize: 13 }}>{c}</div>
            ))}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Need Help?</div>
            <div style={{ marginBottom: 8, fontSize: 13 }}>📞 USSD: *384#</div>
            <a href="https://wa.me/260570230160" target="_blank" rel="noreferrer" style={{ color: '#ccc', textDecoration: 'none', display: 'block', marginBottom: 8, fontSize: 13 }}>💬 WhatsApp Support</a>
            <div style={{ marginBottom: 16, fontSize: 13 }}>🕐 Mon–Sat: 08:00–18:00</div>
            <Link href="/" style={{ color: '#f5a623', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>← Peza Home</Link>
            <Link href="/blog" style={{ color: '#ccc', fontSize: 13, display: 'block', marginBottom: 6 }}>📰 Blog</Link>
            <Link href="/dashboard" style={{ color: '#ccc', fontSize: 13, display: 'block' }}>🏪 Seller Dashboard</Link>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '20px auto 0', borderTop: '1px solid #444', paddingTop: 16, textAlign: 'center' as const, fontSize: 12, color: '#888' }}>
          © 2025 Peza / Kiyara Technologies · Made with ❤️ in Zambia
        </div>
      </footer>
    </div>
  );
}
