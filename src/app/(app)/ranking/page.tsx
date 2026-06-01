import { getSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase/server'
import type { FilaRanking } from '@/types/ranking'
import PremioCard from './components/PremioCard'
import TablaRanking from './components/TablaRanking'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RankingPage() {
  const [session, { data: rankingData }] = await Promise.all([
    getSession(),
    supabase.from('tabla_posiciones').select('*'),
  ])

  const rankingInicial = (rankingData ?? []) as FilaRanking[]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Ranking</h1>
      <PremioCard />
      <TablaRanking
        rankingInicial={rankingInicial}
        userIdActual={session?.id ?? null}
      />
    </div>
  )
}
