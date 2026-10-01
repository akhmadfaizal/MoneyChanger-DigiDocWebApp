import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-page" role="alert">
          <h1>Tampilan tidak dapat dimuat</h1>
          <p>Muat ulang halaman untuk mencoba kembali.</p>
          <Button onClick={() => window.location.reload()}>Muat ulang</Button>
        </main>
      )
    }
    return this.props.children
  }
}
