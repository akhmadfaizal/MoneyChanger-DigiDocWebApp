import { Check } from 'lucide-react'
import type { Session } from '@/features/cashier/model'
export function StepIndicator({ session }: { session: Session }) {
  const steps = [
    session.channel === 'qr' ? 'Data pelanggan' : 'Identitas',
    'Nominal',
    session.channel === 'qr' ? 'Konfirmasi di HP' : 'Konfirmasi di tablet',
    'Pembayaran',
    'Selesai',
  ]
  const index = {
    identity: 0,
    nominal: 1,
    waiting: 2,
    signature: 2,
    payment: 3,
    done: 4,
    cancelled: 0,
  }[session.stage]
  return (
    <ol className="steps" aria-label="Langkah transaksi">
      {steps.map((step, i) => (
        <li
          key={step}
          className={i === index ? 'current' : i < index ? 'completed' : ''}
          aria-current={i === index ? 'step' : undefined}
        >
          <span>
            {i < index ? <Check size={13} aria-hidden="true" /> : i + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  )
}
