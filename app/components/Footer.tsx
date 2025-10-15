export const Footer = () => {
  return (
    <footer class="bg-gray-800 text-white mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-center md:text-left">
            <h2 class="text-xl font-bold mb-2">飯ログ</h2>
            <p class="text-gray-400 text-sm">訪問した飲食店の記録を管理するアプリケーション</p>
          </div>
          <nav>
            <ul class="flex flex-col md:flex-row gap-4 text-center">
              <li>
                <a href="/" class="text-gray-300 hover:text-white transition-colors">
                  訪問記録
                </a>
              </li>
              <li>
                <a href="/shops" class="text-gray-300 hover:text-white transition-colors">
                  店舗一覧
                </a>
              </li>
              <li>
                <a href="/about" class="text-gray-300 hover:text-white transition-colors">
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} 飯ログ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
