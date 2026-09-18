-- Peza WhatsApp bot — full schema, built fresh in the "kivara peza web" project.
--
-- IMPORTANT: this project already has live, in-use `products` (13 rows),
-- `orders`, `users`, and `suppliers` tables belonging to a DIFFERENT app
-- (integer IDs, camelCase columns — an existing storefront/catalog, not
-- this bot). To avoid any collision or risk to that data, the bot's
-- product/order tables are named `bot_products` / `bot_orders` here.
-- Everything else (conversations, customers, businesses) had no existing
-- table, so those keep their natural names.
--
-- RLS is left OFF on these new tables, matching how `products`/`orders`/
-- `users` are already configured in this project (rowsecurity = false) —
-- so the bot works immediately with just the anon key, no service-role
-- key required. Same tradeoff this project already has elsewhere: the
-- anon key (public, embedded in NEXT_PUBLIC_*) can read/write these
-- tables directly. Fine for now; worth tightening with real RLS policies
-- + the service-role key later once traffic is real.

create extension if not exists "pgcrypto";

-- Conversation state machine (one row per WhatsApp number)
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null unique,
  state text not null default 'IDLE',
  cart jsonb not null default '[]'::jsonb,
  context jsonb not null default '{}'::jsonb,
  last_active timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_conversations_phone on conversations (whatsapp_number);

-- Customers (buyers)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null unique,
  name text,
  preferred_language text not null default 'en'
    check (preferred_language in ('en', 'bem', 'nya', 'toi')),
  created_at timestamptz not null default now()
);

-- Businesses (sellers)
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null unique,
  name text not null,
  category text,
  location text,
  airtel_number text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- Products listed by sellers via WhatsApp (kept separate from the
-- existing `products` catalog table — see header note)
create table if not exists bot_products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_bot_products_business on bot_products (business_id);

-- Orders placed via WhatsApp (kept separate from the existing `orders`
-- table — see header note)
create table if not exists bot_orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete cascade,
  status text not null default 'pending',
  total_amount numeric(10,2) not null,
  delivery_address text,
  payment_method text not null default 'airtel_money',
  cod_cash_collected boolean not null default false,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_bot_orders_customer on bot_orders (customer_id);
create index if not exists idx_bot_orders_business on bot_orders (business_id);

-- Offline / retry queue for outbound WhatsApp sends
create table if not exists message_retry_queue (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null,
  payload jsonb not null,
  attempts int not null default 0,
  status text not null default 'queued'
    check (status in ('queued', 'sent', 'failed_permanently')),
  created_at timestamptz not null default now()
);
create index if not exists idx_retry_queue_status on message_retry_queue (status);

-- Airtime/data reward payouts
create table if not exists reward_payouts (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null,
  reason text not null,
  amount numeric(10,2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

-- Group buying
create table if not exists group_buys (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references bot_products(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  target_quantity int not null,
  current_quantity int not null default 0,
  unit_price_at_target numeric(10,2) not null,
  status text not null default 'open'
    check (status in ('open', 'filled', 'expired', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists group_buy_participants (
  id uuid primary key default gen_random_uuid(),
  group_buy_id uuid not null references group_buys(id) on delete cascade,
  whatsapp_number text not null,
  quantity int not null default 1,
  created_at timestamptz not null default now()
);

-- Help / dispute escalation
create table if not exists support_escalations (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null,
  message text,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);
