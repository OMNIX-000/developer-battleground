import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSettings } from '@/store/settings'

function Tooth({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.18 * scale, 0.26 * scale, 0.14 * scale]} />
      <meshStandardMaterial color="#3a3a46" roughness={0.3} metalness={0.7} />
    </mesh>
  )
}

function Teeth({ row, y }: { row: number; y: number }) {
  const teeth: React.ReactNode[] = []
  for (let i = 0; i < 5; i++) {
    const x = -0.5 + i * 0.25
    teeth.push(<Tooth key={`${row}-${i}`} position={[x, y, row > 0 ? 0.55 : 0.45]} scale={1} />)
  }
  return <group>{teeth}</group>
}

function NeonCrack({ position, rotation, color, length }: { position: [number, number, number]; rotation: [number, number, number]; color: string; length: number }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.028, length, 0.028]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function GlowSprite({
  position,
  color,
  size,
  opacity = 0.5,
}: {
  position: [number, number, number]
  color: string
  size: number
  opacity?: number
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const c = new THREE.Color(color)
      const rgb = `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},`
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      g.addColorStop(0, `${rgb}0.9)`)
      g.addColorStop(0.35, `${rgb}0.28)`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 128, 128)
    }
    const t = new THREE.CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [color])

  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  )
}

function SkullRings() {
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringA.current) {
      ringA.current.rotation.z = t * 0.4
      ringA.current.rotation.x = 0.5 + Math.sin(t * 0.2) * 0.15
    }
    if (ringB.current) {
      ringB.current.rotation.z = -t * 0.28
      ringB.current.rotation.y = 0.4 + Math.cos(t * 0.16) * 0.2
    }
  })
  return (
    <>
      <mesh ref={ringA} position={[0, 0.2, 0]}>
        <torusGeometry args={[2.35, 0.018, 8, 80]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ringB} position={[0, 0.1, 0]}>
        <torusGeometry args={[2.7, 0.014, 8, 80]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  )
}

export default function Skull() {
  const groupRef = useRef<THREE.Group>(null)
  const { quality } = useSettings()
  const advanced = quality !== 'LOW'

  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#181820',
        roughness: 0.32,
        metalness: 0.85,
        flatShading: true,
        envMapIntensity: 0.4,
      }),
    [],
  )
  const plate = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2b2b38',
        roughness: 0.38,
        metalness: 0.7,
        flatShading: true,
      }),
    [],
  )
  const dark = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#08080c', roughness: 0.9, flatShading: true }),
    [],
  )
  const socket = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#04040a',
        roughness: 0.4,
        emissive: '#22d3ee',
        emissiveIntensity: advanced ? 1.1 : 0.5,
        flatShading: true,
      }),
    [advanced],
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = 0.5 + Math.sin(t * 0.3) * 0.1
    groupRef.current.rotation.y = Math.sin(t * 0.07) * 0.45
    groupRef.current.rotation.z = Math.sin(t * 0.1 + 1.3) * 0.03
  })

  return (
    <group position={[0, 7.2, -6]} scale={quality === 'LOW' ? 1.3 : 1.55}>
      <group ref={groupRef}>
        {/* Cranium */}
        <mesh material={metal} scale={[1, 1.08, 0.95]}>
          <sphereGeometry args={[1.7, 18, 14]} />
        </mesh>

        {/* Jaw */}
        <mesh material={plate} position={[0, -1.5, 0]} scale={[0.95, 0.5, 0.95]}>
          <sphereGeometry args={[1.1, 12, 9]} />
        </mesh>

        {/* Cheekbones */}
        <mesh material={plate} position={[-1.35, -0.7, 0.05]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
        </mesh>
        <mesh material={plate} position={[1.35, -0.7, -0.05]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
        </mesh>

        {/* Nose cavity */}
        <mesh material={dark} position={[0, -0.55, 1.42]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.24, 0.5, 4]} />
        </mesh>

        {/* Eye sockets — neon cyan */}
        <mesh material={socket} position={[-0.72, 0.05, 1.45]}>
          <sphereGeometry args={[0.52, 14, 10]} />
        </mesh>
        <mesh material={socket} position={[0.72, 0.05, 1.45]}>
          <sphereGeometry args={[0.52, 14, 10]} />
        </mesh>
        {advanced && (
          <>
            <pointLight position={[-1, 0, 2.4]} color="#22d3ee" intensity={4} distance={10} />
            {/* Fake bloom around the eyes */}
            <GlowSprite position={[-0.72, 0.05, 1.62]} color="#22d3ee" size={2.6} opacity={0.55} />
            <GlowSprite position={[0.72, 0.05, 1.62]} color="#22d3ee" size={2.6} opacity={0.55} />
            {/* Rotating energy rings */}
            <SkullRings />
          </>
        )}

        {/* Brow ridge */}
        <mesh material={plate} position={[0, 0.6, 1.15]} scale={[1.85, 0.22, 0.4]}>
          <sphereGeometry args={[1, 12, 8]} />
        </mesh>

        {/* Teeth */}
        <Teeth row={0} y={-1.05} />
        <Teeth row={1} y={-1.85} />

        {/* Neon circuit cracks */}
        <NeonCrack position={[0.3, 0.7, 1.3]} rotation={[0, 0, 0.5]} color="#22d3ee" length={1.1} />
        <NeonCrack position={[-0.4, 0.9, 1.25]} rotation={[0.25, 0, 0.5]} color="#e879f9" length={0.7} />
        <NeonCrack position={[0.05, 0.28, 1.42]} rotation={[0, 0, -0.25]} color="#e879f9" length={0.55} />
        <NeonCrack position={[-0.05, 1.15, 1.3]} rotation={[0, 0, 0.15]} color="#22d3ee" length={0.8} />
        <NeonCrack position={[1.05, 0.35, 0.9]} rotation={[0, 0.5, 0.7]} color="#22d3ee" length={0.5} />
        <NeonCrack position={[-1.05, 0.35, 0.9]} rotation={[0, -0.5, -0.7]} color="#e879f9" length={0.5} />
      </group>

      {/* Neon studio lighting */}
      {advanced && (
        <>
          <spotLight
            position={[0, 16, 2]}
            angle={0.7}
            penumbra={1}
            intensity={55}
            distance={32}
            color="#a78bfa"
          />
          <pointLight position={[-6, 5, 3]} intensity={12} distance={22} color="#22d3ee" />
          <pointLight position={[6, 4, 4]} intensity={10} distance={18} color="#e879f9" />
        </>
      )}
    </group>
  )
}