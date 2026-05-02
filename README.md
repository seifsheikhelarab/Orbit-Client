<div align="center">
  <img src="/icon.png" width="96" alt="Orbit Logo" />
  <h1>Orbit</h1>
  <p>Stop losing track of job applications. Orbit keeps every job, every contact, and every deadline organized.</p>
  <p>
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

## Overview

Orbit is a modern job application tracker designed to help you manage your job search pipeline. It features multiple views, a CV builder, analytics dashboard, and secure authentication.

## Features

- **Multiple Views** - Kanban board and table view for managing applications
- **CV Builder** - Create and manage professional resumes with PDF export
- **Dashboard** - Visualize application stats, conversion rates, and trends
- **Smart Search** - Filter and search applications by status, priority, or keywords
- **Authentication** - Secure login with Better Auth (Email/Password & Google OAuth)
- **Responsive Design** - Optimized for desktop and mobile with Tailwind CSS v4

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling with custom design system
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Client-side routing
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Better Auth** - Authentication client

## Prerequisites

- Bun >= 1.1 (or Node.js >= 20)

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SERVER_URL=http://localhost:5726/api/v1
```

> [!NOTE]
> The client expects the server to be running on the URL specified above.

## Getting Started

```bash
# Install dependencies
bun install
```

## Usage

### Development

```bash
bun run dev
```

The app will be available at `http://localhost:5173`.

### Production

```bash
# Type-check and build
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
src/
├── components/    # Shared UI components (ui/, layout/)
│   ├── ui/       # Primitives (Button, Input, Card, Dialog, Badge...)
│   └── layout/   # AppLayout, Sidebar, TopBar
├── features/      # Feature modules
│   ├── applications/  # Kanban/table views, forms, hooks
│   ├── dashboard/      # Charts, stats, activity feed
│   ├── cv-builder/     # Resume builder + PDF templates
│   ├── auth/          # Login, Register, ProtectedRoute
│   ├── documents/      # File management
│   └── notifications/
├── hooks/         # useUIStore, useKeyboardShortcuts, useApplicationsQuery
├── lib/           # auth-client, axios, utils, status
├── pages/         # Top-level pages (LandingPage)
├── App.tsx        # Root component with routing
└── main.tsx       # Entry point
```
