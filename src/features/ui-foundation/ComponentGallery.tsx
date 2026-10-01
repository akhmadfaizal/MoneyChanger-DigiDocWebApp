import { useState } from 'react'
import {
  ArrowUpRight,
  Layers3,
  Monitor,
  Tablet,
  Check,
  PanelTop,
} from 'lucide-react'
import { appConfig } from '@/app/config'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'

const colors = [
  { name: 'Primary', value: '#362fd9', className: 'bg-primary' },
  { name: 'Success', value: '#42b549', className: 'bg-success' },
  { name: 'Warning', value: '#fe690f', className: 'bg-warning' },
  { name: 'Danger', value: '#fc2947', className: 'bg-danger' },
  { name: 'Background', value: '#f8fafe', className: 'bg-background' },
  { name: 'Foreground', value: '#202024', className: 'bg-foreground' },
]

export function ComponentGallery() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#main" className="brand">
            <span className="brand-icon">
              <Layers3 size={22} aria-hidden="true" />
            </span>
            {appConfig.name}
          </a>
          <span className="version-label">
            UI FOUNDATION <span>v0.1</span>
          </span>
        </div>
      </header>
      <main id="main" className="gallery">
        <div className="intro">
          <p className="eyebrow">DESIGN SYSTEM / W-APP</p>
          <h1>Fondasi untuk setiap layar.</h1>
          <p className="intro-copy">
            Komponen, warna, dan tipografi DigiDoc. Satu acuan visual untuk
            kasir web dan tablet pelanggan.
          </p>
          <div className="scope-row">
            <span>
              <Monitor size={16} aria-hidden="true" />
              Kasir web
            </span>
            <span>
              <Tablet size={16} aria-hidden="true" />
              Tablet pelanggan
            </span>
            <Badge>Preview UI</Badge>
          </div>
        </div>
        <section className="gallery-section" aria-labelledby="colors-heading">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <h2 id="colors-heading">Warna semantic</h2>
              <p>Warna mengikuti fungsi setiap elemen.</p>
            </div>
          </div>
          <div className="swatch-grid">
            {colors.map((color) => (
              <div className="swatch" key={color.name}>
                <div className={`swatch-color ${color.className}`} />
                <strong>{color.name}</strong>
                <span>{color.value}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="gallery-section" aria-labelledby="buttons-heading">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <h2 id="buttons-heading">Tombol & status</h2>
              <p>Hierarki aksi yang konsisten.</p>
            </div>
          </div>
          <div className="component-panel">
            <div className="sample-row">
              <Button onClick={() => setDialogOpen(true)}>
                Buka contoh dialog
                <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="sample-row sizes">
              <Button size="lg">Large · 48px</Button>
              <Button size="md">Medium · 40px</Button>
              <Button size="sm">Small · 32px</Button>
              <Button size="xs">Extra small · 28px</Button>
            </div>
            <div className="sample-row">
              <Badge tone="primary">Informasi</Badge>
              <Badge tone="success">
                <Check size={14} aria-hidden="true" />
                Selesai
              </Badge>
              <Badge tone="warning">Menunggu</Badge>
              <Badge tone="danger">Ditolak</Badge>
            </div>
          </div>
        </section>
        <div className="two-column">
          <section className="gallery-section" aria-labelledby="input-heading">
            <div className="section-heading">
              <span className="section-number">03</span>
              <div>
                <h2 id="input-heading">Input</h2>
                <p>Label jelas, state mudah dikenali.</p>
              </div>
            </div>
            <div className="component-panel field-stack">
              <TextField
                label="Nama pelanggan"
                placeholder="Masukkan nama"
                value={name}
                onChange={(event) => setName(event.target.value)}
                hint="Contoh input; data hanya ada di halaman ini."
              />
              <TextField
                label="Nomor identitas"
                defaultValue=""
                error="Contoh tampilan pesan error."
                placeholder="Nomor KTP / paspor"
              />
              <TextField label="Input nonaktif" value="Contoh data" disabled />
            </div>
          </section>
          <section className="gallery-section" aria-labelledby="type-heading">
            <div className="section-heading">
              <span className="section-number">04</span>
              <div>
                <h2 id="type-heading">Tipografi</h2>
                <p>Plus Jakarta Sans · 400 / 500 / 700</p>
              </div>
            </div>
            <div className="component-panel typography-panel">
              <p className="text-h4">Jelas. Konsisten.</p>
              <p className="text-h7">Dibuat untuk dibaca.</p>
              <p className="text-lg">
                Teks utama untuk informasi dan interaksi.
              </p>
              <p className="text-md">
                Teks pendukung dengan ritme yang nyaman.
              </p>
              <p className="text-sm">Label kecil · 12px / 18px</p>
              <p className="number-sample tabular-nums">Rp 46.490.000</p>
            </div>
          </section>
        </div>
        <footer className="gallery-footer">
          <PanelTop size={16} aria-hidden="true" />
          <p>
            Galeri fondasi UI · Flow kasir akan dibangun pada tahap berikutnya.
          </p>
        </footer>
      </main>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Contoh dialog"
      >
        <p className="dialog-copy">
          Dialog ini memperlihatkan komponen modal DigiDoc. Tutup melalui
          tombol, area luar, atau tombol Escape.
        </p>
        <div className="dialog-actions">
          <Button onClick={() => setDialogOpen(false)}>Tutup contoh</Button>
        </div>
      </Dialog>
    </>
  )
}
