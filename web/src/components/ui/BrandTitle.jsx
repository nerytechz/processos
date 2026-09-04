import { cn } from '../../lib/cn'

const SIZE = {
  nav: 'text-base',
  page: 'text-3xl md:text-4xl',
}

/** Título de marca da Rotina: lead sans + accent serif itálico primary + glitch. */
export function BrandTitle({ lead, accent, glitch = true, size = 'page', as: Tag = 'h1', className }) {
  return (
    <Tag className={cn('whitespace-nowrap font-sans text-foreground font-bold tracking-tight', SIZE[size], className)}>
      {lead ? <>{lead} </> : null}
      <span
        className={cn('font-serif italic font-normal text-primary', glitch && 'glitch')}
        data-text={glitch ? accent : undefined}
      >
        {accent}
      </span>
    </Tag>
  )
}
