import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it } from 'vitest'
import { App } from './App'

beforeEach(() => {
  window.history.replaceState(null, '', '#/cashier')
})
it('completes a QR transfer preview after rejection, then shows the invoice in history', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Proses A-07' }))
  await user.click(screen.getByRole('button', { name: 'Lanjut ke nominal' }))
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Jumlah' }),
    'usd-7000',
  )
  await user.click(
    screen.getByRole('button', { name: 'Kirim ke HP pelanggan' }),
  )
  await user.click(screen.getByRole('button', { name: 'Tolak di HP' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Pelanggan menolak')
  await user.click(
    screen.getByRole('button', { name: 'Kirim ke HP pelanggan' }),
  )
  await user.click(screen.getByRole('button', { name: 'Setujui di HP' }))
  await user.click(screen.getByRole('button', { name: 'Transfer' }))
  for (const name of [
    'Mutasi transfer dicocokkan',
    'USD 7.000 diserahkan',
    'Bukti transaksi diserahkan',
  ])
    await user.click(screen.getByRole('checkbox', { name }))
  expect(screen.getByRole('button', { name: 'Tutup transaksi' })).toBeDisabled()
  await user.click(
    screen.getByRole('button', { name: 'Simulasikan dana masuk' }),
  )
  await user.click(screen.getByRole('button', { name: 'Tutup transaksi' }))
  expect(
    screen.getByRole('heading', { name: 'Transaksi selesai' }),
  ).toBeInTheDocument()
  await user.click(screen.getByRole('link', { name: 'Transaksi hari ini' }))
  await screen.findByRole('heading', { name: 'Riwayat transaksi' })
  const row = screen.getByRole('row', { name: /A-07 Rina Kartika Dewi/ })
  expect(within(row).getByText('Selesai')).toBeInTheDocument()
})

it('searches queue and restores data after no match', async () => {
  const user = userEvent.setup()
  render(<App />)
  const search = screen.getByRole('textbox', { name: 'Cari antrean' })
  await user.type(search, 'tidak ditemukan')
  expect(
    screen.getByText('Tidak ada antrean yang sesuai pencarian.'),
  ).toBeInTheDocument()
  await user.click(
    screen.getByRole('button', { name: 'Tampilkan data contoh' }),
  )
  expect(
    screen.getByRole('button', { name: 'Proses A-07' }),
  ).toBeInTheDocument()
})
