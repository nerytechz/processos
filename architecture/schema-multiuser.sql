-- Multi-user: cada conta tem @username e o proprio caderno.
-- Rode no SQL Editor. Apaga paginas sem dono (rascunhos do app minimo).

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,24}$')
);

alter table public.profiles enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select
using (true);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
for insert to authenticated
with check (auth.uid() = id);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

alter table public.pages add column if not exists owner_id uuid references public.profiles(id) on delete cascade;

delete from public.pages where owner_id is null;

alter table public.pages alter column owner_id set not null;

alter table public.pages drop constraint if exists pages_slug_key;

drop index if exists pages_owner_slug_uidx;
create unique index pages_owner_slug_uidx on public.pages (owner_id, slug);

drop policy if exists pages_select on public.pages;
create policy pages_select on public.pages
for select
using (published = true or auth.uid() = owner_id);

drop policy if exists pages_insert on public.pages;
create policy pages_insert on public.pages
for insert to authenticated
with check (auth.uid() = owner_id);

drop policy if exists pages_update on public.pages;
create policy pages_update on public.pages
for update to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists pages_delete on public.pages;
create policy pages_delete on public.pages
for delete to authenticated
using (auth.uid() = owner_id);

drop policy if exists steps_select on public.steps;
create policy steps_select on public.steps
for select
using (
  exists (
    select 1 from public.pages p
    where p.id = steps.page_id
      and (p.published = true or auth.uid() = p.owner_id)
  )
);

drop policy if exists steps_insert on public.steps;
create policy steps_insert on public.steps
for insert to authenticated
with check (
  exists (
    select 1 from public.pages p
    where p.id = page_id and p.owner_id = auth.uid()
  )
);

drop policy if exists steps_update on public.steps;
create policy steps_update on public.steps
for update to authenticated
using (
  exists (
    select 1 from public.pages p
    where p.id = steps.page_id and p.owner_id = auth.uid()
  )
);

drop policy if exists steps_delete on public.steps;
create policy steps_delete on public.steps
for delete to authenticated
using (
  exists (
    select 1 from public.pages p
    where p.id = steps.page_id and p.owner_id = auth.uid()
  )
);

-- Storage: pasta 1 = user id
drop policy if exists audio_auth_insert on storage.objects;
create policy audio_auth_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'audio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists audio_auth_update on storage.objects;
create policy audio_auth_update on storage.objects
for update to authenticated
using (
  bucket_id = 'audio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists audio_auth_delete on storage.objects;
create policy audio_auth_delete on storage.objects
for delete to authenticated
using (
  bucket_id = 'audio'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists images_auth_insert on storage.objects;
create policy images_auth_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists images_auth_update on storage.objects;
create policy images_auth_update on storage.objects
for update to authenticated
using (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists images_auth_delete on storage.objects;
create policy images_auth_delete on storage.objects
for delete to authenticated
using (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
