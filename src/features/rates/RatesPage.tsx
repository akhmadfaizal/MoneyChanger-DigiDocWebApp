import { useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import { rates } from '@/features/cashier/data'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { PreviewState, type ViewState } from '@/components/ui/PreviewState'
export function RatesPage({
  view,
  onRetry,
}: {
  view: ViewState
  onRetry: () => void
}) {
  const [search, setSearch] = useState('')
  const [updated, setUpdated] = useState(false)
  const rows = rates.filter((rate) =>
    `${rate.code} ${rate.name}`.toLowerCase().includes(search.toLowerCase()),
  )
  return (
    <>
      <div className="page-heading">
        <div>
          <h2>Kurs mata uang</h2>
          <p>
            Data contoh · {updated ? 'tampilan diperbarui' : 'pembaruan 07:42'}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setUpdated(true)
            onRetry()
          }}
        >
          <RefreshCw size={16} />
          Perbarui tampilan
        </Button>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <span className="subtle">
            Nilai rupiah per unit · JPY per 100 yen
          </span>
          <div className="search-field">
            <Search size={17} />
            <TextField
              label="Cari mata uang"
              placeholder="Kode atau nama mata uang"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        {view !== 'normal' ? (
          <PreviewState state={view} onRetry={onRetry} />
        ) : rows.length === 0 ? (
          <PreviewState
            state="empty"
            message="Mata uang tidak ditemukan."
            onRetry={() => setSearch('')}
          />
        ) : (
          <div className="table-scroll">
            <table className="data-table rates-table">
              <thead>
                <tr>
                  <th>Mata uang</th>
                  <th>Beli</th>
                  <th>Jual</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((rate) => (
                  <tr key={rate.code}>
                    <td>
                      <div className="currency-cell">
                        <span className="currency-symbol">{rate.symbol}</span>
                        <div>
                          <strong>{rate.code}</strong>
                          <span>{rate.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="tabular-nums">{rate.buy}</td>
                    <td className="tabular-nums">{rate.sell}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="page-note">
        Kurs tetap untuk preview UI, bukan kurs pasar atau penawaran transaksi.
      </p>
    </>
  )
}
