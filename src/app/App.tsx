import { useEffect, useReducer, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import type { ViewState } from '@/components/ui/PreviewState'
import { ComponentGallery } from '@/features/ui-foundation/ComponentGallery'
import { createInitialState, uiReducer } from '@/features/cashier/model'
import { QueuePage } from '@/features/cashier/QueuePage'
import { SessionPage } from '@/features/cashier/SessionPage'
import { CloseDeskDialog } from '@/features/cashier/CloseDeskDialog'
import { TabletPage } from '@/features/tablet/TabletPage'
import { RatesPage } from '@/features/rates/RatesPage'
import { TransactionsPage } from '@/features/transactions/TransactionsPage'
import { navigate, useHashRoute } from '@/hooks/useHashRoute'

const titles: Record<string, string> = {
  '/cashier': 'Meja kasir',
  '/rates': 'Kurs',
  '/transactions': 'Transaksi hari ini',
  '/tablet': 'Tablet pelanggan',
  '/design-system': 'Design system',
}
export function App() {
  const route = useHashRoute()
  const [state, dispatch] = useReducer(uiReducer, undefined, createInitialState)
  const [view, setView] = useState<ViewState>('normal')
  const [closeDeskOpen, setCloseDeskOpen] = useState(false)
  const session =
    state.sessions.find((item) => item.id === state.activeId) ?? null
  const title =
    route === '/cashier' && session
      ? `${session.channel === 'qr' ? 'Sesi QR' : 'Walk-in'} · ${session.id}`
      : (titles[route] ?? 'Halaman tidak ditemukan')
  useEffect(() => {
    document.title = `${title} · DigiDoc Web`
  }, [title])
  if (route === '/design-system')
    return (
      <>
        <div className="gallery-return">
          <a href="#/cashier">← Kembali ke meja kasir</a>
        </div>
        <ComponentGallery />
      </>
    )
  if (route === '/tablet')
    return (
      <TabletPage
        key={session?.id ?? 'idle'}
        session={session}
        dispatch={dispatch}
      />
    )
  const activeSessions = state.sessions.filter((item) =>
    ['nominal', 'waiting', 'signature', 'payment'].includes(item.stage),
  ).length
  const retry = () => setView('normal')
  return (
    <AppShell
      route={route}
      title={title}
      state={state}
      view={view}
      onViewChange={setView}
      onReset={() => {
        dispatch({ type: 'reset' })
        navigate('/cashier')
      }}
    >
      {route === '/cashier' &&
        (session ? (
          <SessionPage key={session.id} session={session} dispatch={dispatch} />
        ) : (
          <QueuePage
            state={state}
            dispatch={dispatch}
            view={view}
            onRetry={retry}
            onCloseDesk={() => setCloseDeskOpen(true)}
          />
        ))}
      {route === '/rates' && <RatesPage view={view} onRetry={retry} />}
      {route === '/transactions' && (
        <TransactionsPage
          state={state}
          view={view}
          onRetry={retry}
          onCloseDesk={() => setCloseDeskOpen(true)}
        />
      )}
      {!titles[route] && (
        <div className="empty-state">
          <h2>Halaman tidak ditemukan</h2>
          <p>Gunakan navigasi untuk kembali ke tampilan yang tersedia.</p>
          <Button onClick={() => navigate('/cashier')}>
            Kembali ke meja kasir
          </Button>
        </div>
      )}
      <CloseDeskDialog
        key={closeDeskOpen ? 'open' : 'closed'}
        open={closeDeskOpen}
        onClose={() => setCloseDeskOpen(false)}
        activeSessions={activeSessions}
        onConfirm={() => {
          dispatch({ type: 'close-desk' })
          setCloseDeskOpen(false)
          navigate('/cashier')
        }}
      />
    </AppShell>
  )
}
