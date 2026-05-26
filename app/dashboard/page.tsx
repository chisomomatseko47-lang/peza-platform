"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const G = "#C8860A";
const GG = "#E8A020";

// ── Types ────────────────────────────────────────────────────────────────────
interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  delivery_address: string;
  payment_method: string;
  customers?: { whatsapp_number: string; name?: string };
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  is_available: boolean;
  category?: string;
}

interface Business {
  id: string;
  name: string;
  category: string;
  whatsapp_number: string;
  location?: string;
  status: string;
}

interface Stats {
  orders_today: number;
  revenue_today: number;
  total_customers: number;
  active_products: number;
}

// ── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!phone.trim()) { setError("Enter your WhatsApp number"); return; }
    setLoading(true); setError("");
    const formatted = phone.startsWith("+") ? phone : `+${phone}`;
    try {
      const { error: err } = await sb().auth.signInWithOtp({ phone: formatted });
      if (err) throw err;
      setStep("otp");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send OTP. Check Supabase phone auth is enabled.");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp.trim()) { setError("Enter the OTP code"); return; }
    setLoading(true); setError("");
    const formatted = phone.startsWith("+") ? phone : `+${phone}`;
    try {
      const { error: err } = await sb().auth.verifyOtp({ phone: formatted, token: otp, type: "sms" });
      if (err) throw err;
      onLogin(formatted);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid OTP code. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        .serif{font-family:'Instrument Serif',serif;font-style:italic}
        .mono{font-family:'DM Mono',monospace}
        input:focus{outline:none;border-color:${G}!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        .card{animation:fadeUp .5s ease both}
      `}</style>
      <div className="card" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,.08)", borderRadius: 24, padding: 48, width: "100%", maxWidth: 420, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle,rgba(200,134,10,.12),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <img src="/peza-icon.png" alt="Peza" style={{ width: 44, height: 44, objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div>
            <div style={{ color: G, fontWeight: 800, fontSize: 20, letterSpacing: 2 }}>PEZA</div>
            <div className="mono" style={{ color: "#4a4236", fontSize: 10, letterSpacing: 1.5 }}>SME DASHBOARD</div>
          </div>
        </div>

        <h1 className="serif" style={{ fontSize: 32, color: "#e8e4dc", marginBottom: 8 }}>
          {step === "phone" ? "Welcome back" : "Enter your OTP"}
        </h1>
        <p className="mono" style={{ fontSize: 12, color: "#8a7f6e", marginBottom: 32, letterSpacing: .5 }}>
          {step === "phone" ? "Sign in with your registered WhatsApp number" : `Code sent to ${phone}`}
        </p>

        {step === "phone" ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="mono" style={{ fontSize: 11, color: "#4a4236", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>WhatsApp Number</label>
              <input type="tel" placeholder="+260 9XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "14px 18px", fontSize: 15, color: "#e8e4dc", fontFamily: "inherit", transition: "border-color .2s" }} />
            </div>
            <button onClick={sendOtp} disabled={loading}
              style={{ width: "100%", padding: 15, background: G, color: "#000", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 12, cursor: "pointer", opacity: loading ? .7 : 1, transition: "all .2s" }}>
              {loading ? "Sending..." : "Send OTP →"}
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="mono" style={{ fontSize: 11, color: "#4a4236", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>6-Digit Code</label>
              <input type="text" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "14px 18px", fontSize: 22, color: G, fontFamily: "DM Mono,monospace", letterSpacing: 8, textAlign: "center", transition: "border-color .2s" }} />
            </div>
            <button onClick={verifyOtp} disabled={loading}
              style={{ width: "100%", padding: 15, background: G, color: "#000", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 12, cursor: "pointer", opacity: loading ? .7 : 1, marginBottom: 12 }}>
              {loading ? "Verifying..." : "Verify & Enter →"}
            </button>
            <button onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
              style={{ width: "100%", padding: 12, background: "transparent", color: "#8a7f6e", fontSize: 13, border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, cursor: "pointer" }}>
              ← Change number
            </button>
          </>
        )}

        {error && <p className="mono" style={{ color: "#C1440E", fontSize: 12, marginTop: 12, textAlign: "center" }}>{error}</p>}

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.06)", textAlign: "center" }}>
          <p className="mono" style={{ fontSize: 11, color: "#4a4236" }}>Not registered yet?</p>
          <a href="/#sellers" style={{ color: G, fontSize: 12, textDecoration: "none" }}>Register your business on Peza →</a>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", icon: "◈", label: "Overview" },
  { id: "orders", icon: "📦", label: "Orders" },
  { id: "products", icon: "🏪", label: "Catalogue" },
  { id: "broadcast", icon: "📡", label: "Broadcast" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

function Sidebar({ active, onNav, business, onLogout }: { active: string; onNav: (id: string) => void; business: Business | null; onLogout: () => void }) {
  return (
    <div style={{ width: 220, background: "#080808", borderRight: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 }}>
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/peza-icon.png" alt="" style={{ width: 32, height: 32, objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div>
            <div style={{ color: G, fontWeight: 800, fontSize: 14, letterSpacing: 2, fontFamily: "DM Mono,monospace" }}>PEZA</div>
            <div style={{ color: "#4a4236", fontSize: 10, fontFamily: "DM Mono,monospace", letterSpacing: 1 }}>SME PORTAL</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 12px", flex: 1 }}>
        {NAV.map((item) => (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, marginBottom: 2, border: "none", cursor: "pointer", textAlign: "left", background: active === item.id ? "rgba(200,134,10,.12)" : "transparent", color: active === item.id ? G : "#8a7f6e", fontSize: 13, fontFamily: "Syne,system-ui,sans-serif", fontWeight: active === item.id ? 600 : 400, transition: "all .2s" }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
            {active === item.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: G }} />}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        {business && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: "#e8e4dc", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{business.name}</div>
            <div style={{ color: "#4a4236", fontSize: 11, fontFamily: "DM Mono,monospace" }}>{business.category}</div>
          </div>
        )}
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, color: "#4a4236", fontSize: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "DM Mono,monospace", padding: 0 }}>
          ← Sign out
        </button>
      </div>
    </div>
  );
}

// ── Stats Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = G }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: .6 }} />
      <div style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>{label}</div>
      <div style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 40, color, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {sub && <div style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#8a7f6e" }}>{sub}</div>}
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ stats, orders }: { stats: Stats; orders: Order[] }) {
  const recent = orders.slice(0, 5);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Orders Today" value={stats.orders_today} sub="from WhatsApp" />
        <StatCard label="Revenue Today" value={`K${stats.revenue_today.toLocaleString()}`} sub="Kwacha" color="#2de070" />
        <StatCard label="Customers" value={stats.total_customers} sub="total reached" color="#00c9a7" />
        <StatCard label="Active Products" value={stats.active_products} sub="in catalogue" color="#4da6ff" />
      </div>

      <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 20, color: "#e8e4dc" }}>Recent Orders</span>
          <span style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236" }}>{orders.length} total</span>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#4a4236", fontFamily: "DM Mono,monospace", fontSize: 12 }}>No orders yet. Share your Peza link to start receiving orders.</div>
        ) : recent.map((o) => (
          <div key={o.id} style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: o.status === "delivered" ? "#2de070" : o.status === "confirmed" ? G : "#4da6ff", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#e8e4dc", marginBottom: 2 }}>{o.customers?.whatsapp_number || "Customer"}</div>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#8a7f6e" }}>{o.delivery_address} · {o.payment_method}</div>
            </div>
            <div style={{ fontFamily: "DM Mono,monospace", fontSize: 13, color: G }}>K{o.total_amount}</div>
            <div style={{ fontFamily: "DM Mono,monospace", fontSize: 10, color: "#4a4236", textTransform: "uppercase", letterSpacing: 1 }}>{o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab({ orders, onStatusChange }: { orders: Order[]; onStatusChange: (id: string, status: string) => void }) {
  const statusColor: Record<string, string> = { pending: "#4da6ff", confirmed: G, preparing: "#a78bfa", ready: "#2de070", delivered: "#2de070", cancelled: "#C1440E" };
  const nextStatus: Record<string, string> = { pending: "confirmed", confirmed: "preparing", preparing: "ready", ready: "delivered" };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {["All", "Pending", "Confirmed", "Preparing", "Ready", "Delivered"].map((s) => (
          <span key={s} style={{ fontFamily: "DM Mono,monospace", fontSize: 11, padding: "5px 12px", borderRadius: 20, border: `1px solid rgba(255,255,255,.1)`, color: "#8a7f6e", cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}>{s}</span>
        ))}
      </div>
      <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, overflow: "hidden" }}>
        {orders.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#4a4236", fontFamily: "DM Mono,monospace", fontSize: 12 }}>No orders yet. Orders from WhatsApp will appear here.</div>
        ) : orders.map((o, i) => (
          <div key={o.id} style={{ padding: "20px 24px", borderBottom: i < orders.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236" }}>#{o.id.slice(0, 8).toUpperCase()}</span>
                <span style={{ fontFamily: "DM Mono,monospace", fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${statusColor[o.status] || G}22`, color: statusColor[o.status] || G, textTransform: "uppercase", letterSpacing: 1 }}>{o.status}</span>
              </div>
              <div style={{ fontSize: 14, color: "#e8e4dc", marginBottom: 2 }}>{o.customers?.whatsapp_number || "WhatsApp Customer"}</div>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#8a7f6e" }}>{o.delivery_address} · {o.payment_method?.replace("_", " ")}</div>
            </div>
            <div style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 24, color: G }}>K{o.total_amount}</div>
            {nextStatus[o.status] && (
              <button onClick={() => onStatusChange(o.id, nextStatus[o.status])}
                style={{ padding: "8px 16px", background: "rgba(200,134,10,.12)", color: G, border: "1px solid rgba(200,134,10,.25)", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "DM Mono,monospace", letterSpacing: .5, textTransform: "uppercase" }}>
                → {nextStatus[o.status]}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Products Tab ──────────────────────────────────────────────────────────────
function ProductsTab({ products, businessId, onRefresh }: { products: Product[]; businessId: string; onRefresh: () => void }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "" });
  const [saving, setSaving] = useState(false);

  const saveProduct = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    await sb().from("products").insert({
      business_id: businessId,
      name: form.name,
      price: parseFloat(form.price),
      description: form.description,
      category: form.category || "general",
      is_available: true
    });
    setForm({ name: "", price: "", description: "", category: "" });
    setAdding(false);
    setSaving(false);
    onRefresh();
  };

  const toggleAvailable = async (id: string, current: boolean) => {
    await sb().from("products").update({ is_available: !current }).eq("id", id);
    onRefresh();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await sb().from("products").delete().eq("id", id);
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={() => setAdding(!adding)}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: G, color: "#000", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
          {adding ? "✕ Cancel" : "+ Add Product"}
        </button>
      </div>

      {adding && (
        <div style={{ background: "#0f0f0f", border: `1px solid rgba(200,134,10,.3)`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 20, color: "#e8e4dc", marginBottom: 20 }}>New Product</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[["Product Name *", "name", "text", "e.g. Fresh Tomatoes (1kg)"], ["Price (K) *", "price", "number", "e.g. 25"]].map(([l, k, t, ph]) => (
              <div key={k}>
                <label style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>{l}</label>
                <input type={t as string} placeholder={ph as string} value={form[k as keyof typeof form]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", outline: "none" }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Description</label>
            <input type="text" placeholder="Brief description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", outline: "none" }} />
          </div>
          <button onClick={saveProduct} disabled={saving}
            style={{ padding: "12px 24px", background: G, color: "#000", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: saving ? .7 : 1 }}>
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      )}

      <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, overflow: "hidden" }}>
        {products.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#4a4236", fontFamily: "DM Mono,monospace", fontSize: 12 }}>No products yet. Add your first product above.</div>
        ) : products.map((p, i) => (
          <div key={p.id} style={{ padding: "18px 24px", borderBottom: i < products.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: p.is_available ? "#e8e4dc" : "#4a4236", fontWeight: 500, marginBottom: 3 }}>{p.name}</div>
              {p.description && <div style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#8a7f6e" }}>{p.description}</div>}
            </div>
            <div style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 22, color: G }}>K{p.price}</div>
            <button onClick={() => toggleAvailable(p.id, p.is_available)}
              style={{ padding: "6px 14px", background: p.is_available ? "rgba(45,224,112,.12)" : "rgba(255,255,255,.05)", color: p.is_available ? "#2de070" : "#4a4236", border: `1px solid ${p.is_available ? "rgba(45,224,112,.25)" : "rgba(255,255,255,.08)"}`, borderRadius: 8, cursor: "pointer", fontSize: 11, fontFamily: "DM Mono,monospace", letterSpacing: .5 }}>
              {p.is_available ? "● Live" : "○ Off"}
            </button>
            <button onClick={() => deleteProduct(p.id)}
              style={{ padding: "6px 10px", background: "transparent", color: "#C1440E", border: "1px solid rgba(193,68,14,.2)", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Broadcast Tab ─────────────────────────────────────────────────────────────
function BroadcastTab({ businessPhone }: { businessPhone: string }) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const sendBroadcast = () => {
    if (!msg.trim()) return;
    const text = encodeURIComponent(`📢 *Message from your Peza merchant*\n\n${msg}\n\n_Reply to this message or type *menu* to browse our store on Peza._`);
    window.open(`https://wa.me/${businessPhone.replace("+", "")}?text=${text}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 24, color: "#e8e4dc", marginBottom: 8 }}>Broadcast Message</h2>
        <p style={{ fontFamily: "DM Mono,monospace", fontSize: 12, color: "#8a7f6e", marginBottom: 24, lineHeight: 1.7 }}>
          Send a price update, stock alert, or promotion to your Peza customers via WhatsApp.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Your Message</label>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="e.g. Fresh tomatoes back in stock! K25/kg. Reply to order." rows={5}
            style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "14px 16px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6, outline: "none" }} />
        </div>

        {msg && (
          <div style={{ background: "#0a0f0c", border: "1px solid rgba(37,211,102,.15)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontFamily: "DM Mono,monospace", fontSize: 10, color: "#8a7f6e", marginBottom: 8, letterSpacing: 1 }}>PREVIEW</div>
            <div style={{ fontSize: 13, color: "#e9edef", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>📢 <strong>Message from your Peza merchant</strong>{"\n\n"}{msg}</div>
          </div>
        )}

        <button onClick={sendBroadcast}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "13px 24px", background: "#25D366", color: "#000", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
          {sent ? "✅ Opened WhatsApp!" : "📱 Send via WhatsApp"}
        </button>

        <div style={{ marginTop: 24, padding: 16, background: "rgba(200,134,10,.05)", border: "1px solid rgba(200,134,10,.1)", borderRadius: 10 }}>
          <p style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#8a7f6e", lineHeight: 1.7 }}>
            💡 <strong style={{ color: G }}>Tip:</strong> Broadcast opens WhatsApp so you can manually send to your customer groups. Full automated broadcast (Airtel API) coming in Phase 2.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab({ business, onSave }: { business: Business | null; onSave: (b: Partial<Business>) => void }) {
  const [form, setForm] = useState({ name: business?.name || "", category: business?.category || "", location: business?.location || "", whatsapp_number: business?.whatsapp_number || "" });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const CATS = ["food", "fashion", "agriculture", "hardware", "beauty", "retail", "general"];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 24, color: "#e8e4dc", marginBottom: 24 }}>Store Settings</h2>

        <div style={{ display: "grid", gap: 16 }}>
          {[["Business Name", "name", "text", "e.g. Mama Grace Grocery"], ["WhatsApp Number", "whatsapp_number", "tel", "+260 9XX XXX XXX"], ["Location / Area", "location", "text", "e.g. Soweto Market, Lusaka"]].map(([l, k, t, ph]) => (
            <div key={k as string}>
              <label style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>{l}</label>
              <input type={t as string} placeholder={ph as string} value={form[k as keyof typeof form]} onChange={(e) => setForm({ ...form, [k as string]: e.target.value })}
                style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}

          <div>
            <label style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", outline: "none", appearance: "none" }}>
              {CATS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <button onClick={save}
          style={{ marginTop: 24, padding: "13px 28px", background: saved ? "#2de070" : G, color: "#000", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "background .3s" }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ phone }: { phone: string }) {
  const [tab, setTab] = useState("overview");
  const [business, setBusiness] = useState<Business | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({ orders_today: 0, revenue_today: 0, total_customers: 0, active_products: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const db = sb();
    const { data: biz } = await db.from("businesses").select("*").eq("whatsapp_number", phone).single();
    if (!biz) { setLoading(false); return; }
    setBusiness(biz);

    const [ordersRes, productsRes, customersRes] = await Promise.all([
      db.from("orders").select("*, customers(whatsapp_number, name)").eq("business_id", biz.id).order("created_at", { ascending: false }).limit(50),
      db.from("products").select("*").eq("business_id", biz.id).order("created_at", { ascending: false }),
      db.from("customers").select("id").limit(1000),
    ]);

    const allOrders = ordersRes.data || [];
    const allProducts = productsRes.data || [];
    setOrders(allOrders);
    setProducts(allProducts);

    const today = new Date().toISOString().split("T")[0];
    const todayOrders = allOrders.filter((o) => o.created_at?.startsWith(today));
    setStats({
      orders_today: todayOrders.length,
      revenue_today: todayOrders.reduce((s: number, o: Order) => s + (o.total_amount || 0), 0),
      total_customers: customersRes.data?.length || 0,
      active_products: allProducts.filter((p: Product) => p.is_available).length,
    });
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    await sb().from("orders").update({ status }).eq("id", id);
    loadData();
  };

  const saveBusiness = async (updates: Partial<Business>) => {
    if (!business) return;
    await sb().from("businesses").update(updates).eq("id", business.id);
    loadData();
  };

  const logout = async () => { await sb().auth.signOut(); window.location.reload(); };

  const TAB_TITLES: Record<string, string> = { overview: "Dashboard Overview", orders: "Order Management", products: "Product Catalogue", broadcast: "Broadcast Messages", settings: "Store Settings" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050505", fontFamily: "system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        .serif{font-family:'Instrument Serif',serif;font-style:italic}
        .mono{font-family:'DM Mono',monospace}
        input:focus,textarea:focus,select:focus{outline:none;border-color:${G}!important}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#050505}::-webkit-scrollbar-thumb{background:#C8860A44;border-radius:3px}
      `}</style>

      <Sidebar active={tab} onNav={setTab} business={business} onLogout={logout} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,.06)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(5,5,5,.9)", backdropFilter: "blur(20px)", zIndex: 10 }}>
          <div>
            <h1 style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 26, color: "#e8e4dc", margin: 0 }}>{TAB_TITLES[tab]}</h1>
            {business && <div style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#4a4236", marginTop: 2 }}>{business.name} · {phone}</div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2de070" }} />
            <span style={{ fontFamily: "DM Mono,monospace", fontSize: 11, color: "#2de070" }}>Live</span>
          </div>
        </div>

        <div style={{ padding: 32 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 80 }}>
              <div style={{ fontFamily: "DM Mono,monospace", fontSize: 12, color: "#4a4236", letterSpacing: 2 }}>LOADING...</div>
            </div>
          ) : !business ? (
            <div style={{ textAlign: "center", padding: 80 }}>
              <div style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: 28, color: "#e8e4dc", marginBottom: 12 }}>Business not found</div>
              <p style={{ fontFamily: "DM Mono,monospace", fontSize: 12, color: "#8a7f6e", marginBottom: 24 }}>Your WhatsApp number isn&apos;t registered on Peza yet.</p>
              <a href="/#sellers" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: G, color: "#000", padding: "14px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Register Your Business →</a>
            </div>
          ) : (
            <>
              {tab === "overview" && <OverviewTab stats={stats} orders={orders} />}
              {tab === "orders" && <OrdersTab orders={orders} onStatusChange={updateOrderStatus} />}
              {tab === "products" && <ProductsTab products={products} businessId={business.id} onRefresh={loadData} />}
              {tab === "broadcast" && <BroadcastTab businessPhone={business.whatsapp_number} />}
              {tab === "settings" && <SettingsTab business={business} onSave={saveBusiness} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── App Entry ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [phone, setPhone] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    sb().auth.getSession().then(({ data }) => {
      if (data.session?.user?.phone) setPhone(data.session.user.phone);
      setChecking(false);
    });
    const { data: { subscription } } = sb().auth.onAuthStateChange((_e, session) => {
      setPhone(session?.user?.phone || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "DM Mono,monospace", fontSize: 12, color: "#4a4236", letterSpacing: 3 }}>LOADING...</div>
    </div>
  );

  if (!phone) return <LoginScreen onLogin={setPhone} />;
  return <Dashboard phone={phone} />;
}
