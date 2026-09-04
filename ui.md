# UI — Caderno (fechada)

Lei visual. **Fase E encerrada.** Não inventar componente, knob, drag, LED, split de palavra ou layout novo sem pedido explícito.

Origem: componentes da **Rotina / NEURAL.OS** (`Dev/Rotina/src/components/ui/`), portados para `web/src/components/ui/`. Imitar print **proibido**.

Não entram do outro app: hábitos, tribunal, XP, carteira, hold-5s, `DayCalendar`, OverrideButton.

---

## Paleta (imutável)

| Token Tailwind | Hex |
|---|---|
| `background` | `#0C0612` |
| `surface` | `#1A0D28` |
| `primary` | `#7B61FF` |
| `danger` | `#FF2D6B` |
| `warning` | `#E8C547` |
| `foreground` | `#EDE9F8` |
| `muted` | `#9B8FBF` |

Aliases `bg` / `fg` = background / foreground. Sem `zinc-*` / `green-*` / branco de página.

## Fontes

- UI: Geist (`font-sans`)
- Label / kicker: Geist Mono (`font-mono`, ~10px, tracking, caixa alta)
- Accent de título: Instrument Serif itálico (`font-serif`)

## Componentes (usar estes, não reinventar)

| Peça | Arquivo | Regra |
|---|---|---|
| Título | `BrandTitle` | `text-3xl md:text-4xl`. Palavra no `accent` (serif itálico + `.glitch`). `lead` opcional (sans). **Não** partir palavra (CADerno). **Não** degradê 4.5rem. |
| Página | `PageTitle` | `BrandTitle` + descrição `text-xs text-muted`. Ação à direita, se houver. |
| Botão | `Button` / `buttonClass` | Pílula. Default `px-6 py-3 text-sm`. Compacto: `!px-4 !py-2 !text-xs`. Variantes: `primary` / `secondary` / `danger`. |
| Card | `Card` | `rounded-[2rem] p-6 border-foreground/10 bg-surface`. |
| Toast | `ToastProvider` | Pílula inferior. |
| Campo | `.field` / `.neural-field` | `rounded-1rem`, borda primary 28%. |
| Capa | `Media` `variant="cover"` | Largura da coluna, `rounded-[2rem]`, `object-contain`, `max-h ~52vh`. Sem quadrado forçado. Sem drag. |
| Imagem de etapa | `Media` `variant="step"` | `object-contain`, `max-h-80`. |

## Nav

Pílula fixa no topo (desktop), igual Forja: `bg-surface/80`, `rounded-full`, `px-4 py-2`, `text-sm`, ember no ativo, `.nav-scan`.

- Itens de seção: `PUBLICO` (`/`), `EDITOR` (logado, `/editor`).
- Engrenagem = conta (Meu caderno, Editor, Sair). Deslogado: Entrar / Cadastrar na pílula.
- Mobile: tab bar embaixo + engrenagem no topo direito.
- Main: `max-w-6xl mx-auto mt-14 md:mt-24`.

## Layout de conteúdo

- Listas (Público, caderno, editor): grid 2–3 colunas no desktop.
- Página publicada: título → capa largura da coluna → etapas em grid 2 colunas (`lg`).
- Card de etapa: kicker `kind` → título → corpo → mídia → botão Referência.

## Dev

Na raiz do repo: `npm run dev` → http://localhost:5173/

Fase E encerrada. Próximos passos = produto (`task_plan.md`), não visual.
