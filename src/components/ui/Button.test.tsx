import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { Button } from './Button'

it('activates by keyboard and does not submit its enclosing form by default', async () => {
  const onClick = vi.fn()
  const onSubmit = vi.fn((event) => event.preventDefault())
  render(
    <form onSubmit={onSubmit}>
      <Button onClick={onClick}>Lanjut</Button>
    </form>,
  )
  const user = userEvent.setup()
  await user.tab()
  await user.keyboard('{Enter}')
  expect(onClick).toHaveBeenCalledOnce()
  expect(onSubmit).not.toHaveBeenCalled()
})

it('prevents interaction when disabled', async () => {
  const onClick = vi.fn()
  render(
    <Button disabled onClick={onClick}>
      Lanjut
    </Button>,
  )
  await userEvent.click(screen.getByRole('button', { name: 'Lanjut' }))
  expect(onClick).not.toHaveBeenCalled()
})
