import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}
function snapshot() {
  const route = window.location.hash.replace(/^#/, '')
  return route === 'main' ? '/design-system' : route || '/cashier'
}
export function useHashRoute() {
  return useSyncExternalStore(subscribe, snapshot, () => '/cashier')
}
export function navigate(route: string) {
  window.location.hash = route
}
