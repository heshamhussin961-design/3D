import { AICore } from '@/components/sections/AICore';
import { CTA } from '@/components/sections/CTA';
import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { RocketLaunch } from '@/components/sections/RocketLaunch';
import { Services } from '@/components/sections/Services';
import { Stats } from '@/components/sections/Stats';

export default function Home(): JSX.Element {
  return (
    <main className="bg-deep-space">
      <Hero />
      <RocketLaunch />
      <Problem />
      <Services />
      <AICore />
      <Stats />
      <CTA />
    </main>
  );
}
