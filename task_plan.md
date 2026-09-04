# Task Plan — Projeto V.L.A.E.G.

**Constituição:** `cursor.md`  
**Protocolo:** `protocolo_vlaeg.md`  
**Status:** V + L + A (app) + E (UI) feitos.  
**Passo atual:** 3 — Você importa o repo na Vercel (sua conta) e aponta o DNS.  
**Modo:** um passo de cada vez. Sem UI nova.

---

## Objetivo

Caderno de processos. Auth editar / público ver. Só Supabase. `processos.nerytech.com.br`. UI fechada em `ui.md`.

---

## Checklist

### Protocolo 0
- [x] Memória + constituição
- [x] Descoberta 1–5
- [x] Schema de dados em `cursor.md`
- [x] Blueprint dados/infra (UI fora)

### Fase V
- [x] Visão de produto
- [x] Schema domínio
- [x] UI (`ui.md` fechada — componentes Rotina)

### Fase L
- [x] POP `architecture/link-supabase.md`
- [x] `tools/handshake_supabase.py`
- [x] `.env` preenchido
- [x] Handshake OK (Auth 200, REST 404 `pages` ausente, Storage 200)

### Fase A / E / G
- [x] POP `architecture/schema-caderno.md`
- [x] SQL `architecture/schema-caderno.sql`
- [x] SQL `architecture/schema-buckets.sql`
- [x] `tools/verify_schema.py` — SCHEMA OK
- [x] POP `architecture/crud-pages.md` + `tools/list_pages.py`
- [x] POP `architecture/auth-editor.md` + `tools/handshake_auth.py`
- [x] POP `architecture/app-minimo.md` + app em `web/`
- [x] `schema-multiuser.sql` no ar (`profiles` + `pages.owner_id` HTTP 200)
- [x] **1.** Auth dashboard (você: pronto). Login local fica pra depois.
- [x] **2.** Git + GitHub — `https://github.com/nerytechz/processos` (owner: nerytechz)
- [ ] **3.** Vercel + DNS — AGORA (você; não a Cursor)
- [ ] **4.** Auth do Supabase apontando pro site publicado (não localhost)
- [ ] **5.** Domínio `processos.nerytech.com.br`
- [ ] **6.** Signup público off depois do 1º editor
- [ ] Primeira pagina real de processo (pode ser depois do site no ar)

---

## Fila (não fazer agora)

| # | Quem | O quê |
|---|---|---|
| 1 | Você | Auth dashboard — feito |
| 2 | Eu, com seu ok | `git init` + GitHub (`.env` não sobe) |
| 3 | Nós | Vercel |
| 4 | Você | Site URL do Supabase = url publicada |
| 5 | Você | Domínio nerytech |
| 6 | Você | Travar signup |

---

## Blueprint (dados/infra) — aprovado para Link

| Item | Valor |
| --- | --- |
| Produto | Caderno: páginas + etapas (`captacao`, `manipulacao`, `referencia`) |
| Integrações | Supabase Auth + Postgres + Storage |
| Fonte da verdade | Só Supabase |
| Payload | GitHub → Vercel → `processos.nerytech.com.br` |
| Auth | Email/senha editar; publicado = público |
| UI | Fora deste Blueprint. `ui.md`. Não bloqueia L. |
