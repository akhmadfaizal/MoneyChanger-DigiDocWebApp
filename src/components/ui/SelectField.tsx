import { useId, type SelectHTMLAttributes, type ReactNode } from 'react'

export function SelectField({
  label,
  children,
  id,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  children: ReactNode
}) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  return (
    <div className="field">
      <label htmlFor={selectId}>{label}</label>
      <select id={selectId} className="input" {...props}>
        {children}
      </select>
    </div>
  )
}
