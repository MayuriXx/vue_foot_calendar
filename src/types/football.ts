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

// Match Statistics
export interface MatchStatistics {
  team: {
    id: number
    name: string
    logo: string
  }
  statistics: Array<{
    type: string
    value: string | number
  }>
}

// Match Event
export interface MatchEvent {
  type: 'Goal' | 'Card' | 'subst' | 'Var'
  detail: string
  comments: string | null
  time: {
    elapsed: number | null
    extra: number | null
  }
  team: {
    id: number
    name: string
    logo: string
  }
  player: {
    id: number
    name: string
  }
  assist?: {
    id: number
    name: string
  }
}

// Match Lineups (Formations)
export interface MatchLineup {
  team: {
    id: number
    name: string
    logo: string
    formation: string
  }
  coach: {
    id: number
    name: string
  }
  startXI: Array<{
    player: {
      id: number
      name: string
      number: number
      pos: string
    }
  }>
  substitutes: Array<{
    player: {
      id: number
      name: string
      number: number
      pos: string
    }
  }>
}

// Complete Match Details
export interface MatchDetails {
  fixture: Match['fixture']
  league: Match['league']
  teams: Match['teams']
  goals: Match['goals']
  score: Match['score']
  statistics: MatchStatistics[]
  events: MatchEvent[]
  lineups: MatchLineup[]
}

// Standings/Classement
export interface Standing {
  rank: number
  team: {
    id: number
    name: string
    logo: string
  }
  points: number
  goalsDiff: number
  group: string | null
  form: string | null
  status: string
  description: string | null
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
  home: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
  away: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
  update: string
}

export interface StandingsResponse {
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string | null
    season: number
    standings: Standing[][]
  }
}
