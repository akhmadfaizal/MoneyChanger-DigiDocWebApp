import { Inbox, TriangleAlert, LoaderCircle } from 'lucide-react'
import { Button } from './Button'
export type ViewState = 'normal' | 'loading' | 'empty' | 'error'
export function PreviewState({
  state,
  onRetry,
  message,
}: {
  state: Exclude<ViewState, 'normal'>
  onRetry: () => void
  message?: string
}) {
  return (
    <div className="empty-state" role={state === 'error' ? 'alert' : 'status'}>
      {state === 'loading' ? (
        <LoaderCircle className="spin" size={32} />
      ) : state === 'error' ? (
        <TriangleAlert size={32} />
      ) : (
        <Inbox size={32} />
      )}
      <h2>
        {state === 'loading'
          ? 'Memuat tampilan'
          : state === 'error'
            ? 'Tampilan belum dapat dimuat'
            : 'Belum ada data'}
      </h2>
      <p>
        {message ??
          (state === 'loading'
            ? 'Contoh state loading untuk review UI.'
            : state === 'error'
              ? 'Contoh state error. Coba kembali untuk melihat data.'
              : 'Data akan muncul di sini saat tersedia.')}
      </p>
      <Button variant="secondary" onClick={onRetry}>
        {state === 'error' ? 'Coba lagi' : 'Tampilkan data contoh'}
      </Button>
    </div>
  )
}
