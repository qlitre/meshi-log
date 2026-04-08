import { useState } from 'hono/jsx'

const menuItems = [
  { href: '/', label: '訪問記録' },
  { href: '/shops', label: '店舗一覧' },
  { href: '/popular', label: '人気記事' },
  { href: '/about', label: 'About' },
  { href: '/feed.atom', label: 'Feed' },
]

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div class="md:hidden">
      {/* FAB hamburger button - fixed bottom right */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 active:bg-orange-700 focus:outline-none flex items-center justify-center"
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {isOpen && <div class="fixed inset-0 z-40 bg-black/20" onClick={() => setIsOpen(false)} />}
      {isOpen && (
        <nav class="fixed inset-0 z-45 flex items-center justify-center bg-white/95">
          <ul class="flex flex-col items-center gap-2">
            {menuItems.map((item) => (
              <li>
                <a
                  href={item.href}
                  class="block text-center text-xl py-4 px-8 text-gray-700 hover:text-gray-900 active:bg-gray-100 rounded-lg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
