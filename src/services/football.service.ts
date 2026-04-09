import type { ApiFootballResponse, Match, League, Team, MatchesQueryParams, MatchStatistics, MatchEvent, MatchLineup } from '@/types/football'

class FootballService {
  private apiKey: string
  private baseURL = 'https://v3.football.api-sports.io'
  private headers: Record<string, string>

  constructor() {
    this.apiKey = import.meta.env.VITE_API_FOOTBALL_KEY
    if (!this.apiKey) {
      console.error('API Football key not configured in .env.local')
    }

    this.headers = {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': import.meta.env.VITE_API_FOOTBALL_HOST || 'v3.football.api-sports.io',
    }
  }

  /**
   * Récupère un match spécifique par son ID
   */
  async getMatchById(fixtureId: number): Promise<Match | null> {
    try {
      const url = `${this.baseURL}/fixtures?id=${fixtureId}`
      const response = await fetch(url, { headers: this.headers })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiFootballResponse<Match> = await response.json()
      return data.response[0] || null
    } catch (error) {
      console.error('Error fetching match:', error)
      return null
    }
  }

  /**
   * Récupère les matchs selon les critères
   * @param params Paramètres de recherche (date, ligue, équipe, etc.)
   */
  async getMatches(params: MatchesQueryParams): Promise<Match[]> {
    try {
      const queryString = new URLSearchParams()

      if (params.date) queryString.append('date', params.date)
      if (params.league) queryString.append('league', params.league.toString())
      if (params.season) queryString.append('season', params.season.toString())
      if (params.team) queryString.append('team', params.team.toString())
      if (params.status) queryString.append('status', params.status)
      if (params.from) queryString.append('from', params.from)
      if (params.to) queryString.append('to', params.to)

      const url = `${this.baseURL}/fixtures?${queryString.toString()}`
      const response = await fetch(url, { headers: this.headers })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiFootballResponse<Match> = await response.json()
      return data.response
    } catch (error) {
      console.error('Error fetching matches:', error)
      return []
    }
  }

  /**
   * Récupère les matchs du jour
   */
  async getTodayMatches(): Promise<Match[]> {
    const today = new Date().toISOString().split('T')[0]
    return this.getMatches({ date: today })
  }

  /**
   * Récupère les matchs d'une période
   */
  async getMatchesByDateRange(from: string, to: string): Promise<Match[]> {
    return this.getMatches({ from, to })
  }

  /**
   * Récupère les matchs d'une équipe
   */
  async getTeamMatches(teamId: number, season: number): Promise<Match[]> {
    return this.getMatches({ team: teamId, season })
  }

  /**
   * Récupère les matchs d'une ligue
   */
  async getLeagueMatches(leagueId: number, season: number): Promise<Match[]> {
    return this.getMatches({ league: leagueId, season })
  }

  /**
   * Récupère les ligues disponibles
   */
  async getLeagues(): Promise<League[]> {
    try {
      const url = `${this.baseURL}/leagues`
      const response = await fetch(url, { headers: this.headers })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiFootballResponse<League> = await response.json()
      return data.response
    } catch (error) {
      console.error('Error fetching leagues:', error)
      return []
    }
  }

  /**
   * Récupère les équipes d'une ligue
   */
  async getTeams(leagueId: number, season: number): Promise<Team[]> {
    try {
      const url = `${this.baseURL}/teams?league=${leagueId}&season=${season}`
      const response = await fetch(url, { headers: this.headers })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiFootballResponse<Team> = await response.json()
      return data.response
    } catch (error) {
      console.error('Error fetching teams:', error)
      return []
    }
  }

  /**
   * Récupère une ligue spécifique
   */
  async getLeague(leagueId: number): Promise<League | null> {
    try {
      const url = `${this.baseURL}/leagues?id=${leagueId}`
      const response = await fetch(url, { headers: this.headers })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiFootballResponse<League> = await response.json()
      return data.response[0] || null
    } catch (error) {
      console.error('Error fetching league:', error)
      return null
    }
  }

  /**
   * Récupère les statistiques d'un match
   */
  async getMatchStatistics(fixtureId: number): Promise<MatchStatistics[]> {
    try {
      const url = `${this.baseURL}/fixtures/statistics?fixture=${fixtureId}`
      const response = await fetch(url, { headers: this.headers })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiFootballResponse<MatchStatistics> = await response.json()
      return data.response
    } catch (error) {
      console.error('Error fetching match statistics:', error)
      return []
    }
  }

  /**
   * Récupère les événements d'un match
   */
  async getMatchEvents(fixtureId: number): Promise<MatchEvent[]> {
    try {
      const url = `${this.baseURL}/fixtures/events?fixture=${fixtureId}`
      const response = await fetch(url, { headers: this.headers })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiFootballResponse<MatchEvent> = await response.json()
      return data.response
    } catch (error) {
      console.error('Error fetching match events:', error)
      return []
    }
  }

  /**
   * Récupère les formations d'un match
   */
  async getMatchLineups(fixtureId: number): Promise<MatchLineup[]> {
    try {
      const url = `${this.baseURL}/fixtures/lineups?fixture=${fixtureId}`
      const response = await fetch(url, { headers: this.headers })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ApiFootballResponse<MatchLineup> = await response.json()
      return data.response
    } catch (error) {
      console.error('Error fetching match lineups:', error)
      return []
    }
  }
}

export default new FootballService()
