# 005 — Move module-scope functions and static values outside components

- **Status**: TODO
- **Commit**: (run `git rev-parse --short HEAD` before starting)
- **Severity**: MEDIUM
- **Category**: Maintainability & architecture
- **Rule**: react-doctor/prefer-module-scope-pure-function | react-doctor/prefer-module-scope-static-value
- **Estimated scope**: 6 files, ~60 lines moved

## Problem

Pure functions and static objects defined inside component bodies are recreated
every render, wasting work and breaking memoized children.

### Files and locations

| File | What to move |
|------|-------------|
| `src/components/table/TableView.tsx:107-136` | `formatSalary`, `formatDate`, `formatFollowUp` (pure functions) |
| `src/components/table/TableView.tsx:89-98` | `columns` array (static value) |
| `src/components/shared/EmptyState.tsx:37-54` | `defaultContent` object (static value) |
| `src/components/ui/spinner.tsx:25-30` | `colorClasses` object (static value) |
| `src/features/auth/pages/Login.tsx:30-35` | `handleGoogle` (pure function) |
| `src/features/auth/pages/Register.tsx:56-61` | `handleGoogle` (pure function) |

Additionally in TableView: the inner `format` function at line 109 shadows the
imported `format` from `date-fns`. After moving, use the date-fns import
directly.

## Target

Move each function/value above the component definition, at module scope.

```tsx
// before (inside component)
const TableView = ({ ... }) => {
  const formatSalary = (salary: ...) => { ... };
  const formatDate = (date: ...) => { ... };
  // ...
};

// after (module scope)
function formatSalary(salary: ...) { ... }
function formatDate(date: ...) { ... }

const TableView = ({ ... }) => {
  // ...
};
```

For static values:

```tsx
// before (inside component)
const defaultContent = { ... };

// after (module scope, above component)
const defaultContent = { ... } as const;
```

## Repo conventions to follow

- Follow the existing module-scope pattern in `src/lib/status.ts` where helpers
  are defined at module scope.
- Keep the `formatSalary` helper consistent — TableView currently defines its
  own version that may differ from `src/lib/status.ts:formatSalary`. Check and
  reuse if identical.

## Steps

1. Read each file to confirm the functions/values have no dependency on component
   state or props.
2. Move each function/value above the component definition.
3. In TableView, remove the inner `format` wrapper (line 109) and use
   `format` from `date-fns` directly (or the project's re-exported `format`).
4. Verify that the `columns` array in TableView doesn't reference any component
   state — if it does, use `useMemo` instead of module scope.
5. After all moves, run `npx react-doctor@latest` and confirm the diagnostics
   are clear.

## Boundaries

- Do NOT change any function behavior — only move declarations.
- Do NOT rename functions or change their signatures.
- Do NOT extract new files — this plan only moves code within existing files.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope src` — `prefer-module-scope-pure-function`
    and `prefer-module-scope-static-value` warnings for these files should be
    clear.
  - `npx tsc --noEmit` and spot-check lint on changed files.
- **Behavior check**: TableView renders salary, date, and follow-up columns
  correctly. EmptyState shows correct defaults. Spinner colors render. Login
  and Register Google SSO buttons work.
- **Done when**: all 6 diagnostics are clear, functions/values are at module
  scope, no behavioral change.
