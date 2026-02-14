/* ==========================================================
   HisabDesk — Migration 002 (FIXED)
   Finance Tables Production Hardening
   POSTGRES SAFE VERSION
========================================================== */


/* ==========================================================
   BUDGETS
========================================================== */

alter table budgets
  alter column planned set default 0;

create unique index if not exists idx_budgets_unique_month
on budgets(user_id, month, year, category);

create index if not exists idx_budgets_user on budgets(user_id);
create index if not exists idx_budgets_month on budgets(month, year);



/* ==========================================================
   INCOMES
========================================================== */

alter table incomes
  alter column amount set not null,
  alter column amount set default 0;

alter table incomes
  alter column created_at set default now();

create index if not exists idx_incomes_user on incomes(user_id);
create index if not exists idx_incomes_date on incomes(date);
create index if not exists idx_incomes_category on incomes(category);



/* ==========================================================
   EXPENSES
========================================================== */

alter table expenses
  alter column amount set not null,
  alter column amount set default 0;

alter table expenses
  alter column created_at set default now();

create index if not exists idx_expenses_user on expenses(user_id);
create index if not exists idx_expenses_date on expenses(date);
create index if not exists idx_expenses_category on expenses(category);



/* ==========================================================
   VAULT ITEMS
========================================================== */

alter table vault_items
  alter column created_at set default now();

create index if not exists idx_vault_user on vault_items(user_id);



/* ==========================================================
   TRANSACTIONS
========================================================== */

create index if not exists idx_transactions_user on transactions(user_id);
create index if not exists idx_transactions_date on transactions(date);



/* ==========================================================
   FOREIGN KEYS (POSTGRES SAFE)
========================================================== */

-- budgets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_budgets_user'
  ) THEN
    ALTER TABLE budgets
      ADD CONSTRAINT fk_budgets_user
      FOREIGN KEY (user_id) REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- incomes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_incomes_user'
  ) THEN
    ALTER TABLE incomes
      ADD CONSTRAINT fk_incomes_user
      FOREIGN KEY (user_id) REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- expenses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_expenses_user'
  ) THEN
    ALTER TABLE expenses
      ADD CONSTRAINT fk_expenses_user
      FOREIGN KEY (user_id) REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- vault_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_vault_items_user'
  ) THEN
    ALTER TABLE vault_items
      ADD CONSTRAINT fk_vault_items_user
      FOREIGN KEY (user_id) REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_transactions_user'
  ) THEN
    ALTER TABLE transactions
      ADD CONSTRAINT fk_transactions_user
      FOREIGN KEY (user_id) REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END $$;



/* ==========================================================
   DONE
========================================================== */
