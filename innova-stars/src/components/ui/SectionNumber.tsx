import { cn } from '@/lib/utils/cn';

interface SectionNumberProps {
  /** Two-digit section index e.g. `'01'`. Renders verbatim. */
  number: string;
  className?: string;
}

/**
 * Small monospace-feel index used to label major sections, e.g. `01 / 05`.
 * Sits inline with the section's eyebrow label or anchored to a corner.
 */
export function SectionNumber({
  number,
  className,
}: SectionNumberProps): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center gap-2 font-orbitron text-[11px] font-medium tracking-[0.3em] text-gold/70',
        className,
      )}
    >
      <span className="text-gold">{number}</span>
      <span className="text-gold/40">/ 05</span>
    </span>
  );
}

export default SectionNumber;
