import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

function Pineapple({z}) {
  const componentRef = useRef();
  const {viewport, camera} = useThree();
  const {width, height} = viewport.getCurrentViewport(camera, [0, 0, z]);

  const { nodes, materials } = useGLTF('/pineapple-v2-transformed.glb');
 
  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI, 
    rY: Math.random() * Math.PI, 
    rZ: Math.random() * Math.PI, 
  });

  useFrame((state) => {
    componentRef.current.rotation.set((data.rX += 0.001) , (data.rY += 0.001), (data.rZ += 0.001));
    componentRef.current.position.set(data.x * width, (data.y += 0.025), z);
    if(data.y > height){
      data.y = -height;
    }
  })

  return (
    <mesh
      ref={componentRef}
      geometry={nodes.pineapple.geometry} 
      material={materials.skin} 
      scale={0.3} 
    />
  )
}

export default function App({count = 100, depth = 60}) {
  return (
    <Canvas gl={{alpha: false}} camera={ {near: 0.01, far: 110, fov: 30}}>
      <color attach="background" args={["#e0e038"]} />
      <spotLight position={[10, 10, 10]} intensity={0.3}/>
      <Suspense fallback={null}>
        <Environment preset='sunset' />
         {Array.from({ length: count}, (_,i) => (<Pineapple key={i} z={-(i/count) * depth - 20} />))}
         <EffectComposer>
           <DepthOfField target={[0, 0, depth/2]}  focalLength={0.5} bokehScale={4} height={700}/>
         </EffectComposer>
      </Suspense>
    </Canvas>
  )
}