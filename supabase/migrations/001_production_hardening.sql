/* ==========================================================
   HisabDesk — Production Hardening Migration 001
   SAFE ONLY (additive)
   No destructive operations
========================================================== */

-- =========================================================
-- EXTENSIONS
-- =========================================================

create extension if not exists "uuid-ossp";


-- =========================================================
-- COMMON SAFETY DEFAULTS
-- =========================================================

-- created_at default
create or replace function set_created_at()
returns trigger as $$
begin
  if NEW.created_at is null then
    NEW.created_at = now();
  end if;
  return NEW;
end;
$$ language plpgsql;


-- =========================================================
-- INDEX HELPER (performance baseline)
-- =========================================================

-- speeds dashboard queries massively
create index if not exists idx_income_user_id on income(user_id);
create index if not exists idx_income_date on income(date);

create index if not exists idx_expense_user_id on expense(user_id);
create index if not exists idx_expense_date on expense(date);

create index if not exists idx_vault_user_id on vault(user_id);

create index if not exists idx_budget_user_id on budgets(user_id);


-- =========================================================
-- FOREIGN KEYS (user isolation)
-- prevents orphan financial data
-- =========================================================

alter table income
  add constraint if not exists fk_income_user
  foreign key (user_id) references auth.users(id)
  on delete cascade;

alter table expense
  add constraint if not exists fk_expense_user
  foreign key (user_id) references auth.users(id)
  on delete cascade;

alter table vault
  add constraint if not exists fk_vault_user
  foreign key (user_id) references auth.users(id)
  on delete cascade;

alter table budgets
  add constraint if not exists fk_budget_user
  foreign key (user_id) references auth.users(id)
  on delete cascade;


-- =========================================================
-- MONEY SAFETY
-- never allow null math
-- =========================================================

alter table income
  alter column amount set not null,
  alter column amount set default 0;

alter table expense
  alter column amount set not null,
  alter column amount set default 0;


-- =========================================================
-- CREATED_AT DEFAULTS
-- =========================================================

alter table income
  alter column created_at set default now();

alter table expense
  alter column created_at set default now();

alter table vault
  alter column created_at set default now();

alter table budgets
  alter column created_at set default now();


-- =========================================================
-- DUPLICATE PROTECTION
-- prevents accidental double inserts
-- =========================================================

create unique index if not exists idx_budget_unique_month
on budgets(user_id, month, year);


-- =========================================================
-- DONE
-- =========================================================
