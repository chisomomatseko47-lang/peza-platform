'use client';

const WHATSAPP_NUMBER = '260970000000';

function formatItemsList(cartItems) {
  return cartItems
    .map((item, index) => {
      const qty = item.quantity ?? item.qty ?? 1;
      const price = item.price ?? 0;
      const name = item.name ?? 'Item';
      return `${index + 1}. ${name} x${qty} — K${price.toLocaleString()}`;
    })
    .join('\n');
}

function buildWhatsAppUrl(cartItems, cartTotal) {
  const itemsList = formatItemsList(cartItems);
  const message =
    `New Peza Order!\n\n${itemsList}\n\nTotal: K${cartTotal.toLocaleString()}\n\nHello, I would like to confirm my order...`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppCheckoutButton({ cartItems = [], cartTotal = 0, className = '' }) {
  const handleClick = () => {
    const url = buildWhatsAppUrl(cartItems, cartTotal);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.99] ${className}`}
      style={{ backgroundColor: '#25D366' }}
    >
      <span aria-hidden>💬</span>
      Confirm via WhatsApp
    </button>
  );
}
