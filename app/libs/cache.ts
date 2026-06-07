import type { MiddlewareHandler } from 'hono'

// キャッシュTTL（秒）: 10分
const CACHE_MAX_AGE = 600

// `caches.default` は Cloudflare Workers 拡張。DOM lib の CacheStorage 型と
// 衝突して `default` が見えないため、必要なメソッドのみを明示して参照する。
type EdgeCache = {
  match(request: Request): Promise<Response | undefined>
  put(request: Request, response: Response): Promise<void>
}
const getEdgeCache = (): EdgeCache => (caches as unknown as { default: EdgeCache }).default

/**
 * 公開GETページをエッジ共有キャッシュ（caches.default）の対象にするか判定する。
 * 対象: /, /shops, /shops/*, /visits/*（draft除く）, /sitemap, /feed.atom
 */
export const isCacheable = (path: string): boolean => {
  if (path === '/' || path === '/shops' || path === '/sitemap' || path === '/feed.atom') {
    return true
  }
  if (path === '/visits/draft') return false
  if (path.startsWith('/visits/')) return true
  if (path.startsWith('/shops/')) return true
  return false
}

/**
 * Cloudflare Cache API による公開ページのレスポンスキャッシュ（TTL方式）。
 * ヒット時は microCMS を一切呼ばずキャッシュHTMLを返す。
 * ミス時はハンドラ結果を保存（status 200 かつ Set-Cookie を持たない場合のみ）。
 */
export const responseCache: MiddlewareHandler = async (c, next) => {
  // dev等で Cache API / executionCtx が無い環境は素通り
  if (typeof caches === 'undefined' || !c.executionCtx) {
    return next()
  }
  if (c.req.method !== 'GET' || !isCacheable(c.req.path)) {
    return next()
  }

  const cache = getEdgeCache()
  const key = c.req.raw

  const hit = await cache.match(key)
  if (hit) {
    // キャッシュ済みResponseはimmutableなので複製してデバッグヘッダを付与
    const res = new Response(hit.body, hit)
    res.headers.set('X-Edge-Cache', 'HIT')
    return res
  }

  await next()

  const res = c.res
  if (!res || res.status !== 200) return
  if (res.headers.has('Set-Cookie')) return

  // 保存用クローンに Cache-Control を付与（X-Edge-Cacheは保存しない）
  const toCache = res.clone()
  toCache.headers.set('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`)
  // クライアント/エッジ双方が同じTTLでキャッシュできるよう元レスポンスにも付与
  c.res.headers.set('Cache-Control', `public, max-age=${CACHE_MAX_AGE}`)
  c.res.headers.set('X-Edge-Cache', 'MISS')

  c.executionCtx.waitUntil(
    (async () => {
      try {
        await cache.put(key, toCache)
      } catch {
        // Set-Cookie等で put が throw しても無視
      }
    })()
  )
}
