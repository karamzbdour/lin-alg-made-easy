'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Scene from '../canvas/Scene';
import Controls from '../components/Controls';
import { WSClient } from '../lib/websocket';

export default function Home() {
  const [vertices, setVertices] = useState<Float32Array | null>(null);
  const [indices, setIndices] = useState<Uint16Array | null>(null);
  const wsClientRef = useRef<WSClient | null>(null);

  useEffect(() => {
    // 1. Initialize WebSocket Connection to the Python Backend
    const client = new WSClient("ws://localhost:8000/ws/sphere");
    
    // 2. Handshake Phase: Catch the initial JSON containing the mesh topology
    client.onInit = (verts, inds) => {
      setVertices(verts);
      setIndices(inds);
    };

    // 3. Update Phase: Catch the lightning-fast binary float array
    client.onUpdate = (verts) => {
      setVertices(verts);
    };

    client.connect();
    wsClientRef.current = client;

    // Cleanup on unmount
    return () => {
      if (wsClientRef.current) {
        // Handle WS cleanup here if implemented
      }
    };
  }, []);

  const handleMatrixChange = useCallback((matrix: number[][]) => {
    if (wsClientRef.current) {
      wsClientRef.current.sendMatrix(matrix);
    }
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-zinc-950 font-sans">
      
      {/* The UI panel overlay */}
      <Controls onMatrixChange={handleMatrixChange} />

      {/* The 3D WebGL Canvas */}
      <Scene vertices={vertices} indices={indices} />

    </main>
  );
}
