-- Schema caderno de processos. Fonte: cursor.md. Idempotente o suficiente para re-run.

create extension if not exists pgcrypto;

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  published boolean not null default false,
  cover_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.steps (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  kind text not null check (kind in ('captacao', 'manipulacao', 'referencia')),
  sort_order integer not null default 0,
  title text not null default '',
  body text not null default '',
  audio_path text,
  image_path text,
  reference_url text,
  created_at timestamptz not null default now()
);

create index if not exists steps_page_id_sort_idx
  on public.steps (page_id, sort_order);

create or replace function public.set_pages_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
before update on public.pages
for each row
execute procedure public.set_pages_updated_at();

alter table public.pages enable row level security;
alter table public.steps enable row level security;

drop policy if exists pages_select on public.pages;
create policy pages_select on public.pages
for select
using (published = true or auth.role() = 'authenticated');

drop policy if exists pages_insert on public.pages;
create policy pages_insert on public.pages
for insert to authenticated
with check (true);

drop policy if exists pages_update on public.pages;
create policy pages_update on public.pages
for update to authenticated
using (true)
with check (true);

drop policy if exists pages_delete on public.pages;
create policy pages_delete on public.pages
for delete to authenticated
using (true);

drop policy if exists steps_select on public.steps;
create policy steps_select on public.steps
for select
using (
  exists (
    select 1 from public.pages p
    where p.id = steps.page_id
      and (p.published = true or auth.role() = 'authenticated')
  )
);

drop policy if exists steps_insert on public.steps;
create policy steps_insert on public.steps
for insert to authenticated
with check (true);

drop policy if exists steps_update on public.steps;
create policy steps_update on public.steps
for update to authenticated
using (true)
with check (true);

drop policy if exists steps_delete on public.steps;
create policy steps_delete on public.steps
for delete to authenticated
using (true);

grant select on public.pages, public.steps to anon, authenticated;
grant insert, update, delete on public.pages, public.steps to authenticated;

-- Storage: ver architecture/schema-buckets.sql (insert de bucket pode
-- parar o script aqui; tabelas ja ficam criadas).
