import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import type { IpcRenderer } from 'electron';
import { Color, MathUtils, type ShaderMaterial } from 'three';
import { gameResourcesAtom, vfxEnabledAtom, yearsInPowerAtom } from '@/lib/store/game';
import { glowFragmentShader, glowVertexShader } from '@/shaders/glow';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    require?: NodeRequire;
  }
}

type GlowUniforms = {
  uTime: { value: number };
  uPower: { value: number };
  uYearProgress: { value: number };
  uAccent: { value: Color };
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const getIpcRenderer = (): IpcRenderer | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    if (typeof window.require === 'function') {
      return window.require('electron').ipcRenderer;
    }
  } catch {
    // no-op: renderer not available outside Electron shell
  }

  return undefined;
};

interface Metrics {
  intensity: number;
  yearProgress: number;
  accentHex: string;
}

const WebGLStage = () => {
  const vfxEnabled = useAtomValue(vfxEnabledAtom);
  const resources = useAtomValue(gameResourcesAtom);
  const yearsInPower = useAtomValue(yearsInPowerAtom);

  const metrics = useMemo<Metrics>(() => {
    const deltas = [
      Math.abs(resources.church - 50),
      Math.abs(resources.people - 50),
      Math.abs(resources.army - 50),
      Math.abs(resources.wealth - 50),
    ];

    const intensity = clamp01(deltas.reduce((sum, value) => sum + value, 0) / 200);
    const yearProgress = clamp01(yearsInPower / 40);
    const accentColor = new Color().setHSL(
      0.55 - intensity * 0.3,
      0.65 + yearProgress * 0.2,
      0.4 + intensity * 0.3
    );

    return {
      intensity,
      yearProgress,
      accentHex: `#${accentColor.getHexString()}`,
    };
  }, [resources, yearsInPower]);

  if (!vfxEnabled) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        frameloop="never"
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 1.5], fov: 45 }}
      >
        <GlowPlane metrics={metrics} />
      </Canvas>
    </div>
  );
};

interface GlowPlaneProps {
  metrics: Metrics;
}

const GlowPlane = ({ metrics }: GlowPlaneProps) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const { intensity, yearProgress, accentHex } = metrics;

  useManualLoop();

  const uniforms = useRef<GlowUniforms>({
    uTime: { value: 0 },
    uPower: { value: intensity },
    uYearProgress: { value: yearProgress },
    uAccent: { value: new Color(accentHex) },
  });

  useEffect(() => {
    const material = materialRef.current;
    if (!material) {
      return;
    }

    material.uniforms.uYearProgress.value = yearProgress;
    material.uniforms.uAccent.value.set(accentHex);
  }, [accentHex, yearProgress]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) {
      return;
    }

    material.uniforms.uTime.value += delta;
    material.uniforms.uPower.value = MathUtils.lerp(
      material.uniforms.uPower.value,
      intensity,
      0.05
    );
  });

  return (
    <mesh scale={[2.5, 2, 1]}>
      <planeGeometry args={[3.5, 3.5, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={glowFragmentShader}
        vertexShader={glowVertexShader}
        transparent
        depthWrite={false}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

const useManualLoop = () => {
  const { invalidate } = useThree();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    let raf: number | null = null;
    let running = true;

    const loop = () => {
      if (!running) {
        return;
      }

      invalidate();
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!running) {
        return;
      }

      running = false;
      if (raf !== null) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const start = () => {
      if (running) {
        return;
      }

      running = true;
      loop();
    };

    loop();

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const ipc = getIpcRenderer();
    if (ipc) {
      ipc.on('browser-blur', stop);
      ipc.on('browser-focus', start);
    }

    return () => {
      if (raf !== null) {
        window.cancelAnimationFrame(raf);
      }
      document.removeEventListener('visibilitychange', handleVisibility);

      if (ipc) {
        ipc.removeAllListeners('browser-blur');
        ipc.removeAllListeners('browser-focus');
      }
    };
  }, [invalidate]);
};

export default WebGLStage;
