import { useRef, useState, type PointerEvent } from 'react'
import { RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function SignaturePad({
  onSign,
  english,
}: {
  onSign: () => void
  english: boolean
}) {
  const [paths, setPaths] = useState<string[]>([])
  const drawing = useRef(false)
  const usable = paths.some((path) => path.includes('L'))
  function point(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return `${(((event.clientX - rect.left) / rect.width) * 800).toFixed(1)} ${(((event.clientY - rect.top) / rect.height) * 220).toFixed(1)}`
  }
  function start(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return
    drawing.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    const firstPoint = point(event)
    setPaths((previous) => [...previous, `M${firstPoint}`])
  }
  function move(event: PointerEvent<SVGSVGElement>) {
    if (!drawing.current) return
    const nextPoint = point(event)
    setPaths((previous) =>
      previous.map((path, i) =>
        i === previous.length - 1 ? `${path} L${nextPoint}` : path,
      ),
    )
  }
  return (
    <div className="signature-block">
      <svg
        role="img"
        aria-label={english ? 'Signature area' : 'Area tanda tangan'}
        className="signature-pad"
        viewBox="0 0 800 220"
        preserveAspectRatio="none"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={() => {
          drawing.current = false
        }}
        onPointerCancel={() => {
          drawing.current = false
        }}
      >
        {paths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <p className="page-note">
        {english
          ? 'Draw a demo signature, or use the sample below. Kept only on this screen.'
          : 'Gambar tanda tangan demo, atau gunakan contoh di bawah. Hanya tampil di layar ini.'}
      </p>
      <div className="signature-options">
        <Button
          variant="tertiary"
          size="sm"
          onClick={() =>
            setPaths([
              'M180 140 L205 110 L235 85 L255 90 L280 145 L300 160 L335 140 L385 65 L405 70 L450 145 L470 150 L510 120 L540 95 L575 125 L610 108',
            ])
          }
        >
          {english ? 'Use sample signature' : 'Gunakan contoh tanda tangan'}
        </Button>
      </div>
      <div className="tablet-actions">
        <Button size="lg" variant="secondary" onClick={() => setPaths([])}>
          <RotateCcw size={18} />
          {english ? 'Clear' : 'Ulangi'}
        </Button>
        <Button size="lg" disabled={!usable} onClick={onSign}>
          <Check size={18} />
          {english ? 'Confirm & sign' : 'Setuju & tanda tangan'}
        </Button>
      </div>
    </div>
  )
}
