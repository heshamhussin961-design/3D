import type { CSSProperties } from 'react';

/**
 * How to address a folder of numbered image frames.
 *
 * A sequence is described purely by a URL prefix + frame-count + naming
 * convention, e.g. `{basePath: '/frames/hero/', frameCount: 192, ...}`
 * maps to `/frames/hero/frame_0001.webp` ... `/frames/hero/frame_0192.webp`.
 *
 * @example preparing frames
 * Use ffmpeg:
 *   ffmpeg -i input.mp4 -c:v libwebp -quality 75 \
 *     public/frames/hero/frame_%04d.webp
 *
 * @remarks
 * Recommended frame count: 150–300. Below ~120 the scrub feels stepped;
 * above ~300 the payload dominates load time with little perceptual gain.
 *
 * For production, host frames on a CDN (Cloudflare R2, Bunny, etc.) and
 * set `basePath` to the absolute URL. Keep WebP quality at 75 for the
 * right size/quality tradeoff.
 */
export interface FrameSequenceConfig {
  /** URL prefix ending in `/` — e.g. `/frames/hero/` or a CDN URL. */
  basePath: string;
  /** Total number of frames in the sequence. */
  frameCount: number;
  /** Filename prefix before the zero-padded index. Default `'frame_'`. */
  framePrefix?: string;
  /** File extension (without dot). Default `'webp'`. */
  frameExtension?: 'webp' | 'jpg' | 'png';
  /** Zero-padding width of the numeric index. Default `4`. */
  padLength?: number;
}

/**
 * Props for the `<FrameSequence>` component. All config fields are inlined
 * so the component can be used without first constructing a config object.
 */
export interface FrameSequenceProps extends FrameSequenceConfig {
  /** ScrollTrigger `start` value. Default `'top top'`. */
  triggerStart?: string;
  /** ScrollTrigger `end` value. Default `'bottom top'`. */
  triggerEnd?: string;
  /** ScrollTrigger `scrub`. Default `1`. */
  scrub?: number | boolean;
  /** Whether to pin the container while scrubbing. Default `true`. */
  pin?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Fires on every progress update (0–100) as frames stream in. */
  onLoadProgress?: (progress: number) => void;
  /** Fires once when every frame is in memory. */
  onLoadComplete?: () => void;
  /** Suggests a loading priority to the browser. Default `'high'`. */
  priority?: 'high' | 'low';
  /**
   * What to show below `mobileBreakpoint` instead of the canvas scrub:
   * - `'first'` — static `<img>` of the first frame
   * - `'last'` — static `<img>` of the last frame
   * - `'video'` — autoplaying looped `<video>` from `mobileVideoSrc`
   * - `'video-scrub'` — `<video>` whose `currentTime` is driven by scroll
   *                    progress (best parity with the desktop frame scrub;
   *                    requires an all-keyframes mp4)
   * - `'none'` — keep canvas + scrub on mobile too (default)
   */
  mobileFallback?: 'first' | 'last' | 'video' | 'video-scrub' | 'none';
  /**
   * Source URL of the looped video shown when `mobileFallback === 'video'`.
   * Should point to a small mp4/webm in `/public/videos/`.
   */
  mobileVideoSrc?: string;
  /** Below this viewport width, switch to `mobileFallback`. Default `768`. */
  mobileBreakpoint?: number;
}

export interface LoadedFrame {
  index: number;
  image: HTMLImageElement;
  loaded: boolean;
  error?: Error;
}
