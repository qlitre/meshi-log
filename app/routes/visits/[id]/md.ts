import { createRoute } from 'honox/factory'
import { getMicroCMSClient, getVisitDetail } from '../../../libs/microcms'
import { jstDatetime } from '../../../utils/jstDatetime'
import { getShopGenreString } from '../../../utils/getShopGenreString'

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
    .replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, '\n*$1*\n')
    .replace(/<\/?figure[^>]*>/gi, '\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<\/?[uo]l[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default createRoute(async (c) => {
  const id = c.req.param('id') || ''
  const client = getMicroCMSClient(c)
  const visit = await getVisitDetail({ client, contentId: id, queries: { depth: 2 } })

  const date = jstDatetime(visit.visit_date, 'YYYY年M月D日')
  const genre = getShopGenreString(visit.shop.genre)
  const memoMd = htmlToMarkdown(visit.memo)

  const lines: string[] = [
    `# ${visit.title} - ${visit.shop.name}`,
    '',
    `**日時**: ${date}`,
    `**エリア**: ${visit.shop.area.name}`,
    `**ジャンル**: ${genre}`,
    `**住所**: ${visit.shop.address}`,
  ]
  if (visit.shop.nearest_station) lines.push(`**最寄駅**: ${visit.shop.nearest_station}`)
  if (visit.shop.rating) lines.push(`**評価**: ${'★'.repeat(visit.shop.rating)}`)
  lines.push('', '---', '', memoMd)

  return c.text(lines.join('\n'), 200, { 'Content-Type': 'text/markdown; charset=utf-8' })
})
