import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { TextField } from './TextField'

it('connects its accessible label and error message to the input', () => {
  render(
    <TextField
      label="Nomor identitas"
      hint="Masukkan nomor"
      error="Nomor belum diisi"
    />,
  )
  const input = screen.getByRole('textbox', { name: 'Nomor identitas' })
  expect(input).toHaveAccessibleDescription('Nomor belum diisi')
  expect(input).toBeInvalid()
  expect(screen.queryByText('Masukkan nomor')).not.toBeInTheDocument()
})
