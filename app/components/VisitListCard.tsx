import { jstDatetime } from '../utils/jstDatetime'
import type { Visit } from '../types/microcms'
import { stripHtmlTagsAndTruncate } from '../utils/stripHtmlTags'

type Props = {
  visit: Visit
}

export const VisitListCard = ({ visit }: Props) => {
  return (
    <article class="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
      <a href={`/visits/${visit.id}`} class="flex flex-col md:flex-row gap-4 md:gap-6">
        <div class="flex-shrink-0">
          <img
            src={visit.thumbnail.url}
            alt={visit.title}
            width={visit.thumbnail.width}
            height={visit.thumbnail.height}
            class="w-full md:w-48 h-48 md:h-32 object-cover rounded-lg"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg md:text-xl font-bold mb-2 hover:text-blue-600">
            {visit.title} - {visit.shop.name}
          </h2>

          <div class="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600 mb-3 md:mb-4">
            <time>{jstDatetime(visit.visit_date, 'YYYY年M月D日')}</time>
            <span>{visit.shop.area.name}</span>
            <span>{visit.shop.genre.name}</span>
          </div>

          <p class="line-clamp-3 text-sm md:text-base text-gray-700">
            {stripHtmlTagsAndTruncate(visit.memo, 200)}
          </p>
        </div>
      </a>
    </article>
  )
}
