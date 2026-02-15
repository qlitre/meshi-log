import type { PopularPage } from '../libs/pageview'

type Props = {
  article: PopularPage
  rank: number
}

export const PopularArticleCard = ({ article, rank }: Props) => {
  return (
    <article class="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
      <a href={article.page_path} class="flex flex-col md:flex-row gap-4 md:gap-6">
        <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-800 text-white font-bold rounded-full text-lg">
          {rank}
        </div>
        {article.thumbnail_url && (
          <div class="flex-shrink-0 w-full md:w-48">
            <img
              src={article.thumbnail_url}
              alt={article.title}
              class="w-full aspect-[4/3] object-cover rounded-lg"
            />
          </div>
        )}
        <div class="flex-1 min-w-0">
          <h2 class="text-lg md:text-xl font-bold mb-2 hover:text-blue-600">
            {article.title} - {article.shop_name}
          </h2>
          <p class="text-sm text-gray-500">{article.total_count} views</p>
        </div>
      </a>
    </article>
  )
}
