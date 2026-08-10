'use client';

import React from 'react';
import { Line, Text } from '@react-three/drei';

export interface AxesProps {
  /** Length of each axis line from origin. Default is 5. */
  length?: number;
  /** Width of the axis lines in pixels. Default is 2. */
  lineWidth?: number;
  /** Whether to display numerical tick marks along the axes. Default is true. */
  showTicks?: boolean;
  /** Size of tick mark line segments. Default is 0.12. */
  tickSize?: number;
  /** Step interval between consecutive tick marks. Default is 1. */
  tickStep?: number;
  /** Custom colors for the X, Y, and Z axes. */
  colors?: {
    x?: string;
    y?: string;
    z?: string;
  };
  /** Scale factor to determine what values ticks represent. Default is 1. */
  scaleFactor?: number;
}

const DEFAULT_COLORS = {
  x: '#ef4444', // Vibrant Red
  y: '#22c55e', // Emerald Green
  z: '#3b82f6', // Bright Blue
};

export default function Axes({
  length = 5,
  lineWidth = 2,
  showTicks = true,
  tickSize = 0.12,
  tickStep = 1,
  colors = DEFAULT_COLORS,
  scaleFactor = 1,
}: AxesProps) {
  const colorX = colors?.x ?? DEFAULT_COLORS.x;
  const colorY = colors?.y ?? DEFAULT_COLORS.y;
  const colorZ = colors?.z ?? DEFAULT_COLORS.z;

  // Generate integer tick values along positive and negative directions (excluding origin)
  const ticks: number[] = [];
  for (let i = -Math.floor(length); i <= Math.floor(length); i += tickStep) {
    if (i !== 0) {
      ticks.push(i);
    }
  }

  return (
    <group name="custom-axes">
      {/* -------------------- X-AXIS (RED) -------------------- */}
      {/* Positive X axis line */}
      <Line
        points={[
          [0, 0, 0],
          [length, 0, 0],
        ]}
        color={colorX}
        lineWidth={lineWidth}
      />
      {/* Negative X axis line (dashed) */}
      <Line
        points={[
          [-length, 0, 0],
          [0, 0, 0],
        ]}
        color={colorX}
        lineWidth={lineWidth * 0.75}
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />
      {/* X Axis Label */}
      <Text
        position={[length + 0.4, 0, 0]}
        fontSize={0.35}
        color={colorX}
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>

      {/* X-axis Ticks & Labels */}
      {showTicks &&
        ticks.map((t) => (
          <React.Fragment key={`x-tick-${t}`}>
            <Line
              points={[
                [t, -tickSize, 0],
                [t, tickSize, 0],
              ]}
              color={colorX}
              lineWidth={lineWidth * 0.7}
            />
            <Text
              position={[t, -tickSize - 0.2, 0]}
              fontSize={0.2}
              color={colorX}
              anchorX="center"
              anchorY="top"
            >
              {Number((t * scaleFactor).toFixed(4)).toString()}
            </Text>
          </React.Fragment>
        ))}

      {/* -------------------- Y-AXIS (GREEN) -------------------- */}
      {/* Positive Y axis line */}
      <Line
        points={[
          [0, 0, 0],
          [0, length, 0],
        ]}
        color={colorY}
        lineWidth={lineWidth}
      />
      {/* Negative Y axis line (dashed) */}
      <Line
        points={[
          [0, -length, 0],
          [0, 0, 0],
        ]}
        color={colorY}
        lineWidth={lineWidth * 0.75}
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />
      {/* Y Axis Label */}
      <Text
        position={[0, length + 0.4, 0]}
        fontSize={0.35}
        color={colorY}
        anchorX="center"
        anchorY="middle"
      >
        Y
      </Text>

      {/* Y-axis Ticks & Labels */}
      {showTicks &&
        ticks.map((t) => (
          <React.Fragment key={`y-tick-${t}`}>
            <Line
              points={[
                [-tickSize, t, 0],
                [tickSize, t, 0],
              ]}
              color={colorY}
              lineWidth={lineWidth * 0.7}
            />
            <Text
              position={[-tickSize - 0.15, t, 0]}
              fontSize={0.2}
              color={colorY}
              anchorX="right"
              anchorY="middle"
            >
              {Number((t * scaleFactor).toFixed(4)).toString()}
            </Text>
          </React.Fragment>
        ))}

      {/* -------------------- Z-AXIS (BLUE) -------------------- */}
      {/* Positive Z axis line */}
      <Line
        points={[
          [0, 0, 0],
          [0, 0, length],
        ]}
        color={colorZ}
        lineWidth={lineWidth}
      />
      {/* Negative Z axis line (dashed) */}
      <Line
        points={[
          [0, 0, -length],
          [0, 0, 0],
        ]}
        color={colorZ}
        lineWidth={lineWidth * 0.75}
        dashed
        dashSize={0.2}
        gapSize={0.1}
      />
      {/* Z Axis Label */}
      <Text
        position={[0, 0, length + 0.4]}
        fontSize={0.35}
        color={colorZ}
        anchorX="center"
        anchorY="middle"
      >
        Z
      </Text>

      {/* Z-axis Ticks & Labels */}
      {showTicks &&
        ticks.map((t) => (
          <React.Fragment key={`z-tick-${t}`}>
            <Line
              points={[
                [-tickSize, 0, t],
                [tickSize, 0, t],
              ]}
              color={colorZ}
              lineWidth={lineWidth * 0.7}
            />
            <Text
              position={[-tickSize - 0.15, 0, t]}
              fontSize={0.2}
              color={colorZ}
              anchorX="right"
              anchorY="middle"
            >
              {Number((t * scaleFactor).toFixed(4)).toString()}
            </Text>
          </React.Fragment>
        ))}

      {/* Origin marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
