const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/odds-of-glory'

/** Prefix an app route with the configured basePath (for window.location, external links). */
export function withBasePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (basePath === '' || basePath === '/') return normalized
  return `${basePath.replace(/\/$/, '')}${normalized}`
}

/** Auth callback URL for OAuth and email confirmation (client-only — requires window). */
export function authCallbackUrl(): string {
  return `${window.location.origin}${withBasePath('/auth/callback/')}`
}

export function characterEditPath(id: string) {
  return `/characters/edit/?id=${encodeURIComponent(id)}`
}

export function roomPlayerPath(code: string) {
  return `/room/player/?code=${encodeURIComponent(code)}`
}

export function roomMasterPath(code: string) {
  return `/room/master/?code=${encodeURIComponent(code)}`
}

export { basePath }
