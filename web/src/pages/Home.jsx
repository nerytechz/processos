import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { Layout } from '../components/Layout'
import { PageTitle } from '../components/PageTitle'
import { supabase } from '../lib/supabase'

export function Home() {
  const [pages, setPages] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('pages')
      .select('slug,title,summary,owner_id, profiles(username)')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setPages(data ?? [])
      })
  }, [])

  return (
    <Layout>
      <PageTitle description="Paginas publicadas do caderno de processos.">Publico</PageTitle>
      {error && <p className="text-sm text-danger">{error}</p>}
      {pages.length === 0 && !error && <p className="text-xs text-muted">Nenhuma pagina publicada.</p>}
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((p) => {
          const username = p.profiles?.username
          return (
            <li key={`${p.owner_id}-${p.slug}`}>
              <Card>
                {username && (
                  <Link to={`/u/${username}`} className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-primary">
                    @{username}
                  </Link>
                )}
                <div className="mt-2">
                  {username ? (
                    <Link to={`/u/${username}/${p.slug}`} className="text-foreground hover:text-primary">
                      {p.title}
                    </Link>
                  ) : (
                    <span>{p.title}</span>
                  )}
                </div>
                {p.summary && <p className="mt-2 text-xs text-muted">{p.summary}</p>}
              </Card>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}
