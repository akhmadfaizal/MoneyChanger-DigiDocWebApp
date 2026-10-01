import { useState, type Dispatch } from 'react'
import {
  Inbox,
  Clock3,
  Check,
  UserPlus,
  Search,
  Pause,
  ScanLine,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { QrPreview } from '@/components/ui/QrPreview'
import { TextField } from '@/components/ui/TextField'
import { Dialog } from '@/components/ui/Dialog'
import { PreviewState, type ViewState } from '@/components/ui/PreviewState'
import { getOffer } from './data'
import { sessionStatus, type UiState, type UiAction } from './model'

export function QueuePage({
  state,
  dispatch,
  view,
  onRetry,
  onCloseDesk,
}: {
  state: UiState
  dispatch: Dispatch<UiAction>
  view: ViewState
  onRetry: () => void
  onCloseDesk: () => void
}) {
  const [search, setSearch] = useState('')
  const [newOpen, setNewOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const rows = state.sessions.filter(
    (s) =>
      s.stage !== 'cancelled' &&
      `${s.id} ${s.customer.name}`.toLowerCase().includes(search.toLowerCase()),
  )
  const pending = state.sessions.filter((s) => s.stage === 'identity').length
  const waiting = state.sessions.filter(
    (s) => s.stage === 'waiting' || s.stage === 'signature',
  ).length
  const done = state.sessions.filter((s) => s.stage === 'done').length
  return (
    <>
      {!state.deskOpen && (
        <div className="alert-banner warning">
          <Pause size={18} />
          <div>
            <strong>Meja sedang ditutup</strong>
            <p>Buka kembali meja untuk memulai sesi baru.</p>
          </div>
          <Button size="sm" onClick={() => dispatch({ type: 'reopen-desk' })}>
            Buka meja
          </Button>
        </div>
      )}
      <div className="stats-grid">
        <StatCard
          icon={<Inbox size={20} />}
          label="Antrean"
          value={pending}
          note="menunggu diproses"
        />
        <StatCard
          icon={<Clock3 size={20} />}
          label="Menunggu pelanggan"
          value={waiting}
          note="konfirmasi diperlukan"
        />
        <StatCard
          icon={<Check size={20} />}
          label="Selesai hari ini"
          value={done}
          note="transaksi contoh"
        />
        <button
          className="qr-card"
          onClick={() => setQrOpen(true)}
          aria-label="Lihat QR Meja 2"
        >
          <QrPreview />
        </button>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Antrean pelanggan</h2>
            <p>Proses pelanggan dari app atau walk-in.</p>
          </div>
          <div className="search-field">
            <Search size={17} aria-hidden="true" />
            <TextField
              label="Cari antrean"
              placeholder="Nama atau nomor antrean"
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
            message="Tidak ada antrean yang sesuai pencarian."
            onRetry={() => setSearch('')}
          />
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Masuk</th>
                  <th>Pelanggan</th>
                  <th>Jalur</th>
                  <th>Nominal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.id}</strong>
                    </td>
                    <td className="subtle tabular-nums">{s.entered}</td>
                    <td>
                      {s.customer.name}
                      {s.customer.newCustomer && (
                        <small className="cell-subtitle">Pelanggan baru</small>
                      )}
                    </td>
                    <td>
                      <Badge tone={s.channel === 'qr' ? 'primary' : 'warning'}>
                        {s.channel === 'qr' ? 'App · QR' : 'Walk-in'}
                      </Badge>
                    </td>
                    <td>
                      {s.stage === 'identity'
                        ? '—'
                        : `${getOffer(s.offerId).side === 'buy' ? 'Beli' : 'Jual'} ${getOffer(s.offerId).currency} ${getOffer(s.offerId).amount}`}
                    </td>
                    <td>
                      <Badge
                        tone={
                          s.stage === 'done'
                            ? 'success'
                            : s.stage === 'identity'
                              ? 'warning'
                              : 'primary'
                        }
                      >
                        {sessionStatus(s)}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        aria-label={`${s.stage === 'done' ? 'Invoice' : s.stage === 'identity' ? 'Proses' : 'Lihat'} ${s.id}`}
                        variant={
                          s.stage === 'identity' ? 'primary' : 'secondary'
                        }
                        disabled={!state.deskOpen && s.stage !== 'done'}
                        onClick={() => dispatch({ type: 'open', id: s.id })}
                      >
                        {s.stage === 'done'
                          ? 'Invoice'
                          : s.stage === 'identity'
                            ? 'Proses'
                            : 'Lihat'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="page-actions">
        <Button disabled={!state.deskOpen} onClick={() => setNewOpen(true)}>
          <UserPlus size={17} aria-hidden="true" />
          Walk-in · KTP / paspor
        </Button>
        <Button
          variant="secondary"
          disabled={!state.deskOpen}
          onClick={onCloseDesk}
        >
          <Pause size={16} aria-hidden="true" />
          Tutup meja
        </Button>
      </div>
      <p className="page-note">
        Pelanggan tanpa app atau tanpa HP dapat dilayani melalui walk-in.
      </p>
      <Dialog
        title="Walk-in baru"
        open={newOpen}
        onClose={() => setNewOpen(false)}
      >
        <p className="dialog-copy">
          Pilih identitas pelanggan untuk memulai sesi contoh.
        </p>
        <div className="customer-type-grid">
          <button
            className="choice-card"
            onClick={() => {
              dispatch({ type: 'new', nationality: 'WNI' })
              setNewOpen(false)
            }}
          >
            <UserPlus size={28} />
            <strong>WNI · KTP-el</strong>
            <span>Identitas warga Indonesia</span>
          </button>
          <button
            className="choice-card"
            onClick={() => {
              dispatch({ type: 'new', nationality: 'WNA' })
              setNewOpen(false)
            }}
          >
            <ScanLine size={28} />
            <strong>WNA · Paspor</strong>
            <span>Identitas warga asing</span>
          </button>
        </div>
      </Dialog>
      <Dialog title="QR Meja 2" open={qrOpen} onClose={() => setQrOpen(false)}>
        <div className="qr-modal">
          <QrPreview />
          <p>
            Contoh visual QR untuk pelanggan dengan app. Tidak terhubung ke
            layanan transaksi.
          </p>
        </div>
      </Dialog>
    </>
  )
}
