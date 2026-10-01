import { useState, type Dispatch } from 'react'
import {
  ArrowLeftRight,
  Check,
  X,
  UserRound,
  Tablet,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { QrPreview } from '@/components/ui/QrPreview'
import { navigate } from '@/hooks/useHashRoute'
import { getOffer } from '@/features/cashier/data'
import type { UiAction, Session } from '@/features/cashier/model'
import { SignaturePad } from './SignaturePad'

export function TabletPage({
  session,
  dispatch,
}: {
  session: Session | null
  dispatch: Dispatch<UiAction>
}) {
  const [language, setLanguage] = useState<'id' | 'en'>(
    session?.customer.nationality === 'WNA' ? 'en' : 'id',
  )
  const [livenessStep, setLivenessStep] = useState(0)
  const english = language === 'en'
  const offer = session ? getOffer(session.offerId) : null
  return (
    <div className="tablet-page">
      <div className="tablet-review-bar">
        <a href="#/cashier">
          <ArrowLeft size={16} />
          {english ? 'Back to cashier' : 'Kembali ke kasir'}
        </a>
        <span>
          {english ? 'Customer display · demo' : 'Layar pelanggan · demo'}
        </span>
      </div>
      <div className="tablet-device">
        <header className="tablet-header">
          <span className="tablet-brand">
            <span>
              <ArrowLeftRight size={20} />
            </span>
            PT Valuta Sejahtera · Senayan
          </span>
          <div>
            <span>Meja 2</span>
            <div className="language-switch" aria-label="Bahasa / Language">
              <button aria-pressed={!english} onClick={() => setLanguage('id')}>
                ID
              </button>
              <button aria-pressed={english} onClick={() => setLanguage('en')}>
                EN
              </button>
            </div>
          </div>
        </header>
        <main className="tablet-content" lang={language}>
          {!session || session.channel === 'qr' ? (
            <div className="tablet-idle">
              <Tablet size={48} />
              <h1>{english ? 'Welcome' : 'Selamat datang'}</h1>
              <p>
                {english
                  ? 'Your cashier will prepare a walk-in session for this display.'
                  : 'Kasir akan menyiapkan sesi walk-in untuk layar ini.'}
              </p>
              <Button onClick={() => navigate('/cashier')}>
                {english ? 'View cashier desk' : 'Lihat meja kasir'}
              </Button>
            </div>
          ) : session.stage === 'identity' ? (
            <div className="liveness-view">
              <h1>
                {session.liveness === 'passed'
                  ? english
                    ? 'Preview complete'
                    : 'Simulasi selesai'
                  : session.liveness === 'failed'
                    ? english
                      ? 'Face not matched'
                      : 'Wajah belum cocok'
                    : english
                      ? 'Look at the camera'
                      : 'Lihat ke kamera'}
              </h1>
              <p>
                {english
                  ? 'Visual verification preview. Your camera is not accessed.'
                  : 'Preview verifikasi visual. Kamera Anda tidak diakses.'}
              </p>
              <div
                className={`face-frame ${session.liveness === 'passed' ? 'passed' : ''}`}
              >
                <UserRound size={86} strokeWidth={1.5} />
              </div>
              <div className="liveness-markers">
                {(english
                  ? ['Face in frame', 'Blink', 'Turn right']
                  : ['Wajah di bingkai', 'Kedipkan mata', 'Tengok ke kanan']
                ).map((label, i) => (
                  <Badge
                    key={label}
                    tone={
                      session.liveness === 'passed' || livenessStep > i
                        ? 'success'
                        : livenessStep === i
                          ? 'primary'
                          : 'warning'
                    }
                  >
                    {label}
                  </Badge>
                ))}
              </div>
              <div className="tablet-actions liveness-actions">
                {session.liveness === 'passed' ? (
                  <Button size="lg" onClick={() => navigate('/cashier')}>
                    {english ? 'Continue with cashier' : 'Lanjut di kasir'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        dispatch({ type: 'liveness', result: 'failed' })
                      }
                    >
                      {english ? 'Simulate failure' : 'Simulasikan gagal'}
                    </Button>
                    <Button
                      size="lg"
                      disabled={!session.identityReady}
                      onClick={() => {
                        if (session.liveness === 'failed') {
                          setLivenessStep(0)
                          dispatch({ type: 'liveness', result: 'running' })
                        } else if (livenessStep < 2)
                          setLivenessStep((previous) => previous + 1)
                        else dispatch({ type: 'liveness', result: 'passed' })
                      }}
                    >
                      {session.liveness === 'failed'
                        ? english
                          ? 'Try again'
                          : 'Coba lagi'
                        : english
                          ? 'Next preview step'
                          : 'Lanjut simulasi'}
                    </Button>
                  </>
                )}
              </div>
              {!session.identityReady && (
                <p className="field-error">
                  {english
                    ? 'Prepare identity data at the cashier first.'
                    : 'Siapkan data identitas di kasir terlebih dahulu.'}
                </p>
              )}
            </div>
          ) : session.stage === 'waiting' && offer ? (
            <div className="tablet-confirmation">
              <p>
                {english
                  ? `Hello, ${session.customer.name} · please check`
                  : `Halo, ${session.customer.name} · mohon periksa`}
              </p>
              <h1>
                {offer.side === 'buy'
                  ? english
                    ? 'You are buying'
                    : 'Anda membeli'
                  : english
                    ? 'You are selling'
                    : 'Anda menjual'}
              </h1>
              <div className="tablet-amount tabular-nums">
                {offer.currency}{' '}
                {english ? offer.amount.replaceAll('.', ',') : offer.amount}
              </div>
              <div className="tablet-summary">
                <span>
                  {english ? 'Rate' : 'Kurs'} <strong>{offer.rate}</strong>
                </span>
                <span>
                  {english ? 'Total' : 'Total'} <strong>Rp{offer.total}</strong>
                </span>
              </div>
              {offer.highValue && (
                <div className="tablet-extra-verification">
                  <ShieldCheck size={22} />
                  <span>
                    {english
                      ? 'Additional face verification · preview complete'
                      : 'Verifikasi wajah tambahan · contoh selesai'}
                  </span>
                </div>
              )}
              {session.customer.newCustomer && (
                <label className="consent-box">
                  <input
                    type="checkbox"
                    checked={session.consent}
                    onChange={(event) =>
                      dispatch({ type: 'consent', value: event.target.checked })
                    }
                  />
                  <span>
                    {english
                      ? 'I agree to use this sample identity data for the transaction preview.'
                      : 'Saya menyetujui penggunaan data identitas contoh ini untuk simulasi transaksi.'}
                  </span>
                </label>
              )}
              <div className="tablet-actions">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    dispatch({ type: 'reject' })
                    navigate('/cashier')
                  }}
                >
                  <X size={18} />
                  {english ? 'Not correct' : 'Tidak sesuai'}
                </Button>
                <Button
                  size="lg"
                  disabled={session.customer.newCustomer && !session.consent}
                  onClick={() => dispatch({ type: 'approve' })}
                >
                  <Check size={18} />
                  {english ? 'Yes, correct' : 'Ya, sesuai'}
                </Button>
              </div>
              <p className="tablet-footnote">
                {english
                  ? 'Review screen only. No real transaction is submitted.'
                  : 'Layar review. Tidak ada transaksi nyata yang dikirim.'}
              </p>
            </div>
          ) : session.stage === 'signature' && offer ? (
            <div className="tablet-signature">
              <h1>
                {english ? 'Sign to confirm' : 'Tanda tangan untuk menyetujui'}
              </h1>
              <p>
                {offer.currency} {offer.amount} · Rp{offer.total}
              </p>
              <SignaturePad
                english={english}
                onSign={() => dispatch({ type: 'sign' })}
              />
            </div>
          ) : session.stage === 'done' ? (
            <div className="tablet-thanks">
              <span className="completion-icon">
                <Check size={44} />
              </span>
              <h1>{english ? 'Thank you' : 'Terima kasih'}</h1>
              <p>
                {english
                  ? 'Transaction preview complete · receipt ready'
                  : 'Simulasi transaksi selesai · struk tersedia'}
              </p>
              <div className="activation-card">
                <QrPreview
                  label={english ? 'Account activation' : 'Aktivasi akun'}
                />
                <p>
                  {english
                    ? 'Visual QR preview for account activation.'
                    : 'Contoh visual QR untuk aktivasi akun pelanggan.'}
                </p>
              </div>
              <Button variant="secondary" onClick={() => navigate('/cashier')}>
                {english ? 'Back to cashier' : 'Kembali ke kasir'}
              </Button>
            </div>
          ) : session.stage === 'cancelled' ? (
            <div className="tablet-idle">
              <X size={44} />
              <h1>{english ? 'Session cancelled' : 'Sesi dibatalkan'}</h1>
              <Button onClick={() => navigate('/cashier')}>
                {english ? 'Back to cashier' : 'Kembali ke kasir'}
              </Button>
            </div>
          ) : (
            <div className="tablet-idle">
              <Check size={44} />
              <h1>
                {session.stage === 'payment'
                  ? english
                    ? 'Signature received'
                    : 'Tanda tangan diterima'
                  : english
                    ? 'Please wait'
                    : 'Mohon tunggu'}
              </h1>
              <p>
                {english
                  ? 'Your cashier will continue the transaction preview.'
                  : 'Kasir akan melanjutkan simulasi transaksi Anda.'}
              </p>
              <Button onClick={() => navigate('/cashier')}>
                {english
                  ? 'Continue payment at cashier'
                  : 'Lanjut pembayaran di kasir'}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
