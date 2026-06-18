'use client';

import { useCallback, useEffect, useState } from 'react';

const BUS_OPERATORS = [
  'Mazhandu Family Bus',
  'Power Tools',
  'Juldans',
  'Likili',
];

const DESTINATION_CITIES = [
  'Ndola',
  'Kitwe',
  'Livingstone',
  'Chipata',
  'Solwezi',
];

const EMPTY_LOGISTICS = {
  deliveryMode: 'door',
  delivery_lat: null,
  delivery_lng: null,
  delivery_landmark: '',
  bus_station_pickup: false,
  bus_operator_name: '',
  destination_city: '',
};

export default function CheckoutLogistics({ onChange }) {
  const [form, setForm] = useState(EMPTY_LOGISTICS);
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | loading | success | error
  const [geoError, setGeoError] = useState('');

  const emitChange = useCallback(
    (next) => {
      setForm(next);
      onChange?.(next);
    },
    [onChange],
  );

  useEffect(() => {
    onChange?.(EMPTY_LOGISTICS);
  }, [onChange]);

  const selectMode = (mode) => {
    const next =
      mode === 'bus'
        ? {
            ...form,
            deliveryMode: 'bus',
            bus_station_pickup: true,
            delivery_lat: null,
            delivery_lng: null,
          }
        : {
            ...form,
            deliveryMode: 'door',
            bus_station_pickup: false,
            bus_operator_name: '',
            destination_city: '',
          };
    emitChange(next);
    setGeoStatus('idle');
    setGeoError('');
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoError('Geolocation is not supported on this device.');
      return;
    }

    setGeoStatus('loading');
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          ...form,
          delivery_lat: position.coords.latitude,
          delivery_lng: position.coords.longitude,
        };
        emitChange(next);
        setGeoStatus('success');
      },
      (error) => {
        setGeoStatus('error');
        setGeoError(
          error.code === error.PERMISSION_DENIED
            ? 'Location permission denied. Enable GPS or enter directions below.'
            : 'Could not get your location. Try again or add landmark directions.',
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const updateField = (field, value) => {
    emitChange({ ...form, [field]: value });
  };

  const isDoor = form.deliveryMode === 'door';

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">Delivery Details</h2>
      <p className="mt-1 text-sm text-gray-500">
        Choose how you want to receive your order across Zambia.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => selectMode('door')}
          className={`rounded-xl border-2 px-4 py-5 text-left transition-all ${
            isDoor
              ? 'border-[#FFC107] bg-[#FFF8E1] ring-2 ring-[#FFC107]/30'
              : 'border-gray-200 bg-[#F9FAFB] hover:border-gray-300'
          }`}
        >
          <span className="text-2xl">🛵</span>
          <p className="mt-2 font-semibold text-gray-900">Door-to-Door</p>
          <p className="mt-1 text-xs text-gray-500">Delivered to your GPS pin in Lusaka</p>
        </button>

        <button
          type="button"
          onClick={() => selectMode('bus')}
          className={`rounded-xl border-2 px-4 py-5 text-left transition-all ${
            !isDoor
              ? 'border-[#FFC107] bg-[#FFF8E1] ring-2 ring-[#FFC107]/30'
              : 'border-gray-200 bg-[#F9FAFB] hover:border-gray-300'
          }`}
        >
          <span className="text-2xl">🚌</span>
          <p className="mt-2 font-semibold text-gray-900">Bus Station Pickup</p>
          <p className="mt-1 text-xs text-gray-500">Collect at your city bus station</p>
        </button>
      </div>

      {isDoor ? (
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Your Location (GPS)
            </label>
            <button
              type="button"
              onClick={captureLocation}
              disabled={geoStatus === 'loading'}
              className="w-full rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-gray-800 transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
            >
              {geoStatus === 'loading' && '📍 Getting location…'}
              {geoStatus === 'success' && '✓ Location captured'}
              {geoStatus === 'error' && '📍 Retry location'}
              {geoStatus === 'idle' && '📍 Use My Current Location'}
            </button>

            {geoStatus === 'success' && form.delivery_lat != null && (
              <p className="mt-2 text-xs text-green-700">
                Pin saved: {form.delivery_lat.toFixed(5)}, {form.delivery_lng.toFixed(5)}
              </p>
            )}
            {geoError && (
              <p className="mt-2 text-xs text-[#D32F2F]">{geoError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="delivery_landmark"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Local Landmark / Directions
            </label>
            <textarea
              id="delivery_landmark"
              rows={4}
              value={form.delivery_landmark}
              onChange={(e) => updateField('delivery_landmark', e.target.value)}
              placeholder="e.g. Near Manda Hill, white gate opposite the filling station…"
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/30"
            />
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="bus_operator"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Bus Operator
            </label>
            <select
              id="bus_operator"
              value={form.bus_operator_name}
              onChange={(e) => updateField('bus_operator_name', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/30"
            >
              <option value="">Select operator</option>
              {BUS_OPERATORS.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="destination_city"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Destination City
            </label>
            <select
              id="destination_city"
              value={form.destination_city}
              onChange={(e) => updateField('destination_city', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/30"
            >
              <option value="">Select city</option>
              {DESTINATION_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </section>
  );
}
