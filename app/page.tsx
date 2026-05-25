"use client";
import { useEffect, useRef, useState } from "react";

function P5Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let sk: any;
    import("p5").then((m) => {
      const P5 = m.default;
      sk = new P5((p: any) => {
        const pts: any[] = [];
        let t = 0;
        p.setup = () => {
          const c = p.createCanvas(p.windowWidth, p.windowHeight);
          if (ref.current) c.parent(ref.current);
          p.colorMode(p.RGB, 255, 255, 255, 255);
          p.background(5, 5, 5);
          for (let i = 0; i < 700; i++)
            pts.push({ x: p.random(p.width), y: p.random(p.height), px: 0, py: 0, life: p.random(200), maxLife: p.random(140, 280), speed: p.random(0.8, 2.2), size: p.random(0.6, 2.0), type: p.random() < 0.7 ? 0 : p.random() < 0.85 ? 1 : 2 });
        };
        p.draw = () => {
          p.background(5, 5, 5, 18); t += 0.0006;
          for (const pt of pts) {
            pt.px = pt.x; pt.py = pt.y;
            const nx = pt.x * 0.0022, ny = pt.y * 0.0022;
            const a = p.noise(nx, ny, t) * p.TWO_PI * 2.8 + p.noise(nx * 2.1, ny * 2.1, t * 1.4) * p.PI * 0.5;
            const dx = p.width * 0.5 - pt.x, dy = p.height * 0.5 - pt.y;
            pt.x += Math.cos(a) * pt.speed + dx * (Math.sqrt(dx*dx+dy*dy) > 200 ? 0.00015 : 0);
            pt.y += Math.sin(a) * pt.speed + dy * (Math.sqrt(dx*dx+dy*dy) > 200 ? 0.00015 : 0);
            pt.life++;
            if (pt.life >= pt.maxLife || pt.x < -20 || pt.x > p.width + 20 || pt.y < -20 || pt.y > p.height + 20) {
              pt.x = p.random(p.width); pt.y = p.random(p.height); pt.px = pt.x; pt.py = pt.y; pt.life = 0; pt.maxLife = p.random(140, 280);
            }
            const prog = pt.life / pt.maxLife;
            let alpha = prog < 0.15 ? prog / 0.15 : prog > 0.75 ? (1 - prog) / 0.25 : 1.0; alpha *= 175;
            let r = 0, g = 0, b = 0;
            if (pt.type === 0) { const v = p.noise(pt.x * 0.003, pt.y * 0.003, t * 0.5); r = 200 + v * 55; g = 134 + v * 30; b = 10; }
            else if (pt.type === 1) { r = 26; g = 107 + p.noise(pt.x * 0.002, pt.y * 0.002, t) * 40; b = 60; }
            else { r = 193; g = 68; b = 14; }
            p.stroke(r, g, b, alpha); p.strokeWeight(pt.size); p.line(pt.px, pt.py, pt.x, pt.y);
          }
        };
        p.windowResized = () => { p.resizeCanvas(p.windowWidth, p.windowHeight); p.background(5, 5, 5); };
      });
    });
    return () => sk?.remove();
  }, []);
  return <div ref={ref} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

const WA = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.551 4.107 1.513 5.838L.057 23.804a.5.5 0 0 0 .636.637l5.966-1.456A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.375l-.36-.214-3.737.912.928-3.638-.234-.374A9.818 9.818 0 0 1 12 2.182c5.42 0 9.818 4.397 9.818 9.818 0 5.42-4.397 9.818-9.818 9.818z"/>
  </svg>
);

const G = "#C8860A";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [sellerOpen, setSellerOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [biz, setBiz] = useState("");
  const [done, setDone] = useState(false);
  const [wlPhone, setWlPhone] = useState("");
  const [wlDone, setWlDone] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => { document.body.style.overflow = sellerOpen ? "hidden" : ""; }, [sellerOpen]);

  return (
    <div style={{ background: "#050505", color: "#e8e4dc", fontFamily: "system-ui,sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        .serif{font-family:'Instrument Serif',serif;font-style:italic}
        .mono{font-family:'DM Mono',monospace}
        .rv{opacity:0;transform:translateY(24px);transition:opacity .7s,transform .7s}
        .rv.vis{opacity:1;transform:none}
        .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}
        @keyframes glow{0%,100%{filter:drop-shadow(0 0 30px rgba(200,134,10,.55))}50%{filter:drop-shadow(0 0 55px rgba(200,134,10,.9))}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes wap{0%{transform:scale(1);opacity:.4}100%{transform:scale(1.65);opacity:0}}
        .glow{animation:glow 4s ease-in-out infinite}
        .float{animation:float 6s ease-in-out infinite}
        a,button{cursor:pointer}
        .card:hover{transform:translateY(-4px)!important}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#050505}::-webkit-scrollbar-thumb{background:#C8860A44;border-radius:3px}
      `}</style>

      {/* Floating WA */}
      <a href="https://wa.me/260570230160" target="_blank" rel="noreferrer"
        style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(37,211,102,.5)", textDecoration: "none" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#25D366", animation: "wap 2.5s infinite", zIndex: -1 }} />
        <WA />
      </a>

      {/* Gold line */}
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${G},#E8A020,${G},transparent)`, opacity: .55 }} />

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: 64, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(5,5,5,.93)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "1px solid transparent", transition: "all .4s" }}>
        <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/peza-logo.png" alt="Peza" style={{ height: 38, width: "auto", filter: "drop-shadow(0 0 10px rgba(200,134,10,.35))" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span style={{ color: G, fontWeight: 800, fontSize: 22, letterSpacing: 3, marginLeft: 8 }}>PEZA</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[["#how", "How it works"], ["#verticals", "Platform"], ["#sellers", "For Sellers"], ["#investors", "Investors"]].map(([h, l]) => (
            <a key={h} href={h} style={{ color: "rgba(232,228,220,.65)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>{l}</a>
          ))}
          <a href="#waitlist" style={{ background: "#25D366", color: "#000", padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Get Early Access</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
        <P5Hero />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(200,134,10,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(200,134,10,.035) 1px,transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%,black 40%,transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%,black 40%,transparent 100%)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)", width: 640, height: 420, background: "radial-gradient(ellipse,rgba(200,134,10,.09) 0%,transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <img src="/peza-icon.png" alt="Peza" className="glow float" style={{ width: 110, height: 110, objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <img src="/peza-logo.png" alt="Peza" className="glow" style={{ height: 48, width: "auto", display: "block", margin: "0 auto 20px" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />

          <div className="mono" style={{ fontSize: 11, color: G, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, opacity: 0, animation: "fadeUp .8s .3s forwards", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ width: 28, height: 1, background: G, opacity: .5, display: "block" }} />Launching in Lusaka, Zambia<span style={{ width: 28, height: 1, background: G, opacity: .5, display: "block" }} />
          </div>

          <h1 className="serif" style={{ fontSize: "clamp(44px,7vw,96px)", lineHeight: 1, marginBottom: 20, opacity: 0, animation: "fadeUp .8s .4s forwards", letterSpacing: -2 }}>
            <span style={{ color: G }}>Buy.</span> <span style={{ color: "#2de070" }}>Sell.</span> Connect<br />all inside <span style={{ color: G }}>WhatsApp</span>
          </h1>

          <p style={{ fontSize: "clamp(15px,2vw,19px)", lineHeight: 1.8, color: "rgba(232,228,220,.6)", maxWidth: 580, margin: "0 auto 24px", opacity: 0, animation: "fadeUp .8s .5s forwards" }}>
            Zambia&apos;s first AI-powered commerce platform. Shop local businesses, list products, get paid via Airtel Money — all through WhatsApp.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 32, opacity: 0, animation: "fadeUp .8s .6s forwards" }}>
            {["Marketplace", "Chat Commerce", "Trusted Deals", "Airtel Money", "Delivery"].map((p) => (
              <span key={p} className="mono" style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(200,134,10,.25)", color: "rgba(200,134,10,.65)" }}>{p}</span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 72, opacity: 0, animation: "fadeUp .8s .7s forwards" }}>
            <a href="#waitlist" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#25D366", color: "#000", padding: "16px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none" }}><WA /> Start on WhatsApp</a>
            <button onClick={() => setSellerOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: G, color: "#000", padding: "16px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none" }}>List Your Business →</button>
            <a href="#how" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "transparent", color: "#e8e4dc", padding: "16px 32px", borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none", border: "1px solid rgba(232,228,220,.15)" }}>See how it works</a>
          </div>

          <div style={{ display: "flex", gap: 56, justifyContent: "center", flexWrap: "wrap", paddingTop: 48, borderTop: "1px solid rgba(255,255,255,.06)", opacity: 0, animation: "fadeUp .8s .85s forwards" }}>
            {[{ v: "95%", l: "WhatsApp Penetration" }, { v: "17M+", l: "Zambians to Reach" }, { v: "0", l: "App Downloads Needed" }, { v: "3", l: "Languages Supported" }].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <span className="mono" style={{ fontSize: 28, fontWeight: 500, color: G, display: "block" }}>{s.v}</span>
                <span className="mono" style={{ fontSize: 10, color: "#4a4236", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6, display: "block" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div className="rv">
          <span className="mono" style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: G, display: "block", marginBottom: 12 }}>The Peza Experience</span>
          <h2 className="serif" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 20 }}>Your shop lives in your customer&apos;s chat</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#8a7f6e", marginBottom: 32 }}>Imagine ordering groceries from a Soweto Market vendor, listing your farm produce for buyers across Zambia, and getting paid via Airtel Money — all through a single WhatsApp conversation.</p>
          <a href="#waitlist" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: G, color: "#000", padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Join Early Access →</a>
        </div>
        <div className="rv d2" style={{ width: 256, margin: "0 auto", background: "#151515", borderRadius: 38, padding: 13, boxShadow: "0 60px 120px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.07)", position: "relative" }}>
          <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 88, height: 22, background: "#151515", borderRadius: "0 0 14px 14px", zIndex: 2 }} />
          <div style={{ background: "#0a0f0c", borderRadius: 26, overflow: "hidden" }}>
            <div style={{ background: "#1f2c34", padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/peza-icon.png" alt="P" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} onError={(e) => { const el = e.target as HTMLImageElement; el.style.background = "linear-gradient(135deg,#8A5C07,#C8860A)"; el.style.display = "flex"; }} />
              <div><div style={{ color: "#e9edef", fontSize: 12 }}>Peza</div><div className="mono" style={{ color: "#8696a0", fontSize: 10 }}>● online</div></div>
            </div>
            <div style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 7, background: "#0a0f0c", minHeight: 380 }}>
              <div style={{ maxWidth: "88%", padding: "7px 10px 8px", borderRadius: 8, borderTopLeftRadius: 2, fontSize: 11.5, lineHeight: 1.55, alignSelf: "flex-start", background: "#1f2c34", color: "#e9edef" }}>
                Mwabonwa! 👋 Welcome to Peza.
                <div style={{ marginTop: 4 }}>
                  {["🛒 Shop", "🌾 AgriMarket", "🚛 Freight", "🏪 My Store"].map((c) => (
                    <span key={c} className="mono" style={{ background: "rgba(200,134,10,.15)", border: "1px solid rgba(200,134,10,.3)", color: G, fontSize: 10, padding: "4px 9px", borderRadius: 16, display: "inline-block", margin: 2 }}>{c}</span>
                  ))}
                </div>
                <div className="mono" style={{ fontSize: 9, color: "#8696a0", textAlign: "right", marginTop: 2 }}>09:41 ✓✓</div>
              </div>
              <div style={{ maxWidth: "88%", padding: "7px 10px 8px", borderRadius: 8, borderTopRightRadius: 2, fontSize: 11.5, lineHeight: 1.55, alignSelf: "flex-end", background: "#005c4b", color: "#e9edef" }}>I want to sell my maize harvest<div className="mono" style={{ fontSize: 9, color: "#8696a0", textAlign: "right", marginTop: 2 }}>09:42 ✓✓</div></div>
              <div style={{ maxWidth: "88%", padding: "7px 10px 8px", borderRadius: 8, borderTopLeftRadius: 2, fontSize: 11.5, lineHeight: 1.55, alignSelf: "flex-start", background: "#1f2c34", color: "#e9edef" }}>Great! How many bags and where?<div className="mono" style={{ fontSize: 9, color: "#8696a0", textAlign: "right", marginTop: 2 }}>09:42 ✓✓</div></div>
              <div style={{ maxWidth: "88%", padding: "7px 10px 8px", borderRadius: 8, borderTopRightRadius: 2, fontSize: 11.5, lineHeight: 1.55, alignSelf: "flex-end", background: "#005c4b", color: "#e9edef" }}>80 bags, Mkushi<div className="mono" style={{ fontSize: 9, color: "#8696a0", textAlign: "right", marginTop: 2 }}>09:43 ✓✓</div></div>
              <div style={{ maxWidth: "88%", padding: "7px 10px 8px", borderRadius: 8, borderTopLeftRadius: 2, fontSize: 11.5, lineHeight: 1.55, alignSelf: "flex-start", background: "#1f2c34", color: "#e9edef" }}>Found 3 buyers. Best price: <strong style={{ color: G }}>K680/bag</strong> 🔥<div className="mono" style={{ fontSize: 9, color: "#8696a0", textAlign: "right", marginTop: 2 }}>09:43 ✓✓</div></div>
              <div className="mono" style={{ background: "#1f2c34", color: "#8696a0", alignSelf: "flex-start", padding: "9px 13px", borderRadius: 8, fontSize: 18, letterSpacing: 3 }}>···</div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,.06)", maxWidth: 1100, margin: "0 auto" }} />

      {/* VERTICALS */}
      <section id="verticals" style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div className="rv" style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: G, display: "block", marginBottom: 12 }}>What Peza Does</span>
            <h2 className="serif" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 16 }}>Eight verticals. One conversation.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#8a7f6e", maxWidth: 560, margin: "0 auto" }}>From your farm to your freight, your store to your savings — all through a single WhatsApp number.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            {[
              { e: "🛒", t: "SME Commerce", d: "Any Zambian business gets a WhatsApp storefront.", b: "Phase 1", c: G },
              { e: "🌾", t: "AgriMarket", d: "Farmers list produce, buyers bid, live market prices.", b: "Phase 1", c: "#2de070" },
              { e: "🚛", t: "Freight Booking", d: "Book a truck from Lusaka to Ndola or Livingstone.", b: "Phase 1", c: "#00c9a7" },
              { e: "📈", t: "Price Broadcasting", d: "Real-time commodity prices pushed to subscribers.", b: "Phase 1", c: "#4da6ff" },
              { e: "🏛", t: "Gov Services", d: "NRC, NAPSA, ZRA, business registration via WhatsApp.", b: "Phase 2", c: "#C1440E" },
              { e: "🔔", t: "Smart Reminders", d: "Tax deadlines, licence renewals, restock alerts.", b: "Phase 2", c: "#a78bfa" },
              { e: "📱", t: "USSD Access", d: "Full Peza experience via USSD on any basic phone.", b: "Phase 3", c: "#f472b6" },
              { e: "💳", t: "Mobile Payments", d: "Airtel Money and MTN MoMo integrated.", b: "Phase 1", c: G },
            ].map((v, i) => (
              <div key={v.t} className={`rv card d${i % 4}`} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: "22px 18px", transition: "all .3s", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: v.c, opacity: .75 }} />
                <span style={{ fontSize: 26, marginBottom: 12, display: "block" }}>{v.e}</span>
                <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 7, color: "#e8e4dc" }}>{v.t}</h3>
                <p style={{ fontSize: 12, lineHeight: 1.65, color: "#8a7f6e", marginBottom: 10 }}>{v.d}</p>
                <span className="mono" style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, background: `${v.c}22`, color: v.c }}>{v.b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,.06)", maxWidth: 1100, margin: "0 auto" }} />

      {/* MARKET */}
      <section style={{ padding: "100px 0", background: "linear-gradient(180deg,transparent,rgba(200,134,10,.015) 50%,transparent)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div className="rv" style={{ marginBottom: 48 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: G, display: "block", marginBottom: 12 }}>The Zambian Market</span>
            <h2 className="serif" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 16 }}>Why now. Why WhatsApp. Why Zambia.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#8a7f6e", maxWidth: 560 }}>The informal economy is not a problem to be fixed. It is the largest opportunity in Southern Africa.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {[
              { n: "$3B+", c: G, d: "Zambia's informal economy — mostly undigitised, underbanked, operating on trust networks." },
              { n: "95%", c: "#2de070", d: "Adult Zambian WhatsApp penetration — the highest of any platform. WhatsApp is the platform." },
              { n: "1.5M", c: "#00c9a7", d: "Smallholder farming households — each a potential AgriMarket user gaining price transparency." },
            ].map((m, i) => (
              <div key={m.n} className={`rv card d${i}`} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: "28px 24px", transition: "all .25s" }}>
                <div className="serif" style={{ fontSize: 56, lineHeight: 1, marginBottom: 8, color: m.c }}>{m.n}</div>
                <p style={{ fontSize: 13, color: "#8a7f6e", lineHeight: 1.7 }}>{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,.06)", maxWidth: 1100, margin: "0 auto" }} />

      {/* FOR SELLERS */}
      <section id="sellers" style={{ padding: "100px 0", background: "#0f0f0f" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <span className="rv mono" style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C1440E", display: "block", marginBottom: 12 }}>For Businesses</span>
            <h2 className="rv serif" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 16 }}>Your storefront is already in your customers&apos; phones</h2>
            <p className="rv" style={{ fontSize: 15, lineHeight: 1.8, color: "#8a7f6e", marginBottom: 28 }}>17 million Zambians are on WhatsApp. Peza puts your business there — catalogue, orders, and Airtel Money payments. No website needed.</p>
            <ul className="rv" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["Free to join — first 50 SMEs pay nothing for 3 months", "Full WhatsApp catalogue — unlimited products with images", "Instant order notifications — never miss a sale", "Airtel Money collected automatically — no cash handling", "Web dashboard — manage store, track orders, analytics"].map((b) => (
                <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#8a7f6e", lineHeight: 1.6 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(200,134,10,.18)", color: G, fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>{b}
                </li>
              ))}
            </ul>
            <button onClick={() => setSellerOpen(true)} className="rv" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: G, color: "#000", padding: "16px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none" }}>Register Your Business →</button>
          </div>
          <div className="rv d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ i: "🍅", t: "Food & Groceries", d: "Market vendors, supermarkets, home bakers." }, { i: "👗", t: "Fashion", d: "Boutiques, tailors, second-hand dealers." }, { i: "🌾", t: "Agriculture", d: "Farmers, cooperatives, agri-dealers." }, { i: "🔧", t: "Hardware", d: "Hardware shops, building suppliers." }, { i: "💄", t: "Beauty & Salons", d: "Hair salons, barbershops, beauty sellers." }, { i: "📦", t: "General Retail", d: "Any Zambian business. If you sell it, Peza lists it." }].map((s) => (
              <div key={s.t} className="card" style={{ background: "#050505", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: 18, transition: "all .25s" }}>
                <span style={{ fontSize: 22, marginBottom: 8, display: "block" }}>{s.i}</span>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{s.t}</h4>
                <p style={{ fontSize: 12, color: "#8a7f6e", lineHeight: 1.6 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,.06)", maxWidth: 1100, margin: "0 auto" }} />

      {/* WAITLIST */}
      <section id="waitlist" style={{ padding: "120px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse,rgba(200,134,10,.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: G, display: "block", marginBottom: 12 }}>Early Access</span>
          <h2 className="serif" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 12 }}>Be first on Peza</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#8a7f6e", maxWidth: 560, margin: "0 auto 48px" }}>We&apos;re onboarding our first 50 pilot SMEs in Lusaka — free for 3 months.</p>
          {!wlDone ? (
            <div style={{ display: "flex", gap: 12, maxWidth: 460, margin: "0 auto 20px", flexWrap: "wrap", justifyContent: "center" }}>
              <input type="tel" placeholder="Your WhatsApp number (+260...)" value={wlPhone} onChange={(e) => setWlPhone(e.target.value)}
                style={{ flex: 1, minWidth: 240, background: "#0f0f0f", border: "1px solid rgba(255,255,255,.11)", borderRadius: 12, padding: "15px 20px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", outline: "none" }} />
              <button onClick={() => { if (!wlPhone.trim()) return; window.open("https://wa.me/260570230160?text=" + encodeURIComponent("Hi Peza! Early access.\nPhone: " + wlPhone), "_blank"); setWlDone(true); }}
                style={{ background: G, color: "#000", padding: "15px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none" }}>Join →</button>
            </div>
          ) : (
            <p style={{ fontSize: 16, color: G, marginBottom: 20 }}>✅ Opening WhatsApp — we&apos;ll be in touch!</p>
          )}
          <p className="mono" style={{ fontSize: 12, color: "#4a4236" }}>No spam. We&apos;ll WhatsApp you directly.</p>
        </div>
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,.06)", maxWidth: 1100, margin: "0 auto" }} />

      {/* INVESTORS */}
      <section id="investors" style={{ padding: "100px 0", background: "#0f0f0f" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <span className="rv mono" style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: G, display: "block", marginBottom: 12 }}>Investment Opportunity</span>
          <h2 className="rv serif" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 16 }}>Built for Africa. Ready to scale.</h2>
          <p className="rv" style={{ fontSize: 15, lineHeight: 1.8, color: "#8a7f6e", maxWidth: 560, margin: "0 auto 48px" }}>Peza is seeking seed investment to scale beyond Lusaka.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 48 }}>
            {[{ n: "$3B", t: "Total Addressable Market", d: "Zambia's informal economy — our primary digitisation target.", w: 85 }, { n: "$500K", t: "Seed Round Target", d: "12-month runway to 1,000 active SMEs and AgriMarket launch.", w: 30 }, { n: "18mo", t: "Path to Profitability", d: "Transaction fees at 5,000 SMEs cover operational costs.", w: 60 }].map((d, i) => (
              <div key={d.n} className={`rv d${i} card`} style={{ background: "#050505", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: 24, textAlign: "left", transition: "all .25s" }}>
                <div className="serif" style={{ fontSize: 40, color: G, lineHeight: 1, marginBottom: 8 }}>{d.n}</div>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{d.t}</h4>
                <p style={{ fontSize: 13, color: "#8a7f6e", lineHeight: 1.6, marginBottom: 12 }}>{d.d}</p>
                <div style={{ height: 5, background: "rgba(255,255,255,.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.w}%`, background: `linear-gradient(90deg,#8A5C07,${G})`, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
          <a href="mailto:chisomo@kivara.co.zm" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: G, color: "#000", padding: "16px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>Request Investor Deck →</a>
        </div>
      </section>

      {/* FOOTER */}
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${G},#E8A020,${G},transparent)`, opacity: .55 }} />
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "48px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <img src="/peza-logo.png" alt="Peza" style={{ height: 32, width: "auto", filter: "brightness(.85)" }} onError={(e) => { const el = e.target as HTMLImageElement; el.style.display = "none"; }} />
            <div className="mono" style={{ fontSize: 11, color: "#4a4236", marginTop: 4, letterSpacing: 1 }}>BUY. SELL. CONNECT. — ZAMBIA&apos;S COMMERCE PLATFORM</div>
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[["#how", "How it works"], ["#verticals", "Platform"], ["#sellers", "For Sellers"], ["#investors", "Investors"], ["mailto:chisomo@kivara.co.zm", "Contact"]].map(([h, l]) => (
              <a key={h} href={h} style={{ color: "#4a4236", textDecoration: "none", fontSize: 13 }}>{l}</a>
            ))}
          </div>
          <div className="mono" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: "6px 14px", fontSize: 10, color: G, letterSpacing: 1 }}>LUSAKA · ZAMBIA · 2026</div>
        </div>
      </footer>

      {/* SELLER MODAL */}
      {sellerOpen && (
        <div onClick={(e) => e.target === e.currentTarget && setSellerOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.82)", backdropFilter: "blur(12px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,.11)", borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 40, position: "relative" }}>
            <button onClick={() => setSellerOpen(false)} style={{ position: "absolute", top: 20, right: 20, width: 32, height: 32, borderRadius: 8, background: "#141414", border: "1px solid rgba(255,255,255,.06)", color: "#8a7f6e", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C1440E", display: "block", marginBottom: 10 }}>Seller Registration</span>
            <h2 className="serif" style={{ fontSize: 28, marginBottom: 6 }}>List Your Business on Peza</h2>
            <p style={{ fontSize: 13, color: "#8a7f6e", lineHeight: 1.7, marginBottom: 28 }}>Join our pilot — free for the first 3 months.</p>
            {!done ? (
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#4a4236", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px", fontFamily: "DM Mono,monospace" }}>Your Name *</label>
                  <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.11)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#4a4236", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px", fontFamily: "DM Mono,monospace" }}>WhatsApp Number *</label>
                  <input type="tel" placeholder="+260 9XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)}
                    style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.11)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#4a4236", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".5px", fontFamily: "DM Mono,monospace" }}>Business Name *</label>
                  <input type="text" placeholder="e.g. Mama Grace Grocery Store" value={biz} onChange={(e) => setBiz(e.target.value)}
                    style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,.11)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#e8e4dc", fontFamily: "inherit", outline: "none" }} />
                </div>
                <button onClick={() => { if (!name || !phone || !biz) return; window.open("https://wa.me/260570230160?text=" + encodeURIComponent("SELLER:\nName: " + name + "\nPhone: " + phone + "\nBusiness: " + biz), "_blank"); setDone(true); }}
                  style={{ width: "100%", padding: 15, background: G, color: "#000", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 12, cursor: "pointer", marginTop: 8 }}>
                  Register My Business on Peza
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <span style={{ fontSize: 48, marginBottom: 16, display: "block" }}>🎉</span>
                <h3 className="serif" style={{ fontSize: 20, marginBottom: 8 }}>You&apos;re on the list!</h3>
                <p style={{ fontSize: 14, color: "#8a7f6e", lineHeight: 1.7 }}>We&apos;ll WhatsApp you within 24 hours. Welcome to the future of Zambian commerce.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

