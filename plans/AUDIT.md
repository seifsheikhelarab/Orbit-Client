# React Codebase Audit — Orbit Client

React Doctor v0.7.7 full scan. 113 source files. 4 errors, ~70 warnings.
Audit organized by leverage (frequency × fan-out × user impact), not raw severity.

---

## 1. Bugs & Correctness

### HIGH LEVERAGE

**page-transition.tsx:63 — Timer leak on route change (effect-needs-cleanup)**
Every route change creates `setTimeout` calls whose previous timers are never
cleared. The cleanup at line 51-55 only runs on unmount. On a fast user clicking
through routes, timers pile up and fire stale state updates.
`src/components/ui/page-transition.tsx:63`

**page-transition.tsx:67,93,102 — State set from props via effect (no-adjust-state-on-prop-change)**
Three effects copy `location.pathname` into state, forcing an extra render with
stale UI between the prop update and the state commit. On every route change.
`src/components/ui/page-transition.tsx:67` `:93` `:102`

**BuilderPage.tsx:112 — `formState.isDirty` is hardcoded false (bug)**
`formState` is `{ isDirty: false }` and never updated. The `beforeunload` guard
(line 104-110) never fires, so users can navigate away and lose unsaved work.
`src/features/cv-builder/pages/BuilderPage.tsx:112`

**BuilderPage.tsx:93-102 — Stale closure in keyboard-save effect**
`useEffect` for Ctrl+S has `handleSave` missing from deps; `handleSave` closes
over `resumeData`, `coverLetterData`, `settings`, `newName`, `id` which all
change. Keyboard save may use stale data.
`src/features/cv-builder/pages/BuilderPage.tsx:93`

**button-has-type — ~25 instances across 14 files**
Non-submit buttons default to `type="submit"`, which can accidentally submit
forms. High-traffic files: SearchBar, TableView (8 buttons), TopBar (4), Sidebar,
KanbanCard, KanbanColumn, ViewToggle, FilterPanel, ApplicationsPage, BuilderPage.
`src/components/filters/FilterPanel.tsx:15,55` `SearchBar.tsx:82`
`src/components/layout/Sidebar.tsx:87` `TopBar.tsx:14,65,77,91`
`src/components/shared/FeatureTip.tsx:56` `ViewToggle.tsx:16,28`
`src/components/table/TableView.tsx:186,201,208,216,230,252,288,447`
`src/components/kanban/KanbanCard.tsx:160` `KanbanColumn.tsx:76`
`src/features/applications/pages/ApplicationsPage.tsx:336,404`
`KanbanColumn.tsx:61` `AttachResumePage.tsx:105`
`src/features/cv-builder/pages/BuilderPage.tsx:279`

**SearchBar.tsx:28 — Prop mirrored into state via effect (no-mirror-prop-effect)**
`value` prop is copied into `localValue` state via useEffect, showing the old
value briefly on first render.
`src/components/filters/SearchBar.tsx:28`

### MEDIUM LEVERAGE

**WorkExperience.tsx:101,117 — Impure state updater (no-impure-state-updater)**
`setBullets()` called inside a state updater function at line 101. React may
run updater functions more than once, so this side effect can repeat.
`src/features/cv-builder/components/sections/WorkExperience.tsx:101` `:117`

**PreviewBuffer.tsx:105 — Impure state updater**
`setActiveSlot(slot)` called inside `handleDocumentLoad` callback which is inside
a state updater — refs are read/written in the updater function.
`src/features/cv-builder/components/PreviewBuffer.tsx:105`

**WorkExperience.tsx:61 — Chained state updates (no-chain-state-updates)**
State change triggers effect which sets more state, causing extra renders.
`src/features/cv-builder/components/sections/WorkExperience.tsx:61`

**ApplicationsPage.tsx:97 — Missing dep `applications` in useMemo**
The memoized `applicationIds` uses `applications` but it's rebuilt every render,
so the memo runs every time anyway.
`src/features/applications/pages/ApplicationsPage.tsx:97`

### LOW LEVERAGE / SKIP

- **no-array-index-as-key in CV templates** (~30 instances): PDF render lists
  with stable order. Index keys are acceptable here. Skip.
- **BuilderPage.tsx:72,102,110 exhaustive-deps**: Marked `test-noise` by React
  Doctor — these are intentional suppressions for one-time data load effects.
  Skip unless addressing the stale-closure bug above.
- **FeatureTip.tsx:18 — client-localstorage-no-version**: Low risk; the stored
  data shape is simple (boolean). Skip.
- **Server-sequential-independent-await (BuilderPage:116)**: Tagged
  `server-action`, false positive for client code. Skip.

---

## 2. Performance

### HIGH LEVERAGE

**@react-pdf/renderer — 6 files eagerly load heavy PDF library**
BuilderPage, PreviewBuffer, ResumePDF, and all 4 templates import
`@react-pdf/renderer` eagerly. This library is ~500KB+ and only needed on the
CV builder route. Vite already code-splits routes, but the vendor chunk for
cv-builder is still huge.
`src/features/cv-builder/pages/BuilderPage.tsx:12`
`src/features/cv-builder/components/PreviewBuffer.tsx:2`
`src/features/cv-builder/components/ResumePDF.tsx:1`
`src/features/cv-builder/components/templates/MinimalTemplate.tsx:1`
`ModernTemplate.tsx:1` `ProfessionalTemplate.tsx:1` `CoverLetterTemplate.tsx:1`

### LOW LEVERAGE

- **StatusFilterPill.tsx:58 — js-set-map-lookups**: `includes()` on a small
  array (~8 statuses). The array is small enough that Set overhead isn't
  justified. Skip.
- **PreviewBuffer.tsx:36 — defaultLayoutPlugin on every render**: Low frequency
  component (only renders when viewing PDF). Skip.

---

## 3. Accessibility

### MEDIUM LEVERAGE

**control-has-associated-label — 5 controls missing labels**
Screen readers can't identify these interactive controls.
- `src/components/filters/SearchBar.tsx:82` — clear/reset button
- `src/components/table/TableView.tsx:186` — filter button
- `src/features/applications/components/ApplicationForm.tsx:262`
- `src/features/applications/components/ContactsList.tsx:138`
- `src/features/cv-builder/pages/BuilderPage.tsx:170`

**no-redundant-roles — TableView.tsx:285**
`role="row"` on `<tr>` adds noise for screen readers.
`src/components/table/TableView.tsx:285`

---

## 4. Security

### MEDIUM LEVERAGE

**better-auth@1.6.9 — Socket vulnerability score 25/100**
Low supply chain score on Socket's vulnerability axis. Needs `npm audit` check
and potential upgrade. Other axes are healthy (supply chain 97, maintenance 96).
`package.json:36`

---

## 5. Maintainability & Architecture

### HIGH LEVERAGE

**TableView.tsx — Module-scope functions recreated every render**
`formatSalary`, `formatDate`, `formatFollowUp` are defined inside the component
body. They use no local state and should be module-scope pure functions. The
inner `format` function at line 109 also shadows the date-fns `format` import.
`src/components/table/TableView.tsx:107-136`

**EmptyState.tsx:37 — Static object recreated every render**
`defaultContent` object is rebuilt on every render; should be module scope.
`src/components/shared/EmptyState.tsx:37`

**spinner.tsx:25 — Static object recreated every render**
`colorClasses` object rebuilt on every render; should be module scope.
`src/components/ui/spinner.tsx:25`

**TableView.tsx:89 — Static columns array recreated every render**
`columns` definition uses no local state.
`src/components/table/TableView.tsx:89`

**Login.tsx:30, Register.tsx:56 — Pure functions inside components**
`handleGoogle` is a pure function defined inside the component body.
`src/features/auth/pages/Login.tsx:30` `Register.tsx:56`

### MEDIUM LEVERAGE

**BuilderPage.tsx — 626-line giant component**
Contains resume form, cover letter form, preview panel, header, and inline
helper components (`CollapsibleSection`, `EntryPanel`, `Field`,
`SegmentedControl` at lines 504-624). The helpers could be extracted.
`src/features/cv-builder/pages/BuilderPage.tsx:15`

**ApplicationsPage.tsx — 539-line giant component**
12 useState calls, inline dialog, bulk action bar. Could extract filter dialog.
`src/features/applications/pages/ApplicationsPage.tsx:32`

**ViewApplicationPage.tsx — Giant component**
`src/features/applications/pages/ViewApplicationPage.tsx:43`

### LOW LEVERAGE / SKIP

- **only-export-components (StatusBadge, badge, button)**: These export a
  component + a type/variant helper. Moving types to separate files adds churn
  for negligible Fast Refresh benefit. Skip.
- **prefer-useReducer (ApplicationsPage)**: 12 independent useState calls. They
  don't always change together — useReducer would add complexity without clarity.
  Skip.
- **Giant component splits (TableView, ApplicationsPage, ViewApplicationPage)**:
  Valid concern but high-effort refactors. The current code is readable.
  Defer unless actively working in these files.
