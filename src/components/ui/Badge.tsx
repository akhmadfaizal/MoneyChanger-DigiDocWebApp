import type { HTMLAttributes } from 'react'

export function Badge({
  tone = 'primary',
  className = '',
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: 'primary' | 'success' | 'warning' | 'danger'
}) {
  return <span className={`badge badge--${tone} ${className}`} {...props} />
}
