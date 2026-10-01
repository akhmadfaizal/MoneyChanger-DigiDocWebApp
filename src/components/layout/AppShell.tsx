import { useState, type ReactNode } from 'react'
import {
  ArrowLeftRight,
  Bell,
  Menu,
  Monitor,
  Coins,
  Activity,
  Tablet,
  Layers3,
  RotateCcw,
  X,
  SlidersHorizontal,
} from 'lucide-react'
import { appConfig } from '@/app/config'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { SelectField } from '@/components/ui/SelectField'
import type { ViewState } from '@/components/ui/PreviewState'
import type { UiState } from '@/features/cashier/model'

export function AppShell({
  route,
  title,
  state,
  view,
  onViewChange,
  onReset,
  children,
}: {
  route: string
  title: string
  state: UiState
  view: ViewState
  onViewChange: (view: ViewState) => void
  onReset: () => void
  children: ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const waiting = state.sessions.filter(
    (s) => s.stage === 'waiting' || s.stage === 'signature',
  ).length
  const queueCount = state.sessions.filter((s) => s.stage === 'identity').length
  const items = [
    { href: '/cashier', label: 'Meja kasir', icon: Monitor },
    { href: '/rates', label: 'Kurs', icon: Coins },
    { href: '/transactions', label: 'Transaksi hari ini', icon: Activity },
    { href: '/tablet', label: 'Tablet pelanggan', icon: Tablet },
    { href: '/design-system', label: 'Design system', icon: Layers3 },
  ]
  return (
    <div className="app-shell">
      <a
        href="#content"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('content')?.focus()
        }}
      >
        Lewati ke konten
      </a>
      {menuOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Tutup navigasi"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        id="app-navigation"
        className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}
      >
        <a
          href="#/cashier"
          className="app-brand"
          onClick={() => setMenuOpen(false)}
        >
          <span>
            <ArrowLeftRight size={20} aria-hidden="true" />
          </span>
          {appConfig.name}
        </a>
        <div className="sidebar-location">SENAYAN · MEJA 2</div>
        <nav aria-label="Navigasi utama">
          {items.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              aria-current={route === item.href ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <item.icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
              {item.href === '/cashier' && <small>{queueCount}</small>}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="avatar">AP</span>
          <div>
            <strong>Andi Prasetyo</strong>
            <p>Kasir · Senayan Meja 2</p>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="workspace-header">
          <button
            className="icon-button menu-toggle"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="app-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1>{title}</h1>
          <div className="header-tools">
            <span className="desk-label">Senayan · Meja 2</span>
            <Badge tone={state.deskOpen ? 'success' : 'warning'}>
              {state.deskOpen ? 'Meja terbuka' : 'Meja ditutup'}
            </Badge>
            <button
              className="icon-button"
              aria-label="Notifikasi"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell size={18} />
              {waiting > 0 && <span className="notification-dot" />}
            </button>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setSettingsOpen(true)}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Review UI
            </Button>
          </div>
        </header>
        <div className="preview-strip">
          <span className="preview-dot" />
          Mode demo{' '}
          <span className="preview-detail">
            · Data contoh, perubahan tersimpan selama halaman ini terbuka.
          </span>
          <span className="preview-date">01 Okt 2026</span>
        </div>
        <main id="content" className="workspace-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <Dialog
        title="Review tampilan"
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <p className="dialog-copy">
          Pilih state untuk memeriksa tampilan daftar. Sesi transaksi tetap
          dapat dilanjutkan setelah kembali ke state normal.
        </p>
        <div className="form-stack">
          <SelectField
            label="Skenario tampilan"
            value={view}
            onChange={(event) => onViewChange(event.target.value as ViewState)}
          >
            <option value="normal">Normal</option>
            <option value="loading">Loading</option>
            <option value="empty">Kosong</option>
            <option value="error">Error</option>
          </SelectField>
          <Button
            variant="secondary"
            onClick={() => {
              onReset()
              onViewChange('normal')
              setSettingsOpen(false)
            }}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset seluruh data demo
          </Button>
        </div>
        <div className="dialog-actions">
          <Button onClick={() => setSettingsOpen(false)}>Selesai</Button>
        </div>
      </Dialog>
      <Dialog
        title="Notifikasi"
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      >
        <div className="notice-list">
          <p>
            <strong>{waiting} sesi</strong> menunggu konfirmasi pelanggan.
          </p>
          <p>Data kurs contoh diperbarui pukul 07:42.</p>
          <p>Semua aktivitas berada dalam mode demo.</p>
        </div>
      </Dialog>
    </div>
  )
}
