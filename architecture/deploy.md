# POP — Deploy (Fase G)

## Titularidade (lei)

O site e o GitHub são **só do dono da conta**. Cursor / agente **não** é criador, owner nem collaborator.

- Repo: `github.com/<sua-conta>/...`
- Vercel: projeto criado **na sua** conta, importando esse repo
- Domínio: `processos.nerytech.com.br` no registro.br (sua titularidade)
- `.env` **não** vai pro Git. Chaves só no painel da Vercel (você cola)

Agente pode: commitar com o `git config` local, `git push` no remote que **já é seu**.  
Agente não pode: `gh repo` em org da Cursor, convidar Cursor, `vercel` com login da Cursor.

## App na Vercel

1. [vercel.com](https://vercel.com) — login com **seu** GitHub.
2. **Add New → Project** → o repo deste caderno.
3. **Root Directory:** deixe vazio se usar o `vercel.json` da raiz (build em `web/`). Ou aponte `web`.
4. Env (Settings → Environment Variables), Production + Preview:

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   (os mesmos do `.env` local; não commitar o arquivo.)

5. Deploy. Anota a URL `*.vercel.app`.

## Domínio `processos.nerytech.com.br`

### No Vercel (você)

1. Project → **Settings → Domains**
2. Add `processos.nerytech.com.br`
3. A Vercel mostra o alvo DNS (geralmente `cname.vercel-dns.com`)

### No registro.br (você)

1. [registro.br](https://registro.br) → login
2. Domínio **nerytech.com.br**
3. **DNS** / editar zona
4. **Novo registro:**
   - **Tipo:** `CNAME`
   - **Nome / host:** `processos`
   - **Valor / dados:** o que a Vercel pediu (quase sempre `cname.vercel-dns.com`)
   - Sem outro `A`/`AAAA` no nome `processos`
5. Salvar. Propaga em minutos ou até algumas horas.

Não aponta `nerytech.com.br` inteiro pra Vercel neste passo — só o subdomínio `processos`.

## Auth depois que o domínio resolver

Supabase → Authentication → URL Configuration:

- **Site URL:** `https://processos.nerytech.com.br`
- **Redirect URLs:** `https://processos.nerytech.com.br/**`  
  (localhost pode ficar também, pra dev)

## Verificar

- `https://processos.nerytech.com.br` abre o Caderno
- Não existe collaborator Cursor no GitHub
- Projeto Vercel está na sua conta
