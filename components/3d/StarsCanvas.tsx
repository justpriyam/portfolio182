'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';
// @ts-expect-error - maath types not fully available
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

interface StarsProps {
  count?: number;
}

function Stars({ count = 5000 }: StarsProps) {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(count * 3), { radius: 1.2 })
  );

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#22d3ee"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

interface StarsCanvasProps {
  className?: string;
  count?: number;
}

export default function StarsCanvas({ className = '', count }: StarsCanvasProps) {
  return (
    <div className={`w-full h-full absolute inset-0 z-[1] ${className}`}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars count={count} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}
