-- Portal Manajemen Arang v1.0
create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('owner','admin','produksi','gudang','keuangan')),
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique,
  unit text not null default 'kg',
  sale_price numeric(14,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists raw_materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null default 'kg',
  purchase_price numeric(14,2) not null default 0,
  stock numeric(14,3) not null default 0,
  minimum_stock numeric(14,3) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists production_batches (
  id uuid primary key default gen_random_uuid(),
  batch_no text unique not null,
  product_id uuid references products(id),
  raw_material_kg numeric(14,3) not null default 0,
  output_kg numeric(14,3) not null default 0,
  labor_cost numeric(14,2) not null default 0,
  energy_cost numeric(14,2) not null default 0,
  overhead_cost numeric(14,2) not null default 0,
  material_cost numeric(14,2) not null default 0,
  operator_name text,
  shrinkage_kg numeric(14,3) generated always as (greatest(raw_material_kg - output_kg, 0)) stored,
  yield_pct numeric(7,3) generated always as (
    case when raw_material_kg > 0 then (output_kg / raw_material_kg) * 100 else 0 end
  ) stored,
  shrinkage_pct numeric(7,3) generated always as (
    case when raw_material_kg > 0 then ((raw_material_kg - output_kg) / raw_material_kg) * 100 else 0 end
  ) stored,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_date date not null default current_date,
  type text not null check (type in ('income','expense')),
  category text not null,
  description text,
  amount numeric(14,2) not null check (amount >= 0),
  reference text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  raw_material_id uuid references raw_materials(id),
  movement_type text not null check (movement_type in ('in','out','adjustment')),
  quantity numeric(14,3) not null,
  reference text,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_date on transactions(transaction_date);
create index if not exists idx_stock_product on stock_movements(product_id);
create index if not exists idx_production_created on production_batches(created_at);

alter table profiles enable row level security;
alter table products enable row level security;
alter table raw_materials enable row level security;
alter table production_batches enable row level security;
alter table customers enable row level security;
alter table suppliers enable row level security;
alter table transactions enable row level security;
alter table stock_movements enable row level security;

-- MVP policies. Tighten these further after role/auth is configured.
create policy "authenticated users can read profiles" on profiles for select to authenticated using (true);
create policy "authenticated users can read products" on products for select to authenticated using (true);
create policy "authenticated users can write products" on products for all to authenticated using (true) with check (true);
create policy "authenticated users can read raw materials" on raw_materials for select to authenticated using (true);
create policy "authenticated users can write raw materials" on raw_materials for all to authenticated using (true) with check (true);
create policy "authenticated users can read production" on production_batches for select to authenticated using (true);
create policy "authenticated users can write production" on production_batches for all to authenticated using (true) with check (true);
create policy "authenticated users can read customers" on customers for select to authenticated using (true);
create policy "authenticated users can write customers" on customers for all to authenticated using (true) with check (true);
create policy "authenticated users can read suppliers" on suppliers for select to authenticated using (true);
create policy "authenticated users can write suppliers" on suppliers for all to authenticated using (true) with check (true);
create policy "authenticated users can read transactions" on transactions for select to authenticated using (true);
create policy "authenticated users can write transactions" on transactions for all to authenticated using (true) with check (true);
create policy "authenticated users can read stock" on stock_movements for select to authenticated using (true);
create policy "authenticated users can write stock" on stock_movements for all to authenticated using (true) with check (true);