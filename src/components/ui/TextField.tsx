import { useId, type InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}

export function TextField({
  label,
  hint,
  error,
  id,
  className = '',
  'aria-describedby': describedBy,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const message = error || hint
  const descriptionId = message ? `${inputId}-description` : undefined
  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <input
        {...props}
        id={inputId}
        className={`input ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [describedBy, descriptionId].filter(Boolean).join(' ') || undefined
        }
      />
      {message && (
        <p id={descriptionId} className={error ? 'field-error' : 'field-hint'}>
          {message}
        </p>
      )}
    </div>
  )
}
