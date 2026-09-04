import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { AccountMenu } from './AccountMenu'
import { buttonClass } from './ui/Button'

function PillLink({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          isActive ? 'text-primary' : 'text-muted hover:text-foreground'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive ? (
            <span className="nav-ember absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
          ) : null}
        </>
      )}
    </NavLink>
  )
}

export function Layout({ children }) {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed left-1/2 top-6 z-50 hidden -translate-x-1/2 md:block">
        <nav className="relative flex items-center gap-2 rounded-full border border-foreground/10 bg-surface/80 px-4 py-2 shadow-2xl backdrop-blur-xl">
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden>
            <span className="nav-scan" />
          </span>
          <div className="flex items-center gap-1">
            <PillLink to="/" end>
              PUBLICO
            </PillLink>
            {user ? <PillLink to="/editor">EDITOR</PillLink> : null}
          </div>
          {user ? (
            <AccountMenu username={profile?.username} onSignOut={() => signOut()} />
          ) : (
            <div className="flex items-center gap-1">
              <Link className={buttonClass('secondary', '!px-4 !py-1.5 !text-xs')} to="/login">
                Entrar
              </Link>
              <Link className={buttonClass('primary', '!px-4 !py-1.5 !text-xs')} to="/signup">
                Cadastrar
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className="fixed right-4 top-4 z-50 md:hidden">
        <div className="rounded-full border border-foreground/10 bg-surface/80 p-0.5 shadow-2xl backdrop-blur-xl">
          {user ? (
            <AccountMenu username={profile?.username} onSignOut={() => signOut()} />
          ) : (
            <Link className={buttonClass('secondary', '!px-3 !py-1.5 !text-xs')} to="/login">
              Entrar
            </Link>
          )}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-foreground/10 bg-surface/90 pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-xl md:hidden">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden" aria-hidden>
          <span className="nav-scan" />
        </span>
        <div className={`grid ${user ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 pb-2 pt-2.5 font-mono text-[9px] tracking-wider ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            PUBLICO
          </NavLink>
          {user ? (
            <NavLink
              to="/editor"
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 pb-2 pt-2.5 font-mono text-[9px] tracking-wider ${
                  isActive ? 'text-primary' : 'text-muted'
                }`
              }
            >
              EDITOR
            </NavLink>
          ) : null}
        </div>
      </nav>

      <main className="mx-auto mb-16 mt-14 flex w-full max-w-6xl flex-col gap-5 p-4 md:mt-24 md:p-6">{children}</main>
    </div>
  )
}
