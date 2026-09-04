import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Btn } from '../components/Btn'
import { Layout } from '../components/Layout'
import { PageTitle } from '../components/PageTitle'
import { supabase } from '../lib/supabase'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    navigate('/editor')
  }

  return (
    <Layout>
      <PageTitle description="E-mail e senha do editor.">Entrar</PageTitle>
      <form className="max-w-sm space-y-3" onSubmit={onSubmit}>
        <input className="field" type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" type="password" required placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Btn disabled={busy} type="submit" variant="primary" compact>
          {busy ? 'Entrando…' : 'Entrar'}
        </Btn>
      </form>
      <p className="mt-4 text-sm text-muted">
        Sem conta?{' '}
        <Link to="/signup" className="text-primary">
          Cadastrar
        </Link>
      </p>
    </Layout>
  )
}
