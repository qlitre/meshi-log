import { raw } from 'hono/html'

type Props = {
  content: string
}

export const ArticleDetail = async ({ content }: Props) => {
  return <div class="article-content">{raw(content)}</div>
}
