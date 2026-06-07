import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '20px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{ fontSize: 80, marginBottom: 8 }}>🛍️</div>
        <div style={{ color: '#f5a623', fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
          PEZA · ZAMBIA
        </div>
        <h1 style={{ color: '#fff', fontSize: 72, fontWeight: 900, margin: '0 0 8px', lineHeight: 1 }}>
          404
        </h1>
        <p style={{ color: '#aaa', fontSize: 18, margin: '0 0 8px' }}>
          This page could not be found.
        </p>
        <p style={{ color: '#666', fontSize: 14, margin: '0 0 36px' }}>
          It may have been moved, or it never existed. Let&apos;s get you back on track.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <Link href="/" style={{
            background: '#f5a623',
            color: '#000',
            textDecoration: 'none',
            borderRadius: 6,
            padding: '12px 28px',
            fontWeight: 700,
            fontSize: 15,
          }}>
            ← Back to Home
          </Link>
          <Link href="/shop" style={{
            background: '#c8232c',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 6,
            padding: '12px 28px',
            fontWeight: 700,
            fontSize: 15,
          }}>
            🛍️ Visit Shop
          </Link>
        </div>
        <div style={{ marginTop: 40, color: '#444', fontSize: 12 }}>
          Need help? WhatsApp us or dial{' '}
          <span style={{ color: '#f5a623', fontWeight: 700 }}>*384#</span>
        </div>
      </div>
    </div>
  );
}
