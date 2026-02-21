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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="relative z-50 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="メニューを開く"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          // Close icon (X)
          <svg class="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Hamburger icon
          <svg class="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {isOpen && <div class="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
      {isOpen && (
        <nav class="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50">
          <ul class="py-2">
            {menuItems.map((item) => (
              <li>
                <a
                  href={item.href}
                  class="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
