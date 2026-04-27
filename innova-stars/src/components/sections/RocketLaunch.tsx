'use client';

import dynamic from 'next/dynamic';

const FrameSequence = dynamic(
  () => import('@/components/ui/FrameSequence').then((m) => m.FrameSequence),
  { ssr: false },
);

/**
 * Rocket Launch — scroll-scrubbed cinematic rocket video.
 *
 * Frames are extracted from Cinematic_Rocket_Launch_Video_Generation.mp4
 * (192 WebPs at 1280×720). Layered with subtle top + bottom dark gradients
 * for text-readability headroom. Pin handled by FrameSequence.
 */
export function RocketLaunch(): JSX.Element {
  return (
    <section
      aria-label="Mission launch"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-[5]">
        <FrameSequence
          basePath="/frames/hero/"
          frameCount={192}
          framePrefix="frame_"
          frameExtension="webp"
          padLength={4}
          triggerStart="top top"
          triggerEnd="bottom top"
          scrub={1}
          pin
          className="h-screen w-full"
          mobileFallback="video-scrub"
          mobileVideoSrc="/videos/rocket-scrub.mp4"
        />
      </div>

      {/* Top + bottom dark gradient overlay for text readability headroom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </section>
  );
}

export default RocketLaunch;
