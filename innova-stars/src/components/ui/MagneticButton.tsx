'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';

type CommonProps = {
  /** Maximum pixel pull toward the cursor (radius). Default `14`. */
  strength?: number;
  /** Inner content shifts a bit further than the wrapper for a layered feel. */
  innerStrength?: number;
  children: ReactNode;
  className?: string;
};

// Framer Motion redefines onDrag/onAnimationStart/etc for its gesture
// system; omit those from the underlying HTML interfaces to avoid type
// conflicts when spreading.
type ConflictingProps =
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragOver'
  | 'onDragEnter'
  | 'onDragLeave'
  | 'onDragExit'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration';

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingProps> & {
    href?: undefined;
  };
type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, ConflictingProps> & {
    href: string;
  };

type MagneticButtonProps = AsButton | AsLink;

/**
 * Cursor-magnet button OR link. The wrapper element translates by
 * `strength` toward the cursor; an inner span translates further by
 * `innerStrength` for a parallax feel. Snaps back via spring on leave.
 *
 * Renders `<a>` if `href` is set, otherwise `<button>`. Disabled (no
 * transform) on touch-only devices.
 */
export function MagneticButton(props: MagneticButtonProps): JSX.Element {
  const {
    strength = 14,
    innerStrength = 22,
    children,
    className,
    ...rest
  } = props;

  const wrapperRef = useRef<HTMLElement | null>(null);
  const wx = useMotionValue(0);
  const wy = useMotionValue(0);
  const ix = useMotionValue(0);
  const iy = useMotionValue(0);
  const sx = useSpring(wx, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(wy, { stiffness: 220, damping: 18, mass: 0.4 });
  const isx = useSpring(ix, { stiffness: 220, damping: 18, mass: 0.4 });
  const isy = useSpring(iy, { stiffness: 220, damping: 18, mass: 0.4 });
  const enabledRef = useRef<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    enabledRef.current = !window.matchMedia('(pointer: coarse)').matches;
  }, []);

  function handleMove(e: MouseEvent<HTMLElement>): void {
    if (!enabledRef.current) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    wx.set(dx * strength);
    wy.set(dy * strength);
    ix.set(dx * innerStrength);
    iy.set(dy * innerStrength);
  }

  function handleLeave(): void {
    wx.set(0);
    wy.set(0);
    ix.set(0);
    iy.set(0);
  }

  const innerContent = (
    <motion.span
      style={{ x: isx, y: isy, display: 'inline-flex', alignItems: 'center' }}
      className="pointer-events-none gap-3"
    >
      {children}
    </motion.span>
  );

  if ('href' in rest && rest.href !== undefined) {
    const linkRest = rest as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      ConflictingProps
    >;
    return (
      <motion.a
        ref={wrapperRef as React.RefObject<HTMLAnchorElement>}
        style={{ x: sx, y: sy }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={className}
        {...linkRest}
      >
        {innerContent}
      </motion.a>
    );
  }

  const btnRest = rest as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    ConflictingProps
  >;
  return (
    <motion.button
      ref={wrapperRef as React.RefObject<HTMLButtonElement>}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      {...btnRest}
    >
      {innerContent}
    </motion.button>
  );
}

export default MagneticButton;
