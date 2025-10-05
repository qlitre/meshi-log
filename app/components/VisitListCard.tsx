import { jstDatetime } from '../utils/jstDatetime'
import type { Visit } from '../types/microcms'

type Props = {
  visit: Visit
}

export const VisitListCard = ({ visit }: Props) => {
  return (
    <article class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <a href={`/visits/${visit.id}`}>
        <h2 class="text-xl font-bold mb-2 hover:text-blue-600">
          {visit.title} - {visit.shop.name}
        </h2>
      </a>

      <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <time>{jstDatetime(visit.visit_date, 'YYYY年M月D日')}</time>
        <a href={`/shops/${visit.shop.id}`} class="hover:text-blue-600">
          {visit.shop.name}
        </a>
        <span>{visit.shop.area.name}</span>
        <span>{visit.shop.genre.name}</span>
      </div>

      <div
        class="prose max-w-none line-clamp-3 [&_img]:hidden"
        dangerouslySetInnerHTML={{ __html: visit.memo }}
      />
    </article>
  )
}
