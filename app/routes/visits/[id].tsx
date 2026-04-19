import { createRoute } from 'honox/factory'
import {
  getMicroCMSClient,
  getVisitDetail,
  getPrevVisits,
  getNextVisits,
} from '../../libs/microcms'
import { recordPageView } from '../../libs/pageview'
import { getCommentsByVisitId, createComment } from '../../libs/comment'
import { verifyTurnstile } from '../../libs/turnstile'
import { notifyNewComment } from '../../libs/notification'
import type { Meta } from '../../types/meta'
import { jstDatetime } from '../../utils/jstDatetime'
import { stripHtmlTagsAndTruncate } from '../../utils/stripHtmlTags'
import { ArticleDetail } from '../../components/ArticleDetail'
import { ShareX } from '../../components/ShareX'
import { Container } from '../../components/Container'
import { LinkToTop } from '../../components/LinkToTop'
import { ShopInformation } from '../../components/ShopInformation'
import { AdjacentPosts } from '../../components/AdjacentPosts'
import { CommentList } from '../../components/CommentList'
import { getShopGenreString } from '../../utils/getShopGenreString'
import CommentForm from '../../islands/CommentForm'
import { Alert } from '../../islands/Alert'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

const authorCookieKey = 'meshi-log-author'
const successAlertCookieKey = 'success-alert-cookie-key'

// POST: コメント投稿
export const POST = createRoute(async (c) => {
  const id = c.req.param('id') || ''
  const formData = await c.req.formData()
  const author = ((formData.get('author') as string) || '').trim()
  const content = ((formData.get('content') as string) || '').trim()
  const turnstileToken = (formData.get('cf-turnstile-response') as string) || ''

  // Turnstile検証
  const isValid = await verifyTurnstile(turnstileToken, c.env.TURNSTILE_SECRET_KEY)
  if (!isValid) {
    return c.redirect(`/visits/${id}?error=turnstile`, 303)
  }

  // バリデーション
  if (!author || !content || author.length > 50 || content.length > 1000) {
    return c.redirect(`/visits/${id}?error=validation`, 303)
  }

  await createComment(c.env.DB, { visitId: id, author, content })

  // メール通知（レスポンスをブロックしない）
  c.executionCtx.waitUntil(
    notifyNewComment({
      email: c.env.EMAIL,
      notificationEmail: c.env.NOTIFICATION_EMAIL,
      visitId: id,
      author,
      content,
    })
  )
  // author名をブラウザに保存
  setCookie(c, authorCookieKey, author, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1年
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  })
  setCookie(c, successAlertCookieKey, 'コメントの追加に成功しました', {
    path: '/',
    maxAge: 10,
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  })
  return c.redirect(`/visits/${id}`, 303)
})

// GET: 訪問詳細表示
export default createRoute(async (c) => {
  const id = c.req.param('id') || ''
  const client = getMicroCMSClient(c)
  const visit = await getVisitDetail({ client, contentId: id, queries: { depth: 2 } })

  const description = stripHtmlTagsAndTruncate(visit.memo, 100)
  const publishedAt = visit.publishedAt || ''
  const [nextVisits, prevVisits, comments] = await Promise.all([
    getNextVisits({ client, publishedAt }),
    getPrevVisits({ client, publishedAt }),
    getCommentsByVisitId(c.env.DB, id),
  ])
  const url = new URL(c.req.url)
  const canonicalUrl = `${url.protocol}//${url.host}/visits/${id}`
  // 前回の名前を取得
  const author = getCookie(c, authorCookieKey) || ''
  const successMessage = getCookie(c, successAlertCookieKey)
  if (successMessage) deleteCookie(c, successAlertCookieKey, { path: '/' })

  // エラーメッセージ
  const errorParam = c.req.query('error')
  let errorMessage = ''
  if (errorParam === 'turnstile') {
    errorMessage = '認証に失敗しました。もう一度お試しください。'
  } else if (errorParam === 'validation') {
    errorMessage = '名前とコメントを正しく入力してください。'
  }

  // ページビュー記録（レスポンスをブロックしない）
  c.executionCtx.waitUntil(
    recordPageView({
      db: c.env.DB,
      pagePath: `/visits/${id}`,
      contentId: id,
      pageType: 'visit',
      visit,
    })
  )

  const meta: Meta = {
    title: `${visit.title} - ${visit.shop.name} - 飯ログ`,
    description: description,
    keywords: visit.shop.name,
    canonicalUrl: canonicalUrl,
    ogpType: 'article' as const,
    ogpImage: visit.thumbnail?.url,
    ogpUrl: canonicalUrl,
  }

  return c.render(
    <Container>
      {successMessage && <Alert message={successMessage} type="success" />}
      {/* 記事ヘッダー */}
      <article class="article-detail mb-8">
        <h1 class="text-2xl font-bold mb-4">
          {visit.title} - {visit.shop.name}
        </h1>
        <div class="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
          <time>{jstDatetime(visit.visit_date, 'YYYY年M月D日')}</time>
          <span>{visit.shop.area.name}</span>
          <span>{getShopGenreString(visit.shop.genre)}</span>
        </div>

        {/* 本文 */}
        <ArticleDetail content={visit.memo} />

        {/* シェアボタン */}
        <div class="mt-8 pt-6 border-t">
          <ShareX url={canonicalUrl} title={`${visit.title} - ${visit.shop.name}`} />
        </div>
      </article>

      {/* 店舗情報 */}
      <ShopInformation shop={visit.shop} />

      {/* コメント */}
      <CommentList comments={comments} />
      <CommentForm
        author={author}
        visitId={id}
        siteKey={c.env.TURNSTILE_SITE_KEY}
        error={errorMessage}
      />

      <AdjacentPosts nextVisits={nextVisits.contents} prevVisits={prevVisits.contents} />
      {/* 戻るリンク */}
      <LinkToTop />
    </Container>,
    { meta }
  )
})
