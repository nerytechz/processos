# POP — Schema Caderno (Fase A)

## Objetivo

Materializar o schema de `cursor.md` no Supabase: tabelas `pages` e `steps`, RLS, buckets `audio` e `images`.

## Entrada

- Constituição: `cursor.md` (schema de domínio).
- SQL determinístico: `architecture/schema-caderno.sql`.
- `.env` com `SUPABASE_URL` + `SUPABASE_ANON_KEY` (só para **verificar** depois).

## Por que o SQL Editor

A chave `anon` **não executa DDL**. Sem `service_role` / connection string no `.env`, a aplicação do schema é: colar `architecture/schema-caderno.sql` no **SQL Editor** do projeto (uma vez). O tool Python só **confirma** o resultado.

## Passos

1. Abrir SQL Editor do projeto Supabase ligado ao `.env`.
2. Colar e rodar `architecture/schema-caderno.sql` (tabelas + RLS).
3. Colar e rodar `architecture/schema-buckets.sql`.
4. Se o insert falhar (erro de coluna/RLS): Dashboard → Storage → New bucket. Nomes: `audio` e `images`. Public = ON. Depois rode de novo só as policies do mesmo SQL.
5. Rodar `python tools/verify_schema.py`.
6. Esperar: `pages` HTTP 200; `GET /storage/v1/bucket/audio` e `.../images` HTTP 200.

## Bordas

- "Success. No rows returned" no SQL Editor é normal em DDL de tabela.
- Anon **não** cria bucket (RLS AccessDenied). SQL Editor ou Dashboard.
- Sem policy `SELECT` em `storage.buckets`, a API devolve **NoSuchBucket** mesmo com o bucket criado. Policy: `buckets_select_public` (`public = true`).
- Listar `GET /storage/v1/bucket` (lista) pode voltar `[]` mesmo com buckets; o verify usa GET por id.

## Saída

Tabelas + RLS + buckets. Relato em `progress.md`.
