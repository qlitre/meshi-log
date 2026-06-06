type ImageOptions = {
  w?: number
  h?: number
  fm?: 'webp' | 'jpg'
  q?: number
}

// microCMSの画像APIパラメータ（fm/w/h/q）を付与して配信サイズを縮小する
// 例: getMicrocmsImageUrl(url, { w: 400, fm: 'webp', q: 80 })
export const getMicrocmsImageUrl = (url: string, opts: ImageOptions = {}): string => {
  const u = new URL(url)
  if (opts.w) u.searchParams.set('w', String(opts.w))
  if (opts.h) u.searchParams.set('h', String(opts.h))
  if (opts.fm) u.searchParams.set('fm', opts.fm)
  if (opts.q) u.searchParams.set('q', String(opts.q))
  return u.toString()
}
