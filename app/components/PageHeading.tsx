import type { FC, ReactNode } from 'hono/jsx'
import type { BaseProps } from '../types/common'

type Props = BaseProps & {
  children: ReactNode
}

export const PageHeading: FC<Props> = ({ className, children }) => {
  return <h2 class={`text-xl font-bold ${className || ''}`}>{children}</h2>
}
