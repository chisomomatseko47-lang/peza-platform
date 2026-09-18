-- Catalog prep: product photos, for WhatsApp Commerce Manager catalog later.
-- Already applied directly to the live project (omcqiterzqphavtfxhns) —
-- this file documents it for anyone else working on the repo / a fresh env.

alter table if exists bot_products
  add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
