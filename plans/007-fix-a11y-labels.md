# 007 — Add accessible labels to unlabeled controls

- **Status**: TODO
- **Commit**: (run `git rev-parse --short HEAD` before starting)
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Rule**: react-doctor/control-has-associated-label | react-doctor/no-redundant-roles
- **Estimated scope**: 5 files, ~6 lines changed

## Problem

5 interactive controls have no accessible label, so screen readers can't identify
them. 1 redundant ARIA role adds noise.

| File | Line | Issue |
|------|------|-------|
| `src/components/filters/SearchBar.tsx` | 82 | Clear/reset button — no label |
| `src/components/table/TableView.tsx` | 186 | Filter button — no label |
| `src/features/applications/components/ApplicationForm.tsx` | 262 | Control — no label |
| `src/features/applications/components/ContactsList.tsx` | 138 | Control — no label |
| `src/features/cv-builder/pages/BuilderPage.tsx` | 170 | Control — no label |
| `src/components/table/TableView.tsx` | 285 | `role="row"` on `<tr>` — redundant |

## Target

Add `aria-label` to each control. Remove the redundant `role="row"`.

```tsx
// SearchBar.tsx:82 — clear button
<button type="button" aria-label="Clear search" onClick={...}>

// TableView.tsx:186 — filter button
<button type="button" aria-label="Filter applications" onClick={...}>

// TableView.tsx:285 — remove role="row"
<tr className="...">  // was: <tr role="row" className="...">
```

Check the actual JSX for ApplicationForm:262, ContactsList:138, and
BuilderPage:170 to determine the appropriate `aria-label` text.

## Repo conventions to follow

- Existing accessible patterns: the Sidebar uses `aria-label` on navigation
  (`src/components/layout/Sidebar.tsx`), follow that style.
- Keep labels concise and descriptive.

## Steps

1. Read each file at the flagged line to identify the exact control.
2. Add `aria-label="..."` with descriptive text to each unlabeled control.
3. At `src/components/table/TableView.tsx:285`, remove `role="row"` from `<tr>`.
4. Re-run the scan to confirm diagnostics are clear.

## Boundaries

- Do NOT change the visual UI or component behavior.
- Do NOT add visible labels — use `aria-label` only.

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope src` — `control-has-associated-label` and
    `no-redundant-roles` warnings for these files should be clear.
  - `npx tsc --noEmit`.
- **Behavior check**: Use a screen reader (or browser a11y inspector) to verify
  the controls announce their labels. Tab through the TableView — filter button
  should read "Filter applications".
- **Done when**: all a11y diagnostics clear, screen reader announces labels
  correctly.
