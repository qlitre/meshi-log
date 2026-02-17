import type { PopularPage } from '../libs/pageview'

type Props = {
  article: PopularPage
  rank: number
}

export const PopularArticleCard = ({ article, rank }: Props) => {
  return (
    <a
      href={article.page_path}
      class="flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <span class="flex-shrink-0 w-8 text-center text-lg font-bold text-gray-400">
        {rank}
      </span>
      <div class="flex-1 min-w-0">
        <h2 class="text-base font-semibold text-gray-800 truncate">
          {article.shop_name}
          {article.title && <span class="text-gray-500 font-normal"> - {article.title}</span>}
        </h2>
      </div>
      <span class="flex-shrink-0 text-sm text-gray-400">{article.total_count} views</span>
    </a>
  )
}
