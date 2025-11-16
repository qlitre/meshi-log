import type { Visit } from '../types/microcms'

type Props = {
  nextVisits: Visit[]
  prevVisits: Visit[]
}

export const AdjacentPosts = async ({ nextVisits, prevVisits }: Props) => {
  const hasNext = nextVisits.length > 0
  const hasPrev = prevVisits.length > 0
  return (
    <nav class="my-8 flex flex-col md:flex-row md:justify-between items-stretch gap-4 border-t border-b py-4">
      <div class="flex-1 px-2">
        {hasNext ? (
          <a
            href={`/visits/${nextVisits[0].id}`}
            class="text-blue-600 hover:text-blue-800 hover:underline"
          >
            <div class="text-sm text-gray-500">← 次の記事</div>
            <div class="font-medium">{nextVisits[0].title}</div>
          </a>
        ) : (
          <div class="text-gray-400">
            <div class="text-sm">← 次の記事</div>
            <div class="font-medium">なし</div>
          </div>
        )}
      </div>
      <div class="flex-1 px-2 md:text-right">
        {hasPrev ? (
          <a
            href={`/visits/${prevVisits[0].id}`}
            class="text-blue-600 hover:text-blue-800 hover:underline"
          >
            <div class="text-sm text-gray-500">前の記事 →</div>
            <div class="font-medium">{prevVisits[0].title}</div>
          </a>
        ) : (
          <div class="text-gray-400">
            <div class="text-sm">前の記事 →</div>
            <div class="font-medium">なし</div>
          </div>
        )}
      </div>
    </nav>
  )
}
