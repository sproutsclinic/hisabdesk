/* =========================================================
   HisabDesk — Tax Module DB Schema
   ---------------------------------------------------------
   PURPOSE
   - Tax profiles
   - Tax calculation history
   - Optimized for:
       ✓ audit trail
       ✓ yearly snapshots
       ✓ AI context
       ✓ exports
       ✓ future filings

   PRINCIPLES
   ✅ single source of truth
   ✅ append-only calculations
   ✅ no overwrites
   ✅ JSONB for flexibility
   ✅ indexed for fast reads

   SAFE
   - run once in Supabase SQL editor
   - idempotent (IF NOT EXISTS)

   ========================================================= */



/* =========================================================
   EXTENSIONS
   ========================================================= */

create extension if not exists "pgcrypto";



/* =========================================================
   TAX PROFILES
   ---------------------------------------------------------
   One per user
   Stores static metadata only
   ========================================================= */

create table if not exists public.tax_profiles (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null unique,

  age integer not null default 0,
  filing_status text not null default 'individual',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tax_profiles_user
  on public.tax_profiles(user_id);



/* =========================================================
   TAX CALCULATIONS (HISTORY / SNAPSHOTS)
   ---------------------------------------------------------
   Append only
   Each calculation is immutable
   Enables:
     - history
     - comparisons
     - exports
     - AI context
   ========================================================= */

create table if not exists public.tax_calculations (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,

  financial_year text not null,

  /* raw inputs */
  income jsonb not null,
  deductions jsonb not null,

  /* engine result */
  result jsonb not null,

  recommended_regime text not null,
  total_tax numeric not null default 0,

  created_at timestamptz not null default now()
);

create index if not exists idx_tax_calc_user
  on public.tax_calculations(user_id);

create index if not exists idx_tax_calc_year
  on public.tax_calculations(financial_year);

create index if not exists idx_tax_calc_user_year
  on public.tax_calculations(user_id, financial_year);

create index if not exists idx_tax_calc_created
  on public.tax_calculations(created_at desc);



/* =========================================================
   FOREIGN KEYS
   ========================================================= */

alter table public.tax_profiles
  drop constraint if exists fk_tax_profile_user;

alter table public.tax_profiles
  add constraint fk_tax_profile_user
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;


alter table public.tax_calculations
  drop constraint if exists fk_tax_calc_user;

alter table public.tax_calculations
  add constraint fk_tax_calc_user
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;



/* =========================================================
   ROW LEVEL SECURITY (MANDATORY)
   ========================================================= */

alter table public.tax_profiles enable row level security;
alter table public.tax_calculations enable row level security;



/* =========================================================
   POLICIES
   ---------------------------------------------------------
   Users can only access their own data
   Service role bypasses automatically
   ========================================================= */

-- profiles
create policy if not exists "tax_profiles_select_own"
on public.tax_profiles
for select
using (auth.uid() = user_id);

create policy if not exists "tax_profiles_insert_own"
on public.tax_profiles
for insert
with check (auth.uid() = user_id);

create policy if not exists "tax_profiles_update_own"
on public.tax_profiles
for update
using (auth.uid() = user_id);


-- calculations
create policy if not exists "tax_calc_select_own"
on public.tax_calculations
for select
using (auth.uid() = user_id);

create policy if not exists "tax_calc_insert_own"
on public.tax_calculations
for insert
with check (auth.uid() = user_id);

create policy if not exists "tax_calc_delete_own"
on public.tax_calculations
for delete
using (auth.uid() = user_id);



/* =========================================================
   NOTES
   ---------------------------------------------------------
   income JSON example:
     {
       "salary": 1200000,
       "business": 0,
       "capitalGains": 0,
       "other": 50000
     }

   result JSON example:
     {
       oldRegime: {...},
       newRegime: {...},
       recommended: "old",
       savings: 32000
     }

   ========================================================= */
