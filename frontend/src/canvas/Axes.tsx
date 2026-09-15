'use client';

import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Line, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export interface AxesProps {
  /** Explicit length of each axis line from origin. If omitted, dynamically calculated. */
  length?: number;
  /** Width of the axis lines in pixels. Default is 2. */
  lineWidth?: number;
  /** Whether to display numerical tick marks along the axes. Default is true. */
  showTicks?: boolean;
  /** Fixed size of tick mark line segments. If omitted, dynamically scaled. */
  tickSize?: number;
  /** Step interval between consecutive tick marks. If omitted, computed adaptively. */
  tickStep?: number;
  /** Custom colors for the X, Y, and Z axes. */
  colors?: {
    x?: string;
    y?: string;
    z?: string;
  };
}

const DEFAULT_COLORS = {
  x: '#ef4444', // Vibrant Red
  y: '#22c55e', // Emerald Green
  z: '#3b82f6', // Bright Blue
};

/**
 * Calculates standard "nice" tick intervals (1, 2, 5 * 10^k)
 * based on the visible span of the camera frustum.
 */
function getAdaptiveTickStep(visibleSpan: number, targetTicks = 8): number {
  if (visibleSpan <= 0) return 1;
  const roughStep = visibleSpan / targetTicks;
  const power = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalized = roughStep / power;

  let factor = 1;
  if (normalized > 7.5) {
    factor = 10;
  } else if (normalized > 3.5) {
    factor = 5;
  } else if (normalized > 1.5) {
    factor = 2;
  } else {
    factor = 1;
  }

  const step = factor * power;
  return Number(step.toPrecision(10));
}

/**
 * Formats tick coordinate values cleanly, using scientific notation
 * only for very large or microscopic values.
 */
function formatTickLabel(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 1e6 || (abs < 1e-3 && abs !== 0)) {
    return val.toExponential(2);
  }
  return Number(val.toPrecision(6)).toString();
}

export default function Axes({
  length: propLength,
  lineWidth = 2,
  showTicks = true,
  tickSize: propTickSize,
  tickStep: propTickStep,
  colors = DEFAULT_COLORS,
}: AxesProps) {
  const { camera } = useThree();
  const lastDistanceRef = useRef<number>(0);

  const [axisMetrics, setAxisMetrics] = useState(() => ({
    axisLength: propLength ?? 10,
    computedTickStep: propTickStep ?? 1,
    computedTickSize: propTickSize ?? 0.15,
    fontSize: 0.25,
    ticks: [] as number[],
  }));

  useFrame(() => {
    const distance = camera.position.length();

    // Recompute when camera distance changes by more than 0.5% or initially
    if (
      lastDistanceRef.current === 0 ||
      Math.abs(distance - lastDistanceRef.current) / (lastDistanceRef.current || 1) > 0.005
    ) {
      lastDistanceRef.current = distance;

      // Estimate visible span along the plane passing through the origin
      const fov = (camera as THREE.PerspectiveCamera).fov ?? 45;
      const fovRad = (fov * Math.PI) / 180;
      const visibleSpan = 2 * distance * Math.tan(fovRad / 2);

      const computedStep = propTickStep ?? getAdaptiveTickStep(visibleSpan, 8);
      const computedLength = propLength ?? Math.max(computedStep * 5, visibleSpan * 0.55);
      const computedTickSize = propTickSize ?? distance * 0.012;
      const fontSize = distance * 0.022;

      // Generate ticks at true 3D world coordinates
      const ticks: number[] = [];
      const maxTick = Math.floor(computedLength / computedStep) * computedStep;
      const count = Math.round(maxTick / computedStep);

      for (let i = -count; i <= count; i++) {
        if (i !== 0) {
          const val = Number((i * computedStep).toPrecision(8));
          ticks.push(val);
        }
      }

      setAxisMetrics({
        axisLength: computedLength,
        computedTickStep: computedStep,
        computedTickSize,
        fontSize,
        ticks,
      });
    }
  });

  const colorX = colors?.x ?? DEFAULT_COLORS.x;
  const colorY = colors?.y ?? DEFAULT_COLORS.y;
  const colorZ = colors?.z ?? DEFAULT_COLORS.z;

  const { axisLength, computedTickSize, fontSize, ticks } = axisMetrics;
  const originRadius = lastDistanceRef.current > 0 ? lastDistanceRef.current * 0.004 : 0.05;

  return (
    <group name="custom-axes">
      {/* -------------------- X-AXIS (RED) -------------------- */}
      {/* Positive X axis line */}
      <Line
        points={[
          [0, 0, 0],
          [axisLength, 0, 0],
        ]}
        color={colorX}
        lineWidth={lineWidth}
      />
      {/* Negative X axis line (dashed) */}
      <Line
        points={[
          [-axisLength, 0, 0],
          [0, 0, 0],
        ]}
        color={colorX}
        lineWidth={lineWidth * 0.75}
        dashed
        dashSize={axisLength * 0.04}
        gapSize={axisLength * 0.02}
      />
      {/* X Axis Label */}
      <Billboard position={[axisLength + fontSize * 1.5, 0, 0]}>
        <Text
          fontSize={fontSize * 1.3}
          color={colorX}
          anchorX="center"
          anchorY="middle"
        >
          X
        </Text>
      </Billboard>

      {/* X-axis Ticks & Labels */}
      {showTicks &&
        ticks.map((t) => (
          <React.Fragment key={`x-tick-${t}`}>
            <Line
              points={[
                [t, -computedTickSize, 0],
                [t, computedTickSize, 0],
              ]}
              color={colorX}
              lineWidth={lineWidth * 0.7}
            />
            <Billboard position={[t, -computedTickSize - fontSize * 0.7, 0]}>
              <Text
                fontSize={fontSize}
                color={colorX}
                anchorX="center"
                anchorY="top"
              >
                {formatTickLabel(t)}
              </Text>
            </Billboard>
          </React.Fragment>
        ))}

      {/* -------------------- Y-AXIS (GREEN) -------------------- */}
      {/* Positive Y axis line */}
      <Line
        points={[
          [0, 0, 0],
          [0, axisLength, 0],
        ]}
        color={colorY}
        lineWidth={lineWidth}
      />
      {/* Negative Y axis line (dashed) */}
      <Line
        points={[
          [0, -axisLength, 0],
          [0, 0, 0],
        ]}
        color={colorY}
        lineWidth={lineWidth * 0.75}
        dashed
        dashSize={axisLength * 0.04}
        gapSize={axisLength * 0.02}
      />
      {/* Y Axis Label */}
      <Billboard position={[0, axisLength + fontSize * 1.5, 0]}>
        <Text
          fontSize={fontSize * 1.3}
          color={colorY}
          anchorX="center"
          anchorY="middle"
        >
          Y
        </Text>
      </Billboard>

      {/* Y-axis Ticks & Labels */}
      {showTicks &&
        ticks.map((t) => (
          <React.Fragment key={`y-tick-${t}`}>
            <Line
              points={[
                [-computedTickSize, t, 0],
                [computedTickSize, t, 0],
              ]}
              color={colorY}
              lineWidth={lineWidth * 0.7}
            />
            <Billboard position={[-computedTickSize - fontSize * 0.5, t, 0]}>
              <Text
                fontSize={fontSize}
                color={colorY}
                anchorX="right"
                anchorY="middle"
              >
                {formatTickLabel(t)}
              </Text>
            </Billboard>
          </React.Fragment>
        ))}

      {/* -------------------- Z-AXIS (BLUE) -------------------- */}
      {/* Positive Z axis line */}
      <Line
        points={[
          [0, 0, 0],
          [0, 0, axisLength],
        ]}
        color={colorZ}
        lineWidth={lineWidth}
      />
      {/* Negative Z axis line (dashed) */}
      <Line
        points={[
          [0, 0, -axisLength],
          [0, 0, 0],
        ]}
        color={colorZ}
        lineWidth={lineWidth * 0.75}
        dashed
        dashSize={axisLength * 0.04}
        gapSize={axisLength * 0.02}
      />
      {/* Z Axis Label */}
      <Billboard position={[0, 0, axisLength + fontSize * 1.5]}>
        <Text
          fontSize={fontSize * 1.3}
          color={colorZ}
          anchorX="center"
          anchorY="middle"
        >
          Z
        </Text>
      </Billboard>

      {/* Z-axis Ticks & Labels */}
      {showTicks &&
        ticks.map((t) => (
          <React.Fragment key={`z-tick-${t}`}>
            <Line
              points={[
                [-computedTickSize, 0, t],
                [computedTickSize, 0, t],
              ]}
              color={colorZ}
              lineWidth={lineWidth * 0.7}
            />
            <Billboard position={[-computedTickSize - fontSize * 0.5, 0, t]}>
              <Text
                fontSize={fontSize}
                color={colorZ}
                anchorX="right"
                anchorY="middle"
              >
                {formatTickLabel(t)}
              </Text>
            </Billboard>
          </React.Fragment>
        ))}

      {/* Origin marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[originRadius, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
