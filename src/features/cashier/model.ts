import {
  getOffer,
  newWna,
  newWni,
  registeredCustomer,
  type Customer,
} from './data'

export type Stage =
  | 'identity'
  | 'nominal'
  | 'waiting'
  | 'signature'
  | 'payment'
  | 'done'
  | 'cancelled'
export type Session = {
  id: string
  channel: 'qr' | 'walk-in'
  customer: Customer
  stage: Stage
  offerId: string
  entered: string
  identityMode: 'chip' | 'manual'
  identityReady: boolean
  photoReady: boolean
  liveness: 'idle' | 'running' | 'passed' | 'failed'
  rejected: boolean
  consent: boolean
  payment: 'cash' | 'transfer'
  transferReceived: boolean
  checks: boolean[]
  signed: boolean
  sentAgain: boolean
}
export type UiState = {
  sessions: Session[]
  activeId: string | null
  deskOpen: boolean
  nextWalkin: number
}
export type UiAction =
  | { type: 'open'; id: string }
  | { type: 'queue' }
  | { type: 'new'; nationality: 'WNI' | 'WNA' }
  | { type: 'patch-customer'; patch: Partial<Customer> }
  | { type: 'identity-mode'; mode: 'chip' | 'manual' }
  | { type: 'read-chip'; success: boolean }
  | { type: 'photo' }
  | { type: 'liveness'; result: Session['liveness'] }
  | { type: 'nominal' }
  | { type: 'offer'; id: string }
  | { type: 'send' }
  | { type: 'resend' }
  | { type: 'reject' }
  | { type: 'consent'; value: boolean }
  | { type: 'approve' }
  | { type: 'sign' }
  | { type: 'payment'; method: Session['payment'] }
  | { type: 'transfer-received' }
  | { type: 'check'; index: number; checked: boolean }
  | { type: 'complete' }
  | { type: 'cancel' }
  | { type: 'back' }
  | { type: 'close-desk' }
  | { type: 'reopen-desk' }
  | { type: 'reset' }

function makeSession(
  id: string,
  channel: Session['channel'],
  customer: Customer,
  offerId: string,
): Session {
  return {
    id,
    channel,
    customer: { ...customer },
    offerId,
    stage: 'identity',
    entered: '10:11',
    identityMode: 'chip',
    identityReady: channel === 'qr',
    photoReady: false,
    liveness: 'idle',
    rejected: false,
    consent: false,
    payment: 'cash',
    transferReceived: false,
    checks: [false, false, false],
    signed: false,
    sentAgain: false,
  }
}
export function createInitialState(): UiState {
  const qr = makeSession(
    'A-07',
    'qr',
    {
      ...registeredCustomer,
      name: 'Rina Kartika Dewi',
      identity: '3273 •••• •••• 0001',
      address: 'Jakarta Selatan',
    },
    'usd-1000',
  )
  const walkin = makeSession('W-03', 'walk-in', registeredCustomer, 'aud-500')
  const waiting = makeSession(
    'A-05',
    'qr',
    {
      ...newWna,
      name: 'Tan Wei Ling',
      newCustomer: false,
      country: 'Singapura',
    },
    'sgd-sell',
  )
  waiting.stage = 'waiting'
  waiting.entered = '10:02'
  const done = makeSession(
    'W-02',
    'walk-in',
    { ...registeredCustomer, name: 'Made W.' },
    'aud-500',
  )
  done.stage = 'done'
  done.entered = '09:31'
  done.signed = true
  return {
    sessions: [qr, walkin, waiting, done],
    activeId: null,
    deskOpen: true,
    nextWalkin: 4,
  }
}
export function canComplete(session: Session): boolean {
  return (
    session.stage === 'payment' &&
    session.checks.length === 3 &&
    session.checks.every(Boolean) &&
    (session.payment === 'cash' || session.transferReceived)
  )
}
export function uiReducer(state: UiState, action: UiAction): UiState {
  if (action.type === 'reset') return createInitialState()
  if (action.type === 'open')
    return state.sessions.some((s) => s.id === action.id)
      ? { ...state, activeId: action.id }
      : state
  if (action.type === 'queue') return { ...state, activeId: null }
  if (action.type === 'close-desk')
    return state.sessions.some((s) =>
      ['nominal', 'waiting', 'signature', 'payment'].includes(s.stage),
    )
      ? state
      : { ...state, deskOpen: false, activeId: null }
  if (action.type === 'reopen-desk') return { ...state, deskOpen: true }
  if (action.type === 'new') {
    if (!state.deskOpen) return state
    const id = `W-${String(state.nextWalkin).padStart(2, '0')}`
    const customer = action.nationality === 'WNI' ? newWni : newWna
    const session = makeSession(
      id,
      'walk-in',
      customer,
      action.nationality === 'WNI' ? 'usd-300' : 'jpy-sell',
    )
    return {
      ...state,
      sessions: [...state.sessions, session],
      activeId: id,
      nextWalkin: state.nextWalkin + 1,
    }
  }
  const session = state.sessions.find((s) => s.id === state.activeId)
  if (!session) return state
  let updated = session
  switch (action.type) {
    case 'patch-customer':
      if (session.stage === 'identity')
        updated = {
          ...session,
          customer: { ...session.customer, ...action.patch },
        }
      break
    case 'identity-mode':
      if (session.stage === 'identity')
        updated = {
          ...session,
          identityMode: action.mode,
          identityReady: false,
          photoReady: false,
          liveness: 'idle',
        }
      break
    case 'read-chip':
      if (session.stage === 'identity')
        updated = {
          ...session,
          identityReady: action.success,
          identityMode: action.success ? 'chip' : 'manual',
          liveness: 'idle',
        }
      break
    case 'photo':
      if (session.stage === 'identity')
        updated = { ...session, photoReady: true, identityReady: true }
      break
    case 'liveness':
      if (session.stage === 'identity')
        updated = { ...session, liveness: action.result }
      break
    case 'nominal':
      if (
        session.stage === 'identity' &&
        session.identityReady &&
        (session.channel === 'qr' || session.liveness === 'passed') &&
        session.customer.name.trim() &&
        session.customer.address.trim() &&
        session.customer.identity.trim()
      )
        updated = { ...session, stage: 'nominal' }
      break
    case 'offer':
      if (session.stage === 'nominal') {
        getOffer(action.id)
        updated = { ...session, offerId: action.id }
      }
      break
    case 'send':
      if (session.stage === 'nominal')
        updated = {
          ...session,
          stage: 'waiting',
          rejected: false,
          consent: false,
          signed: false,
          checks: [false, false, false],
          transferReceived: false,
          sentAgain: false,
        }
      break
    case 'resend':
      if (session.stage === 'waiting') updated = { ...session, sentAgain: true }
      break
    case 'reject':
      if (session.stage === 'waiting' || session.stage === 'signature')
        updated = {
          ...session,
          stage: 'nominal',
          rejected: true,
          consent: false,
          signed: false,
        }
      break
    case 'consent':
      if (session.stage === 'waiting')
        updated = { ...session, consent: action.value }
      break
    case 'approve':
      if (
        session.stage === 'waiting' &&
        (!session.customer.newCustomer || session.consent)
      )
        updated = {
          ...session,
          stage: session.channel === 'qr' ? 'payment' : 'signature',
        }
      break
    case 'sign':
      if (session.stage === 'signature')
        updated = { ...session, stage: 'payment', signed: true }
      break
    case 'payment':
      if (session.stage === 'payment')
        updated = {
          ...session,
          payment: action.method,
          checks: [false, false, false],
          transferReceived: false,
        }
      break
    case 'transfer-received':
      if (session.stage === 'payment' && session.payment === 'transfer')
        updated = { ...session, transferReceived: true }
      break
    case 'check':
      if (session.stage === 'payment' && action.index >= 0 && action.index < 3)
        updated = {
          ...session,
          checks: session.checks.map((value, index) =>
            index === action.index ? action.checked : value,
          ),
        }
      break
    case 'complete':
      if (canComplete(session)) updated = { ...session, stage: 'done' }
      break
    case 'cancel':
      if (session.stage !== 'done') updated = { ...session, stage: 'cancelled' }
      break
    case 'back':
      if (session.stage === 'nominal')
        updated = { ...session, stage: 'identity' }
      else if (session.stage === 'waiting')
        updated = { ...session, stage: 'nominal', consent: false }
      break
  }
  if (updated === session) return state
  return {
    ...state,
    sessions: state.sessions.map((s) => (s.id === updated.id ? updated : s)),
  }
}

export function sessionStatus(session: Session) {
  const statuses = {
    identity: 'Menunggu diproses',
    nominal: 'Input nominal',
    waiting: 'Menunggu pelanggan',
    signature: 'Menunggu tanda tangan',
    payment: 'Pembayaran',
    done: 'Selesai',
    cancelled: 'Dibatalkan',
  }
  return statuses[session.stage]
}
