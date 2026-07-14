# 002 — Add type="button" to all non-submit buttons

- **Status**: TODO
- **Commit**: (run `git rev-parse --short HEAD` before starting)
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: react-doctor/button-has-type
- **Estimated scope**: 14 files, ~25 one-line changes

## Problem

Every `<button>` without an explicit `type` defaults to `type="submit"`. When
any of these buttons appears inside a `<form>`, clicking it submits the form
accidentally. This affects high-traffic UI: search clear button, table row
actions, kanban card menus, sidebar navigation, view toggle, and filter panels.

### Files and lines

| File | Lines |
|------|-------|
| `src/components/filters/FilterPanel.tsx` | 15, 55 |
| `src/components/filters/SearchBar.tsx` | 82 |
| `src/components/layout/Sidebar.tsx` | 87 |
| `src/components/layout/TopBar.tsx` | 14, 65, 77, 91 |
| `src/components/shared/FeatureTip.tsx` | 56 |
| `src/components/shared/ViewToggle.tsx` | 16, 28 |
| `src/components/table/TableView.tsx` | 186, 201, 208, 216, 230, 252, 288, 447 |
| `src/components/kanban/KanbanCard.tsx` | 160 |
| `src/components/kanban/KanbanColumn.tsx` | 76 |
| `src/features/applications/components/KanbanColumn.tsx` | 61 |
| `src/features/applications/pages/ApplicationsPage.tsx` | 336, 404 |
| `src/features/applications/pages/AttachResumePage.tsx` | 105 |
| `src/features/cv-builder/pages/BuilderPage.tsx` | 279 |

## Target

Add `type="button"` to every non-submit `<button>`. For buttons that ARE submit
buttons (e.g., inside a form that should submit), leave them as-is or set
`type="submit"` explicitly.

```tsx
// before
<button onClick={handleClear} className="...">

// after
<button type="button" onClick={handleClear} className="...">
```

## Repo conventions to follow

- The existing UI components in `src/components/ui/button.tsx` use CVA variants.
  These are raw `<button>` elements in feature code, not using the Button
  component — that's fine, don't change the component choice.
- Follow the existing prop ordering pattern in each file (type comes before
  other props in this codebase).

## Steps

1. Open each file listed above and add `type="button"` to every `<button>` that
   is not a form submit button.
2. For each file, check if the button is inside a `<form>` — if so, determine
   whether it should be `type="submit"` or `type="button"`. Most are action
   buttons, not submit.
3. After all edits, run `npx react-doctor@latest --scope src` and confirm
   `button-has-type` warnings are gone.
4. Re-read the diff and remove any unrelated changes.

## Boundaries

- Do NOT change button behavior, styling, or component choice.
- Do NOT add any new components or abstractions.
- Keep each change to a single `type="button"` addition per button.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope src` — `button-has-type` warnings should
    be zero.
  - `npx tsc --noEmit` and `npx eslint src/components/filters/SearchBar.tsx
    src/components/table/TableView.tsx` (spot-check a few files).
- **Behavior check**: Open the applications list (TableView), click the filter
  button, clear the search, toggle kanban/table views — none should accidentally
  submit a form. Check that any actual submit buttons (login form, register
  form, application form) still submit correctly.
- **Done when**: zero `button-has-type` warnings, no accidental form submissions,
  TypeScript and ESLint pass.
