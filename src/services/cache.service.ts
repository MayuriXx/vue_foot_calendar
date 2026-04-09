/**
 * Service de cache localStorage pour limiter les appels API
 * Chaque clé a un TTL (Time To Live) configurable
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // en millisecondes
}

class CacheService {
  private readonly STORAGE_PREFIX = 'fc_cache_'

  /**
   * Récupère une valeur du cache si elle existe et n'a pas expiré
   */
  get<T>(key: string): T | null {
    try {
      const storageKey = `${this.STORAGE_PREFIX}${key}`
      const entry = localStorage.getItem(storageKey)

      if (!entry) {
        return null
      }

      const cached: CacheEntry<T> = JSON.parse(entry)
      const now = Date.now()
      const isExpired = now - cached.timestamp > cached.ttl

      if (isExpired) {
        // Supprime la clé expirée
        localStorage.removeItem(storageKey)
        return null
      }

      return cached.data
    } catch (error) {
      console.error(`Error retrieving cache for key ${key}:`, error)
      return null
    }
  }

  /**
   * Stocke une valeur dans le cache avec un TTL
   * @param key Clé du cache
   * @param data Données à mettre en cache
   * @param ttlMinutes Durée de vie en minutes (défaut: 60)
   */
  set<T>(key: string, data: T, ttlMinutes: number = 60): void {
    try {
      const storageKey = `${this.STORAGE_PREFIX}${key}`
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000, // Convertir en millisecondes
      }
      localStorage.setItem(storageKey, JSON.stringify(entry))
    } catch (error) {
      console.error(`Error setting cache for key ${key}:`, error)
    }
  }

  /**
   * Supprime une clé du cache
   */
  remove(key: string): void {
    try {
      const storageKey = `${this.STORAGE_PREFIX}${key}`
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error(`Error removing cache for key ${key}:`, error)
    }
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  /**
   * Obtient les stats du cache (pour debugging)
   */
  getStats(): { totalEntries: number; storageUsed: string } {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(this.STORAGE_PREFIX))
    let totalSize = 0

    keys.forEach((key) => {
      const item = localStorage.getItem(key)
      if (item) totalSize += item.length
    })

    return {
      totalEntries: keys.length,
      storageUsed: `${(totalSize / 1024).toFixed(2)} KB`,
    }
  }
}

export default new CacheService()
