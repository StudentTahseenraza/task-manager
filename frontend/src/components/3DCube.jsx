import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'
import { useRef, useState } from 'react'

function AnimatedCube() {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      
      if (hovered) {
        meshRef.current.scale.x = 1.2
        meshRef.current.scale.y = 1.2
        meshRef.current.scale.z = 1.2
      } else {
        meshRef.current.scale.x = 1
        meshRef.current.scale.y = 1
        meshRef.current.scale.z = 1
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <MeshDistortMaterial
        color="#0ea5e9"
        speed={2}
        distort={0.4}
        radius={1}
      />
    </mesh>
  )
}

function FloatingSphere() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#8b5cf6"
        speed={1.5}
        distort={0.6}
        radius={1}
      />
    </Sphere>
  )
}

export default function ThreeDCube() {
  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden perspective-2000">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedCube />
        <FloatingSphere position={[3, 0, 0]} />
      </Canvas>
    </div>
  )
}