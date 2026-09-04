import { cn } from '../../lib/cn'

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-[2rem] border border-foreground/10 bg-surface p-6 shadow-xl', className)} {...props}>
      {children}
    </div>
  )
}
