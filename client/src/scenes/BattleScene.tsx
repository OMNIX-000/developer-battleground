import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useSettings } from '@/store/settings'
import { Terrain, GroundGrid, CyberSkylines, SceneParticles, NeonSkyline, HorizonGlow, Starfield } from './Environment'
import Skull from './Skull'
import CameraController from './CameraController'

export default function BattleScene() {
  const { quality } = useSettings()
  const high = quality === 'HIGH'
  const medium = quality === 'MEDIUM'
  const particleCount = high ? 700 : medium ? 350 : 90

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 10, 16], fov: 45, near: 0.1, far: 500 }}
        dpr={[1, 1.5]}
        gl={{ antialias: quality !== 'LOW', powerPreference: 'low-power' }}
        style={{ background: '#000000' }}
      >
        <color attach="background" args={['#05050c']} />
        <Suspense fallback={null}>
          <CameraController />
          <ambientLight intensity={0.35} color="#7dd3fc" />
          <fogExp2 attach="fog" args={['#05050c', 0.02]} />
          <Skull />
          <Terrain />
          <GroundGrid />
          <CyberSkylines />
          {(medium || high) && (
            <>
              <HorizonGlow />
              <NeonSkyline />
            </>
          )}
          {high && <Starfield />}
          <SceneParticles count={particleCount} />
        </Suspense>
      </Canvas>
    </div>
  )
}