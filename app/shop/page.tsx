"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ── Brand colors ─────────────────────────────────────────────────────────────
const G = "#C8860A";
const GG = "#E8A020";
const DARK = "#0a0a0a";

// ── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  seller: string;
  sellerCity: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  description: string;
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: "all", name: "All Products", icon: "🛒", count: 248 },
  { id: "food", name: "Food & Groceries", icon: "🥦", count: 64 },
  { id: "fashion", name: "Fashion & Clothing", icon: "👗", count: 52 },
  { id: "electronics", name: "Electronics", icon: "📱", count: 38 },
  { id: "farming", name: "Farm Produce", icon: "🌽", count: 41 },
  { id: "beauty", name: "Beauty & Health", icon: "💄", count: 29 },
  { id: "home", name: "Home & Living", icon: "🏠", count: 24 },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Zambian Honey — 1kg Raw", price: 85, originalPrice: 110, seller: "Bee Zambia", sellerCity: "Lusaka", category: "food", rating: 4.9, reviews: 127, image: "🍯", badge: "Best Seller", description: "Pure raw honey from Zambian bees. No additives.", inStock: true },
  { id: 2, name: "Chitenge Dress — Modern Cut", price: 180, seller: "Lusaka Threads", sellerCity: "Lusaka", category: "fashion", rating: 4.7, reviews: 84, image: "👗", badge: "New Arrival", description: "Handmade chitenge dress, multiple sizes available.", inStock: true },
  { id: 3, name: "Maize Flour 25kg (Roller Meal)", price: 230, originalPrice: 250, seller: "Agro Zambia", sellerCity: "Ndola", category: "food", rating: 4.8, reviews: 203, image: "🌾", badge: "Top Rated", description: "Premium roller meal, freshly milled. Delivery available.", inStock: true },
  { id: 4, name: "Android Smartphone 4G", price: 1350, originalPrice: 1800, seller: "TechHub Zambia", sellerCity: "Kitwe", category: "electronics", rating: 4.5, reviews: 56, image: "📱", badge: "Sale", description: "Quad-core, 3GB RAM, 64GB storage. Airtel Money accepted.", inStock: true },
  { id: 5, name: "Fresh Tomatoes (5kg Crate)", price: 45, seller: "Soweto Farms", sellerCity: "Lusaka", category: "farming", rating: 4.6, reviews: 312, image: "🍅", description: "Farm-fresh tomatoes. Same-day delivery in Lusaka.", inStock: true },
  { id: 6, name: "Solar Panel Kit 100W", price: 2800, originalPrice: 3200, seller: "SunPower ZM", sellerCity: "Livingstone", category: "electronics", rating: 4.8, reviews: 41, image: "☀️", badge: "Popular", description: "Complete solar kit with battery & inverter. Nationwide delivery.", inStock: true },
  { id: 7, name: "Shea Butter Body Cream", price: 55, seller: "ZamBeauty", sellerCity: "Lusaka", category: "beauty", rating: 4.9, reviews: 178, image: "💆", badge: "Best Seller", description: "100% natural Zambian shea butter. Skin brightening formula.", inStock: true },
  { id: 8, name: "Kapenta (Dried Fish) 2kg", price: 95, seller: "Lake Tanganyika Co.", sellerCity: "Mpulungu", category: "food", rating: 4.7, reviews: 91, image: "🐟", description: "Sun-dried kapenta fish. Packed hygienically.", inStock: true },
  { id: 9, name: "Bamboo Dining Chair Set (4)", price: 1200, seller: "Zamwood Crafts", sellerCity: "Chipata", category: "home", rating: 4.6, reviews: 33, image: "🪑", description: "Handcrafted bamboo chairs. Durable & eco-friendly.", inStock: false },
  { id: 10, name: "Nshima Pot (Large, 20L)", price: 320, seller: "Home Essentials ZM", sellerCity: "Ndola", category: "home", rating: 4.4, reviews: 67, image: "🥘", description: "Heavy-duty aluminum nshima pot. Free lid included.", inStock: true },
  { id: 11, name: "Airtel Data Bundle Card", price: 50, seller: "Digital Zambia", sellerCity: "Lusaka", category: "electronics", rating: 4.8, reviews: 445, image: "📶", badge: "Hot Deal", description: "3GB data bundle code. Works on all Airtel Zambia networks.", inStock: true },
  { id: 12, name: "Chitenge Fabric (3m)", price: 130, originalPrice: 160, seller: "Vibrant Fabrics ZM", sellerCity: "Lusaka", category: "fashion", rating: 4.5, reviews: 210, image: "🎨", badge: "Sale", description: "Premium Zambian chitenge. Bright authentic patterns.", inStock: true },
];

// ── Chat message type ──────────────────────────────────────────────────────
interface ChatMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  city: string;
}

const CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, user: "Mwape K.", text: "Anyone know where I can get fresh kapenta delivered to Kabulonga?", time: "2m ago", city: "Lusaka" },
  { id: 2, user: "Chisomo M.", text: "Try Lake Tanganyika Co. on here! They deliver nationwide 🐟", time: "1m ago", city: "Ndola" },
  { id: 3, user: "Bwalya N.", text: "Just ordered the solar panel kit — arrived in 3 days to Kitwe! Highly recommend.", time: "5m ago", city: "Kitwe" },
  { id: 4, user: "Thandiwe P.", text: "Does anyone sell chitenge online here with delivery to Livingstone?", time: "3m ago", city: "Livingstone" },
  { id: 5, user: "Lubinda S.", text: "Yes! Vibrant Fabrics ZM ships everywhere. Check category 👆", time: "2m ago", city: "Lusaka" },
];

// ── StarRating component ──────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 12 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

// ── ProductCard component ─────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={{
      background: "#111", border: "1px solid rgba(200,134,10,.15)", borderRadius: 14,
      overflow: "hidden", transition: "transform .2s, box-shadow .2s", cursor: "pointer",
      position: "relative",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(200,134,10,.2)`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
    >
      {product.badge && (
        <div style={{ position: "absolute", top: 10, left: 10, background: G, color: "#000", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
          {product.badge}
        </div>
      )}
      {!product.inStock && (
        <div style={{ position: "absolute", top: 10, right: 10, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
          Out of Stock
        </div>
      )}
      {discount > 0 && (
        <div style={{ position: "absolute", top: product.badge ? 34 : 10, left: 10, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
          -{discount}%
        </div>
      )}
      <div style={{ height: 140, background: "linear-gradient(135deg, #1a1a1a, #222)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>
        {product.image}
      </div>
      <div style={{ padding: 16 }}>
        <p style={{ color: "#8a8a8a", fontSize: 11, marginBottom: 4 }}>📍 {product.sellerCity} · {product.seller}</p>
        <h3 style={{ color: "#e8e4dc", fontSize: 14, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{product.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <StarRating rating={product.rating} />
          <span style={{ color: "#6b7280", fontSize: 11 }}>({product.reviews})</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
          <span style={{ color: GG, fontWeight: 700, fontSize: 18 }}>K{product.price}</span>
          {product.originalPrice && (
            <span style={{ color: "#6b7280", textDecoration: "line-through", fontSize: 13 }}>K{product.originalPrice}</span>
          )}
        </div>
        <button
          disabled={!product.inStock}
          onClick={() => onAddToCart(product)}
          style={{
            width: "100%", padding: "10px 0", borderRadius: 10, fontWeight: 700, fontSize: 13,
            background: product.inStock ? `linear-gradient(135deg, ${G}, ${GG})` : "#333",
            color: product.inStock ? "#000" : "#666", border: "none", cursor: product.inStock ? "pointer" : "not-allowed",
          }}
        >
          {product.inStock ? "🛒 Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

// ── Cart sidebar ──────────────────────────────────────────────────────────
function CartSidebar({ items, onClose, onRemove }: { items: Product[]; onClose: () => void; onRemove: (id: number) => void }) {
  const total = items.reduce((s, p) => s + p.price, 0);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,.7)" }} />
      <div style={{ width: 340, background: "#111", padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: GG, fontWeight: 700, fontSize: 20 }}>🛒 Cart ({items.length})</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#e8e4dc", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {items.length === 0 ? (
          <p style={{ color: "#6b7280", textAlign: "center", marginTop: 40 }}>Your cart is empty</p>
        ) : (
          <>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: "#1a1a1a", padding: 12, borderRadius: 10 }}>
                <span style={{ fontSize: 28 }}>{item.image}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#e8e4dc", fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                  <p style={{ color: GG, fontWeight: 700 }}>K{item.price}</p>
                </div>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>🗑</button>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ color: "#e8e4dc", fontWeight: 600 }}>Total:</span>
                <span style={{ color: GG, fontWeight: 700, fontSize: 20 }}>K{total}</span>
              </div>
              <a
                href={`https://wa.me/260570230160?text=Hi! I'd like to order from Peza. My cart total is K${total}.`}
                target="_blank"
                rel="noreferrer"
                style={{ display: "block", textAlign: "center", background: "#25D366", color: "#000", padding: 14, borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 15 }}
              >
                📲 Order via WhatsApp
              </a>
              <p style={{ color: "#6b7280", fontSize: 11, textAlign: "center", marginTop: 8 }}>Or dial *384# to order via USSD</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Shop Page ────────────────────────────────────────────────────────
export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [activeTab, setActiveTab] = useState<"shop" | "community" | "ussd">("shop");

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase()) ||
      p.sellerCity.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const addToCart = (p: Product) => setCart(prev => [...prev, p]);
  const removeFromCart = (id: number) => setCart(prev => { const i = prev.findLastIndex(x => x.id === id); return prev.filter((_, idx) => idx !== i); });

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), user: "You", text: chatInput, time: "just now", city: "Zambia" }]);
    setChatInput("");
  };

  return (
    <div style={{ minHeight: "100vh", background: DARK, color: "#e8e4dc", fontFamily: "system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(200,134,10,.15)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, height: 64 }}>
          <Link href="/" style={{ color: GG, fontWeight: 900, fontSize: 22, textDecoration: "none", letterSpacing: -0.5 }}>PEZA</Link>
          <span style={{ color: "#3d3d3d", fontSize: 18 }}>|</span>
          <span style={{ color: "#8a8a8a", fontSize: 14 }}>Marketplace</span>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, sellers, cities..."
              style={{ width: "100%", padding: "10px 16px 10px 40px", background: "#1a1a1a", border: "1px solid rgba(200,134,10,.2)", borderRadius: 10, color: "#e8e4dc", fontSize: 14, outline: "none" }}
            />
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }}>🔍</span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {(["shop", "community", "ussd"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13,
                background: activeTab === tab ? G : "transparent", color: activeTab === tab ? "#000" : "#8a8a8a",
              }}>
                {tab === "shop" ? "🛒 Shop" : tab === "community" ? "💬 Community" : "📟 USSD"}
              </button>
            ))}
          </nav>
          <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "linear-gradient(135deg, #C8860A, #E8A020)", border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer", color: "#000", fontWeight: 700, fontSize: 14 }}>
            🛒 Cart {cart.length > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, marginLeft: 4 }}>{cart.length}</span>}
          </button>
        </div>
      </header>

      {cartOpen && <CartSidebar items={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} />}

      {/* ── Hero Banner ── */}
      <div style={{ background: "linear-gradient(135deg, #1a0f00, #0d1a0d)", borderBottom: "1px solid rgba(200,134,10,.1)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: G, fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>🇿🇲 Made for Zambia</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, background: `linear-gradient(135deg, ${G}, ${GG})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12 }}>
            Zambia's Online Marketplace
          </h1>
          <p style={{ color: "#8a8a8a", fontSize: 16, marginBottom: 24 }}>
            Shop from local businesses across Lusaka, Ndola, Kitwe & beyond. Pay with Airtel Money. No smartphone? Dial <strong style={{ color: GG }}>*384#</strong>
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {["🚚 Free Delivery Over K500", "💳 Airtel Money", "📟 USSD *384#", "🛡️ Buyer Protection"].map(tag => (
              <span key={tag} style={{ background: "rgba(200,134,10,.1)", border: "1px solid rgba(200,134,10,.2)", color: GG, padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px" }}>
        {/* ── SHOP TAB ── */}
        {activeTab === "shop" && (
          <>
            {/* Categories */}
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  flexShrink: 0, padding: "10px 18px", borderRadius: 30, border: "1px solid",
                  borderColor: activeCategory === cat.id ? G : "rgba(255,255,255,.08)",
                  background: activeCategory === cat.id ? "rgba(200,134,10,.15)" : "transparent",
                  color: activeCategory === cat.id ? GG : "#8a8a8a", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span style={{ background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "0 6px", fontSize: 11 }}>{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Sort & Results bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ color: "#6b7280", fontSize: 14 }}><span style={{ color: GG, fontWeight: 700 }}>{filtered.length}</span> products found</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "#1a1a1a", border: "1px solid rgba(200,134,10,.2)", color: "#e8e4dc", padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 48 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
            </div>

            {/* Seller CTA */}
            <div style={{ background: "linear-gradient(135deg, rgba(200,134,10,.1), rgba(26,107,48,.1))", border: "1px solid rgba(200,134,10,.2)", borderRadius: 20, padding: "40px 32px", textAlign: "center", marginBottom: 40 }}>
              <h2 style={{ color: GG, fontWeight: 800, fontSize: 28, marginBottom: 10 }}>Start Selling on Peza Today</h2>
              <p style={{ color: "#8a8a8a", fontSize: 15, marginBottom: 24 }}>Join thousands of Zambian businesses. List products for free & get paid via Airtel Money.</p>
              <a href="/dashboard" style={{ display: "inline-block", background: `linear-gradient(135deg, ${G}, ${GG})`, color: "#000", padding: "14px 32px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                🏪 Open Your Shop →
              </a>
            </div>
          </>
        )}

        {/* ── COMMUNITY TAB ── */}
        {activeTab === "community" && (
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{ color: GG, fontWeight: 800, fontSize: 26, marginBottom: 8 }}>💬 Peza Community</h2>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>Chat with buyers & sellers across Zambia — ask questions, share deals, leave tips.</p>
            <div style={{ background: "#111", border: "1px solid rgba(200,134,10,.15)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, maxHeight: 480, overflowY: "auto" }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${G}, ${GG})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000", fontSize: 13, flexShrink: 0 }}>
                      {msg.user[0]}
                    </div>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ color: GG, fontWeight: 600, fontSize: 13 }}>{msg.user}</span>
                        <span style={{ color: "#3d3d3d", fontSize: 11 }}>📍 {msg.city}</span>
                        <span style={{ color: "#3d3d3d", fontSize: 11 }}>{msg.time}</span>
                      </div>
                      <p style={{ color: "#c8c4bc", fontSize: 14, lineHeight: 1.5 }}>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: 16, display: "flex", gap: 12 }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()}
                  placeholder="Ask the community something..."
                  style={{ flex: 1, background: "#1a1a1a", border: "1px solid rgba(200,134,10,.2)", borderRadius: 10, padding: "10px 14px", color: "#e8e4dc", fontSize: 14, outline: "none" }}
                />
                <button onClick={sendChat} style={{ background: `linear-gradient(135deg, ${G}, ${GG})`, border: "none", borderRadius: 10, padding: "10px 18px", color: "#000", fontWeight: 700, cursor: "pointer" }}>Send</button>
              </div>
            </div>
          </div>
        )}

        {/* ── USSD TAB ── */}
        {activeTab === "ussd" && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ color: GG, fontWeight: 800, fontSize: 26, marginBottom: 8 }}>📟 Shop Without a Smartphone</h2>
            <p style={{ color: "#6b7280", marginBottom: 32 }}>Peza works on every phone in Zambia — even basic feature phones. Just dial our USSD code!</p>
            <div style={{ background: "#111", border: "2px solid rgba(200,134,10,.3)", borderRadius: 20, padding: 40, textAlign: "center", marginBottom: 32 }}>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 12 }}>Dial this code on any Zambian phone:</p>
              <div style={{ background: "linear-gradient(135deg, #1a0f00, #0d1a0d)", borderRadius: 16, padding: "24px 32px", display: "inline-block", marginBottom: 16 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: GG, letterSpacing: 4 }}>*384#</span>
              </div>
              <p style={{ color: "#8a8a8a", fontSize: 13 }}>Works on Airtel, MTN & Zamtel networks</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {[
                { step: "1", title: "Dial *384#", desc: "Works on any mobile network in Zambia. No data or internet needed." },
                { step: "2", title: "Browse Products", desc: "Navigate categories like Food, Fashion, Electronics using your keypad." },
                { step: "3", title: "Place Your Order", desc: "Select items and confirm your delivery address via the USSD menu." },
                { step: "4", title: "Pay with Airtel Money", desc: "Receive a payment prompt on your phone. Confirm with your PIN." },
              ].map(s => (
                <div key={s.step} style={{ background: "#111", border: "1px solid rgba(200,134,10,.15)", borderRadius: 14, padding: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${G}, ${GG})`, color: "#000", fontWeight: 900, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{s.step}</div>
                  <h3 style={{ color: "#e8e4dc", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(37,211,102,.05)", border: "1px solid rgba(37,211,102,.2)", borderRadius: 14, padding: 20, textAlign: "center" }}>
              <p style={{ color: "#e8e4dc", marginBottom: 12, fontWeight: 600 }}>Need help ordering via USSD?</p>
              <a href="https://wa.me/260570230160" target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#25D366", color: "#000", padding: "12px 24px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>
                📲 WhatsApp Our Support Team
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ color: "#3d3d3d", fontSize: 13 }}>
          © 2025 Peza / Kivara · <Link href="/" style={{ color: G, textDecoration: "none" }}>Home</Link> · Built with ❤️ in Zambia 🇿🇲
        </p>
      </footer>
    </div>
  );
}
