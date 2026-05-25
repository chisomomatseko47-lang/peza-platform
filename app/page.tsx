export default function Home() {
  return (
    <main style={{
      background: '#000000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '20px',
      position: 'relative',
    }}>
      <nav style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 40px',
      }}>
        <div>
          <span style={{color: '#C8860A', fontWeight: 'bold', fontSize: '20px', letterSpacing: '4px'}}>PEZA</span>
          <span style={{color: '#1A6B3C', fontSize: '11px', letterSpacing: '3px', marginLeft: '8px'}}>BY KIVARA</span>
        </div>
        <a href="https://wa.me/+260000000000" style={{
          background: '#25D366',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '999px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 'bold',
        }}>Start on WhatsApp</a>
      </nav>

      <div style={{textAlign: 'center', maxWidth: '800px', marginTop: '80px'}}>
        <div style={{
          border: '1px solid rgba(200,134,10,0.3)',
          borderRadius: '999px',
          padding: '6px 20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
        }}>
          <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#1A6B3C'}} />
          <span style={{color: '#C8860A', fontSize: '11px', letterSpacing: '3px'}}>ZAMBIA'S COMMERCE PLATFORM</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 80px)',
          fontWeight: 'bold',
          color: 'white',
          margin: '0 0 24px',
          lineHeight: 1,
          letterSpacing: '-1px',
        }}>
          BUY. <span style={{color: '#C8860A'}}>SELL.</span> <span style={{color: '#1A6B3C'}}>CONNECT.</span>
        </h1>

        <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '18px', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 40px'}}>
          Peza brings every Zambian business to WhatsApp. Browse local shops, place orders, pay with Airtel Money — all without leaving your chat.
        </p>

        <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px'}}>
          <a href="https://wa.me/+260000000000" style={{
            background: '#25D366',
            color: 'white',
            padding: '16px 36px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            minWidth: '200px',
            textAlign: 'center',
          }}>Start on WhatsApp</a>
          <a href="#signup" style={{
            border: '1px solid rgba(200,134,10,0.5)',
            color: '#C8860A',
            padding: '16px 36px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            minWidth: '200px',
            textAlign: 'center',
          }}>List Your Business</a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          maxWidth: '400px',
          margin: '0 auto',
        }}>
          {[
            {value: '17M+', label: 'ZAMBIANS'},
            {value: 'FREE', label: 'TO JOIN'},
            {value: 'WhatsApp', label: 'POWERED'},
          ].map((stat) => (
            <div key={stat.label} style={{textAlign: 'center'}}>
              <div style={{color: '#C8860A', fontSize: '22px', fontWeight: 'bold'}}>{stat.value}</div>
              <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '2px', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}