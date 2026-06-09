/**
 * Resolve a static asset path with the correct basePath prefix.
 *
 * In local dev, NEXT_PUBLIC_BASE_PATH is empty → /images/...
 * On GitHub Pages, NEXT_PUBLIC_BASE_PATH is /abyssos → /abyssos/images/...
 */
export function assetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
}
