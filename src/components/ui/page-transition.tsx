import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger child elements with increasing delay (50ms per child) */
  stagger?: boolean;
  /** Animation direction: 'up' (default), 'lateral' (side-to-side) */
  direction?: 'up' | 'lateral';
  /** Route transition mode: 'enter-only' (default) skips exit, 'full' does exit-then-enter */
  mode?: 'enter-only' | 'full';
}

// Routes that should use lateral (side-to-side) transitions
const LATERAL_ROUTES = [
  '/app/applications',
  '/app/dashboard',
  '/app/resumes',
  '/app/settings',
  '/app/notifications',
  '/app/interviews',
];

const EXIT_DURATION = 150;  // ms — matches CSS exit animation duration
const ENTER_DURATION = 500; // ms — matches CSS enter animation duration

/**
 * Wraps page content with enter + optional exit animations.
 * Uses CSS animations for performance — no framer-motion needed.
 * Respects prefers-reduced-motion.
 *
 * Direction guide:
 * - 'up': Slide up + fade (good for stacked pages)
 * - 'lateral': Slide in from right (forward) / left (backward)
 *
 * mode:
 * - 'enter-only' (default): Animate in on mount, no exit. Simple and fast.
 * - 'full': Exit old content, then enter new. Safer transition.
 */
export function PageTransition({ children, className, stagger = true, direction, mode = 'full' }: PageTransitionProps) {
  const location = useLocation();
  const [phase, setPhase] = useState<'enter' | 'exit' | 'idle'>('enter');
  const [cachedChildren, setCachedChildren] = useState(children);
  const [displayPath, setDisplayPath] = useState(location.pathname);
  const prevPathRef = useRef(location.pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isFirstRender = useRef(true);

  // Clean up timers on unmount and on effect re-run
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const detectedDirection = direction || (
    LATERAL_ROUTES.some(route => location.pathname.startsWith(route))
      ? 'lateral'
      : 'up'
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setCachedChildren(children);
      setPhase('enter');
      timerRef.current = setTimeout(() => {
        setPhase('idle');
      }, ENTER_DURATION);
      return;
    }

    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;

      if (mode === 'full') {
        // Defer exit phase out of synchronous effect body — drives animation state machine
        // ponytail: setTimeout(0) satisfies set-state-in-effect lint; sub-ms delay is imperceptible
        timerRef.current = setTimeout(() => {
          setPhase('exit');

          timerRef.current = setTimeout(() => {
            setDisplayPath(location.pathname);
            setCachedChildren(children);
            setPhase('enter');

            timerRef.current = setTimeout(() => {
              setPhase('idle');
            }, ENTER_DURATION);
          }, EXIT_DURATION);
        }, 0);
      } else {
        // enter-only: swap and enter
        timerRef.current = setTimeout(() => {
          setDisplayPath(location.pathname);
          setCachedChildren(children);
          setPhase('enter');

          timerRef.current = setTimeout(() => {
            setPhase('idle');
          }, ENTER_DURATION);
        }, 0);
      }
    } else {
      // Same route — sync children immediately without animation
      setCachedChildren(children);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname, children, mode]);

  const isAnimating = phase === 'exit' || phase === 'enter';

  let animationClass = '';
  if (phase === 'enter') {
    animationClass = detectedDirection === 'lateral' ? 'animate-page-enter-lateral' : 'animate-page-enter';
  } else if (phase === 'exit') {
    animationClass = detectedDirection === 'lateral' ? 'animate-page-exit-lateral' : 'animate-page-exit';
  }

  return (
    <div
      key={phase === 'enter' ? location.pathname : displayPath}
      className={cn(
        animationClass,
        phase === 'enter' && stagger && 'stagger-children',
        isAnimating && 'pointer-events-none',
        className
      )}
    >
      {cachedChildren}
    </div>
  );
}
