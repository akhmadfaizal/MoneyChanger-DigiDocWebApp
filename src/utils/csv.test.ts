import { expect, it } from 'vitest'
import { toCsv } from './csv'
it('quotes commas, quotes and newlines while protecting spreadsheet formula cells', () => {
  const csv = toCsv([
    ['Nama', 'Catatan'],
    ['Contoh, satu', 'Dia berkata "ya"\nlalu lanjut'],
    ['=SUM(A1:A2)', '@formula'],
  ])
  expect(csv).toContain('"Contoh, satu","Dia berkata ""ya""\nlalu lanjut"')
  expect(csv).toContain('"\'=SUM(A1:A2)","\'@formula"')
  expect(csv.startsWith('\ufeff')).toBe(true)
})
