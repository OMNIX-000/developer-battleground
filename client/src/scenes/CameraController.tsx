import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TARGET = new THREE.Vector3(0, 7.2, -6)

export default function CameraController() {
  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera
    const t = state.clock.elapsedTime
    const radius = 16 + Math.sin(t * 0.045) * 1.4
    const angle = t * 0.045

    cam.position.x = Math.sin(angle) * radius * 0.7
    cam.position.z = Math.cos(angle) * radius
    cam.position.y = 8.5 + Math.sin(t * 0.11) * 1.6
    cam.lookAt(TARGET)
    if (cam.fov !== 45) {
      cam.fov = 45
      cam.updateProjectionMatrix()
    }
  })

  return null
}