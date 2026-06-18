'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import CheckoutLogistics from '@/components/checkout/CheckoutLogistics';
import WhatsAppCheckoutButton from '@/components/checkout/WhatsAppCheckoutButton';

const MOCK_CART_ITEMS = [
  { id: 1, name: 'Itel A70 Smartphone 4G LTE', price: 1850, quantity: 1 },
  { id: 3, name: 'Zambia Pure Wild Honey 500g', price: 180, quantity: 2 },
  { id: 7, name: 'Natural Shea Butter Cream 250ml', price: 120, quantity: 1 },
];

const PAYMENT_METHODS = [
  { id: 'airtel_money', label: 'Airtel Money', icon: '📱' },
  { id: 'mtn_money', label: 'MTN Money', icon: '💳' },
  { id: 'cash', label: 'Cash on Delivery', icon: '💵' },
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function CheckoutPage() {
  const [logistics, setLogistics] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('airtel_money');
  const [isInstallment, setIsInstallment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState('');

  const handleLogisticsChange = useCallback((data) => {
    setLogistics(data);
  }, []);

  const subtotal = useMemo(
    () => MOCK_CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [],
  );

  const isBusPickup = logistics?.bus_station_pickup === true;
  const deliveryFee = isBusPickup ? 80 : 40;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    setCheckoutError('');
    setCheckoutSuccess('');

    if (!logistics) {
      setCheckoutError('Please complete your delivery details.');
      return;
    }

    if (logistics.bus_station_pickup) {
      if (!logistics.bus_operator_name || !logistics.destination_city) {
        setCheckoutError('Please select a bus operator and destination city.');
        return;
      }
    } else if (logistics.delivery_lat == null || logistics.delivery_lng == null) {
      setCheckoutError('Please capture your GPS location for door-to-door delivery.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        total_amount: total,
        status: 'pending',
        delivery_lat: logistics.bus_station_pickup ? null : logistics.delivery_lat,
        delivery_lng: logistics.bus_station_pickup ? null : logistics.delivery_lng,
        delivery_landmark: logistics.delivery_landmark || null,
        bus_station_pickup: logistics.bus_station_pickup,
        bus_operator_name: logistics.bus_station_pickup ? logistics.bus_operator_name : null,
        items: MOCK_CART_ITEMS,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select('id')
        .single();

      if (orderError) throw orderError;

      const paymentPayload = {
        order_id: order.id,
        amount_paid: isInstallment ? Math.ceil(total / 3) : total,
        method: paymentMethod,
        is_installment: isInstallment,
        transaction_ref: null,
      };

      const { error: paymentError } = await supabase.from('payments').insert(paymentPayload);

      if (paymentError) throw paymentError;

      setCheckoutSuccess(
        isInstallment
          ? 'Order placed! First Chilimba installment recorded — pay the remaining balance over the next 2 months.'
          : 'Order confirmed! We will contact you shortly.',
      );
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/shop" className="text-lg font-bold text-gray-900">
            🛍️ Peza Checkout
          </Link>
          <Link href="/shop" className="text-sm font-medium text-gray-500 hover:text-gray-800">
            ← Back to Shop
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Complete Your Order</h1>
        <p className="mt-1 text-sm text-gray-500">
          Local delivery across Zambia — pay with mobile money or cash.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <CheckoutLogistics onChange={handleLogisticsChange} />

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose how you would like to pay for this order.
              </p>

              <div className="mt-5 space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition ${
                      paymentMethod === method.id
                        ? 'border-[#FFC107] bg-[#FFF8E1] ring-2 ring-[#FFC107]/30'
                        : 'border-gray-200 bg-[#F9FAFB] hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="sr-only"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 bg-[#F9FAFB] p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isInstallment}
                    onChange={(e) => setIsInstallment(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#FFC107] focus:ring-[#FFC107]"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Chilimba (Pay in 3 Installments)</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Split your total into 3 monthly payments. First installment charged today.
                    </p>
                    {isInstallment && (
                      <p className="mt-2 text-sm font-semibold text-[#D32F2F]">
                        K{Math.ceil(total / 3).toLocaleString()} due today
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

              <ul className="mt-5 space-y-4 border-b border-gray-200 pb-5">
                {MOCK_CART_ITEMS.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-700">
                      {item.name}
                      <span className="ml-1 text-gray-400">×{item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-medium text-gray-900">
                      K{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-gray-900">K{subtotal.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>
                    Delivery ({isBusPickup ? 'Bus Station' : 'Door-to-Door'})
                  </dt>
                  <dd className="font-medium text-gray-900">K{deliveryFee.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                  <dt>Total</dt>
                  <dd className="text-[#D32F2F]">K{total.toLocaleString()}</dd>
                </div>
              </dl>

              {checkoutError && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[#D32F2F]">
                  {checkoutError}
                </p>
              )}
              {checkoutSuccess && (
                <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                  {checkoutSuccess}
                </p>
              )}

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#D32F2F] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B71C1C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Processing…' : 'Confirm Order'}
                </button>

                <WhatsAppCheckoutButton cartItems={MOCK_CART_ITEMS} cartTotal={total} />
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                Secure checkout · Airtel Money · MTN Money · Cash on Delivery
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
