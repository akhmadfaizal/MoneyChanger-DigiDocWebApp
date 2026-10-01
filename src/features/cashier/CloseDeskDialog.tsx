import { useState } from 'react'
import { Camera, Check, Pause } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SelectField } from '@/components/ui/SelectField'

export function CloseDeskDialog({
  open,
  onClose,
  onConfirm,
  activeSessions,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  activeSessions: number
}) {
  const [scenario, setScenario] = useState('match')
  const [reason, setReason] = useState('')
  const [photo, setPhoto] = useState(false)
  const difference = scenario === 'difference'
  return (
    <Dialog title="Tutup meja · Meja 2" open={open} onClose={onClose}>
      <div className="form-stack">
        <p className="dialog-copy">
          Rekap penutupan menggunakan angka contoh. Tidak mengirim laporan ke
          admin cabang.
        </p>
        <SelectField
          label="Skenario rekonsiliasi"
          value={scenario}
          onChange={(event) => setScenario(event.target.value)}
        >
          <option value="match">Jumlah cocok</option>
          <option value="difference">Ada selisih</option>
        </SelectField>
        <div className="form-grid">
          <TextField
            label="Rupiah tunai"
            value={difference ? 'Rp87.200.000' : 'Rp87.250.000'}
            readOnly
          />
          <TextField label="Sistem (contoh)" value="Rp87.250.000" readOnly />
          <TextField label="USD" defaultValue="2.300" />
          <TextField label="SGD" defaultValue="1.100" />
        </div>
        {difference && (
          <>
            <Badge tone="warning">Selisih −Rp50.000 · alasan diperlukan</Badge>
            <TextField
              label="Alasan selisih"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Jelaskan selisih contoh"
              required
            />
          </>
        )}
        <Button variant="secondary" onClick={() => setPhoto(true)}>
          {photo ? <Check size={16} /> : <Camera size={16} />}
          {photo
            ? 'Foto hitung fisik contoh siap'
            : 'Gunakan foto hitung fisik contoh'}
        </Button>
        {activeSessions > 0 && (
          <p className="field-error" role="status">
            Masih ada {activeSessions} sesi aktif. Selesaikan atau batalkan
            sebelum menutup meja.
          </p>
        )}
      </div>
      <div className="dialog-actions">
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button
          disabled={
            activeSessions > 0 || !photo || (difference && !reason.trim())
          }
          onClick={onConfirm}
        >
          <Pause size={16} />
          Konfirmasi tutup meja
        </Button>
      </div>
    </Dialog>
  )
}
