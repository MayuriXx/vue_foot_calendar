import { ref, computed } from 'vue'
import type { Match } from '@/types/football'
import footballService from '@/services/football.service'
import cacheService from '@/services/cache.service'

interface LeagueGrouped {
  id: number
  name: string
  country: string
  logo: string
  flag: string | null
  live: Match[]
  upcoming: Match[]
  finished: Match[]
}

type StatusFilter = 'all' | 'live' | 'upcoming' | 'finished'

export function useFootball() {
  const matches = ref<Match[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const fromCache = ref(false)

  // Filter state
  const selectedStatus = ref<StatusFilter>('all')
  const selectedCountry = ref<string>('all')
  const selectedLeague = ref<string>('all')

  /**
   * Récupère les matchs du jour avec cache
   * Cache : 60 minutes pour les matchs qui peuvent avoir des updates
   */
  const loadTodayMatches = async () => {
    isLoading.value = true
    error.value = null
    fromCache.value = false

    try {
      const cacheKey = 'matches_today'
      
      // Essayer le cache en premier
      const cachedMatches = cacheService.get<Match[]>(cacheKey)
      if (cachedMatches && cachedMatches.length > 0) {
        matches.value = cachedMatches
        fromCache.value = true
        isLoading.value = false
        console.info('ℹ️ Matchs aujourd\'hui chargés du cache')
        return
      }

      // Sinon, récupérer de l'API
      const freshMatches = await footballService.getTodayMatches()
      matches.value = freshMatches
      
      // Mettre en cache pour 60 minutes
      if (freshMatches.length > 0) {
        cacheService.set(cacheKey, freshMatches, 60)
        console.info('✓ Matchs aujourd\'hui mis en cache (60 min)')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des matchs'
      matches.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupère les matchs d'une période avec cache
   * Cache : 120 minutes pour les matchs futurs (données stables)
   */
  const loadMatchesByDateRange = async (from: string, to: string) => {
    isLoading.value = true
    error.value = null
    fromCache.value = false

    try {
      const cacheKey = `matches_${from}_${to}`
      
      // Essayer le cache en premier
      const cachedMatches = cacheService.get<Match[]>(cacheKey)
      if (cachedMatches && cachedMatches.length > 0) {
        matches.value = cachedMatches
        fromCache.value = true
        isLoading.value = false
        console.info(`ℹ️ Matchs ${from} à ${to} chargés du cache`)
        return
      }

      // Sinon, récupérer de l'API
      const freshMatches = await footballService.getMatchesByDateRange(from, to)
      matches.value = freshMatches
      
      // Mettre en cache pour 120 minutes (données stables)
      if (freshMatches.length > 0) {
        cacheService.set(cacheKey, freshMatches, 120)
        console.info(`✓ Matchs ${from} à ${to} mis en cache (120 min)`)
      }
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

  /**
   * Regroupe les matchs par ligue et par statut
   * Retourne un array de ligues avec leurs matchs organisés par catégorie
   */
  const matchesByLeague = computed(() => {
    const leagueMap = new Map<string, LeagueGrouped>()

    matches.value.forEach((match) => {
      const leagueKey = `${match.league.id}-${match.league.name}`

      if (!leagueMap.has(leagueKey)) {
        leagueMap.set(leagueKey, {
          id: match.league.id,
          name: match.league.name,
          country: match.league.country,
          logo: match.league.logo,
          flag: match.league.flag,
          live: [],
          upcoming: [],
          finished: [],
        })
      }

      const league = leagueMap.get(leagueKey)!
      const status = match.fixture.status.short

      // Catégoriser par statut
      if (status === '1H' || status === '2H' || status === 'ET' || status === 'P') {
        league.live.push(match)
      } else if (status === 'NS' || status === 'PST') {
        league.upcoming.push(match)
      } else if (status === 'FT' || status === 'AET') {
        league.finished.push(match)
      }
    })

    // Convertir en array et trier par pays puis par nom de ligue
    return Array.from(leagueMap.values()).sort((a, b) => {
      if (a.country !== b.country) {
        return a.country.localeCompare(b.country)
      }
      return a.name.localeCompare(b.name)
    })
  })

  /**
   * Obtient la liste unique des pays
   */
  const countries = computed(() => {
    const countrySet = new Set<string>()
    matches.value.forEach((match) => {
      countrySet.add(match.league.country)
    })
    return Array.from(countrySet).sort()
  })

  /**
   * Obtient la liste unique des ligues (filtrées par pays si sélectionné)
   */
  const leagues = computed(() => {
    const leagueSet = new Set<string>()
    matches.value.forEach((match) => {
      if (selectedCountry.value === 'all' || match.league.country === selectedCountry.value) {
        leagueSet.add(`${match.league.id}|${match.league.name}`)
      }
    })
    return Array.from(leagueSet).sort()
  })

  /**
   * Filtre les matchs selon les critères sélectionnés
   */
  const filteredMatches = computed(() => {
    return matches.value.filter((match) => {
      // Filtre par pays
      if (selectedCountry.value !== 'all' && match.league.country !== selectedCountry.value) {
        return false
      }

      // Filtre par ligue
      if (selectedLeague.value !== 'all') {
        const [leagueId] = selectedLeague.value.split('|')
        if (match.league.id.toString() !== leagueId) {
          return false
        }
      }

      // Filtre par statut
      if (selectedStatus.value !== 'all') {
        const status = match.fixture.status.short
        if (selectedStatus.value === 'live') {
          const isLive = status === '1H' || status === '2H' || status === 'ET' || status === 'P'
          if (!isLive) return false
        } else if (selectedStatus.value === 'upcoming') {
          const isUpcoming = status === 'NS' || status === 'PST'
          if (!isUpcoming) return false
        } else if (selectedStatus.value === 'finished') {
          const isFinished = status === 'FT' || status === 'AET'
          if (!isFinished) return false
        }
      }

      return true
    })
  })

  /**
   * Regroupe les matchs filtrés par ligue et par statut
   */
  const filteredMatchesByLeague = computed(() => {
    const leagueMap = new Map<string, LeagueGrouped>()

    filteredMatches.value.forEach((match) => {
      const leagueKey = `${match.league.id}-${match.league.name}`

      if (!leagueMap.has(leagueKey)) {
        leagueMap.set(leagueKey, {
          id: match.league.id,
          name: match.league.name,
          country: match.league.country,
          logo: match.league.logo,
          flag: match.league.flag,
          live: [],
          upcoming: [],
          finished: [],
        })
      }

      const league = leagueMap.get(leagueKey)!
      const status = match.fixture.status.short

      if (status === '1H' || status === '2H' || status === 'ET' || status === 'P') {
        league.live.push(match)
      } else if (status === 'NS' || status === 'PST') {
        league.upcoming.push(match)
      } else if (status === 'FT' || status === 'AET') {
        league.finished.push(match)
      }
    })

    return Array.from(leagueMap.values()).sort((a, b) => {
      if (a.country !== b.country) {
        return a.country.localeCompare(b.country)
      }
      return a.name.localeCompare(b.name)
    })
  })

  /**
   * Réinitialise les filtres
   */
  const resetFilters = () => {
    selectedStatus.value = 'all'
    selectedCountry.value = 'all'
    selectedLeague.value = 'all'
  }

  return {
    // State
    matches,
    isLoading,
    error,
    fromCache,

    // Filter State
    selectedStatus,
    selectedCountry,
    selectedLeague,

    // Methods
    loadTodayMatches,
    loadMatchesByDateRange,
    loadTeamMatches,
    loadLeagueMatches,
    resetFilters,

    // Computed
    matchesByLeague,
    countries,
    leagues,
    filteredMatches,
    filteredMatchesByLeague,
    upcomingMatches,
    liveMatches,
    finishedMatches,
  }
}
