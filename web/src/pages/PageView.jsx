import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buttonClass } from '../components/Btn'
import { Card } from '../components/Card'
import { Layout } from '../components/Layout'
import { Media } from '../components/Media'
import { PageTitle } from '../components/PageTitle'
import { publicUrl, supabase } from '../lib/supabase'

const KIND = {
  captacao: 'Captacao',
  manipulacao: 'Manipulacao',
  referencia: 'Referencia',
}

export function Caderno() {
  const { username } = useParams()
  const [pages, setPages] = useState([])
  const [error, setError] = useState('')
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('id,username')
        .eq('username', username)
        .maybeSingle()
      if (pErr) {
        setError(pErr.message)
        return
      }
      if (!profile) {
        setMissing(true)
        return
      }
      const { data, error: err } = await supabase
        .from('pages')
        .select('slug,title,summary')
        .eq('owner_id', profile.id)
        .eq('published', true)
        .order('created_at', { ascending: false })
      if (err) setError(err.message)
      else setPages(data ?? [])
    }
    load()
  }, [username])

  return (
    <Layout>
      <PageTitle kicker="caderno" description={missing ? 'Usuario nao encontrado.' : undefined}>
        @{username}
      </PageTitle>
      {error && <p className="text-sm text-danger">{error}</p>}
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((p) => (
          <li key={p.slug}>
            <Card>
              <Link to={`/u/${username}/${p.slug}`} className="text-foreground hover:text-primary">
                {p.title}
              </Link>
              {p.summary && (
                <>
                  <hr className="my-3 border-white/10" />
                  <p className="text-xs text-muted">{p.summary}</p>
                </>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export function PageView() {
  const { username, slug } = useParams()
  const [page, setPage] = useState(null)
  const [steps, setSteps] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle()
      if (pErr || cancelled) {
        if (pErr) setError(pErr.message)
        return
      }
      if (!profile) {
        setError('Usuario nao encontrado.')
        return
      }
      const { data: row, error: pageErr } = await supabase
        .from('pages')
        .select('*')
        .eq('owner_id', profile.id)
        .eq('slug', slug)
        .maybeSingle()
      if (pageErr || cancelled) {
        if (pageErr) setError(pageErr.message)
        return
      }
      if (!row) {
        setError('Pagina nao encontrada (ou nao publicada).')
        return
      }
      setPage(row)
      const { data: stepRows, error: stepErr } = await supabase
        .from('steps')
        .select('*')
        .eq('page_id', row.id)
        .order('sort_order', { ascending: true })
      if (stepErr) setError(stepErr.message)
      else setSteps(stepRows ?? [])
    }
    load()
    return () => {
      cancelled = true
    }
  }, [username, slug])

  return (
    <Layout>
      {error && <p className="text-sm text-danger">{error}</p>}
      {page && (
        <>
          <PageTitle
            kicker={
              <Link to={`/u/${username}`} className="hover:text-primary">
                @{username}
              </Link>
            }
            description={page.summary || undefined}
          >
            {page.title}
          </PageTitle>
          <Media src={page.cover_image_path ? publicUrl('images', page.cover_image_path) : null} variant="cover" />
          <ol className="grid gap-3 lg:grid-cols-2">
            {steps.map((s) => (
              <li key={s.id}>
                <Card>
                  <p className="kicker text-primary">{KIND[s.kind] || s.kind}</p>
                  <h2 className="mt-2 font-sans text-lg font-bold tracking-tight text-foreground">{s.title}</h2>
                  {s.body && <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{s.body}</p>}
                  {s.image_path && <Media src={publicUrl('images', s.image_path)} variant="step" />}
                  {s.audio_path && (
                    <audio className="deck mt-3" controls src={publicUrl('audio', s.audio_path)} />
                  )}
                  {s.reference_url && (
                    <a
                      className={`${buttonClass('secondary', '!px-4 !py-2 !text-xs mt-3')}`}
                      href={s.reference_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Referencia
                    </a>
                  )}
                </Card>
              </li>
            ))}
          </ol>
        </>
      )}
    </Layout>
  )
}
