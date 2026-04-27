import type { FrameSequenceConfig } from '@/types/frames';

const DEFAULT_PREFIX = 'frame_';
const DEFAULT_EXT = 'webp' as const;
const DEFAULT_PAD = 4;
const MAX_RETRIES = 3;
const PARALLEL_BATCH = 6;

/**
 * Build the URL for a single frame.
 *
 * @param index Zero-based frame index. Files are `1`-indexed on disk, so
 *              index `0` maps to `frame_0001.webp`.
 */
export function getFrameUrl(
  config: FrameSequenceConfig,
  index: number,
): string {
  const prefix = config.framePrefix ?? DEFAULT_PREFIX;
  const ext = config.frameExtension ?? DEFAULT_EXT;
  const pad = config.padLength ?? DEFAULT_PAD;
  const num = String(index + 1).padStart(pad, '0');
  return `${config.basePath}${prefix}${num}.${ext}`;
}

/**
 * Load a single image with async decoding + retry/backoff.
 *
 * Retries up to 3 times (100ms, 300ms, 900ms) on network errors.
 * Honors an `AbortSignal` at every await point — aborted loads throw
 * instead of resolving.
 */
export async function loadFrame(
  url: string,
  signal?: AbortSignal,
): Promise<HTMLImageElement> {
  let lastError: Error = new Error(`Failed to load ${url}`);

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    try {
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';

        const onAbort = (): void => {
          img.src = '';
          reject(new DOMException('Aborted', 'AbortError'));
        };

        img.onload = (): void => {
          signal?.removeEventListener('abort', onAbort);
          resolve(img);
        };
        img.onerror = (): void => {
          signal?.removeEventListener('abort', onAbort);
          reject(new Error(`Image load error: ${url}`));
        };

        if (signal) {
          if (signal.aborted) {
            onAbort();
            return;
          }
          signal.addEventListener('abort', onAbort, { once: true });
        }

        img.src = url;
      });
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') throw err;
      lastError = err as Error;
      if (attempt < MAX_RETRIES - 1) {
        const delay = 100 * Math.pow(3, attempt);
        await new Promise<void>((resolve) => {
          const t = setTimeout(resolve, delay);
          signal?.addEventListener(
            'abort',
            () => {
              clearTimeout(t);
              resolve();
            },
            { once: true },
          );
        });
      }
    }
  }

  throw lastError;
}

/**
 * Priority-queueing batch loader for a WebP image sequence.
 *
 * Strategy:
 * 1. Critical frames (`loadCritical(n)`) — the first N frames, loaded in
 *    parallel, block the initial render.
 * 2. Sampled frames — every 10th frame across the full range. Gives
 *    instant low-resolution scrubbing once a partial set is in memory.
 * 3. Fill — everything else, in sequential order.
 *
 * `getFrame(i)` falls back to the nearest loaded frame if `i` isn't in
 * memory yet, so scrubbing never "blanks out" while frames stream in.
 */
export class FrameLoader {
  private readonly config: FrameSequenceConfig;
  private readonly frames = new Map<number, HTMLImageElement>();
  private readonly controller = new AbortController();
  private destroyed = false;

  constructor(config: FrameSequenceConfig) {
    this.config = config;
  }

  async loadCritical(count: number): Promise<HTMLImageElement[]> {
    const n = Math.min(count, this.config.frameCount);
    const indices = Array.from({ length: n }, (_, i) => i);
    return this.loadIndices(indices);
  }

  /**
   * Load every remaining frame (sampled first, then fill) and report
   * progress as a percentage of total frames cached.
   */
  async loadAll(onProgress?: (percent: number) => void): Promise<void> {
    const total = this.config.frameCount;
    const sampleStep = 10;
    const toLoad: number[] = [];

    for (let i = 0; i < total; i += sampleStep) {
      if (!this.frames.has(i)) toLoad.push(i);
    }
    for (let i = 0; i < total; i++) {
      if (!this.frames.has(i) && !toLoad.includes(i)) toLoad.push(i);
    }

    for (let start = 0; start < toLoad.length; start += PARALLEL_BATCH) {
      if (this.controller.signal.aborted) return;
      const batch = toLoad.slice(start, start + PARALLEL_BATCH);
      await Promise.all(
        batch.map(async (i) => {
          try {
            const img = await loadFrame(
              getFrameUrl(this.config, i),
              this.controller.signal,
            );
            if (!this.destroyed) this.frames.set(i, img);
          } catch (err) {
            if ((err as DOMException).name !== 'AbortError') {
              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.warn('[FrameLoader] failed to load', i, err);
              }
            }
          }
        }),
      );
      onProgress?.((this.frames.size / total) * 100);
    }
  }

  /**
   * Return the image for `index`, or the closest already-loaded frame
   * when `index` hasn't streamed in yet. `null` only if nothing is loaded.
   */
  getFrame(index: number): HTMLImageElement | null {
    const exact = this.frames.get(index);
    if (exact) return exact;
    let closest: HTMLImageElement | null = null;
    let bestDist = Infinity;
    this.frames.forEach((img, i) => {
      const d = Math.abs(i - index);
      if (d < bestDist) {
        bestDist = d;
        closest = img;
      }
    });
    return closest;
  }

  abort(): void {
    this.controller.abort();
  }

  destroy(): void {
    this.destroyed = true;
    this.abort();
    this.frames.clear();
  }

  private async loadIndices(indices: number[]): Promise<HTMLImageElement[]> {
    return Promise.all(
      indices.map(async (i) => {
        const img = await loadFrame(
          getFrameUrl(this.config, i),
          this.controller.signal,
        );
        if (!this.destroyed) this.frames.set(i, img);
        return img;
      }),
    );
  }
}
