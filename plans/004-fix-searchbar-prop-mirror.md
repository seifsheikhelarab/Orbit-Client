# 004 — Fix SearchBar prop mirroring

- **Status**: TODO
- **Commit**: (run `git rev-parse --short HEAD` before starting)
- **Severity**: MEDIUM
- **Category**: Bugs & correctness
- **Rule**: react-doctor/no-mirror-prop-effect
- **Estimated scope**: 1 file, ~15 lines changed

## Problem

`src/components/filters/SearchBar.tsx:28` — The `value` prop is copied into
`localValue` state via a `useEffect`, which means the component shows the old
value briefly on the first render before the effect fires.

### Current code

```tsx
// src/components/filters/SearchBar.tsx:28-30
useEffect(() => {
  setLocalValue(value);
}, [value]);
```

## Target

If `localValue` is only used to debounce the prop before passing it to the
debounced callback, replace it with a ref:

```tsx
// target
const localValueRef = useRef(value);
localValueRef.current = value;

// Use localValueRef.current in the onChange handler instead of localValue state
```

Or, if the component needs to render the value, use the prop directly and only
use a ref for the debounce:

```tsx
// target — render prop directly, debounce via ref
const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  onChange(newValue); // parent controls the value
}, [onChange]);

// If debouncing is needed, debounce the callback, not the state
```

Check the actual usage to determine the right pattern. If the parent controls
the value (controlled input), remove the local state entirely and debounce
the callback.

## Repo conventions to follow

- Follow the debounce pattern in `src/features/applications/hooks/useApplicationsQuery.tsx`
  which debounces at the query level.
- The component is already small (95 lines); keep changes minimal.

## Steps

1. Read `src/components/filters/SearchBar.tsx` to understand how `localValue`
   is used (rendered in input? passed to debounce?).
2. Remove the `useState` for `localValue` and the `useEffect` that syncs it.
3. Replace with the appropriate pattern (ref or direct prop usage).
4. Verify debounce behavior still works (typing quickly should not fire
   `onChange` on every keystroke).

## Boundaries

- Do NOT change the debounce timing or the component's public API.
- Do NOT remove the debounce — only fix the prop mirroring.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope src/components/filters/SearchBar.tsx`
    — `no-mirror-prop-effect` should be clear.
  - `npx tsc --noEmit` and `npx eslint src/components/filters/SearchBar.tsx`.
- **Behavior check**: Type in the search bar — results should debounce correctly
  (not fire on every keystroke). Clear the search — input should clear
  immediately.
- **Done when**: the diagnostic is clear, debounce works, input clears
  responsively.
