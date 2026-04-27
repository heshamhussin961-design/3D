'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { FrameLoader } from '@/lib/utils/frameLoader';
import type { FrameSequenceConfig } from '@/types/frames';

const CRITICAL_FRAMES = 10;

interface UseFrameSequenceResult {
  loadProgress: number;
  isReady: boolean;
  isComplete: boolean;
  error: Error | null;
  getFrame: (index: number) => HTMLImageElement | null;
}

interface UseFrameSequenceOptions {
  /**
   * When `true`, do not load any frames. The hook returns immediately with
   * `isReady = true`, `isComplete = true`, and a no-op `getFrame`. Use this
   * to skip the entire frame pipeline on devices that won't render the
   * canvas (e.g. mobile when `mobileFallback === 'video'`).
   */
  skip?: boolean;
}

/**
 * Manages the lifecycle of a `FrameLoader` in React. Kicks off critical
 * loading, then streams the rest in the background, and exposes a stable
 * `getFrame` callback for callers.
 *
 * The returned `getFrame` is stable across renders so it can be used in
 * `useEffect`/`useGSAP` deps without re-running every render.
 */
export function useFrameSequence(
  config: FrameSequenceConfig,
  options?: UseFrameSequenceOptions,
): UseFrameSequenceResult {
  const loaderRef = useRef<FrameLoader | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    basePath,
    frameCount,
    framePrefix,
    frameExtension,
    padLength,
  } = config;

  const skip = options?.skip ?? false;

  useEffect(() => {
    if (skip) {
      // No frames to load — pretend we're done so consumers don't show a loader.
      setIsReady(true);
      setIsComplete(true);
      setLoadProgress(100);
      return;
    }

    let cancelled = false;
    const loader = new FrameLoader({
      basePath,
      frameCount,
      framePrefix,
      frameExtension,
      padLength,
    });
    loaderRef.current = loader;
    setIsReady(false);
    setIsComplete(false);
    setLoadProgress(0);
    setError(null);

    loader
      .loadCritical(CRITICAL_FRAMES)
      .then(() => {
        if (cancelled) return;
        setIsReady(true);
        return loader.loadAll((p) => {
          if (!cancelled) setLoadProgress(p);
        });
      })
      .then(() => {
        if (!cancelled) setIsComplete(true);
      })
      .catch((err: unknown) => {
        if ((err as DOMException)?.name === 'AbortError') return;
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      cancelled = true;
      loader.destroy();
      loaderRef.current = null;
    };
  }, [basePath, frameCount, framePrefix, frameExtension, padLength, skip]);

  const getFrame = useCallback(
    (index: number) => loaderRef.current?.getFrame(index) ?? null,
    [],
  );

  return { loadProgress, isReady, isComplete, error, getFrame };
}
