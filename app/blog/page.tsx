import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Zambia Commerce & Business Tips",
  description: "Read the latest tips, stories and insights about buying and selling in Zambia. Learn how to grow your business with Peza, Airtel Money, and WhatsApp commerce.",
  openGraph: {
    title: "Peza Blog — Zambia Commerce & Business Tips",
    description: "Tips and stories for Zambian entrepreneurs and shoppers.",
    url: "https://www.peza.africa/blog",
  },
};

const G = "#C8860A";
const GG = "#E8A020";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  emoji: string;
  tags: string[];
}

const POSTS: BlogPost[] = [
  {
    id: 1, slug: "how-to-start-selling-online-zambia",
    title: "How to Start Selling Online in Zambia in 2025",
    excerpt: "Everything you need to know to list your first product, accept Airtel Money payments, and reach buyers across Lusaka, Ndola and Kitwe.",
    category: "Seller Guides", author: "Peza Team", date: "June 1, 2025", readTime: "6 min read", emoji: "🏪",
    tags: ["selling", "Zambia", "Airtel Money", "WhatsApp"],
  },
  {
    id: 3, slug: "top-selling-products-zambia-2025",
    title: "Top 10 Best-Selling Products in Zambia Right Now",
    excerpt: "From kapenta to solar panels — we analysed thousands of orders to bring you the hottest products Zambians are buying in 2025.",
    category: "Trends", author: "Peza Analytics", date: "May 18, 2025", readTime: "8 min read", emoji: "📈",
    tags: ["trending", "products", "Zambia", "market"],
  },
  {
    id: 4, slug: "airtel-money-for-businesses-zambia",
    title: "Why Zambian SMEs Should Accept Airtel Money in 2025",
    excerpt: "95% of Zambians use WhatsApp. With Airtel Money penetration rising fast, mobile payments are no longer optional for Zambian businesses.",
    category: "Business Tips", author: "Peza Team", date: "May 10, 2025", readTime: "5 min read", emoji: "💳",
    tags: ["Airtel Money", "mobile payments", "SME", "Zambia"],
  },
  {
    id: 5, slug: "zambia-ecommerce-growth-2025",
    title: "Zambia's E-Commerce Boom: What Sellers Need to Know",
    excerpt: "Online shopping in Zambia grew by 340% in 2024. Here's what that means for local sellers, and how Peza is helping businesses ride the wave.",
    category: "Industry News", author: "Peza Analytics", date: "April 30, 2025", readTime: "7 min read", emoji: "🚀",
    tags: ["ecommerce", "growth", "Zambia", "opportunity"],
  },
  {
    id: 6, slug: "whatsapp-commerce-guide-zambia",
    title: "The Complete Guide to WhatsApp Commerce for Zambian Businesses",
    excerpt: "WhatsApp is where Zambia buys and sells. Learn how to set up your WhatsApp Business profile, catalogue and Peza integration.",
    category: "Seller Guides", author: "Kivara Team", date: "April 20, 2025", readTime: "10 min read", emoji: "📲",
    tags: ["WhatsApp", "commerce", "guide", "Zambia"],
  },
];

const CATEGORIES = ["All", "Seller Guides", "Buyer Guides", "Business Tips", "Trends", "Industry News"];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e4dc", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,10,.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(200,134,10,.15)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, height: 64 }}>
          <Link href="/" style={{ color: GG, fontWeight: 900, fontSize: 22, textDecoration: "none" }}>PEZA</Link>
          <span style={{ color: "#3d3d3d" }}>|</span>
          <span style={{ color: "#8a8a8a", fontSize: 14 }}>Blog</span>
          <div style={{ flex: 1 }} />
          <Link href="/shop" style={{ background: `linear-gradient(135deg, #C8860A, #E8A020)`, color: "#000", padding: "8px 18px", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 13 }}>🛍️ Shop Now</Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{ padding: "64px 24px 40px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        <p style={{ color: G, fontWeight: 600, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Peza Blog</p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#e8e4dc", marginBottom: 16, lineHeight: 1.2 }}>
          Commerce Insights for <span style={{ color: GG }}>Zambia</span>
        </h1>
        <p style={{ color: "#8a8a8a", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
          Tips, guides and stories to help Zambian entrepreneurs sell more and buyers shop smarter.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {/* Featured Post */}
        <div style={{ background: "linear-gradient(135deg, #1a0f00, #0d1a0d)", border: "1px solid rgba(200,134,10,.25)", borderRadius: 20, padding: "40px", marginBottom: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
          <div>
            <span style={{ background: G, color: "#000", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>⭐ Featured</span>
            <p style={{ color: "#6b7280", fontSize: 12, marginTop: 12, marginBottom: 6 }}>{POSTS[0].category} · {POSTS[0].readTime}</p>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#e8e4dc", lineHeight: 1.3, marginBottom: 14 }}>{POSTS[0].title}</h2>
            <p style={{ color: "#8a8a8a", lineHeight: 1.7, marginBottom: 20 }}>{POSTS[0].excerpt}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {POSTS[0].tags.map(t => (
                <span key={t} style={{ background: "rgba(200,134,10,.1)", border: "1px solid rgba(200,134,10,.2)", color: GG, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>#{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${G}, ${GG})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000", fontSize: 12 }}>P</div>
              <div>
                <p style={{ color: "#e8e4dc", fontSize: 13, fontWeight: 600 }}>{POSTS[0].author}</p>
                <p style={{ color: "#6b7280", fontSize: 12 }}>{POSTS[0].date}</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100 }}>{POSTS[0].emoji}</div>
        </div>

        {/* Post Grid */}
        <h2 style={{ color: GG, fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Latest Articles</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, marginBottom: 56 }}>
          {POSTS.slice(1).map(post => (
            <article key={post.id} style={{ background: "#111", border: "1px solid rgba(200,134,10,.12)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 12, transition: "border-color .2s" }}>
              <div style={{ fontSize: 40 }}>{post.emoji}</div>
              <span style={{ background: "rgba(200,134,10,.1)", color: GG, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 10, width: "fit-content" }}>{post.category}</span>
              <h3 style={{ color: "#e8e4dc", fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>{post.title}</h3>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {post.tags.slice(0, 2).map(t => (
                  <span key={t} style={{ background: "rgba(255,255,255,.04)", color: "#6b7280", padding: "2px 8px", borderRadius: 10, fontSize: 11 }}>#{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 12 }}>
                <span style={{ color: "#6b7280", fontSize: 12 }}>{post.date}</span>
                <span style={{ color: "#6b7280", fontSize: 12 }}>⏱ {post.readTime}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ background: "linear-gradient(135deg, rgba(200,134,10,.08), rgba(26,107,48,.08))", border: "1px solid rgba(200,134,10,.2)", borderRadius: 20, padding: "48px 32px", textAlign: "center" }}>
          <h2 style={{ color: GG, fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Stay Ahead in Zambia's Market</h2>
          <p style={{ color: "#8a8a8a", marginBottom: 28 }}>Get weekly tips, deals and seller insights — delivered via WhatsApp.</p>
          <a href="https://wa.me/260570230160?text=Subscribe me to Peza updates!" target="_blank" rel="noreferrer"
            style={{ display: "inline-block", background: "#25D366", color: "#000", padding: "14px 32px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
            📲 Subscribe via WhatsApp
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "32px 24px", textAlign: "center" }}>
        <p style={{ color: "#3d3d3d", fontSize: 13 }}>
          © 2025 Peza / Kivara ·{" "}
          <Link href="/" style={{ color: G, textDecoration: "none" }}>Home</Link> ·{" "}
          <Link href="/shop" style={{ color: G, textDecoration: "none" }}>Shop</Link> · Built with ❤️ in Zambia 🇿🇲
        </p>
      </footer>
    </div>
  );
}
