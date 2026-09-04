import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertOctagon } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import TacticalButton from '@/components/ui/TacticalButton'

export default function NotFoundPage() {
  return (
    <PageShell title="Sector Not Found" subtitle="ERROR 404 // COORDINATES OUT OF RANGE">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <AlertOctagon className="h-20 w-20 text-tactical-danger" />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl font-black uppercase tracking-widest text-white">
          4<span className="text-tactical-accent">0</span>4
        </h1>
        <p className="mt-2 max-w-md font-mono text-sm leading-relaxed text-gray-500">
          The sector you are attempting to reach does not exist on the tactical map.
          It may have been destroyed, relocated, or never deployed.
        </p>
        <div className="mt-8">
          <Link to="/">
            <TacticalButton>Return to Lobby</TacticalButton>
          </Link>
        </div>
      </div>
    </PageShell>
  )
}