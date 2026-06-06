import { raw } from 'hono/html'
import { optimizeRichEditorImages } from '../utils/microcmsImageUrl'

type Props = {
  content: string
}

export const ArticleDetail = async ({ content }: Props) => {
  return <div class="article-content">{raw(optimizeRichEditorImages(content))}</div>
}
