"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0D4A2A]/20 to-black pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C8860A] to-transparent" />

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#C8860A] font-bold text-xl tracking-[0.2em]">PEZA</span>
          <span className="text-[#1A6B3C] text-xs tracking-widest mt-1">BY KIVARA</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["How It Works", "For SMEs", "Pricing", "Contact"].map((item) => (
            <a key={item} href="#" className="text-white/60 hover:text-[#C8860A] text-sm tracking-wider transition-colors duration-300">
              {item}
            </a>
          ))}
        </div>
        
          href="https://wa.me/+260000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 tracking-wide"
        >
          Start on WhatsApp
        </a>
      </motion.nav>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 border border-[#C8860A]/30 rounded-full px-4 py-1.5 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-[#1A6B3C] animate-pulse" />
          <span className="text-[#C8860A] text-xs tracking-[0.2em]">ZAMBIA'S COMMERCE PLATFORM</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none mb-4"
        >
          BUY.{" "}
          <span className="text-[#C8860A]">SELL.</span>{" "}
          <span className="text-[#1A6B3C]">CONNECT.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-4 mt-6"
        >
          Peza brings every Zambian business to WhatsApp.
          Browse local shops, place orders, pay with Airtel Money —
          all without leaving your chat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs tracking-widest text-white/30 mb-10"
        >
          {["MARKETPLACE", "CHAT COMMERCE", "TRUSTED DEALS", "DIGITAL PAYMENTS", "DELIVERY"].map((pillar, i) => (
            <span key={pillar} className="flex items-center gap-2">
              {i > 0 && <span className="text-[#C8860A]/40">|</span>}
              {pillar}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          
            href="https://wa.me/+260000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 text-sm tracking-wide min-w-[220px] justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Start on WhatsApp
          </a>
          
            href="#sme-signup"
            className="flex items-center gap-2 border border-[#C8860A]/50 hover:border-[#C8860A] text-[#C8860A] font-semibold px-8 py-4 rounded-full transition-all duration-300 text-sm tracking-wide min-w-[220px] justify-center"
          >
            List Your Business →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10 w-full max-w-lg"
        >
          {[
            { value: "17M+", label: "Zambians" },
            { value: "FREE", label: "To Join" },
            { value: "WhatsApp", label: "Powered" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#C8860A]">{stat.value}</span>
              <span className="text-white/40 text-xs tracking-widest mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}