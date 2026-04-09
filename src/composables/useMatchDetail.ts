import { ref } from 'vue'
import type { Match, MatchStatistics, MatchEvent, MatchLineup } from '@/types/football'
import footballService from '@/services/football.service'

export function useMatchDetail(fixtureId: number) {
  const match = ref<Match | null>(null)
  const statistics = ref<MatchStatistics[]>([])
  const events = ref<MatchEvent[]>([])
  const lineups = ref<MatchLineup[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Charge tous les détails du match
   */
  const loadMatchDetails = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Récupère les infos de base du match par son ID
      match.value = await footballService.getMatchById(fixtureId)

      if (!match.value) {
        error.value = 'Match not found'
        return
      }

      // Récupère les statistiques, événements et formations en parallèle
      const [stats, matchEvents, matchLineups] = await Promise.all([
        footballService.getMatchStatistics(fixtureId),
        footballService.getMatchEvents(fixtureId),
        footballService.getMatchLineups(fixtureId),
      ])

      statistics.value = stats
      events.value = matchEvents
      lineups.value = matchLineups
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des détails'
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    match,
    statistics,
    events,
    lineups,
    isLoading,
    error,

    // Methods
    loadMatchDetails,
  }
}
