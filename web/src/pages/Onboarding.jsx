import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Btn } from '../components/Btn'
import { Layout } from '../components/Layout'
import { PageTitle } from '../components/PageTitle'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

export function Onboarding() {
  const { user, profile, ready, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!ready) return <Layout>Carregando…</Layout>
  if (!user) return <Navigate to="/login" replace />
  if (profile) return <Navigate to="/editor" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const handle = username.trim().toLowerCase()
    if (!/^[a-z0-9_]{3,24}$/.test(handle)) {
      setError('3–24: letras, numeros e _.')
      return
    }
    setBusy(true)
    const { error: err } = await supabase.from('profiles').insert({ id: user.id, username: handle })
    setBusy(false)
    if (err) {
      if (err.code === '23505') setError('Essa @ ja existe.')
      else setError(err.message)
      return
    }
    await refreshProfile()
    navigate('/editor')
  }

  return (
    <Layout>
      <PageTitle description="Endereco do caderno. Unico.">Sua @</PageTitle>
      <form className="max-w-sm space-y-3" onSubmit={onSubmit}>
        <div className="flex items-center rounded-[1rem] border border-primary/25 bg-background">
          <span className="px-3 text-muted">@</span>
          <input
            className="w-full bg-transparent px-2 py-2 text-foreground outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="seu_nome"
            autoComplete="off"
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Btn disabled={busy} type="submit" variant="primary" compact>
          {busy ? 'Salvando…' : 'Continuar'}
        </Btn>
      </form>
    </Layout>
  )
}
