const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/odds-of-glory'

/** Prefix an app route with the configured basePath (for window.location, external links). */
export function withBasePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (basePath === '' || basePath === '/') return normalized
  return `${basePath.replace(/\/$/, '')}${normalized}`
}

export { basePath }
