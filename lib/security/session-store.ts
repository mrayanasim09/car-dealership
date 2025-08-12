import NodeCache from 'node-cache'

export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>
  del(key: string): Promise<void>
  keys(prefix?: string): Promise<string[]>
}

class InMemoryStore implements KeyValueStore {
  private cache = new NodeCache()
  async get<T>(key: string): Promise<T | null> {
    const v = this.cache.get<T>(key)
    return (v as T) ?? null
  }
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const ttl = typeof ttlSeconds === 'number' ? ttlSeconds : 0
    this.cache.set(key, value as unknown as T, ttl)
  }
  async del(key: string): Promise<void> {
    this.cache.del(key)
  }
  async keys(prefix = ''): Promise<string[]> {
    return this.cache.keys().filter(k => k.startsWith(prefix))
  }
}

class UpstashRestStore implements KeyValueStore {
  private readonly baseUrl: string
  private readonly token: string
  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.token = token
  }

  private async call<T = unknown>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${this.token}` },
      cache: 'no-store',
      ...init,
    })
    const data = (await res.json().catch(() => ({} as unknown))) as T
    return data as T
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.call<{ result?: string }>(`/GET/${encodeURIComponent(key)}`)
    if (typeof data?.result !== 'string') return null
    try {
      return JSON.parse(data.result) as T
    } catch {
      return null
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const payload = encodeURIComponent(JSON.stringify(value))
    const ex = ttlSeconds && ttlSeconds > 0 ? `?EX=${ttlSeconds}` : ''
    await this.call(`/SET/${encodeURIComponent(key)}/${payload}${ex}`)
  }

  async del(key: string): Promise<void> {
    await this.call(`/DEL/${encodeURIComponent(key)}`)
  }

  async keys(prefix = ''): Promise<string[]> {
    // Use SCAN with MATCH prefix*
    const match = encodeURIComponent(`${prefix}*`)
    const data = await this.call<{ result?: [string, string[]] }>(`/SCAN/0?MATCH=${match}&COUNT=1000`)
    const arr = Array.isArray(data?.result) ? (data.result as [string, string[]])[1] : []
    return arr
  }
}

export async function createStore(): Promise<KeyValueStore> {
  const useRedis = process.env.USE_REDIS === '1'
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (useRedis && upstashUrl && upstashToken) {
    return new UpstashRestStore(upstashUrl, upstashToken)
  }
  return new InMemoryStore()
}

