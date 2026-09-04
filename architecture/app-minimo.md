# POP — App mínimo (Fase A)

## Objetivo

Site funcional: Auth por e-mail (Supabase) + páginas no banco. Visual = `ui.md`.

## Rotas

- `/` — lista `published = true`
- `/u/:username` — caderno público do autor
- `/u/:username/:slug` — leitura da página + etapas
- `/signup` — cadastro; depois “confira o e-mail”
- `/login` — e-mail + senha
- `/onboarding` — escolher `@` (primeira vez)
- `/editor`, `/editor/nova`, `/editor/:id` — autenticado: CRUD + upload

## Entrada

- `.env` na raiz: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, e os mesmos com prefixo `VITE_`
- Dashboard Auth: Confirm email ON
- Redirect URLs: `http://localhost:5173/**` (dev) e depois o domínio

## App

Pasta `web/` (Vite + React + Tailwind + `@supabase/supabase-js` + react-router).

`vite.config` lê `.env` da raiz (`envDir`).

## Bordas

- Sem sessão: `/editor` redireciona para `/login`
- Visitante não escreve (RLS)
- Visual = `ui.md`. Este POP é fluxo.
- Não seed automático

## Verificar

`cd web && npm run dev` ou `npm run dev` na raiz (proxy para `web/`).
