import { BrandTitle } from './ui/BrandTitle'

/** Cabeçalho no peso da Rotina: BrandTitle 3xl/4xl + descrição 12px. */
export function PageTitle({ lead, accent, children, kicker, description, action }) {
  const title = accent || children
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker ? <div className="mb-1 text-xs text-muted">{kicker}</div> : null}
        <BrandTitle lead={lead} accent={title} />
        {description ? <p className="mt-2 max-w-xl text-xs text-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-shrink-0 flex-wrap gap-2">{action}</div> : null}
    </header>
  )
}
