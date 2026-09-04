import { cn } from '../../lib/cn'

const VARIANTS = {
  primary: 'bg-primary text-foreground font-bold',
  secondary: 'bg-transparent border border-primary/40 text-foreground',
  ghost: 'bg-transparent border border-primary/40 text-foreground',
  danger: 'bg-danger text-foreground font-bold',
}

/** Mesmas classes do Button da Rotina. compact = tamanho do "+ Item" no Mercado. */
export function buttonClass(variant = 'secondary', className = '') {
  const v = VARIANTS[variant] || VARIANTS.secondary
  return cn(
    'inline-flex items-center justify-center rounded-full text-sm tracking-wide whitespace-nowrap transition-all hover:opacity-90 disabled:opacity-40 px-6 py-3',
    v,
    className,
  )
}

export function Button({ variant = 'primary', compact = false, className = '', ...props }) {
  return (
    <button
      className={buttonClass(
        variant,
        cn(compact && '!px-4 !py-2 !text-xs', className),
      )}
      {...props}
    />
  )
}
