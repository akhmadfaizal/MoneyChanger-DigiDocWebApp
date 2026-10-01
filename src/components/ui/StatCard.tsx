import type { ReactNode } from 'react'
export function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode
  label: string
  value: ReactNode
  note: string
}) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div>
        <p>{label}</p>
        <strong className="tabular-nums">{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  )
}
