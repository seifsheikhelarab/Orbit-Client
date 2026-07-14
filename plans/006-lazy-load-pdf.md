# 006 — Lazy-load @react-pdf/renderer for CV builder

- **Status**: TODO
- **Commit**: (run `git rev-parse --short HEAD` before starting)
- **Severity**: MEDIUM
- **Category**: Performance
- **Rule**: react-doctor/prefer-dynamic-import
- **Estimated scope**: 6 files, ~20 lines changed

## Problem

`@react-pdf/renderer` (~500KB+) is eagerly imported in 6 files across the CV
builder feature. Vite code-splits routes, so the library is only loaded when
the user visits the builder — but within that route, the entire library loads
upfront including PDF generation code that's only needed for the template
components, not the preview buffer or form.

### Files

- `src/features/cv-builder/pages/BuilderPage.tsx:12`
- `src/features/cv-builder/components/PreviewBuffer.tsx:2`
- `src/features/cv-builder/components/ResumePDF.tsx:1`
- `src/features/cv-builder/components/templates/MinimalTemplate.tsx:1`
- `src/features/cv-builder/components/templates/ModernTemplate.tsx:1`
- `src/features/cv-builder/components/templates/ProfessionalTemplate.tsx:1`
- `src/features/cv-builder/components/templates/CoverLetterTemplate.tsx:1`

## Target

Lazy-load the heavy PDF components using `React.lazy`. The key split point is
the template components and the PDF renderer itself — the form and preview UI
should load immediately.

```tsx
// target in BuilderPage.tsx
const ResumePDF = React.lazy(() => import('./components/ResumePDF'));
const PreviewBuffer = React.lazy(() => import('./components/PreviewBuffer'));

// Wrap in Suspense with a fallback
<Suspense fallback={<Spinner />}>
  <PreviewBuffer ... />
</Suspense>
```

For the template components (MinimalTemplate, ModernTemplate, ProfessionalTemplate,
CoverLetterTemplate), they're already imported via ResumePDF — lazy-loading
ResumePDF transitively lazy-loads them.

### Important: Check current dynamic import setup

BuilderPage already has dynamic imports at lines 115-116 for the templates.
Check if those are already using `React.lazy` or `import()` — if so, only
PreviewBuffer and ResumePDF need the lazy treatment.

## Repo conventions to follow

- Follow the existing `React.lazy` pattern if one exists in the codebase.
- Use the existing `Spinner` component as the Suspense fallback.
- The Vite config already has a `vendor-pdf` chunk — verify it still works
  with lazy loading.

## Steps

1. Read `src/features/cv-builder/pages/BuilderPage.tsx:115-116` to check the
   existing dynamic import setup.
2. Convert `ResumePDF` and `PreviewBuffer` imports to `React.lazy` in
   `BuilderPage.tsx`.
3. Wrap the lazy components in `<Suspense fallback={<Spinner />}>`.
4. Verify the `vendor-pdf` chunk in `vite.config.ts` still splits correctly.
5. Check that `ResumePDF.tsx` exports a default component (required for
   `React.lazy`).

## Boundaries

- Do NOT change the PDF rendering behavior or templates.
- Do NOT add new dependencies.
- Keep the Suspense boundary minimal — only wrap the PDF components, not the
  entire builder page.

## Verification

- **Mechanical**:
  - `npx tsc --noEmit` and `npx eslint src/features/cv-builder/`.
  - Run `npx vite build --mode development` and check the chunk sizes — the
    vendor-pdf chunk should only load when the builder route is visited.
- **Behavior check**: Navigate to the builder — form should render immediately.
  The PDF preview should show a spinner briefly while the PDF library loads.
  All templates should render correctly.
- **Done when**: the builder form renders instantly, PDF preview loads lazily,
  no loading errors, TypeScript and lint pass.
