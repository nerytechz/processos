import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Faltam VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no .env da raiz')
}

export const supabase = createClient(url, key)

export function publicUrl(bucket, objectPath) {
  if (!objectPath) return null
  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath)
  return data.publicUrl
}
