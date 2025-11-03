type Props = {
  totalCount: number
  limit: number
  currentPage: number
  basePath: string
  query?: Record<string, string>
}

export const Pagination = ({ totalCount, limit, currentPage = 1, basePath, query = {} }: Props) => {
  const getPath = (p: number) => {
    const params = new URLSearchParams(query)
    if (p > 1) {
      params.set('page', String(p))
    } else {
      params.delete('page')
    }
    const queryString = params.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }

  const getPaginationItem = (p: number) => {
    if (p === currentPage) {
      return (
        <span class="flex justify-center items-center w-full h-full bg-blue-600 text-white rounded-lg font-semibold">
          {p}
        </span>
      )
    }
    return (
      <a
        class="flex justify-center items-center w-full h-full bg-white text-gray-700 rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition-all font-medium"
        href={getPath(p)}
      >
        {p}
      </a>
    )
  }

  const pager: number[] = []
  const numPages = Math.ceil(totalCount / limit)
  for (let i = 1; i < numPages + 1; i++) {
    if (i < currentPage - 2) continue
    if (i > currentPage + 2) continue
    pager.push(i)
  }

  return (
    <nav class="mt-8 mb-4">
      <ul class="flex flex-wrap justify-center items-center gap-2">
        {currentPage >= 2 && (
          <li class="list-none w-20 h-10">
            <a
              class="flex justify-center items-center w-full h-full bg-white text-gray-700 rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition-all font-medium"
              href={getPath(currentPage - 1)}
            >
              ← 前へ
            </a>
          </li>
        )}
        {currentPage >= 4 && <li class="list-none w-10 h-10">{getPaginationItem(1)}</li>}
        {currentPage >= 5 && <span class="text-gray-400 mx-1">...</span>}

        {pager.map((number) => (
          <li class="list-none w-10 h-10" key={number}>
            {getPaginationItem(number)}
          </li>
        ))}
        {currentPage <= numPages - 4 && <span class="text-gray-400 mx-1">...</span>}
        {currentPage <= numPages - 3 && (
          <li class="list-none w-10 h-10">{getPaginationItem(numPages)}</li>
        )}
        {currentPage < numPages && (
          <li class="list-none w-20 h-10">
            <a
              class="flex justify-center items-center w-full h-full bg-white text-gray-700 rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition-all font-medium"
              href={getPath(currentPage + 1)}
            >
              次へ →
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
