import { ref } from 'vue'
import type { Match, MatchStatistics, MatchEvent, MatchLineup, Standing } from '@/types/football'
import footballService from '@/services/football.service'
import cacheService from '@/services/cache.service'

export function useMatchDetail(fixtureId: number) {
  const match = ref<Match | null>(null)
  const statistics = ref<MatchStatistics[]>([])
  const events = ref<MatchEvent[]>([])
  const lineups = ref<MatchLineup[]>([])
  const standings = ref<Standing[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const standingsError = ref<string | null>(null)
  const isLoadingStandings = ref(false)
  let standingsLoaded = false

  /**
   * Charge tous les détails du match
   * Fonctionne indépendamment du statut du match (en direct, à venir, terminé)
   * NE charge PAS les standings automatiquement pour économiser les requêtes
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
      // (on charge les standings séparément avec loadStandings)
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
      console.error('Match detail loading error:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Charge les standings (LAZY) - appelé seulement quand nécessaire
   * Cache : 30 min pour matchs LIVE, 120 min pour autres (données stables)
   */
  const loadStandings = async () => {
    // Ne charger qu'une fois
    if (standingsLoaded || !match.value) {
      return
    }

    standingsLoaded = true
    isLoadingStandings.value = true
    standingsError.value = null

    try {
      const leagueId = match.value.league.id
      const season = match.value.league.season
      const cacheKey = `standings_${leagueId}_${season}`

      // Déterminer le TTL selon le statut du match
      const isLive =
        match.value.fixture.status.short === '1H' ||
        match.value.fixture.status.short === '2H' ||
        match.value.fixture.status.short === 'ET' ||
        match.value.fixture.status.short === 'P'

      // Essayer le cache en premier
      const cachedStandings = cacheService.get<Standing[]>(cacheKey)
      if (cachedStandings && cachedStandings.length > 0) {
        standings.value = cachedStandings
        console.info(`ℹ️ Standings ${match.value.league.name} chargés du cache`)
        isLoadingStandings.value = false
        return
      }

      // Sinon, récupérer de l'API
      const standingsData = await footballService.getStandings(leagueId, season)
      standings.value = standingsData[0] || []

      // Mettre en cache selon le statut
      const ttlMinutes = isLive ? 30 : 120
      if (standings.value && standings.value.length > 0) {
        cacheService.set(cacheKey, standings.value, ttlMinutes)
        console.info(`✓ Standings ${match.value.league.name} mis en cache (${ttlMinutes} min)`)
      }

      // Message si pas de classement
      if (!standings.value || standings.value.length === 0) {
        standingsError.value = 'Classement non disponible pour cette ligue'
        console.warn(`No standings data for league ${leagueId}`)
      }
    } catch (err) {
      standingsError.value = err instanceof Error ? err.message : 'Erreur lors du chargement du classement'
      console.error('Standings loading error:', err)
    } finally {
      isLoadingStandings.value = false
    }
  }

  return {
    // State
    match,
    statistics,
    events,
    lineups,
    standings,
    isLoading,
    error,
    standingsError,
    isLoadingStandings,

    // Methods
    loadMatchDetails,
    loadStandings, // À appeler manuellement ou lors du scroll
  }
}
