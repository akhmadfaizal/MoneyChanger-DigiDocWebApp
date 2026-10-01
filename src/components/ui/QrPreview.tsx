import { QrCode } from 'lucide-react'
export function QrPreview({ label = 'QR Meja 2' }: { label?: string }) {
  return (
    <div className="qr-preview">
      <QrCode size={66} strokeWidth={1.7} aria-hidden="true" />
      <div>
        <strong>{label}</strong>
        <p>QR visual · demo</p>
      </div>
    </div>
  )
}
