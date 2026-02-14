/* ==========================================================
   HisabDesk — Migration 003
   Add category to incomes
   SAFE ADDITIVE
========================================================== */

-- add column safely
alter table incomes
add column if not exists category text default 'general';

-- make not null after default is applied
alter table incomes
alter column category set not null;

-- performance index
create index if not exists idx_incomes_category
on incomes(category);
