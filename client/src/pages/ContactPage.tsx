import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import GlassPanel from '@/components/ui/GlassPanel'
import TacticalButton from '@/components/ui/TacticalButton'
import { contactService } from '@/services/contactService'
import { isValidEmail } from '@/utils/helpers'
import { useSound } from '@/store/settings'
import { useNotifications } from '@/store/notifications'

type SendPhase = 'idle' | 'validating' | 'connecting' | 'transmitting' | 'done' | 'error'

const phaseText: Record<Exclude<SendPhase, 'idle'>, string> = {
  validating: 'VALIDATING TRANSMISSION...',
  connecting: 'ESTABLISHING CONNECTION...',
  transmitting: 'TRANSMITTING DATA...',
  done: 'MESSAGE DELIVERED',
  error: 'TRANSMISSION FAILED',
}

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [phase, setPhase] = useState<SendPhase>('idle')
  const play = useSound()
  const { push } = useNotifications()

  const validate = (): boolean => {
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'OPERATOR NAME REQUIRED'
    if (!isValidEmail(email)) next.email = 'VALID EMAIL REQUIRED'
    if (message.trim().length < 10) next.message = 'MESSAGE MUST BE AT LEAST 10 CHARACTERS'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase === 'done' || phase === 'transmitting') return
    setErrors({})

    if (!validate()) {
      play('notification')
      return
    }

    setPhase('validating')
    await wait(400)
    setPhase('connecting')
    await wait(500)
    setPhase('transmitting')

    try {
      await contactService.send({ name, email, message })
      setPhase('done')
      play('mission')
      push({ title: 'TRANSMISSION DELIVERED', subtitle: 'Message received by command.', type: 'mission' })
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setPhase('idle'), 4000)
    } catch {
      setPhase('error')
      play('notification')
    }
  }

  const inputClass =
    'w-full border bg-black/40 px-4 py-3 font-mono text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-tactical-accent/60'

  return (
    <PageShell title="Communication Terminal" subtitle="ENCRYPTED CHANNEL // TRANSMISSION TO OPERATOR">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <GlassPanel className="p-6">
          <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-tactical-accent">
            <Radio className="h-4 w-4 animate-pulse" /> CHANNEL 9-N // SECURE LINE OPEN
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block font-display text-xs uppercase tracking-widest text-gray-400">
                Operator Name <span className="text-tactical-danger">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="YOUR CALL-SIGN"
                className={`${inputClass} ${errors.name ? 'border-tactical-danger/70' : 'border-white/15'}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
              />
              {errors.name && <p id="contact-name-error" className="mt-1 font-mono text-xs text-tactical-danger">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-1.5 block font-display text-xs uppercase tracking-widest text-gray-400">
                Contact Frequency <span className="text-tactical-danger">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="OPERATOR@DOMAIN.COM"
                className={`${inputClass} ${errors.email ? 'border-tactical-danger/70' : 'border-white/15'}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
              />
              {errors.email && <p id="contact-email-error" className="mt-1 font-mono text-xs text-tactical-danger">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-1.5 block font-display text-xs uppercase tracking-widest text-gray-400">
                Transmission Payload <span className="text-tactical-danger">*</span>
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="TYPE YOUR MESSAGE TO COMMAND..."
                className={`${inputClass} resize-y ${errors.message ? 'border-tactical-danger/70' : 'border-white/15'}`}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
              />
              {errors.message && <p id="contact-message-error" className="mt-1 font-mono text-xs text-tactical-danger">{errors.message}</p>}
            </div>

            <div className="flex items-center gap-4">
              <TacticalButton type="submit" disabled={phase === 'transmitting' || phase === 'done'}>
                <Send className="mr-2 inline h-4 w-4" />
                Send Transmission
              </TacticalButton>

              <AnimatePresence mode="wait">
                {phase !== 'idle' && (
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
                  >
                    {phase === 'validating' && <Loader2 className="h-4 w-4 animate-spin text-amber-400" />}
                    {phase === 'connecting' && <Loader2 className="h-4 w-4 animate-spin text-sky-400" />}
                    {phase === 'transmitting' && <Loader2 className="h-4 w-4 animate-spin text-tactical-accent" />}
                    {phase === 'done' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    {phase === 'error' && <AlertTriangle className="h-4 w-4 text-tactical-danger" />}
                    <span className={
                      phase === 'done' ? 'text-emerald-400'
                        : phase === 'error' ? 'text-tactical-danger'
                        : 'text-tactical-accent'
                    }>
                      {phaseText[phase]}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </GlassPanel>

        <div className="space-y-4">
          <GlassPanel className="p-5">
            <p className="mb-3 font-display text-xs uppercase tracking-widest text-tactical-accent">Encrypted Channels</p>
            <ul className="space-y-2 font-mono text-xs">
              <li className="flex items-center justify-between"><span className="text-gray-500">EMAIL</span><span className="text-gray-300">suprit@example.com</span></li>
              <li className="flex items-center justify-between"><span className="text-gray-500">GITHUB</span><a href="https://github.com/supritpanda" target="_blank" rel="noreferrer" className="text-tactical-accent hover:underline">github.com/supritpanda</a></li>
              <li className="flex items-center justify-between"><span className="text-gray-500">LINKEDIN</span><a href="https://linkedin.com/in/supritpanda" target="_blank" rel="noreferrer" className="text-tactical-accent hover:underline">/in/supritpanda</a></li>
            </ul>
          </GlassPanel>

          <GlassPanel className="p-5">
            <p className="mb-2 font-display text-xs uppercase tracking-widest text-tactical-accent">Transmission Protocol</p>
            <p className="font-mono text-xs leading-relaxed text-gray-500">
              All incoming transmissions are stored in the command database and reviewed by the
              operator. A response is typically deployed within 24-48 hours.
            </p>
          </GlassPanel>
        </div>
      </div>
    </PageShell>
  )
}

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration))
}