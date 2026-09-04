import { Suspense, lazy, useState } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from '@/components/hud/BottomNav'
import TopBarHUD from '@/components/hud/TopBarHUD'
import NotificationToasts from '@/components/hud/NotificationToasts'
import BackgroundLayers from '@/components/common/BackgroundLayers'
import { supportsWebGL } from '@/utils/webgl'
import { useSettings } from '@/store/settings'
import { LoadingState } from '@/components/ui/StateComponents'

const BattleScene = lazy(() => import('@/scenes/BattleScene'))

export default function MainLayout() {
  const [webgl] = useState(supportsWebGL())
  const { quality } = useSettings()
  const use3D = webgl && quality !== 'LOW'

  return (
    <div className="scanlines relative min-h-screen bg-tactical-bg">
      {use3D ? (
        <Suspense fallback={<BackgroundLayers />}>
          <BattleScene />
        </Suspense>
      ) : (
        <BackgroundLayers />
      )}

      <TopBarHUD />
      <NotificationToasts />

      <main className="relative z-10 pb-24 pt-20">
        <Suspense fallback={<div className="flex justify-center pt-32"><LoadingState message="LOADING SECTOR..." /></div>}>
          <Outlet />
        </Suspense>
      </main>

      <BottomNav />
    </div>
  )
}