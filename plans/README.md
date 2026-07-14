# React Improvement Plans

Generated from React Doctor v0.7.7 full scan. 113 source files.

## Execution Order

Plans are ordered by leverage (frequency × fan-out × user impact). Execute in
this sequence — later plans depend on earlier ones only where noted.

| # | Plan | Severity | Category | Files | Est. Effort |
|---|------|----------|----------|-------|-------------|
| 001 | [Fix page-transition timer leak](001-fix-page-transition.md) | HIGH | Bugs | 1 | 40 lines |
| 002 | [Add type="button" to all buttons](002-fix-button-has-type.md) | HIGH | Bugs | 14 | ~25 one-liners |
| 003 | [Fix BuilderPage stale closures](003-fix-builderpage-bugs.md) | HIGH | Bugs | 1 | 30 lines |
| 004 | [Fix SearchBar prop mirroring](004-fix-searchbar-prop-mirror.md) | MEDIUM | Bugs | 1 | 15 lines |
| 005 | [Move module-scope functions/values](005-move-module-scope.md) | MEDIUM | Maintainability | 6 | ~60 lines moved |
| 006 | [Lazy-load @react-pdf/renderer](006-lazy-load-pdf.md) | MEDIUM | Performance | 6 | ~20 lines |
| 007 | [Add accessible labels](007-fix-a11y-labels.md) | MEDIUM | Accessibility | 5 | ~6 lines |

## Dependencies

- **002** (button-has-type) should be done before **004** (SearchBar) since
  SearchBar:82 is touched by both plans.
- **005** (module-scope) and **006** (lazy-load) are independent of each other
  and of 001-004.
- **007** (a11y labels) should be done after **002** since TableView:186 is
  touched by both.

## Not Planned (Deliberate Simplifications)

The following React Doctor warnings were reviewed and intentionally skipped:

- **no-array-index-as-key in CV templates** (~30 instances): PDF render lists
  with stable order; index keys are safe.
- **only-export-components (StatusBadge, badge, button)**: Type/helper exports
  alongside components — Fast Refresh benefit negligible.
- **prefer-useReducer (ApplicationsPage)**: 12 independent states; reducer adds
  complexity without clarity.
- **Giant component splits (TableView, ApplicationsPage, ViewApplicationPage,
  BuilderPage)**: Valid but high-effort; defer unless actively refactoring.
- **client-localstorage-no-version (FeatureTip)**: Simple boolean data, low risk.
- **server-sequential-independent-await (BuilderPage:116)**: False positive
  (tagged server-action, is client code).
- **js-set-map-lookups (StatusFilterPill)**: Small array (~8 items), Set overhead
  not justified.

## Score Impact

Current score is impacted by 4 errors and ~70 warnings. Fixing plans 001-003
alone eliminates all 4 errors and approximately 35 warnings (button-has-type).
Plans 004-007 address an additional ~15 warnings.
