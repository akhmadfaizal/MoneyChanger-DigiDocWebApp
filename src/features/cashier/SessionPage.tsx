import { useState, type Dispatch } from 'react'
import {
  Smartphone,
  Tablet,
  ScanLine,
  Keyboard,
  Camera,
  Check,
  X,
  Send,
  Pencil,
  Banknote,
  Landmark,
  Printer,
  ArrowLeft,
  UserRound,
  TriangleAlert,
  LoaderCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { SelectField } from '@/components/ui/SelectField'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { navigate } from '@/hooks/useHashRoute'
import { getOffer, offers, newWna, type Customer } from './data'
import { canComplete, type Session, type UiAction } from './model'
import { Receipt } from './Receipt'

function IdentityStep({
  session,
  dispatch,
}: {
  session: Session
  dispatch: Dispatch<UiAction>
}) {
  const customer = session.customer
  const patch = (patch: Partial<Customer>) =>
    dispatch({ type: 'patch-customer', patch })
  const qr = session.channel === 'qr'
  const manual = session.identityMode === 'manual'
  const valid =
    session.identityReady &&
    (qr || session.liveness === 'passed') &&
    customer.name.trim() &&
    customer.address.trim() &&
    customer.identity.trim()
  const showTablet = () => {
    dispatch({ type: 'liveness', result: 'running' })
    navigate('/tablet')
  }
  return (
    <>
      {qr ? (
        <div className="alert-banner">
          <Smartphone size={18} />
          <span>Data contoh pelanggan dari app · tidak perlu membaca KTP.</span>
        </div>
      ) : (
        <div className="identity-tools">
          <div className="segmented-control" aria-label="Jenis identitas">
            <button
              aria-pressed={customer.document === 'ktp'}
              onClick={() => {
                patch({
                  document: 'ktp',
                  nationality: 'WNI',
                  country: 'Indonesia',
                })
                dispatch({ type: 'identity-mode', mode: 'chip' })
              }}
            >
              KTP-el
            </button>
            <button
              aria-pressed={customer.document === 'passport'}
              onClick={() => {
                patch({ ...newWna, newCustomer: customer.newCustomer })
                dispatch({ type: 'identity-mode', mode: 'chip' })
              }}
            >
              Paspor
            </button>
          </div>
          <div className="segmented-control" aria-label="Cara input">
            <button
              aria-pressed={!manual}
              onClick={() => dispatch({ type: 'identity-mode', mode: 'chip' })}
            >
              <ScanLine size={15} />
              Baca chip
            </button>
            <button
              aria-pressed={manual}
              onClick={() =>
                dispatch({ type: 'identity-mode', mode: 'manual' })
              }
            >
              <Keyboard size={15} />
              Ketik manual
            </button>
          </div>
        </div>
      )}
      <div className={qr ? 'identity-qr-grid' : 'identity-grid'}>
        <div>
          {manual && !qr ? (
            <div className="form-grid">
              <TextField
                label={customer.document === 'ktp' ? 'NIK' : 'Nomor paspor'}
                value={customer.identity}
                onChange={(event) => patch({ identity: event.target.value })}
                required
              />
              <TextField
                label="Nama pelanggan"
                value={customer.name}
                onChange={(event) => patch({ name: event.target.value })}
                required
              />
              {customer.document === 'passport' && (
                <SelectField
                  label="Negara"
                  value={customer.country}
                  onChange={(event) => patch({ country: event.target.value })}
                >
                  <option>Jepang</option>
                  <option>Singapura</option>
                  <option>Australia</option>
                  <option>Amerika Serikat</option>
                </SelectField>
              )}
              <TextField
                label="Tanggal lahir"
                value={customer.birth}
                onChange={(event) => patch({ birth: event.target.value })}
              />
              <div className="span-two">
                <TextField
                  label={
                    customer.document === 'ktp'
                      ? 'Alamat sesuai KTP'
                      : 'Alamat menginap di Indonesia'
                  }
                  value={customer.address}
                  onChange={(event) => patch({ address: event.target.value })}
                  required
                />
              </div>
            </div>
          ) : (
            <dl className="details-list">
              <div>
                <dt>Status</dt>
                <dd>
                  <Badge tone={customer.newCustomer ? 'warning' : 'success'}>
                    {customer.newCustomer ? 'Pelanggan baru' : 'Terdaftar'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt>Nama</dt>
                <dd>{customer.name}</dd>
              </div>
              <div>
                <dt>
                  {customer.document === 'ktp' ? 'Identitas KTP' : 'Paspor'}
                </dt>
                <dd>{customer.identity}</dd>
              </div>
              <div>
                <dt>Jenis pelanggan</dt>
                <dd>
                  {customer.nationality} · {customer.country}
                </dd>
              </div>
              <div>
                <dt>Tanggal lahir</dt>
                <dd>{customer.birth}</dd>
              </div>
              <div>
                <dt>Alamat</dt>
                <dd>{customer.address}</dd>
              </div>
            </dl>
          )}
        </div>
        {qr ? (
          <dl className="details-list">
            <div>
              <dt>Tujuan · sumber dana</dt>
              <dd>Pendidikan · Gaji</dd>
            </div>
            <div>
              <dt>Pemilik uang</dt>
              <dd>Konfirmasi di HP pelanggan</dd>
            </div>
            <div>
              <dt>Dokumen</dt>
              <dd>Contoh data terverifikasi</dd>
            </div>
            <div>
              <dt>Invoice</dt>
              <dd>Tersedia setelah transaksi selesai</dd>
            </div>
          </dl>
        ) : (
          <div className="verification-grid">
            <div className="verification-card">
              {manual ? <Camera size={30} /> : <ScanLine size={30} />}
              <strong>
                {manual
                  ? customer.document === 'ktp'
                    ? 'Foto KTP'
                    : 'Foto halaman paspor'
                  : 'Pembacaan chip'}
              </strong>
              <Badge
                tone={
                  (manual ? session.photoReady : session.identityReady)
                    ? 'success'
                    : 'warning'
                }
              >
                {(manual ? session.photoReady : session.identityReady)
                  ? 'Contoh data siap'
                  : 'Belum diproses'}
              </Badge>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  dispatch(
                    manual
                      ? { type: 'photo' }
                      : { type: 'read-chip', success: true },
                  )
                }
              >
                {manual ? 'Gunakan foto contoh' : 'Simulasikan chip terbaca'}
              </Button>
              {!manual && (
                <Button
                  size="xs"
                  variant="tertiary"
                  onClick={() =>
                    dispatch({ type: 'read-chip', success: false })
                  }
                >
                  Chip gagal · input manual
                </Button>
              )}
            </div>
            <div className="verification-card">
              <Tablet size={30} />
              <strong>Liveness pelanggan</strong>
              <Badge
                tone={
                  session.liveness === 'passed'
                    ? 'success'
                    : session.liveness === 'failed'
                      ? 'danger'
                      : 'warning'
                }
              >
                {session.liveness === 'passed'
                  ? 'Lolos'
                  : session.liveness === 'failed'
                    ? 'Belum cocok'
                    : 'Menunggu pelanggan'}
              </Badge>
              <Button
                size="sm"
                variant="secondary"
                disabled={!session.identityReady}
                onClick={showTablet}
              >
                {session.liveness === 'passed'
                  ? 'Ulangi di tablet'
                  : 'Mulai di tablet'}
              </Button>
            </div>
          </div>
        )}
      </div>
      {!qr && (
        <p className="page-note">
          Identitas dan liveness menggunakan data contoh. Kamera dan pembaca
          chip tidak diakses.
        </p>
      )}
      <div className="session-actions">
        <Button variant="secondary" onClick={() => dispatch({ type: 'queue' })}>
          Kembali ke antrean
        </Button>
        <Button disabled={!valid} onClick={() => dispatch({ type: 'nominal' })}>
          Lanjut ke nominal
        </Button>
      </div>
    </>
  )
}

function NominalStep({
  session,
  dispatch,
}: {
  session: Session
  dispatch: Dispatch<UiAction>
}) {
  const offer = getOffer(session.offerId)
  const changeSide = (side: 'buy' | 'sell') => {
    const next = offers.find(
      (o) => o.side === side && o.currency === offer.currency,
    )
    if (next) dispatch({ type: 'offer', id: next.id })
  }
  const available = offers.filter((o) => o.side === offer.side)
  const currencies = [...new Set(available.map((o) => o.currency))]
  return (
    <>
      {session.rejected && (
        <div className="alert-banner danger" role="alert">
          <X size={18} />
          <span>
            {session.channel === 'qr'
              ? 'Pelanggan menolak di app'
              : 'Pelanggan memilih “Tidak sesuai” di tablet'}{' '}
            · periksa nominal dan kirim kembali.
          </span>
        </div>
      )}
      <div className="two-pane">
        <div>
          <div className="segmented-control stretch">
            <button
              aria-pressed={offer.side === 'buy'}
              onClick={() => changeSide('buy')}
            >
              Pelanggan beli
            </button>
            <button
              aria-pressed={offer.side === 'sell'}
              onClick={() => changeSide('sell')}
            >
              Pelanggan jual
            </button>
          </div>
          <div className="form-grid">
            <SelectField
              label="Mata uang"
              value={offer.currency}
              onChange={(event) => {
                const next = available.find(
                  (o) => o.currency === event.target.value,
                )
                if (next) dispatch({ type: 'offer', id: next.id })
              }}
            >
              {currencies.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </SelectField>
            <SelectField
              label="Jumlah"
              value={offer.id}
              onChange={(event) =>
                dispatch({ type: 'offer', id: event.target.value })
              }
            >
              {available
                .filter((o) => o.currency === offer.currency)
                .map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.amount}
                  </option>
                ))}
            </SelectField>
            <div className="span-two">
              <TextField
                label={offer.side === 'buy' ? 'Kurs jual' : 'Kurs beli'}
                value={`${offer.rate} · contoh kurs`}
                readOnly
              />
            </div>
          </div>
          <p className="page-note">
            Pilihan nominal memakai pasangan kurs dan total contoh untuk review.
          </p>
        </div>
        <div>
          <div className="total-panel">
            <span>Total</span>
            <strong className="tabular-nums">Rp{offer.total}</strong>
          </div>
          <p className={`threshold-note ${offer.highValue ? 'high' : ''}`}>
            {offer.highValue ? (
              <TriangleAlert size={17} />
            ) : (
              <Check size={17} />
            )}
            {offer.highValue
              ? '≥ Rp100 juta · contoh state verifikasi wajah tambahan'
              : 'Di bawah Rp100 juta'}
          </p>
          {offer.highValue && (
            <div className="info-panel">
              Konfirmasi pelanggan akan menampilkan permintaan verifikasi
              tambahan. Ini merupakan simulasi state UI.
            </div>
          )}
        </div>
      </div>
      <div className="session-actions">
        <Button variant="secondary" onClick={() => dispatch({ type: 'back' })}>
          Kembali
        </Button>
        <Button onClick={() => dispatch({ type: 'send' })}>
          {session.channel === 'qr' ? (
            <Smartphone size={16} />
          ) : (
            <Tablet size={16} />
          )}
          {session.channel === 'qr'
            ? 'Kirim ke HP pelanggan'
            : 'Kirim ke tablet pelanggan'}
        </Button>
      </div>
    </>
  )
}

function WaitingStep({
  session,
  dispatch,
}: {
  session: Session
  dispatch: Dispatch<UiAction>
}) {
  const offer = getOffer(session.offerId)
  const qr = session.channel === 'qr'
  return (
    <>
      <div className="waiting-content">
        <LoaderCircle size={48} className="spin" aria-hidden="true" />
        <h2>
          {session.stage === 'signature'
            ? 'Menunggu tanda tangan di tablet'
            : `Menunggu konfirmasi di ${qr ? 'HP' : 'tablet'} pelanggan`}
        </h2>
        <strong>
          {offer.currency} {offer.amount} · Rp{offer.total}
        </strong>
        <p>Jangan terima uang sebelum pelanggan menyetujui.</p>
        {session.sentAgain && (
          <Badge tone="success">Konfirmasi dikirim ulang</Badge>
        )}
      </div>
      {qr ? (
        <div className="simulation-panel">
          <div>
            <Smartphone size={18} />
            <strong>Preview respons HP pelanggan</strong>
          </div>
          <p>
            Gunakan respons contoh untuk melanjutkan review tanpa aplikasi
            mobile.
          </p>
          {offer.highValue && (
            <Badge tone="warning">Verifikasi wajah tambahan · simulasi</Badge>
          )}
          <div className="sample-row">
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: 'reject' })}
            >
              <X size={16} />
              Tolak di HP
            </Button>
            <Button onClick={() => dispatch({ type: 'approve' })}>
              <Check size={16} />
              Setujui di HP
            </Button>
          </div>
        </div>
      ) : (
        <div className="tablet-preview-link">
          <Tablet size={24} />
          <div>
            <strong>Layar pelanggan siap</strong>
            <p>Buka preview tablet untuk konfirmasi dan tanda tangan.</p>
          </div>
          <Button onClick={() => navigate('/tablet')}>Lihat tablet</Button>
        </div>
      )}
      <div className="session-actions">
        <Button
          variant="secondary"
          disabled={session.stage === 'signature'}
          onClick={() => dispatch({ type: 'resend' })}
        >
          <Send size={15} />
          Kirim ulang
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            dispatch({
              type: session.stage === 'signature' ? 'reject' : 'back',
            })
          }
        >
          <Pencil size={15} />
          Ubah nominal
        </Button>
      </div>
    </>
  )
}

function PaymentStep({
  session,
  dispatch,
}: {
  session: Session
  dispatch: Dispatch<UiAction>
}) {
  const offer = getOffer(session.offerId)
  const sell = offer.side === 'sell'
  const checks =
    session.payment === 'cash'
      ? sell
        ? [
            'Valuta diterima dan dihitung',
            'Rupiah diserahkan',
            'Bukti transaksi diserahkan',
          ]
        : [
            'Uang diterima dan dihitung',
            'Kembalian diberikan',
            `${offer.currency} ${offer.amount} diserahkan`,
          ]
      : sell
        ? [
            'Valuta diterima dan dihitung',
            'Transfer rupiah dicocokkan',
            'Bukti transaksi diserahkan',
          ]
        : [
            'Mutasi transfer dicocokkan',
            `${offer.currency} ${offer.amount} diserahkan`,
            'Bukti transaksi diserahkan',
          ]
  return (
    <>
      <div className="alert-banner success">
        <Check size={18} />
        <span>
          {session.channel === 'qr'
            ? 'Pelanggan menyetujui di app · respons contoh'
            : 'Pelanggan menyetujui dan menandatangani di tablet'}
        </span>
      </div>
      <div className="two-pane">
        <div>
          <h2 className="payment-total tabular-nums">Rp{offer.total}</h2>
          <p className="subtle">
            {offer.side === 'buy' ? 'Beli' : 'Jual'} {offer.currency}{' '}
            {offer.amount}
          </p>
          <div className="payment-methods">
            <button
              aria-pressed={session.payment === 'cash'}
              onClick={() => dispatch({ type: 'payment', method: 'cash' })}
            >
              <Banknote size={23} />
              <strong>Tunai</strong>
            </button>
            <button
              aria-pressed={session.payment === 'transfer'}
              onClick={() => dispatch({ type: 'payment', method: 'transfer' })}
            >
              <Landmark size={23} />
              <strong>Transfer</strong>
            </button>
          </div>
          {session.payment === 'cash' ? (
            <div className="form-grid">
              <TextField
                label={sell ? 'Rupiah diserahkan' : 'Uang diterima'}
                value={`Rp${offer.received}`}
                readOnly
              />
              <TextField
                label="Kembalian"
                value={`Rp${offer.change}`}
                readOnly
              />
            </div>
          ) : (
            <dl className="details-list info-panel">
              <div>
                <dt>
                  {sell
                    ? 'Transfer ke pelanggan'
                    : 'Transfer ke rekening contoh'}
                </dt>
                <dd>Bank Demo · •••• 7890</dd>
              </div>
              <div>
                <dt>Jumlah</dt>
                <dd>Rp{offer.total}</dd>
              </div>
            </dl>
          )}
          <p className="page-note">
            Nilai pembayaran merupakan contoh tetap; tidak ada uang yang
            ditransaksikan.
          </p>
        </div>
        <div className="handover-panel">
          <h3>Serah terima</h3>
          {session.payment === 'transfer' && (
            <div className="transfer-status">
              <Badge tone={session.transferReceived ? 'success' : 'warning'}>
                {session.transferReceived
                  ? sell
                    ? 'Transfer terkirim · contoh'
                    : 'Dana masuk · contoh'
                  : 'Menunggu transfer'}
              </Badge>
              {!session.transferReceived && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => dispatch({ type: 'transfer-received' })}
                >
                  {sell
                    ? 'Simulasikan transfer terkirim'
                    : 'Simulasikan dana masuk'}
                </Button>
              )}
            </div>
          )}
          {checks.map((label, index) => (
            <label className="check-row" key={label}>
              <input
                type="checkbox"
                checked={session.checks[index] ?? false}
                onChange={(event) =>
                  dispatch({
                    type: 'check',
                    index,
                    checked: event.target.checked,
                  })
                }
              />
              {label}
            </label>
          ))}
          <p className="page-note">
            Selesaikan seluruh checklist sebelum menutup transaksi.
          </p>
        </div>
      </div>
      <div className="session-actions">
        <Button
          disabled={!canComplete(session)}
          onClick={() => dispatch({ type: 'complete' })}
        >
          <Check size={16} />
          Tutup transaksi
        </Button>
      </div>
    </>
  )
}

export function SessionPage({
  session,
  dispatch,
}: {
  session: Session
  dispatch: Dispatch<UiAction>
}) {
  const [cancelOpen, setCancelOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const offer = getOffer(session.offerId)
  return (
    <>
      <div className="session-top">
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => dispatch({ type: 'queue' })}
        >
          <ArrowLeft size={16} />
          Antrean
        </Button>
        <div>
          <UserRound size={15} />
          <span>{session.customer.name}</span>
          <Badge>{session.channel === 'qr' ? 'App · QR' : 'Walk-in'}</Badge>
        </div>
      </div>
      <section className="panel session-panel">
        <StepIndicator session={session} />
        {session.stage === 'identity' && (
          <IdentityStep session={session} dispatch={dispatch} />
        )}
        {session.stage === 'nominal' && (
          <NominalStep session={session} dispatch={dispatch} />
        )}
        {(session.stage === 'waiting' || session.stage === 'signature') && (
          <WaitingStep session={session} dispatch={dispatch} />
        )}
        {session.stage === 'payment' && (
          <PaymentStep session={session} dispatch={dispatch} />
        )}
        {session.stage === 'done' && (
          <>
            <div className="completion-content">
              <span className="completion-icon">
                <Check size={34} />
              </span>
              <h2>Transaksi selesai</h2>
              <p>
                {session.id} · {offer.currency} {offer.amount} · Rp{offer.total}{' '}
                · {session.payment === 'cash' ? 'tunai' : 'transfer'}
              </p>
            </div>
            <dl className="details-list info-panel">
              <div>
                <dt>Invoice</dt>
                <dd>
                  INV-261001-{session.id}{' '}
                  <Badge tone="success">Siap dilihat</Badge>
                </dd>
              </div>
              <div>
                <dt>Konfirmasi pelanggan</dt>
                <dd>
                  {session.channel === 'qr'
                    ? 'Disetujui di HP · contoh'
                    : 'Disetujui & tanda tangan di tablet'}
                </dd>
              </div>
            </dl>
            <div className="session-actions">
              {session.channel === 'walk-in' && (
                <Button variant="secondary" onClick={() => navigate('/tablet')}>
                  Layar terima kasih tablet
                </Button>
              )}
              <Button variant="secondary" onClick={() => setReceiptOpen(true)}>
                <Printer size={16} />
                Lihat / cetak struk
              </Button>
              <Button onClick={() => dispatch({ type: 'queue' })}>
                Kembali ke antrean
              </Button>
            </div>
          </>
        )}
        {session.stage === 'cancelled' && (
          <div className="empty-state">
            <X size={34} />
            <h2>Sesi dibatalkan</h2>
            <p>
              Sesi {session.id} tidak dilanjutkan. Status tersedia di transaksi
              hari ini.
            </p>
            <Button onClick={() => dispatch({ type: 'queue' })}>
              Kembali ke antrean
            </Button>
          </div>
        )}
      </section>
      {session.stage !== 'done' && session.stage !== 'cancelled' && (
        <div className="cancel-session">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setCancelOpen(true)}
          >
            <X size={14} />
            Batalkan sesi
          </Button>
        </div>
      )}
      <Dialog
        title="Batalkan sesi?"
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
      >
        <p className="dialog-copy">
          Sesi {session.id} akan ditandai dibatalkan. Tidak ada transaksi nyata
          yang diproses.
        </p>
        <div className="dialog-actions">
          <Button variant="secondary" onClick={() => setCancelOpen(false)}>
            Lanjutkan sesi
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: 'cancel' })
              setCancelOpen(false)
            }}
          >
            Ya, batalkan
          </Button>
        </div>
      </Dialog>
      <Receipt
        session={session}
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
      />
    </>
  )
}
