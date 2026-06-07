import type { FC } from 'hono/jsx'
import { useEffect } from 'hono/jsx'

type Props = {
  id: string
}

/**
 * ページ表示時に一度だけ /api/pageview へPVビーコンを送る。
 * 共有エッジキャッシュ済みのHTMLでもブラウザ側でJSが動くため、
 * キャッシュと独立してPVを計測できる。
 */
export const PageViewBeacon: FC<Props> = ({ id }) => {
  useEffect(() => {
    fetch('/api/pageview', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id }),
      keepalive: true,
    }).catch(() => {
      // 計測失敗はUXに影響させない
    })
  }, [])

  return null
}
