import { describe, expect, it } from 'vitest'
import {
  canComplete,
  createInitialState,
  uiReducer,
  type UiAction,
  type UiState,
} from './model'
function apply(state: UiState, ...actions: UiAction[]) {
  return actions.reduce(uiReducer, state)
}
function current(state: UiState) {
  return state.sessions.find((session) => session.id === state.activeId)!
}
const cashChecks: UiAction[] = [0, 1, 2].map((index) => ({
  type: 'check',
  index,
  checked: true,
}))

describe('QR presentation flow', () => {
  it('returns to nominal after rejection and requires confirmation before payment', () => {
    let state = apply(
      createInitialState(),
      { type: 'open', id: 'A-07' },
      { type: 'nominal' },
      { type: 'send' },
      { type: 'reject' },
    )
    expect(current(state).stage).toBe('nominal')
    expect(current(state).rejected).toBe(true)
    state = apply(state, { type: 'complete' })
    expect(current(state).stage).toBe('nominal')
    state = apply(
      state,
      { type: 'offer', id: 'usd-7000' },
      { type: 'send' },
      { type: 'resend' },
      { type: 'approve' },
    )
    expect(current(state).offerId).toBe('usd-7000')
    expect(current(state).stage).toBe('payment')
    expect(canComplete(current(state))).toBe(false)
    state = apply(state, ...cashChecks, { type: 'complete' })
    expect(current(state).stage).toBe('done')
  })
  it('keeps transfer pending until both the transfer and checklist are acknowledged', () => {
    let state = apply(
      createInitialState(),
      { type: 'open', id: 'A-05' },
      { type: 'approve' },
      { type: 'payment', method: 'transfer' },
      ...cashChecks,
      { type: 'complete' },
    )
    expect(current(state).stage).toBe('payment')
    state = apply(state, { type: 'transfer-received' }, { type: 'complete' })
    expect(current(state).stage).toBe('done')
  })
  it('clears payment acknowledgements when the method changes', () => {
    let state = apply(
      createInitialState(),
      { type: 'open', id: 'A-05' },
      { type: 'approve' },
      ...cashChecks,
    )
    state = apply(state, { type: 'payment', method: 'transfer' })
    expect(current(state).checks).toEqual([false, false, false])
    expect(current(state).transferReceived).toBe(false)
  })
})

describe('walk-in presentation flow', () => {
  it('requires identity and liveness, then consent for a new customer, then signature', () => {
    let state = apply(
      createInitialState(),
      { type: 'new', nationality: 'WNA' },
      { type: 'nominal' },
    )
    expect(current(state).stage).toBe('identity')
    state = apply(
      state,
      { type: 'read-chip', success: false },
      { type: 'photo' },
      { type: 'liveness', result: 'failed' },
      { type: 'nominal' },
    )
    expect(current(state).stage).toBe('identity')
    state = apply(
      state,
      { type: 'liveness', result: 'passed' },
      { type: 'nominal' },
      { type: 'send' },
      { type: 'approve' },
    )
    expect(current(state).stage).toBe('waiting')
    state = apply(
      state,
      { type: 'consent', value: true },
      { type: 'approve' },
      { type: 'complete' },
    )
    expect(current(state).stage).toBe('signature')
    state = apply(state, { type: 'sign' }, ...cashChecks, { type: 'complete' })
    expect(current(state).stage).toBe('done')
    expect(current(state).signed).toBe(true)
  })
  it('restarts approval and signature after a rejected nominal', () => {
    let state = apply(
      createInitialState(),
      { type: 'new', nationality: 'WNI' },
      { type: 'read-chip', success: true },
      { type: 'liveness', result: 'passed' },
      { type: 'nominal' },
      { type: 'send' },
      { type: 'consent', value: true },
      { type: 'approve' },
      { type: 'reject' },
      { type: 'send' },
    )
    expect(current(state).stage).toBe('waiting')
    expect(current(state).consent).toBe(false)
    expect(current(state).signed).toBe(false)
    state = apply(state, { type: 'approve' })
    expect(current(state).stage).toBe('waiting')
  })
  it('generates distinct session ids and keeps data when navigating back to queue', () => {
    let state = apply(
      createInitialState(),
      { type: 'new', nationality: 'WNI' },
      { type: 'patch-customer', patch: { name: 'Contoh kedua' } },
      { type: 'queue' },
      { type: 'new', nationality: 'WNA' },
    )
    expect(current(state).id).toBe('W-05')
    state = apply(state, { type: 'open', id: 'W-04' })
    expect(current(state).customer.name).toBe('Contoh kedua')
  })
})

describe('desk lifecycle', () => {
  it('prevents closing with an unfinished session and prevents creating sessions on a closed desk', () => {
    let state = apply(createInitialState(), { type: 'close-desk' })
    expect(state.deskOpen).toBe(true)
    state = apply(
      state,
      { type: 'open', id: 'A-05' },
      { type: 'cancel' },
      { type: 'close-desk' },
    )
    expect(state.deskOpen).toBe(false)
    const before = state.sessions.length
    state = apply(state, { type: 'new', nationality: 'WNI' })
    expect(state.sessions).toHaveLength(before)
    state = apply(
      state,
      { type: 'reopen-desk' },
      { type: 'new', nationality: 'WNI' },
    )
    expect(state.sessions).toHaveLength(before + 1)
  })
  it('restores the original fixtures on reset', () => {
    const state = apply(
      createInitialState(),
      { type: 'new', nationality: 'WNI' },
      { type: 'reset' },
    )
    expect(state).toEqual(createInitialState())
  })
})
