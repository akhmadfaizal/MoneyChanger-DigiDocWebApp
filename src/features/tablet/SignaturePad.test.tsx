import { StrictMode } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { SignaturePad } from './SignaturePad'

afterEach(() => vi.unstubAllGlobals())

it('captures pointer strokes safely across React updates and clears the signature', () => {
  vi.stubGlobal('PointerEvent', MouseEvent)
  const onSign = vi.fn()
  render(
    <StrictMode>
      <SignaturePad onSign={onSign} english={false} />
    </StrictMode>,
  )
  const pad = screen.getByRole('img', { name: 'Area tanda tangan' })
  Object.defineProperty(pad, 'setPointerCapture', { value: vi.fn() })
  vi.spyOn(pad, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 800,
    bottom: 220,
    width: 800,
    height: 220,
    toJSON: () => ({}),
  })
  const submit = screen.getByRole('button', { name: 'Setuju & tanda tangan' })
  expect(submit).toBeDisabled()
  fireEvent.pointerDown(pad, { button: 0, clientX: 100, clientY: 100 })
  expect(submit).toBeDisabled()
  fireEvent.pointerMove(pad, { clientX: 200, clientY: 120 })
  fireEvent.pointerUp(pad)
  expect(pad.querySelector('path')).toHaveAttribute(
    'd',
    'M100.0 100.0 L200.0 120.0',
  )
  fireEvent.click(submit)
  expect(onSign).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByRole('button', { name: 'Ulangi' }))
  expect(submit).toBeDisabled()
  expect(pad.querySelector('path')).toBeNull()
})
