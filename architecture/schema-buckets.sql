-- Buckets. Se este script der erro de coluna, crie no Dashboard:
-- Storage > New bucket > nomes exatamente: audio, images > Public: ON
-- Depois rode so as policies abaixo.

do $$
begin
  insert into storage.buckets (id, name, public, type)
  values
    ('audio', 'audio', true, 'STANDARD'),
    ('images', 'images', true, 'STANDARD')
  on conflict (id) do update
  set public = excluded.public;
exception
  when undefined_column then
    insert into storage.buckets (id, name, public)
    values
      ('audio', 'audio', true),
      ('images', 'images', true)
    on conflict (id) do update
    set public = excluded.public;
end $$;

-- Sem isto, a API Storage devolve NoSuchBucket para a chave anon
-- mesmo com o bucket criado no Dashboard.
drop policy if exists buckets_select_public on storage.buckets;
create policy buckets_select_public on storage.buckets
for select
using (public = true);

drop policy if exists audio_public_read on storage.objects;
create policy audio_public_read on storage.objects
for select
using (bucket_id = 'audio');

drop policy if exists images_public_read on storage.objects;
create policy images_public_read on storage.objects
for select
using (bucket_id = 'images');

drop policy if exists audio_auth_insert on storage.objects;
create policy audio_auth_insert on storage.objects
for insert to authenticated
with check (bucket_id = 'audio');

drop policy if exists audio_auth_update on storage.objects;
create policy audio_auth_update on storage.objects
for update to authenticated
using (bucket_id = 'audio');

drop policy if exists audio_auth_delete on storage.objects;
create policy audio_auth_delete on storage.objects
for delete to authenticated
using (bucket_id = 'audio');

drop policy if exists images_auth_insert on storage.objects;
create policy images_auth_insert on storage.objects
for insert to authenticated
with check (bucket_id = 'images');

drop policy if exists images_auth_update on storage.objects;
create policy images_auth_update on storage.objects
for update to authenticated
using (bucket_id = 'images');

drop policy if exists images_auth_delete on storage.objects;
create policy images_auth_delete on storage.objects
for delete to authenticated
using (bucket_id = 'images');
