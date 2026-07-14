# 001 — Fix page-transition timer leak and stale state

- **Status**: TODO
- **Commit**: (run `git rev-parse --short HEAD` before starting)
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: react-doctor/effect-needs-cleanup | react-doctor/no-adjust-state-on-prop-change
- **Estimated scope**: 1 file, ~40 lines changed

## Problem

`src/components/ui/page-transition.tsx:63` — `setTimeout` in useEffect has no
cleanup. On each route change, new timers are created but previous ones are
never cleared. On fast navigation, stale timers fire and set wrong state.

Lines 67, 93, 102 — Three effects copy `location.pathname` into state via
`useEffect`, forcing an extra render with stale UI between prop change and state
commit. The `mode` and `direction` state are derived from props/location that
could be computed inline or during render.

### Current code

```tsx
// src/components/ui/page-transition.tsx:51-104 (simplified)
useEffect(() => {
  if (location.pathname === previousPathname) return;

  if (mode === 'full') {
    setIsAnimating(true);
    setDirection('out');
    setPreviousPathname(location.pathname);

    setTimeout(() => {
      setDirection('in');
      setTimeout(() => {
        setIsAnimating(false);
        setDirection('none');
      }, 300);
    }, 300);
  } else {
    setPreviousPathname(location.pathname);
  }
}, [location.pathname, previousPathname, mode]);

useEffect(() => {
  if (location.pathname !== previousPathname) {
    setPreviousPathname(location.pathname);
  }
}, [location.pathname, previousPathname]);

useEffect(() => {
  setMode(mode); // line 102 — copies prop to state
}, [mode]);
```

## Target

Replace the timer-based animation with a ref-based cleanup approach, and replace
the state-syncing effects with render-time derived values:

```tsx
// target — derive direction from props during render
const [prevPathname, setPrevPathname] = useState(location.pathname);
const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// Clean up on unmount
useEffect(() => {
  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
}, []);

// Route change handler with proper cleanup
useEffect(() => {
  if (location.pathname === prevPathname || mode !== 'full') {
    if (location.pathname !== prevPathname) setPrevPathname(location.pathname);
    return;
  }

  // Clear any pending timer before starting new animation
  if (timerRef.current) clearTimeout(timerRef.current);

  setPhase('out');
  timerRef.current = setTimeout(() => {
    setPrevPathname(location.pathname);
    setPhase('in');
    timerRef.current = setTimeout(() => {
      setPhase('idle');
      timerRef.current = null;
    }, 300);
  }, 300);

  return () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
}, [location.pathname, prevPathname, mode]);
```

For the `mode` prop: remove the `setMode(mode)` effect entirely. Use the prop
directly — there's no reason to copy it into state.

## Repo conventions to follow

- Follow the existing pattern in `src/components/ui/page-transition.tsx:45-50`
  where refs are already used for tracking.
- Preserve the component's public API (`PageTransitionProps` interface).

## Steps

1. At `src/components/ui/page-transition.tsx:51-104`, replace the main
   animation effect with the ref-based version that cleans up timers before
   creating new ones.
2. Remove the `setMode(mode)` effect at line 100-103 — use `mode` prop directly.
3. Remove the `setPreviousPathname` effect at line 93-96 — derive it inline
   during the route-change effect.
4. Replace `direction` state with `phase` state derived from the animation
   lifecycle.
5. Re-read the diff and verify the animation timing and transitions are preserved.

## Boundaries

- Do NOT change the component's public API or props interface.
- Do NOT add dependencies.
- Keep the change behavior-preserving — same visual animation, just no leaked
  timers or stale state.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope src/components/ui/page-transition.tsx`
    clears the `effect-needs-cleanup` and `no-adjust-state-on-prop-change`
    diagnostics; score does not regress.
  - Run `npx tsc --noEmit` and `npx eslint src/components/ui/page-transition.tsx`.
- **Behavior check**: Navigate between routes rapidly (click Sidebar links in
  quick succession). Confirm the fade animation plays correctly and no stale
  content flashes. Check React DevTools Profiler — no extra renders from stale
  state updates.
- **Done when**: both diagnostics are clear, TypeScript and ESLint pass, route
  transitions look and feel identical.
