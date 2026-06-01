import { createClient } from '@supabase/supabase-js'

// Browser client — anon key. Usarlo para Realtime y lecturas client-side.
// Nunca usar el service_role key en el browser.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
