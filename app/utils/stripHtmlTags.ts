/**
 * HTMLタグを除去してプレーンテキストを抽出する（内部関数）
 * @param html - HTML文字列
 * @returns HTMLタグを除去したテキスト
 */
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * HTMLタグを除去して指定した長さでテキストを切り詰める
 * @param html - HTML文字列
 * @param maxLength - 最大文字数
 * @returns HTMLタグを除去して切り詰めたテキスト（切り詰めた場合は末尾に...を追加）
 */
export const stripHtmlTagsAndTruncate = (html: string, maxLength: number): string => {
  const plainText = stripHtmlTags(html)
  if (plainText.length <= maxLength) {
    return plainText
  }
  return plainText.slice(0, maxLength) + '...'
}
