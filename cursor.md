# Constituição — Caderno de Processos (Sound Design)

## Função

Caderno digital de processos de sound design para disciplina. Visitantes **veem**. O autor **edita** após login. Fonte da verdade: **somente Supabase**. Entrega: GitHub → Vercel → `processos.nerytech.com.br`.

---

## Status

| Bloco | Estado |
| --- | --- |
| Produto / auth / entrega | Fechado |
| Schema de dados | Fechado (domínio). UI **não** altera estas tabelas sem mudança de produto. |
| UI | **Fechada.** Lei em `ui.md` (componentes da Rotina). Sem Fase E extra. |
| Blueprint dados/infra | Aprovado para seguir Link |

---

## Modos

| Modo | Quem | Pode |
| --- | --- | --- |
| **Visualização** | Qualquer um, sem login | Ver páginas `published = true` e mídia associada |
| **Edição** | Autenticado via **Supabase Auth** (e-mail + senha, confirmação / convite por e-mail). Sem senha no código. | CRUD páginas/etapas, upload |

Sem cadastro público. Visitante não escreve.

---

## Regras (não são UI)

1. Fonte da verdade: **só Supabase**.
2. **Não há DAW nem sintetizador** no browser.
3. Publicado = público. Rascunho só o autor.
4. Auth: confirmação/convite **por e-mail** (Supabase). Sem cadastro público permanente. Sem credenciais hardcoded.
5. Spike / `.tmp/` não entram no produto.
6. UI: só o que está em `ui.md`. Sem inventar peça visual. Mudança de UI = pedido explícito + `ui.md` primeiro.

---

## Schema de dados (payload)

### Postgres

```json
{
  "profiles": {
    "id": "uuid PK = auth.users.id",
    "username": "string unique (@), [a-z0-9_] 3–24",
    "created_at": "timestamptz"
  },
  "pages": {
    "id": "uuid PK",
    "owner_id": "uuid FK → profiles",
    "slug": "string unique por owner",
    "title": "string",
    "summary": "string",
    "published": "boolean default false",
    "cover_image_path": "string | null",
    "created_at": "timestamptz",
    "updated_at": "timestamptz"
  },
  "steps": {
    "id": "uuid PK",
    "page_id": "uuid FK → pages ON DELETE CASCADE",
    "kind": "captacao | manipulacao | referencia",
    "sort_order": "int",
    "title": "string",
    "body": "string",
    "audio_path": "string | null",
    "image_path": "string | null",
    "reference_url": "string | null",
    "created_at": "timestamptz"
  }
}
```

`kind` é **dado** (o que a etapa é), não layout. Como isso aparece na tela = `ui.md`.

### Storage

Buckets: `audio`, `images`.  
Path: `{user_id}/{page_id}/{filename}`.  
Leitura pública. Escrita: dono (pasta = `auth.uid()`).

### Auth / RLS

- `profiles`: SELECT público; INSERT/UPDATE só o próprio `id`.
- `SELECT` pages/steps: `published = true` **OU** `auth.uid() = owner_id`.
- `INSERT/UPDATE/DELETE` pages/steps: só o dono.
- Visitante lê caderno em `/u/:username`.

### Entrada (edição)

```json
{
  "page": {
    "title": "string",
    "slug": "string",
    "summary": "string",
    "published": false,
    "cover": "File | null",
    "steps": [
      {
        "kind": "captacao | manipulacao | referencia",
        "title": "string",
        "body": "string",
        "audio": "File | null",
        "image": "File | null",
        "reference_url": "string | null"
      }
    ]
  }
}
```

### Saída (visualização pública)

```json
{
  "page": {
    "slug": "string",
    "title": "string",
    "summary": "string",
    "cover_url": "string | null",
    "steps": [
      {
        "kind": "string",
        "title": "string",
        "body": "string",
        "audio_url": "string | null",
        "image_url": "string | null",
        "reference_url": "string | null"
      }
    ]
  }
}
```

---

## Entrega

- App (Fase A/E): React 19 + Vite + Tailwind + `@supabase/supabase-js`.
- Vercel: `processos.nerytech.com.br`.
- Env app: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Env tools/Link: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (mesmos valores).
- **Titularidade:** GitHub, Vercel e domínio só na conta do dono. Cursor/agente não é criador nem collaborator. POP: `architecture/deploy.md`. Regra: `.cursor/rules/deploy-ownership.mdc`.

---

## Log de manutenção

- 2026-08-31 — App minimo em `web/`: Auth e-mail + CRUD pagina. Sem UI Juno.
- 2026-09-04 — Fase E fechada. UI = componentes Rotina em `web/src/components/ui/`. Lei: `ui.md`. Sem Juno/drag.
- 2026-09-04 — Lei de titularidade: agente não cria/sobe deploy como owner. `architecture/deploy.md`.
