'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Axes from './Axes';

// -- mock arrays for now --
interface SceneProps {
  vertices: Float32Array | null;
  indices: Uint16Array | null;
}

const DynamicMesh: React.FC<SceneProps> = ({ vertices, indices }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // 1. Full Geometry Re-allocation on Topology Change (e.g. Vector -> Sphere -> Cube)
  useEffect(() => {
    if (!vertices || !indices) return;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    if (meshRef.current) {
      const oldGeometry = meshRef.current.geometry;
      meshRef.current.geometry = geometry;
      if (oldGeometry) oldGeometry.dispose();
    }

    return () => {
      geometry.dispose();
    };
  }, [indices]);

  // 2. High-speed In-Place Vertex Updates on Matrix Transformations
  useEffect(() => {
    if (!meshRef.current || !vertices) return;
    const geometry = meshRef.current.geometry;
    if (!geometry) return;

    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    if (posAttr && posAttr.count === vertices.length / 3) {
      posAttr.set(vertices);
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  }, [vertices]);

  return (
    <mesh ref={meshRef}>
      {/* Semi-transparent wireframe material to visualize linear transformations */}
      <meshStandardMaterial 
        color="#00ffcc" 
        wireframe={true} 
        transparent={true} 
        opacity={0.8} 
      />
    </mesh>
  );
};

export default function Scene({ vertices, indices }: SceneProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    setZoomLevel((prev) => {
      const zoomFactor = 1.1;
      if (e.deltaY > 0) return prev * zoomFactor;
      if (e.deltaY < 0) return prev / zoomFactor;
      return prev;
    });
  }, []);

  return (
    <div 
      style={{ width: '100vw', height: '100vh', background: '#111' }}
      onWheel={handleWheel}
    >
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <Axes length={5} scaleFactor={zoomLevel} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <group scale={[1 / zoomLevel, 1 / zoomLevel, 1 / zoomLevel]}>
          <DynamicMesh vertices={vertices} indices={indices} />
        </group>
        
        {/* Allows the user to rotate and zoom the camera with their mouse */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
