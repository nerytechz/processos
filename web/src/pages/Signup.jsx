import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Btn } from '../components/Btn'
import { Layout } from '../components/Layout'
import { PageTitle } from '../components/PageTitle'
import { supabase } from '../lib/supabase'

export function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    })
    setBusy(false)
    if (err) {
      setError(err.message)
      return
    }
    setDone(true)
  }

  return (
    <Layout>
      <PageTitle description="Confirme o e-mail depois de criar a conta.">Cadastrar</PageTitle>
      {done ? (
        <p className="text-muted">
          Confira o e-mail. Depois{' '}
          <Link to="/login" className="text-primary">
            entre
          </Link>
          .
        </p>
      ) : (
        <form className="max-w-sm space-y-3" onSubmit={onSubmit}>
          <input className="field" type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="field"
            type="password"
            required
            minLength={6}
            placeholder="Senha (min. 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Btn disabled={busy} type="submit" variant="primary" compact>
            {busy ? 'Enviando…' : 'Criar conta'}
          </Btn>
        </form>
      )}
    </Layout>
  )
}
