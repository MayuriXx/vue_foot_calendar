import { ref, computed } from 'vue'
import type { Match } from '@/types/football'
import footballService from '@/services/football.service'

export function useFootball() {
  const matches = ref<Match[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Récupère les matchs du jour
   */
  const loadTodayMatches = async () => {
    isLoading.value = true
    error.value = null

    try {
      matches.value = await footballService.getTodayMatches()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des matchs'
      matches.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupère les matchs d'une période
   */
  const loadMatchesByDateRange = async (from: string, to: string) => {
    isLoading.value = true
    error.value = null

    try {
      matches.value = await footballService.getMatchesByDateRange(from, to)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des matchs'
      matches.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupère les matchs d'une équipe
   */
  const loadTeamMatches = async (teamId: number, season: number) => {
    isLoading.value = true
    error.value = null

    try {
      matches.value = await footballService.getTeamMatches(teamId, season)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des matchs'
      matches.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupère les matchs d'une ligue
   */
  const loadLeagueMatches = async (leagueId: number, season: number) => {
    isLoading.value = true
    error.value = null

    try {
      matches.value = await footballService.getLeagueMatches(leagueId, season)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des matchs'
      matches.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties
  const matchesByDate = computed(() => {
    const grouped: Record<string, Match[]> = {}

    matches.value.forEach((match) => {
      const date = new Date(match.fixture.date).toLocaleDateString('fr-FR')
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(match)
    })

    return grouped
  })

  const upcomingMatches = computed(() => {
    return matches.value.filter((match) => {
      const status = match.fixture.status.short
      return status === 'NS' || status === 'PST'
    })
  })

  const liveMatches = computed(() => {
    return matches.value.filter((match) => {
      const status = match.fixture.status.short
      return status === '1H' || status === '2H' || status === 'ET' || status === 'P'
    })
  })

  const finishedMatches = computed(() => {
    return matches.value.filter((match) => {
      const status = match.fixture.status.short
      return status === 'FT' || status === 'AET'
    })
  })

  return {
    // State
    matches,
    isLoading,
    error,

    // Methods
    loadTodayMatches,
    loadMatchesByDateRange,
    loadTeamMatches,
    loadLeagueMatches,

    // Computed
    matchesByDate,
    upcomingMatches,
    liveMatches,
    finishedMatches,
  }
}
