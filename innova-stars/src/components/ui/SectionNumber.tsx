interface SectionNumberProps {
  /** Two-digit section index e.g. `'01'`. Kept on the prop type so callers
   * don't break, but no longer rendered. */
  number?: string;
  className?: string;
}

/**
 * Disabled. Was a small "03 / 05" eyebrow next to each section's label;
 * removed at design's request to clean up the chrome.
 */
export function SectionNumber({}: SectionNumberProps): null {
  return null;
}

export default SectionNumber;
