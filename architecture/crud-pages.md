# POP — Ler páginas (Fase A)

## Objetivo

Confirmar leitura REST de `public.pages` com a chave anon (só `published = true` aparece).

## Entrada

`.env`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

## Passos

1. Schema OK (`python tools/verify_schema.py`).
2. Rodar `python tools/list_pages.py`.
3. Esperar HTTP 200 e JSON array (pode ser `[]`).

## Bordas

- Anon **não** vê rascunhos (`published = false`).
- INSERT/UPDATE/DELETE exigem usuário autenticado (Auth dashboard). Não faz parte deste POP.
- Não inventar seed de dados aqui.

## Saída

Stdout JSON. Relato em `progress.md`.
