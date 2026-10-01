import { Printer, FileCheck2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { getOffer } from './data'
import type { Session } from './model'

export function Receipt({
  session,
  open,
  onClose,
}: {
  session: Session | null
  open: boolean
  onClose: () => void
}) {
  if (!session) return null
  const offer = getOffer(session.offerId)
  return (
    <Dialog title="Invoice transaksi" open={open} onClose={onClose}>
      <article className="print-receipt">
        <div className="receipt-brand">
          <FileCheck2 size={32} />
          <strong>DigiDoc · PT Valuta Sejahtera</strong>
          <span>Senayan · Meja 2</span>
          <Badge>INVOICE DEMO</Badge>
        </div>
        <h3>INV-261001-{session.id}</h3>
        <p>01 Oktober 2026 · Data contoh</p>
        <dl className="details-list">
          <div>
            <dt>Pelanggan</dt>
            <dd>{session.customer.name}</dd>
          </div>
          <div>
            <dt>Transaksi</dt>
            <dd>
              {offer.side === 'buy' ? 'Beli' : 'Jual'} {offer.currency}{' '}
              {offer.amount}
            </dd>
          </div>
          <div>
            <dt>Kurs</dt>
            <dd>{offer.rate}</dd>
          </div>
          <div>
            <dt>Metode</dt>
            <dd>{session.payment === 'cash' ? 'Tunai' : 'Transfer'}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{session.stage === 'done' ? 'Selesai' : 'Belum selesai'}</dd>
          </div>
          <div className="receipt-total">
            <dt>Total</dt>
            <dd>Rp{offer.total}</dd>
          </div>
        </dl>
        <p className="receipt-disclaimer">
          Bukti tampilan UI. Bukan bukti transaksi atau pembayaran yang sah.
        </p>
      </article>
      <div className="dialog-actions no-print">
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
        <Button onClick={() => window.print()}>
          <Printer size={16} aria-hidden="true" />
          Cetak invoice
        </Button>
      </div>
    </Dialog>
  )
}
