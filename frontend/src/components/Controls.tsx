import { useState, useEffect, useRef } from 'react';

// Throttle utility to limit how often we send data over the network (e.g. 60 FPS)
function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

interface ControlsProps {
  onMatrixChange: (matrix: number[][]) => void;
}

export default function Controls({ onMatrixChange }: ControlsProps) {
  // 3x3 Identity matrix by default
  const [matrix, setMatrix] = useState<number[][]>([
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0]
  ]);

  // Throttle updates to ~60 frames per second (1000ms / 60 ≈ 16ms)
  const throttledMatrix = useThrottle(matrix, 16);

  useEffect(() => {
    onMatrixChange(throttledMatrix);
  }, [throttledMatrix, onMatrixChange]);

  const handleChange = (r: number, c: number, val: number) => {
    const newMatrix = [...matrix.map(row => [...row])];
    newMatrix[r][c] = val;
    setMatrix(newMatrix);
  };

  return (
    <div className="absolute top-6 left-6 p-4 bg-zinc-900/80 text-white rounded-xl shadow-xl backdrop-blur-md border border-zinc-700/70 w-72 z-10">
      <h3 className="text-base font-semibold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
        Linear Transformation
      </h3>
      
      <div className="grid grid-cols-3 gap-2.5">
        {matrix.map((row, r) =>
          row.map((val, c) => (
            <div key={`${r}-${c}`} className="flex flex-col items-center">
              <input
                type="number"
                step="0.1"
                value={val}
                onChange={(e) => handleChange(r, c, parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-800 text-white border border-zinc-600 rounded px-1.5 py-1 text-center font-mono text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={val}
                onChange={(e) => handleChange(r, c, parseFloat(e.target.value))}
                className="w-full mt-1.5 accent-emerald-500 cursor-pointer h-1.5"
              />
            </div>
          ))
        )}
      </div>

      <button 
        onClick={() => setMatrix([[1,0,0],[0,1,0],[0,0,1]])}
        className="mt-3.5 w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-lg text-xs font-medium tracking-wide transition-colors border border-zinc-700"
      >
        Reset Identity Matrix
      </button>
    </div>
  );
}
