# POP — Auth editor por e-mail (Fase A / app)

## Objetivo

O editor entra pelo **fluxo oficial do Supabase Auth** (e-mail). Senha não é hardcoded. `EDITOR_EMAIL` no `.env` **não** é o produto — era só atalho de script.

## Como o produto faz

Supabase envia o e-mail. O app só chama Auth.

| Fluxo | Quando |
| --- | --- |
| **Sign up + confirmar e-mail** | Primeiro editor. Confirm email **ligado**. Ele cadastra no site, clica o link do e-mail, depois faz login. Em seguida **desligar** "Allow new users to sign up" (sem cadastro público). |
| **Invite** | Dashboard → Authentication → Invite. O Supabase manda o e-mail; a pessoa define senha. Signup público continua off. |
| **Login** | E-mail + senha já confirmados. |
| **Forgot password** | Reset por e-mail (Supabase). |

Visitante **não** se cadastra. Quem não está logado só vê páginas publicadas.

## Dashboard (uma vez)

Authentication → Providers → Email: **Confirm email** ON.  
URL de redirect: `https://processos.nerytech.com.br/**` (e localhost na Fase A).  
E-mails padrão do Supabase servem no começo (limite de taxa). SMTP próprio (`nerytech.com.br`) depois, se precisar.

## Scripts Python

`tools/handshake_auth.py` fica **opcional** (CI / debug), com credenciais só no `.env` local. Não substitui tela de login. Não commitar senha.

## Bordas

- Sem confirmar o e-mail, o login falha (`email not confirmed`).
- Add user no dashboard **pula** o e-mail — não é o método do produto.
- RLS já exige `authenticated` para escrever. Não precisa de senha no código.

## Saída

Usuário editor existe **depois** de confirmar o e-mail (signup ou invite). Relato em `progress.md` quando o app de Auth existir.
