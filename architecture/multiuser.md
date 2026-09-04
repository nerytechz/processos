# POP — Multi-user (caderno por @)

## Objetivo

Cada conta tem `username` único (@) e só edita as próprias páginas.

## SQL

Rodar `architecture/schema-multiuser.sql` no SQL Editor.

## App

- Depois do login, se não tem @ → `/onboarding`
- URLs públicas: `/u/:username` e `/u/:username/:slug`
- Upload: `{user_id}/{page_id}/arquivo`

## Bordas

- Páginas antigas sem dono são **apagadas** pelo SQL.
- @ : `a-z 0-9 _`, 3–24 caracteres.
