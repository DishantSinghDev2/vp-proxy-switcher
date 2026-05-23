export interface IPInfo {
  country: string
  countryCode: string
  city: string
  flag: string
}

export interface CurrentIP {
  ip: string
  flag: string
  country: string
  city: string
}

/** Fetch country/city/flag for a given proxy host IP via ipwho.is (free, no key) */
export async function fetchIPInfo(host: string): Promise<IPInfo | null> {
  try {
    const res = await fetch(`https://ipwho.is/${host}`, {
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })
    const d = await res.json()
    if (!d.success) return null
    return {
      country: d.country || 'Unknown',
      countryCode: d.country_code || 'XX',
      city: d.city || '',
      flag: d.flag?.emoji || codeToFlag(d.country_code),
    }
  } catch {
    return null
  }
}

/** Fetch the current external IP (what sites see) — call after proxy is activated */
export async function fetchCurrentIP(): Promise<CurrentIP | null> {
  try {
    const res = await fetch('https://ipwho.is/', {
      signal: AbortSignal.timeout(6000),
      cache: 'no-store',
    })
    const d = await res.json()
    if (!d.success) return null
    return {
      ip: d.ip || '',
      flag: d.flag?.emoji || codeToFlag(d.country_code),
      country: d.country || '',
      city: d.city || '',
    }
  } catch {
    return null
  }
}

/** Measure latency through the currently active proxy by timing a fetch to 1.1.1.1 */
export async function measureLatency(): Promise<number | null> {
  const start = Date.now()
  try {
    await fetch('https://1.1.1.1/cdn-cgi/trace', {
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    return Date.now() - start
  } catch {
    return null
  }
}

function codeToFlag(code?: string): string {
  if (!code || code.length !== 2) return '🌐'
  return [...code.toUpperCase()]
    .map(c => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('')
}
