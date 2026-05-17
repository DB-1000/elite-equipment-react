-- ══════════════════════════════════════════════
-- ELITE EQUIPMENT — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ══════════════════════════════════════════════

-- Products
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null,
  price integer not null,
  image text default '',
  description text default '',
  specs jsonb default '{}',
  active boolean default true,
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  total integer not null,
  status text default 'pending',
  tracking_number text,
  shipping_name text,
  shipping_address text,
  shipping_city text,
  shipping_state text,
  shipping_zip text,
  created_at timestamptz default now()
);

-- Order Items
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references orders(id) on delete cascade not null,
  product_id bigint references products(id) on delete set null,
  product_name text not null,
  product_price integer not null,
  product_image text,
  quantity integer not null default 1
);

-- ══════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Products: anyone can read active products
create policy "Public read active products" on products
  for select using (active = true);

-- Products: admin full access (replace email if needed)
create policy "Admin manage products" on products
  for all using (auth.jwt() ->> 'email' = 'dbell01@frostburg.edu');

-- Orders: users can read and create their own orders
create policy "Users read own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users create orders" on orders
  for insert with check (auth.uid() = user_id);

-- Orders: admin can read and update all orders
create policy "Admin manage orders" on orders
  for all using (auth.jwt() ->> 'email' = 'dbell01@frostburg.edu');

-- Order items: users can read and create items for their own orders
create policy "Users read own order items" on order_items
  for select using (order_id in (select id from orders where user_id = auth.uid()));

create policy "Users create order items" on order_items
  for insert with check (order_id in (select id from orders where user_id = auth.uid()));

-- Order items: admin full access
create policy "Admin manage order items" on order_items
  for all using (auth.jwt() ->> 'email' = 'dbell01@frostburg.edu');

-- ══════════════════════════════════════════════
-- Seed Products
-- ══════════════════════════════════════════════

insert into products (name, category, price, image, description, specs) values
('Apex Performance Processor', 'CPU', 450, 'images/cpu-apex.jpg', 'Our flagship processor, engineered for extreme overclocking and sustained peak performance. Features 12 high-frequency cores with unlocked multipliers and Turbo Boost support.', '{"Core Count":"12 Cores","Base Frequency":"3.8 GHz","Turbo Boost":"Up to 5.4 GHz","TDP":"125W","Socket":"LGA1700","Cache":"36MB L3"}'),
('Creative Workstation Processor', 'CPU', 390, 'images/cpu-workstation.jpg', 'Optimized for content creation, 4K rendering, and video editing. Balanced core layout for demanding creative workflows.', '{"Core Count":"12 Cores","Base Frequency":"3.6 GHz","Turbo Boost":"Up to 5.1 GHz","TDP":"105W","Socket":"LGA1700","Cache":"30MB L3"}'),
('Balanced Core Processor', 'CPU', 280, 'images/cpu-balanced.jpg', 'The versatile all-rounder. Eight high-efficiency cores, perfect for gaming builds and professional workloads.', '{"Core Count":"8 Cores","Base Frequency":"3.4 GHz","Turbo Boost":"Up to 4.9 GHz","TDP":"95W","Socket":"LGA1700","Cache":"24MB L3"}'),
('Velocity NVMe SSD', 'SSD', 150, 'images/ssd-velocity.jpg', 'Gen5 NVMe performance with 1TB of blazing-fast storage. Eliminates loading bottlenecks.', '{"Capacity":"1TB","Interface":"PCIe 5.0 NVMe","Read Speed":"12,400 MB/s","Write Speed":"11,800 MB/s","Form Factor":"M.2 2280","NAND":"TLC 3D"}'),
('Speed Master SSD', 'SSD', 120, 'images/ssd-speedmaster.jpg', 'Entry-level Gen4 NVMe. Essential upgrade from SATA for any performance-focused build.', '{"Capacity":"1TB","Interface":"PCIe 4.0 NVMe","Read Speed":"7,400 MB/s","Write Speed":"6,900 MB/s","Form Factor":"M.2 2280","NAND":"TLC 3D"}'),
('Data Vault SSD', 'SSD', 180, 'images/ssd-datavault.jpg', 'Massive 2TB Gen4 NVMe storage for creators who need both capacity and speed.', '{"Capacity":"2TB","Interface":"PCIe 4.0 NVMe","Read Speed":"7,300 MB/s","Write Speed":"6,700 MB/s","Form Factor":"M.2 2280","NAND":"TLC 3D"}'),
('Precision Mechanical Keyboard', 'Keyboard', 130, 'images/keyboard-precision.jpg', 'Full-size mechanical keyboard with premium tactile switches for typists who demand accuracy.', '{"Layout":"Full Size (100%)","Switch Type":"Tactile Switches","Actuation":"45g","Backlight":"RGB per-key","Connection":"USB-C","Build":"Aluminum top plate"}'),
('Compact Tenkeyless Keyboard', 'Keyboard', 110, 'images/keyboard-tkl.jpg', 'TKL compact layout with linear switches for fast, smooth keystrokes and maximum desk space.', '{"Layout":"TKL Compact","Switch Type":"Linear Switches","Actuation":"40g","Backlight":"RGB per-key","Connection":"USB-C / Wireless","Build":"Polycarbonate frame"}'),
('Ergonomic Split Keyboard', 'Keyboard', 160, 'images/keyboard-ergo.jpg', 'Split ergonomic design reduces wrist fatigue. The ultimate tool for professionals who type for hours.', '{"Layout":"Ergo Split 65%","Switch Type":"Tactile Switches","Actuation":"50g","Backlight":"RGB per-key","Connection":"USB-C","Build":"CNC aluminum halves"}');
