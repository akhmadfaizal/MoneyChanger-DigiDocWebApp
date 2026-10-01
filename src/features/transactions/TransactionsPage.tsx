import { useState } from 'react'
import { Check, Clock3, X, Download, Pause } from 'lucide-react'
import { getOffer } from '@/features/cashier/data'
import type { UiState, Session } from '@/features/cashier/model'
import { sessionStatus } from '@/features/cashier/model'
import { Receipt } from '@/features/cashier/Receipt'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { TextField } from '@/components/ui/TextField'
import { SelectField } from '@/components/ui/SelectField'
import { StatCard } from '@/components/ui/StatCard'
import { PreviewState, type ViewState } from '@/components/ui/PreviewState'
import { downloadCsv } from '@/utils/csv'

export function TransactionsPage({
  state,
  view,
  onRetry,
  onCloseDesk,
}: {
  state: UiState
  view: ViewState
  onRetry: () => void
  onCloseDesk: () => void
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [receipt, setReceipt] = useState<Session | null>(null)
  const sessions = state.sessions.filter((s) => s.stage !== 'identity')
  const rows = sessions.filter(
    (s) =>
      `${s.id} ${s.customer.name}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === 'all' ||
        (filter === 'done' && s.stage === 'done') ||
        (filter === 'cancelled' && s.stage === 'cancelled') ||
        (filter === 'active' && s.stage !== 'done' && s.stage !== 'cancelled')),
  )
  function exportRows() {
    downloadCsv('digidoc-transaksi-demo.csv', [
      [
        'Nomor',
        'Pelanggan',
        'Mata uang',
        'Jumlah',
        'Total IDR',
        'Jalur',
        'Status',
      ],
      ...rows.map((s) => {
        const offer = getOffer(s.offerId)
        return [
          s.id,
          s.customer.name,
          offer.currency,
          offer.amount,
          offer.total,
          s.channel,
          sessionStatus(s),
        ]
      }),
    ])
  }
  return (
    <>
      <div className="stats-grid three">
        <StatCard
          icon={<Check size={20} />}
          label="Selesai"
          value={sessions.filter((s) => s.stage === 'done').length}
          note="hari ini · data contoh"
        />
        <StatCard
          icon={<Clock3 size={20} />}
          label="Dalam proses"
          value={
            sessions.filter(
              (s) => s.stage !== 'done' && s.stage !== 'cancelled',
            ).length
          }
          note="sesi aktif"
        />
        <StatCard
          icon={<X size={20} />}
          label="Dibatalkan"
          value={sessions.filter((s) => s.stage === 'cancelled').length}
          note="sesi tidak dilanjutkan"
        />
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Riwayat transaksi</h2>
            <p>01 Oktober 2026 · Meja 2</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            disabled={rows.length === 0 || view !== 'normal'}
            onClick={exportRows}
          >
            <Download size={16} />
            Ekspor CSV
          </Button>
        </div>
        <div className="filter-bar">
          <TextField
            label="Cari transaksi"
            placeholder="Nama atau nomor sesi"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <SelectField
            label="Status transaksi"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">Semua status</option>
            <option value="done">Selesai</option>
            <option value="active">Dalam proses</option>
            <option value="cancelled">Dibatalkan</option>
          </SelectField>
        </div>
        {view !== 'normal' ? (
          <PreviewState state={view} onRetry={onRetry} />
        ) : rows.length === 0 ? (
          <PreviewState
            state="empty"
            message="Tidak ada transaksi sesuai filter."
            onRetry={() => {
              setSearch('')
              setFilter('all')
            }}
          />
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Pelanggan</th>
                  <th>Transaksi</th>
                  <th>Total</th>
                  <th>Jalur</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const offer = getOffer(s.offerId)
                  return (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.id}</strong>
                      </td>
                      <td>{s.customer.name}</td>
                      <td>
                        {offer.side === 'buy' ? 'Beli' : 'Jual'}{' '}
                        {offer.currency} {offer.amount}
                      </td>
                      <td className="tabular-nums">Rp{offer.total}</td>
                      <td>
                        <Badge>{s.channel === 'qr' ? 'QR' : 'Walk-in'}</Badge>
                      </td>
                      <td>
                        <Badge
                          tone={
                            s.stage === 'done'
                              ? 'success'
                              : s.stage === 'cancelled'
                                ? 'danger'
                                : 'warning'
                          }
                        >
                          {sessionStatus(s)}
                        </Badge>
                      </td>
                      <td>
                        {s.stage === 'done' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            aria-label={`Invoice ${s.id}`}
                            onClick={() => setReceipt(s)}
                          >
                            Invoice
                          </Button>
                        ) : (
                          <span className="subtle">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="page-actions right">
        <Button disabled={!state.deskOpen} onClick={onCloseDesk}>
          <Pause size={16} />
          Tutup meja
        </Button>
      </div>
      <Receipt
        session={receipt}
        open={receipt !== null}
        onClose={() => setReceipt(null)}
      />
    </>
  )
}
