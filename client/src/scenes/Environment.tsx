import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const terrainPixelCount = 24

export function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)
  const data: number[] = []
  for (let i = 0; i < terrainPixelCount * terrainPixelCount; i++) data.push(0)

  const geometry = (
    <planeGeometry args={[120, 120, terrainPixelCount, terrainPixelCount]} />
  )

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      {geometry}
      <meshStandardMaterial color="#08070f" roughness={0.95} metalness={0.1} wireframe={false} />
    </mesh>
  )
}

function Building({
  position,
  height,
  color = '#12202c',
}: {
  position: [number, number, number]
  height: number
  color?: string
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[4, height, 4]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.3} />
    </mesh>
  )
}

export function Structures() {
  return (
    <group>
      <Building position={[-18, 3, -14]} height={6} />
      <Building position={[-12, 5.5, -20]} height={11} color="#16222f" />
      <Building position={[16, 2.5, -18]} height={5} />
      <Building position={[22, 7, -10]} height={14} color="#182634" />
      <Building position={[8, 4, -30]} height={8} />
      <Building position={[-26, 3.5, -6]} height={7} color="#13212d" />
    </group>
  )
}

export function Tower({ position }: { position: [number, number, number] }) {
  const topRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (topRef.current) {
      topRef.current.rotation.y = state.clock.elapsedTime * 2
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[0.15, 0.4, 12, 6]} />
        <meshStandardMaterial color="#1b2c39" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 12, 0]} ref={topRef}>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2} />
      </mesh>
      {/* Beacon */}
      <pointLight position={[0, 12.5, 0]} color="#2dd4bf" intensity={8} distance={18} />
    </group>
  )
}

export function CommunicationTowers() {
  return (
    <group>
      <Tower position={[-30, 0, -30]} />
      <Tower position={[28, 0, -26]} />
      <Tower position={[-4, 0, -38]} />
    </group>
  )
}

function NeonGridRing() {
  const ringRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ringRef.current) return
    ringRef.current.rotation.x = (state.clock.elapsedTime * 0.12) % (Math.PI * 2)
  })
  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <ringGeometry args={[4.2, 4.55, 64]} />
      <meshBasicMaterial color="#e879f9" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function HologramTower({ position }: { position: [number, number, number] }) {
  const beamRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.position.y = -1.2 + ((state.clock.elapsedTime * 0.5) % 6)
    }
  })
  return (
    <group position={position}>
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.15, 0.4, 12, 6]} />
        <meshStandardMaterial color="#14141c" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 8.5, 0]}>
        <torusGeometry args={[0.9, 0.05, 8, 32]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <mesh ref={beamRef} position={[0, 3, 0]}>
        <boxGeometry args={[0.08, 1.4, 0.08]} />
        <meshBasicMaterial color="#e879f9" />
      </mesh>
      <pointLight position={[0, 8.5, 0]} color="#22d3ee" intensity={6} distance={20} />
    </group>
  )
}

export function CyberSkylines() {
  return (
    <group>
      <HologramTower position={[-24, 0, -24]} />
      <HologramTower position={[22, 0, -18]} />
      <NeonGridRing />
    </group>
  )
}

export function GroundGrid() {
  return (
    <gridHelper
      args={[100, 26, '#22d3ee', '#1a1033']}
      position={[0, -1.2, 0]}
    />
  )
}

export function Fog() {
  return (
    <fogExp2 attach="fog" args={['#06060f', 0.02]} />
  )
}

export function SearchLightBeam({ position, angle }: { position: [number, number, number]; angle: number }) {
  const beamRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!beamRef.current) return
    beamRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + angle) * 0.35
  })

  return (
    <group position={position}>
      <mesh ref={beamRef} position={[0, 12, 0]}>
        <coneGeometry args={[2.4, 24, 16, 1, true]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[0, 1, 0]} color="#0ea5e9" intensity={3} distance={20} />
    </group>
  )
}

export function SearchLights() {
  return (
    <group>
      <SearchLightBeam position={[-10, 0, -8]} angle={0} />
      <SearchLightBeam position={[14, 0, -2]} angle={2} />
    </group>
  )
}

export function SceneParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useRef<Float32Array>(new Float32Array(count * 3))
  const colors = useRef<Float32Array>(new Float32Array(count * 3))

  const cyan = new THREE.Color('#22d3ee')
  const magenta = new THREE.Color('#e879f9')

  for (let i = 0; i < count; i++) {
    positions.current[i * 3] = (Math.random() - 0.5) * 90
    positions.current[i * 3 + 1] = Math.random() * 40
    positions.current[i * 3 + 2] = (Math.random() - 0.5) * 90
    const c = Math.random() > 0.45 ? cyan : magenta
    colors.current[i * 3] = c.r
    colors.current[i * 3 + 1] = c.g
    colors.current[i * 3 + 2] = c.b
  }

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(time * 0.5 + i) * 0.004
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  const geometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry())
  geometry.current.setAttribute('position', new THREE.BufferAttribute(positions.current, 3))
  geometry.current.setAttribute('color', new THREE.BufferAttribute(colors.current, 3))

  return (
    <points ref={ref} geometry={geometry.current}>
      <pointsMaterial
        vertexColors
        size={0.22}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  )
}

export function Starfield({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const geometry = useRef<THREE.BufferGeometry>()

  if (!geometry.current) {
    const g = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 0.85 + 0.15)
      const r = 160
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.current = g
  }

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.004
  })

  return (
    <points ref={ref} geometry={geometry.current}>
      <pointsMaterial size={0.55} color="#9be8ff" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function SkylinePiece({
  angle,
  height,
  width,
  accent,
}: {
  angle: number
  height: number
  width: number
  accent: boolean
}) {
  const radius = 62
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  return (
    <group position={[x, 0, z]} rotation={[0, -angle, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial
          color="#0a0f1e"
          emissive={accent ? '#e879f9' : '#101a33'}
          emissiveIntensity={accent ? 1.4 : 0.9}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>
      {accent && (
        <mesh position={[0, height + 1.4, 0]}>
          <boxGeometry args={[0.15, 2.8, 0.15]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  )
}

export function NeonSkyline() {
  const pieces: React.ReactNode[] = []
  for (let i = 0; i < 26; i++) {
    const angle = (i / 26) * Math.PI * 2
    pieces.push(
      <SkylinePiece
        key={i}
        angle={angle + pseudoRandom(i) * 0.12}
        height={3 + pseudoRandom(i + 1) * 11}
        width={2.4 + pseudoRandom(i + 2) * 2}
        accent={i % 6 === 0}
      />,
    )
  }
  return <group position={[0, -1.2, 0]}>{pieces}</group>
}

export function HorizonGlow() {
  return (
    <group position={[0, 1.4, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[60, 64, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[64.4, 64.9, 96]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}