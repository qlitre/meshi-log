import type { FC, ReactNode } from 'hono/jsx'

type BadgeColor = 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'

type Props = {
  children: ReactNode
  color?: BadgeColor
}

const colorClasses: Record<BadgeColor, string> = {
  gray: 'bg-gray-50 text-gray-600 inset-ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:inset-ring-gray-400/20',
  red: 'bg-red-50 text-red-700 inset-ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:inset-ring-red-400/20',
  yellow:
    'bg-yellow-50 text-yellow-800 inset-ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:inset-ring-yellow-400/20',
  green:
    'bg-green-50 text-green-700 inset-ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:inset-ring-green-500/20',
  blue: 'bg-blue-50 text-blue-700 inset-ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:inset-ring-blue-400/30',
  indigo:
    'bg-indigo-50 text-indigo-700 inset-ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:inset-ring-indigo-400/30',
  purple:
    'bg-purple-50 text-purple-700 inset-ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:inset-ring-purple-400/30',
  pink: 'bg-pink-50 text-pink-700 inset-ring-pink-700/10 dark:bg-pink-400/10 dark:text-pink-400 dark:inset-ring-pink-400/20',
}

export const Badge = ({ children, color = 'gray' }: Props) => {
  return (
    <span
      class={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium inset-ring ${colorClasses[color]}`}
    >
      {children}
    </span>
  )
}
