# POP — Handshake Supabase (Fase L)

## Objetivo

Verificar que URL + anon key respondem. Sem isso, não há CRUD nem Storage.

## Entrada

`.env` na raiz:

- `SUPABASE_URL` — `https://<ref>.supabase.co`
- `SUPABASE_ANON_KEY` — chave `anon` `public`

## Passos

1. Confirmar `.env` existe (nunca commitar).
2. Rodar `python tools/handshake_supabase.py`.
3. Esperar HTTP 2xx em Auth health e REST.

## Bordas

- Sem `.env` ou vars vazias → falha explícita, não chute.
- `GET /rest/v1/` (raiz) pode exigir `service_role` — o probe usa `/rest/v1/pages`.
- HTTP 404 em `pages` = API no ar, tabela ainda não criada → Link OK.
- 401/403 com "Invalid API key" → key errada ou projeto pausado.
- Timeout / DNS → URL errada ou rede.
- Não cria tabelas neste handshake. Só conectividade.

## Saída

Log em stdout. Relato em `progress.md`.
