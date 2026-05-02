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

/**
 * Wraps page content with enter animations.
 * Uses CSS animations for performance - no framer-motion needed.
 * Respects prefers-reduced-motion.
 *
 * Direction guide:
 * - 'up': Slide up + fade (good for stacked pages)
 * - 'lateral': Slide in from right + fade (good for lateral navigation)
 */
export function PageTransition({ children, className, stagger = true, direction }: PageTransitionProps) {
  const location = useLocation();
  const [isEntering, setIsEntering] = useState(false);
  const prevPathRef = useRef(location.pathname);

  // Auto-detect direction based on route type
  const detectedDirection = direction || (
    LATERAL_ROUTES.some(route => location.pathname.startsWith(route))
      ? 'lateral'
      : 'up'
  );

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setIsEntering(true);
      prevPathRef.current = location.pathname;

      const timer = setTimeout(() => setIsEntering(false), 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const animationClass = detectedDirection === 'lateral' ? 'animate-page-enter-lateral' : 'animate-page-enter';

  return (
    <div
      key={location.pathname}
      className={cn(
        animationClass,
        stagger && 'stagger-children',
        isEntering && 'pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
}
