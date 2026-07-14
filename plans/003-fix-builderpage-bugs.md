# 003 — Fix BuilderPage stale closures and broken dirty tracking

- **Status**: TODO
- **Commit**: (run `git rev-parse --short HEAD` before starting)
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: react-doctor/exhaustive-deps | Beyond the scan (bug)
- **Estimated scope**: 1 file, ~30 lines changed

## Problem

Two bugs in `src/features/cv-builder/pages/BuilderPage.tsx`:

1. **Line 112**: `formState` is hardcoded `{ isDirty: false }` and never updated.
   The `beforeunload` guard at line 104-110 checks `formState.isDirty`, which
   is always `false`. Users can navigate away from the builder with unsaved
   changes and lose work with no warning.

2. **Line 93-102**: The keyboard-save `useEffect` (Ctrl+S) depends on
   `[handleSave]` but `handleSave` is not memoized — it's recreated every
   render, closing over `resumeData`, `coverLetterData`, `settings`, `newName`,
   `id`. If the effect captures a stale `handleSave`, keyboard save writes old
   data.

### Current code

```tsx
// src/features/cv-builder/pages/BuilderPage.tsx:112
const formState = { isDirty: false }; // never updated!

// line 93-102
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handleSave]); // handleSave not memoized

// line 104-110
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (formState.isDirty) { // always false!
      e.preventDefault();
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [resumeData, coverLetterData]); // formState.isDirty missing + always false
```

## Target

Use `useRef` to track dirty state imperatively, since `beforeunload` is an
imperative browser API that shouldn't trigger re-renders:

```tsx
// target
const isDirtyRef = useRef(false);

// Mark dirty whenever form data changes
useEffect(() => {
  isDirtyRef.current = true;
}, [resumeData, coverLetterData]);

// Mark clean after save
const handleSave = useCallback(async () => {
  // ... existing save logic ...
  isDirtyRef.current = false;
}, [/* existing deps */]);

// Keyboard save — use refs for imperative event handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handleSave]);

// beforeunload — check ref, no deps needed
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirtyRef.current) {
      e.preventDefault();
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);
```

If `handleSave` is already a `useCallback`, verify its deps are correct. If
it's a plain function, wrap it in `useCallback` or use a ref to hold the latest
version.

## Repo conventions to follow

- Follow the existing pattern of `useEffect` for window event listeners (see
  `src/features/applications/pages/ApplicationsPage.tsx:36-45` for a clean
  example).
- Preserve the existing save behavior and button.

## Steps

1. At `src/features/cv-builder/pages/BuilderPage.tsx:112`, remove the
   `formState` variable entirely.
2. Add `const isDirtyRef = useRef(false);` near the other refs.
3. Add a `useEffect` that sets `isDirtyRef.current = true` when `resumeData` or
   `coverLetterData` change.
4. In `handleSave`, set `isDirtyRef.current = false` after successful save.
5. At line 104-110, change the `beforeunload` effect to check
   `isDirtyRef.current` and depend on `[]`.
6. Verify the `handleSave` closure is stable (useCallback with correct deps, or
   a ref pattern).
7. Re-read the diff and confirm no other behavior changed.

## Boundaries

- Do NOT change the save API call or its parameters.
- Do NOT change the visual UI.
- Keep the change focused on the dirty-tracking and keyboard-save bugs.

## Verification

- **Mechanical**:
  - `npx tsc --noEmit` and `npx eslint src/features/cv-builder/pages/BuilderPage.tsx`.
  - `npx react-doctor@latest --scope src/features/cv-builder/pages/BuilderPage.tsx`
    — `exhaustive-deps` warnings on lines 102 and 110 should be resolved.
- **Behavior check**: Open the CV builder, make a change to a resume field, then
  try to navigate away — browser should show "unsaved changes" warning. Save
  with Ctrl+S, then navigate away — no warning. Reload the page — verify save
  worked.
- **Done when**: beforeunload fires on dirty forms, Ctrl+S saves current data,
  TypeScript and lint pass.
