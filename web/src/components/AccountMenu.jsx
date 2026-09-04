import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

export function AccountMenu({ username, onSignOut }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onPointer(e) {
      if (root.current && !root.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={root} className="relative flex-shrink-0">
      <button
        type="button"
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          open ? 'bg-primary/20 text-primary' : 'text-primary hover:bg-primary/10'
        }`}
        aria-label="Conta"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <GearIcon />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] mt-2 flex w-56 flex-col gap-1 rounded-[1.5rem] border border-primary/25 bg-surface p-4 shadow-2xl"
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {username ? `@${username}` : 'Conta'}
          </p>
          {username && (
            <Link
              role="menuitem"
              to={`/u/${username}`}
              className="rounded-[1rem] px-3 py-2 text-xs text-foreground hover:bg-primary/10"
              onClick={() => setOpen(false)}
            >
              Meu caderno
            </Link>
          )}
          <Link
            role="menuitem"
            to="/editor"
            className="rounded-[1rem] px-3 py-2 text-xs text-foreground hover:bg-primary/10"
            onClick={() => setOpen(false)}
          >
            Editor
          </Link>
          <button
            type="button"
            role="menuitem"
            className="rounded-[1rem] px-3 py-2 text-left text-xs text-danger hover:bg-danger/10"
            onClick={() => {
              setOpen(false)
              onSignOut()
            }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
