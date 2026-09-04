import { useEffect, useState } from 'react'
import { publicUrl } from '../lib/supabase'

export function Media({ src, alt = '', variant = 'step' }) {
  if (!src) return null
  if (variant === 'cover') {
    return (
      <figure className="w-full overflow-hidden rounded-[2rem] border border-foreground/10 bg-surface">
        <img
          src={src}
          alt={alt}
          className="mx-auto block h-auto w-full max-h-[min(52vh,36rem)] object-contain"
        />
      </figure>
    )
  }
  return (
    <figure className="mt-4 w-full overflow-hidden rounded-[1.25rem] bg-background">
      <img src={src} alt={alt} className="mx-auto block h-auto max-h-80 max-w-full object-contain" />
    </figure>
  )
}

export function ImageSlot({ file, path, variant = 'step', alt = '' }) {
  const [local, setLocal] = useState(null)

  useEffect(() => {
    if (!file) {
      setLocal(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setLocal(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const src = local || (path ? publicUrl('images', path) : null)
  return <Media src={src} alt={alt} variant={variant} />
}
