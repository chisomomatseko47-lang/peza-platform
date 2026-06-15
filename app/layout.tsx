import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://www.peza.africa";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Peza — Buy. Sell. Connect. Zambia's #1 Commerce Platform",
    template: "%s | Peza Zambia",
  },
  description:
    "Peza is Zambia's leading e-commerce and WhatsApp commerce platform. Shop local businesses in Lusaka, Ndola, Kitwe & across Zambia. Pay with Airtel Money. No app needed — shop via WhatsApp or USSD *384#.",
  keywords: [
    "Zambia online shopping",
    "buy online Zambia",
    "Zambia ecommerce",
    "Lusaka online market",
    "Airtel Money shopping",
    "WhatsApp commerce Zambia",
    "USSD shopping Zambia",
    "Zambian marketplace",
    "buy sell Zambia",
    "Peza Zambia",
    "online store Zambia",
    "Zambia SME market",
    "Lusaka marketplace",
    "Ndola online shop",
    "Kitwe shopping",
    "Zambia delivery",
    "local business Zambia",
  ],
  authors: [{ name: "Kivara", url: BASE_URL }],
  creator: "Kivara",
  publisher: "Peza / Kivara",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_ZM",
    url: BASE_URL,
    siteName: "Peza",
    title: "Peza — Buy. Sell. Connect. Zambia's #1 Commerce Platform",
    description:
      "Shop local Zambian businesses on WhatsApp & online. Pay with Airtel Money. Browse thousands of products from Lusaka, Ndola, Kitwe and beyond.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peza — Zambia's Commerce Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peza — Zambia's #1 Commerce Platform",
    description:
      "Buy & sell on WhatsApp. Shop local Zambian businesses. Pay with Airtel Money. USSD available for all phones.",
    images: ["/og-image.png"],
    creator: "@PezaZambia",
    site: "@PezaZambia",
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "ecommerce",
  verification: {
    google: "nlRYmwkCoTK_tapIEFfA72l7kRPQKZW4r7euvA1DbQY",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Peza",
  alternateName: "Peza Zambia",
  url: BASE_URL,
  logo: `${BASE_URL}/peza-logo.png`,
  description:
    "Zambia's leading WhatsApp and e-commerce platform connecting buyers and sellers across Lusaka, Ndola, Kitwe and all of Zambia.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lusaka",
    addressCountry: "ZM",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English", "Bemba", "Nyanja"],
  },
  sameAs: [
    "https://wa.me/260570230160",
  ],
};
const mobileNavScript =
  "(function(){" +
  "var h=document.getElementById('peza-hamburger');" +
  "var m=document.getElementById('peza-mobile-menu');" +
  "if(!h||!m)return;" +
  "h.addEventListener('click',function(){" +
  "var o=m.classList.toggle('open');" +
  "h.setAttribute('aria-expanded',String(o));" +
  "document.body.style.overflow=o?'hidden':'';" +
  "});" +
  "m.querySelectorAll('a').forEach(function(l){" +
  "l.addEventListener('click',function(){" +
  "m.classList.remove('open');" +
  "h.setAttribute('aria-expanded','false');" +
  "document.body.style.overflow='';" +
  "});});" +
  "})();";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#C8860A" />
        <meta name="geo.region" content="ZM" />
        <meta name="geo.placename" content="Lusaka, Zambia" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="general" />
      </head>

      <body>
        {children}
        <script
          id="peza-mobile-nav"
          dangerouslySetInnerHTML={{ __html: mobileNavScript }}
        />
      </body>
    </html>
  );
}
