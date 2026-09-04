# Progress — Projeto V.L.A.E.G.

## 2026-08-26 — Protocolo 0

- Substituídas todas as referências `gemini.md` → `cursor.md` em `protocolo_vlaeg.md`.
- Memória do projeto inicializada: `task_plan.md`, `findings.md`, `progress.md`.
- **Bloqueio ativo:** sem scripts em `tools/` até descoberta + schema + Blueprint aprovado.

## 2026-08-27 — Pausa V.L.A.E.G. → Spike

- Paramos na Fase V, pergunta 1 (Estrela Guia parcial).
- Spike em `.tmp/spike-knob-scrub/` para validar knob master.

## 2026-08-28 — Retomada V.L.A.E.G.

- Spike **apagado** (`.tmp/spike-knob-scrub/`). Nenhuma regra do spike entrou em `cursor.md`.
- Resultado registrado em `findings.md` (demo linear 0%→100%, knob travado, 1.5×).
- **Estrela Guia** consolidada (caderno de processos + demo de efeito via gravação).
- Integrações: Supabase (Storage + Postgres).
- Fonte da Verdade: somente Supabase.
- Payload de Entrega: GitHub + Vercel em `processos.nerytech.com.br`.

## 2026-08-28 — Correção: spike ≠ produto

- Confirmado: **nenhum HTML/JSX no repo** (spike apagado).
- `cursor.md` limpo: demo/knob/`playbackRate`/schema de etapas **não são lei**.
- Blueprint **reaberto**. UI das páginas começa do zero com o usuário.
- **Próximo:** descrever como são as páginas do caderno.

## 2026-08-28 — Schema fechado; Fase L iniciada

- UI não bloqueia Link. Schema de domínio em `cursor.md`.
- POP + `tools/handshake_supabase.py`. Handshake falhou: sem `.env` (esperado).
- **Próximo:** usuário cria `.env` (URL + anon key) e rodamos o handshake de novo.

## 2026-08-28 — Link OK

- Credenciais estavam no `.env.example`; copiadas para `.env`; example voltou a placeholder.
- Auth health 200. REST `/pages` 404 PGRST205 (tabela ainda não existe). Storage 200 `[]`.
- **Próximo:** Fase A — SQL de `pages`/`steps` + buckets (colar no SQL Editor do Supabase).

## 2026-08-28 — Fase A (schema)

- POP `architecture/schema-caderno.md` + SQL + `tools/verify_schema.py`.
- Verify: schema ainda ausente (DDL nao roda com anon).
- **Proximo do POP:** executar `architecture/schema-caderno.sql` no SQL Editor; depois `python tools/verify_schema.py`.

## 2026-08-28 — Tabelas OK; buckets pendentes

- `pages` HTTP 200 `[]`. "Success. No rows returned" = DDL ok.
- Buckets `audio`/`images` nao existem (o insert de Storage parou no mesmo script).
- SQL separado: `architecture/schema-buckets.sql`.
- **Proximo do POP:** rodar esse SQL no Editor; depois verify de novo.

## 2026-08-28 — Buckets ainda 404 apos SQL

- Tabelas OK. `GET /bucket/audio|images` = NoSuchBucket.
- Anon createBucket = RLS AccessDenied (esperado).
- SQL de buckets atualizado (coluna `type` STANDARD + fallback).
- **Proximo do POP:** rerodar `architecture/schema-buckets.sql`. Se falhar, criar no Dashboard dois buckets publicos `audio` e `images`.

## 2026-08-28 — Buckets invisíveis para anon

- Lista Storage com anon ainda `[]` / GET id 404. Provavel: bucket existe no Dashboard, sem policy SELECT em `storage.buckets`.
- SQL atualizado: policy `buckets_select_public`.
- **Proximo:** rodar de novo `architecture/schema-buckets.sql` (pelo menos o bloco da policy SELECT).

## 2026-08-28 — SCHEMA OK

- `pages` 200. Buckets `audio` e `images` publicos 200.
- POP CRUD leitura: `tools/list_pages.py` (array vazio esperado).
- **Proximo (Fase A):** usuario editor no Auth (insert so autenticado). Sem isso nao ha ferramenta de escrita.

## 2026-08-28 — POP Auth editor

- `architecture/auth-editor.md` + `tools/handshake_auth.py`.
- Handshake: faltam EDITOR_EMAIL / EDITOR_PASSWORD no .env (esperado).
- **Proximo:** Add user no dashboard; colocar email/senha no .env; `python tools/handshake_auth.py`.

## 2026-08-31 — Auth por e-mail (produto)

- Metodo do produto: signup/invite + confirmacao de e-mail do Supabase. Sem senha hardcoded.
- `EDITOR_*` no .env = so script opcional, nao a conta do site.
- **Proximo (Fase A):** app com telas sign up / login / "confira o e-mail" (UI Juno na Fase E).

## 2026-08-31 — App minimo (`web/`)

- Vite + React + Auth e-mail + CRUD pagina/etapas/upload.
- Sem visual Juno. Build OK.
- **Proximo (voce):** Confirm email ON; Redirect `http://localhost:5173/**`; `cd web; npm run dev`; cadastrar; criar uma pagina publicada.

## 2026-08-31 — Multi-user + @

- SQL: `architecture/schema-multiuser.sql` (rodar no Editor).
- App: `/onboarding` (@), caderno `/u/:username`.
- UI: colar design system no `ui.md`; Fase E.

## 2026-09-04 — Fase E fechada

- Modelo A: `BrandTitle`, `Button`, `Card`, `Toast` da Rotina. Nav pílula Forja.
- Passo a passo de UI **encerrado** (pedido do usuário). Sem drag/knobs/peças novas.
- Lei visual em `ui.md`. `cursor.md` + `task_plan.md` atualizados.
- **Próximo:** produto (conteúdo + Auth dashboard + multiuser SQL se ainda não rodou) e Fase G (GitHub/Vercel/domínio).

## 2026-09-04 — Guia um passo

- Multiuser já no banco (`profiles` 200, `owner_id` 200). SQL não é o passo atual.
- Passo **1** aberto: Auth dashboard (Confirm email + redirect `http://localhost:5173/**`).
- Fila: 2 login/@ → 3 página real → 4 deploy → 5 trava signup/prod.

## 2026-09-04 — Passo 1 ok; mira produção

- Você: Auth dashboard pronto. Login no localhost adiado.
- Sem pasta `.git` ainda.
- Passo **2**: criar Git + mandar pro GitHub. Sem isso a Vercel não publica.

## 2026-09-04 — GitHub na conta do dono

- Repo: https://github.com/nerytechz/processos (`main`). Owner `nerytechz`. Collaborator só ele.
- Autor do commit: Joao Nery. `.env` fora do git.
- Lei: `architecture/deploy.md` + `.cursor/rules/deploy-ownership.mdc`.
- Sem `vercel` por agente. Passo 3: dono importa na Vercel + CNAME no registro.br.
