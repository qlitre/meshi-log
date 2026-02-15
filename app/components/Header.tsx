export function Header() {
  return (
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 shrink-0">
            <a href="/" class="hover:text-gray-700">
              飯ログ
            </a>
          </h1>
          <nav>
            <ul class="flex gap-2 sm:gap-6 text-sm sm:text-base">
              <li>
                <a href="/" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                  訪問記録
                </a>
              </li>
              <li>
                <a href="/shops" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                  店舗一覧
                </a>
              </li>
              <li>
                <a href="/popular" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                  人気記事
                </a>
              </li>
              <li>
                <a href="/about" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
