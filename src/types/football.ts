// Response wrapper from API-Football
export interface ApiFootballResponse<T> {
  get: string
  parameters: Record<string, string | number>
  errors: string[]
  results: number
  paging: {
    current: number
    total: number
  }
  response: T[]
}

// Match/Fixture
export interface Match {
  fixture: {
    id: number
    referee: string | null
    timezone: string
    date: string
    timestamp: number
    periods: {
      first: number | null
      second: number | null
    }
    venue: {
      id: number | null
      name: string
      city: string
    }
    status: {
      long: string
      short: string
      elapsed: number | null
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string | null
    season: number
    round: string
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string
      winner: boolean | null
    }
    away: {
      id: number
      name: string
      logo: string
      winner: boolean | null
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: {
      home: number | null
      away: number | null
    }
    fulltime: {
      home: number | null
      away: number | null
    }
    extratime: {
      home: number | null
      away: number | null
    }
    penalty: {
      home: number | null
      away: number | null
    }
  }
}

// League
export interface League {
  league: {
    id: number
    name: string
    type: 'League' | 'Cup'
    logo: string
    country: string
    flag: string | null
  }
  seasons: Array<{
    year: number
    start: string
    end: string
    current: boolean
  }>
}

// Team
export interface Team {
  team: {
    id: number
    name: string
    code: string
    country: string
    founded: number
    national: boolean
    logo: string
  }
  venue: {
    id: number
    name: string
    address: string
    city: string
    capacity: number
    surface: string
    image: string
  }
}

// API Query params
export interface MatchesQueryParams {
  date?: string // YYYY-MM-DD
  league?: number
  season?: number
  team?: number
  status?: string
  from?: string
  to?: string
}
