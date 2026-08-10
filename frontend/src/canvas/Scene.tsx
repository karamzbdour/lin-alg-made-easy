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
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // This hook runs every time 'vertices' or 'indices' change
  useEffect(() => {
    if (!geometryRef.current || !vertices || !indices) return;

    // 1. Tell Three.js where the points are in space
    // We create a BufferAttribute out of our Float32Array. 
    // The '3' tells WebGL: "Group these floats into chunks of 3 (x, y, z)"
    geometryRef.current.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    );

    // 2. Tell Three.js how to connect the points into triangles
    // We create a BufferAttribute out of our Uint16Array.
    // The '1' tells WebGL: "Read these integers one by one"
    geometryRef.current.setIndex(
      new THREE.BufferAttribute(indices, 1)
    );

    // 3. Recalculate lighting normals
    // Since the shape might have stretched or rotated, we need WebGL to 
    // recalculate how light bounces off the new surfaces.
    geometryRef.current.computeVertexNormals();

    // 4. Important: Tell the GPU that the data has been updated and needs to be re-drawn!
    geometryRef.current.attributes.position.needsUpdate = true;
    if (geometryRef.current.index) {
        geometryRef.current.index.needsUpdate = true;
    }

  }, [vertices, indices]);

  return (
    <mesh ref={meshRef}>
      {/* We explicitly define an empty BufferGeometry that we populate via the ref */}
      <bufferGeometry ref={geometryRef} />
      
      {/* A nice semi-transparent wireframe material so we can see the math in action */}
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
