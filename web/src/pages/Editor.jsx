import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Btn, btnClass } from '../components/Btn'
import { Card } from '../components/Card'
import { Layout } from '../components/Layout'
import { ImageSlot } from '../components/Media'
import { PageTitle } from '../components/PageTitle'
import { useAuth } from '../lib/AuthContext'
import { slugify } from '../lib/slug'
import { supabase } from '../lib/supabase'

const KINDS = [
  { value: 'captacao', label: 'Captacao' },
  { value: 'manipulacao', label: 'Manipulacao' },
  { value: 'referencia', label: 'Referencia' },
]

function blankStep() {
  return {
    kind: 'captacao',
    title: '',
    body: '',
    reference_url: '',
    audio_path: null,
    image_path: null,
    audioFile: null,
    imageFile: null,
  }
}

async function uploadIfFile(bucket, userId, pageId, file, previousPath) {
  if (!file) return previousPath
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const path = `${userId}/${pageId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file)
  if (error) throw error
  return path
}

export function EditorList() {
  const { user, ready } = useAuth()
  const [pages, setPages] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    supabase
      .from('pages')
      .select('id,slug,title,published,updated_at')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setPages(data ?? [])
      })
  }, [user])

  if (!ready) return <Layout>Carregando…</Layout>
  if (!user) return <Navigate to="/login" replace />

  return (
    <Layout>
      <PageTitle
        description="Paginas do seu caderno."
        action={
          <Link className={btnClass('secondary', '!px-4 !py-2 !text-xs')} to="/editor/nova">
            + Nova pagina
          </Link>
        }
      >
        Editor
      </PageTitle>
      {error && <p className="text-sm text-danger">{error}</p>}
      <ul className="grid gap-3 md:grid-cols-2">
        {pages.map((p) => (
          <li key={p.id}>
            <Card>
              <p className="kicker">{p.published ? 'publicada' : 'rascunho'}</p>
              <p className="mt-2 text-foreground">{p.title}</p>
              <hr className="my-3 border-white/10" />
              <Link className={btnClass('secondary', '!px-4 !py-2 !text-xs')} to={`/editor/${p.id}`}>
                Editar
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export function EditorForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { user, ready } = useAuth()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [published, setPublished] = useState(false)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPath, setCoverPath] = useState(null)
  const [steps, setSteps] = useState([blankStep()])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id || !user) return
    async function load() {
      const { data: page, error: pageErr } = await supabase.from('pages').select('*').eq('id', id).single()
      if (pageErr) {
        setError(pageErr.message)
        return
      }
      setTitle(page.title)
      setSlug(page.slug)
      setSummary(page.summary || '')
      setPublished(page.published)
      setCoverPath(page.cover_image_path)
      const { data: stepRows, error: stepErr } = await supabase
        .from('steps')
        .select('*')
        .eq('page_id', id)
        .order('sort_order')
      if (stepErr) setError(stepErr.message)
      else if (stepRows?.length) {
        setSteps(
          stepRows.map((s) => ({
            kind: s.kind,
            title: s.title,
            body: s.body,
            reference_url: s.reference_url || '',
            audio_path: s.audio_path,
            image_path: s.image_path,
            audioFile: null,
            imageFile: null,
          })),
        )
      }
    }
    load()
  }, [id, user])

  if (!ready) return <Layout>Carregando…</Layout>
  if (!user) return <Navigate to="/login" replace />

  function patchStep(index, patch) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  async function onSave(e) {
    e.preventDefault()
    setError('')
    const cleanSlug = slugify(slug || title)
    if (!title.trim() || !cleanSlug) {
      setError('Titulo e slug sao obrigatorios.')
      return
    }
    setBusy(true)
    try {
      let pageId = id
      if (isNew) {
        const { data, error: insErr } = await supabase
          .from('pages')
          .insert({
            title: title.trim(),
            slug: cleanSlug,
            summary: summary.trim(),
            published,
            owner_id: user.id,
          })
          .select('id')
          .single()
        if (insErr) throw insErr
        pageId = data.id
      } else {
        const { error: updErr } = await supabase
          .from('pages')
          .update({
            title: title.trim(),
            slug: cleanSlug,
            summary: summary.trim(),
            published,
          })
          .eq('id', pageId)
        if (updErr) throw updErr
      }

      const nextCover = await uploadIfFile('images', user.id, pageId, coverFile, coverPath)
      if (nextCover !== coverPath) {
        const { error: coverErr } = await supabase.from('pages').update({ cover_image_path: nextCover }).eq('id', pageId)
        if (coverErr) throw coverErr
      }

      const built = []
      for (let i = 0; i < steps.length; i += 1) {
        const s = steps[i]
        const audio_path = await uploadIfFile('audio', user.id, pageId, s.audioFile, s.audio_path)
        const image_path = await uploadIfFile('images', user.id, pageId, s.imageFile, s.image_path)
        built.push({
          page_id: pageId,
          kind: s.kind,
          sort_order: i,
          title: s.title.trim() || `Etapa ${i + 1}`,
          body: s.body.trim(),
          reference_url: s.reference_url.trim() || null,
          audio_path,
          image_path,
        })
      }

      const { error: delErr } = await supabase.from('steps').delete().eq('page_id', pageId)
      if (delErr) throw delErr
      if (built.length) {
        const { error: stErr } = await supabase.from('steps').insert(built)
        if (stErr) throw stErr
      }

      navigate('/editor')
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout>
      <PageTitle>{isNew ? 'Nova pagina' : 'Editar'}</PageTitle>
      <form className="space-y-4" onSubmit={onSave}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,28rem)]">
          <div className="space-y-4">
            <label className="block text-sm text-muted">
              Titulo
              <input
                className="field"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (isNew) setSlug(slugify(e.target.value))
                }}
                required
              />
            </label>
            <label className="block text-sm text-muted">
              Slug (URL)
              <input className="field" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} required />
            </label>
            <label className="block text-sm text-muted">
              Resumo
              <textarea className="field" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Publicada
            </label>
          </div>
          <Card>
            <p className="kicker text-primary">Capa</p>
            <ImageSlot file={coverFile} path={coverPath} variant="cover" alt="Capa" />
            <label className={`${btnClass('secondary', '!px-4 !py-2 !text-xs mt-3')} cursor-pointer`}>
              {coverFile || coverPath ? 'Trocar capa' : 'Enviar capa'}
              <input
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </Card>
        </div>

        <h2 className="pt-2 font-sans text-lg font-bold">Etapas</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {steps.map((s, i) => (
            <fieldset key={i} className="space-y-2 rounded-2xl border border-white/10 bg-surface p-4">
              <legend className="kicker px-1">Etapa {i + 1}</legend>
              <select className="field mt-0" value={s.kind} onChange={(e) => patchStep(i, { kind: e.target.value })}>
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
              <input className="field" placeholder="Titulo da etapa" value={s.title} onChange={(e) => patchStep(i, { title: e.target.value })} />
              <textarea className="field" rows={3} placeholder="O que foi feito" value={s.body} onChange={(e) => patchStep(i, { body: e.target.value })} />
              <input
                className="field"
                placeholder="URL de referencia"
                value={s.reference_url}
                onChange={(e) => patchStep(i, { reference_url: e.target.value })}
              />
              <ImageSlot file={s.imageFile} path={s.image_path} variant="step" alt="" />
              <div className="flex flex-wrap gap-2">
                <label className={`${btnClass('secondary', '!px-4 !py-2 !text-xs')} cursor-pointer`}>
                  Audio
                  <input
                    className="hidden"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => patchStep(i, { audioFile: e.target.files?.[0] ?? null })}
                  />
                </label>
                <label className={`${btnClass('secondary', '!px-4 !py-2 !text-xs')} cursor-pointer`}>
                  Imagem
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => patchStep(i, { imageFile: e.target.files?.[0] ?? null })}
                  />
                </label>
                {steps.length > 1 && (
                  <Btn type="button" variant="danger" compact onClick={() => setSteps((prev) => prev.filter((_, j) => j !== i))}>
                    Remover
                  </Btn>
                )}
              </div>
              {(s.audioFile || s.audio_path) && <p className="text-xs text-muted">{s.audioFile ? s.audioFile.name : 'audio anexado'}</p>}
            </fieldset>
          ))}
        </div>
        <Btn type="button" variant="secondary" compact onClick={() => setSteps((prev) => [...prev, blankStep()])}>
          + Etapa
        </Btn>

        {error && <p className="text-danger">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <Btn disabled={busy} type="submit" variant="primary" compact>
            {busy ? 'Salvando…' : 'Salvar'}
          </Btn>
          <Link to="/editor" className={btnClass('secondary', '!px-4 !py-2 !text-xs text-center')}>
            Cancelar
          </Link>
        </div>
      </form>
    </Layout>
  )
}
