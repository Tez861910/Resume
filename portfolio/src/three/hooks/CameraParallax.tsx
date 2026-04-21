import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

interface CameraParallaxProps {
  /** How far the camera shifts horizontally (world units). */
  strength?: number
  /** How far the camera shifts vertically (world units). */
  verticalStrength?: number
  /** Lerp factor — lower = smoother / lazier follow. */
  lerpFactor?: number
}

/**
 * Render-less R3F component.
 * Mounts inside a <Canvas> and gently nudges the perspective camera toward
 * the normalised mouse position, giving every scene a parallax depth effect
 * without requiring OrbitControls or any external state.
 *
 * Usage:
 *   <Canvas>
 *     <CameraParallax strength={0.4} verticalStrength={0.2} />
 *     …scene children…
 *   </Canvas>
 */
export default function CameraParallax({
  strength = 0.4,
  verticalStrength = 0.2,
  lerpFactor = 0.04,
}: CameraParallaxProps): null {
  const mouse = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalise to [-1, 1] — centre of screen is (0, 0)
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    const targetX = mouse.current.x * strength
    const targetY = mouse.current.y * verticalStrength

    // Smooth lerp toward target each frame
    camera.position.x += (targetX - camera.position.x) * lerpFactor
    camera.position.y += (targetY - camera.position.y) * lerpFactor

    // Always look back at the scene origin so geometry stays centred
    camera.lookAt(0, 0, 0)
  })

  return null
}
