'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Per-route transition wrapper. `template.tsx` re-mounts on every route
 * change (unlike `layout.tsx`), so this gives a clean fade/slide whenever
 * the user navigates between top-level pages without disrupting the
 * persistent Navigation/Footer in the layout.
 */
export default function Template({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
