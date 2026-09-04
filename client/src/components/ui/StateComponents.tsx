import { AlertTriangle, Loader2, PackageOpen, WifiOff } from 'lucide-react'
import TacticalButton from './TacticalButton'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'CONNECTION LOST',
  message = 'Unable to reach the command network. Check your connection and retry.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 border border-tactical-danger/30 bg-tactical-danger/5 p-8 text-center">
      <WifiOff className="h-10 w-10 text-tactical-danger" />
      <div>
        <h3 className="font-display text-lg font-bold uppercase tracking-widest text-tactical-danger">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{message}</p>
      </div>
      {onRetry && (
        <TacticalButton variant="danger" onClick={onRetry}>
          Retry Connection
        </TacticalButton>
      )}
    </div>
  )
}

export function LoadingState({ message = 'LOADING DATA...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-tactical-accent" />
      <p className="font-display text-sm uppercase tracking-widest text-gray-400">{message}</p>
    </div>
  )
}

export function EmptyState({ title = 'NO DATA FOUND', message = 'The sector is clear. No records detected.' }: { title?: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-white/10 bg-black/30 p-12 text-center">
      <PackageOpen className="h-10 w-10 text-gray-500" />
      <h3 className="font-display text-base font-bold uppercase tracking-widest text-gray-300">{title}</h3>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}

export function ErrorBoundary({
  error,
}: {
  error: unknown
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-tactical-danger/40 bg-tactical-danger/5 p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-tactical-danger" />
      <p className="font-display text-sm uppercase tracking-widest text-tactical-danger">
        SYSTEM FAULT: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    </div>
  )
}