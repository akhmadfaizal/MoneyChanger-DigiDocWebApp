import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function BrokenView(): never {
  throw new Error('Render failure')
}

it('shows a recovery action when a child fails to render', () => {
  const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {})
  try {
    render(
      <ErrorBoundary>
        <BrokenView />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Tampilan tidak dapat dimuat',
    )
    expect(
      screen.getByRole('button', { name: 'Muat ulang' }),
    ).toBeInTheDocument()
  } finally {
    errorLog.mockRestore()
  }
})
