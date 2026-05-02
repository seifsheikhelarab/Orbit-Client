# Product Requirements Document

## Orbit — Job Application Tracker

**Version:** 1.0  
**Date:** April 2026  
**Stack:** React + Vite (Frontend) / Express + Bun (Backend) / PostgreSQL + Prisma (Database)  
**Status:** Phase 1–6 Complete

---

## 1. Overview

**Orbit** is a personal job application tracking tool designed for job seekers actively managing multiple job applications. It provides a structured pipeline for tracking application status, organizing documents, setting follow-up reminders, and visualizing job search progress through analytics dashboards.

The product helps users stay organized during the stressful job hunt process by reducing anxiety and providing control over their job search.

---

## 3. User Stories

### Authentication

| ID | Story |
|----|-------|
| US-01 | As a new user, I can register with name, email, and password |
| US-02 | As a new user, I can sign up with Google OAuth |
| US-03 | As a returning user, I can log in with email/password |
| US-04 | As a returning user, I can log in with Google OAuth |
| US-05 | As an existing user, I can link my Google account |
| US-06 | As an OAuth user, I can set a password |
| US-07 | As a user, I can log out securely |
| US-08 | As an unauthenticated user, I am redirected to login |

### Application Management

| ID | Story |
|----|-------|
| US-09 | As a user, I can create an application with company, title, and status |
| US-10 | As a user, I can fill optional fields: job URL, location, salary range, application date, notes, source |
| US-11 | As a user, I can view all my applications |
| US-12 | As a user, I can click into an application to view/edit details |
| US-13 | As a user, I can update application status |
| US-14 | As a user, I can delete an application |
| US-15 | As a user, I can set a follow-up date and note |
| US-16 | As a user, I can see overdue follow-up indicators |

### Views & Discovery

| ID | Story |
|----|-------|
| US-17 | As a user, I can toggle between Kanban and Table views |
| US-18 | As a user, I can drag-and-drop to change status (Kanban) |
| US-19 | As a user, I can change status inline (Table) |
| US-20 | As a user, I can search across company, title, and notes |
| US-21 | As a user, I can filter by status, location, date range, salary range |
| US-22 | As a user, I can sort columns (Table view) |
| US-23 | As a user, I can paginate through applications |

### Document Management

| ID | Story |
|----|-------|
| US-24 | As a user, I can upload PDF/DOCX files (up to 5MB) |
| US-25 | As a user, I can categorize documents (CV, Cover Letter, Other) |
| US-26 | As a user, I can name documents custom names |
| US-27 | As a user, I can view version history of documents |
| US-28 | As a user, I can attach documents to applications |
| US-29 | As a user, I can preview PDFs inline |
| US-30 | As a user, I can download documents |
| US-31 | As a user, I can import files from Google Drive |
| US-32 | As a user, I can soft-delete documents |

### Reminders & Notifications

| ID | Story |
|----|-------|
| US-33 | As a user, I receive email reminders for follow-up dates |
| US-34 | As a user, I see in-app notification bell with unread count |
| US-35 | As a user, I can snooze reminders (1, 3, 7 days) |
| US-36 | As a user, I can dismiss reminders |

### Analytics Dashboard

| ID | Story |
|----|-------|
| US-37 | As a user, I can view summary stats (total, active, response rate, offer rate) |
| US-38 | As a user, I can view applications over time chart |
| US-39 | As a user, I can view pipeline funnel with conversion rates |
| US-40 | As a user, I can view status breakdown donut chart |
| US-41 | As a user, I can view response rate trend |
| US-42 | As a user, I can view top locations chart |
| US-43 | As a user, I can view job source breakdown |
| US-44 | As a user, I can filter by date range (30d, 90d, 6m, 12m, all time) |
| US-45 | As a user, I can export data to CSV |

### Status History

| ID | Story |
|----|-------|
| US-46 | As a user, every status change is logged with timestamp |
| US-47 | As a user, I can view status history timeline on detail page |

### Bulk Actions

| ID | Story |
|----|-------|
| US-48 | As a user, I can select multiple applications (Table view) |
| US-49 | As a user, I can bulk change status |
| US-50 | As a user, I can bulk delete with confirmation |

### Contacts

| ID | Story |
|----|-------|
| US-51 | As a user, I can add contacts per application (name, title, email, phone, LinkedIn) |
| US-52 | As a user, I can edit/delete contacts |
| US-53 | As a user, I can view contacts on application detail page |

### Interview Rounds

| ID | Story |
|----|-------|
| US-54 | As a user, I can log interview rounds (type, date, interviewer, notes) |
| US-55 | As a user, I can mark interview outcomes (Positive, Neutral, Negative) |
| US-56 | As a user, I can edit/delete interview rounds |
| US-57 | As a user, I can view rounds in chronological order |
| US-58 | As a user, I can add interviews to Google Calendar |

### Calendar Integration

| ID | Story |
|----|-------|
| US-59 | As a user, I can add follow-up dates to Google Calendar |
| US-60 | As a user, I can add interview rounds to Google Calendar |

### User Settings

| ID | Story |
|----|-------|
| US-61 | As a user, I can update my name and email |
| US-62 | As a user, I can change my password |
| US-63 | As a user, I can set my timezone preference |
| US-64 | As a user, I can toggle email reminders |
| US-65 | As a user, I can toggle in-app notifications |
| US-66 | As a user, I can delete my account |

---

## 4. Status Pipeline

Fixed 6-stage ordered pipeline. Status can be set to any stage (not enforced as linear progression).

```
SAVED → APPLIED → PHONE_SCREEN → INTERVIEW → OFFER → CLOSED
```

| Status | Description |
|--------|-------------|
| `SAVED` | Job bookmarked, not yet applied |
| `APPLIED` | Application submitted |
| `PHONE_SCREEN` | Recruiter/HR screening scheduled or done |
| `INTERVIEW` | Technical or panel interview stage |
| `OFFER` | Offer received |
| `CLOSED` | Rejected, withdrawn, or position filled |

---

## 5. Data Models

### Core Entities

#### User
- `id` (nanoid), `email` (unique), `name`, `password`, `emailVerified`
- `googleId` (unique), `avatarUrl`
- `timezone` (default: UTC), `emailRemindersEnabled`, `inAppNotificationsEnabled`
- Relations: sessions, accounts, jobApplications, documents, notifications, resumes

#### JobApplication
- Core: `id`, `userId`, `company`, `jobTitle`, `applicationStatus`
- Details: `jobURL`, `location`, `salaryMin`, `salaryMax`, `appliedDate`, `notes`
- Follow-up: `followUpDate`, `followUpNote`
- Tracking: `source`, `createdAt`, `updatedAt`
- Relations: statusHistory, contacts, interviewRounds, notifications, reminderJobs

#### Document
- `id`, `userId`, `name`, `type` (CV, COVER_LETTER, OTHER)
- `activeVersionId`, `deletedAt` (soft delete)
- Relations: versions (DocumentVersion[])

#### DocumentVersion
- `id`, `documentId`, `versionNumber`, `originalFilename`, `storageKey`
- `mimeType`, `fileSizeBytes`, `source` (LOCAL, GOOGLE_DRIVE)

#### Resume (CV Builder)
- `id`, `userId`, `name`, `slug` (unique)
- `content` (JSON - structured resume data)
- `settings` (JSON - template, colors, fonts, margins)
- `isPublic`

#### StatusHistory
- `id`, `applicationId`, `fromStatus`, `toStatus`, `note`, `changedAt`

#### Contact
- `id`, `applicationId`, `name`, `title`, `email`, `phone`, `linkedinUrl`

#### InterviewRound
- `id`, `applicationId`, `roundType` (PHONE_SCREEN, TECHNICAL, SYSTEM_DESIGN, BEHAVIORAL, FINAL, OTHER)
- `scheduledAt`, `interviewerName`, `notes`, `outcome` (POSITIVE, NEUTRAL, NEGATIVE)

#### Notification
- `id`, `userId`, `applicationId`, `type` (FOLLOW_UP_DUE, FOLLOW_UP_OVERDUE)
- `title`, `body`, `readAt`, `actionedAt`

#### ReminderJob
- `id`, `applicationId`, `scheduledDate`, `sentAt`

---

## 6. API Endpoints

### Authentication (`/api/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET | `/me` | Get current user |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | Google OAuth callback |
| POST | `/link-google` | Link Google to existing account |

### Applications (`/api/applications`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List (paginated, filterable) |
| POST | `/` | Create |
| GET | `/:id` | Get single |
| PATCH | `/:id` | Update |
| DELETE | `/:id` | Delete |
| PATCH | `/bulk` | Bulk status change |
| DELETE | `/bulk` | Bulk delete |

### Contacts (`/api/applications/:id/contacts`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List contacts |
| POST | `/` | Add contact |
| PATCH | `/:contactId` | Update contact |
| DELETE | `/:contactId` | Delete contact |

### Interview Rounds (`/api/applications/:id/interviews`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List rounds |
| POST | `/` | Log round |
| PATCH | `/:roundId` | Update round |
| DELETE | `/:roundId` | Delete round |

### Documents (`/api/documents`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List documents |
| POST | `/upload` | Upload file |
| GET | `/:id` | Get document |
| PATCH | `/:id` | Update document |
| DELETE | `/:id` | Soft delete |
| POST | `/import/google-drive` | Import from Drive |
| GET | `/:id/download` | Download file |

### Applications-Documents
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/:id/attach` | Attach document |
| DELETE | `/:id/detach/:docId` | Detach document |

### Users (`/api/users`)
| Method | Route | Description |
|--------|-------|-------------|
| PATCH | `/me` | Update profile/preferences |
| POST | `/me/change-password` | Change password |
| DELETE | `/me` | Delete account |

### Notifications (`/api/notifications`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List notifications |
| POST | `/:id/read` | Mark as read |
| POST | `/:id/snooze` | Snooze reminder |
| DELETE | `/:id` | Dismiss |

### Dashboard (`/api/dashboard`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/stats` | Summary statistics |
| GET | `/charts/over-time` | Applications over time |
| GET | `/charts/pipeline` | Pipeline funnel |
| GET | `/charts/status` | Status breakdown |
| GET | `/charts/response-trend` | Response rate trend |
| GET | `/charts/locations` | Top locations |
| GET | `/charts/sources` | Source breakdown |

### Resumes (`/api/resumes`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List resumes |
| POST | `/` | Create resume |
| GET | `/:id` | Get resume |
| PATCH | `/:id` | Update resume |
| DELETE | `/:id` | Delete resume |
| GET | `/:slug` | Get by slug (public) |

---

## 7. Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | Email/password login |
| `/register` | RegisterPage | User registration |
| `/` | DashboardPage | Analytics overview |
| `/applications` | ApplicationsPage | List/Kanban/Table view |
| `/applications/new` | NewApplicationPage | Create form |
| `/applications/:id` | ApplicationDetailPage | View/edit details |
| `/documents` | DocumentsPage | Document library |
| `/documents/:id` | DocumentDetailPage | Document viewer |
| `/settings` | SettingsPage | User settings |
| `/resumes` | ResumesPage | CV builder |
| `/resumes/:id` | BuilderPage | Resume editor |

---

## 8. Key Features Summary

### Phase 1: Foundation
- User registration/login/logout
- Application CRUD
- Status pipeline (6 stages)
- Basic filtering

### Phase 2: Views & Discovery
- Kanban board with drag-and-drop
- Table view with sorting
- Global search
- Multi-filter (status, location, date, salary)
- View toggle (persistent)

### Phase 3: Document Management
- File upload (PDF, DOCX up to 5MB)
- Version history
- Attach to applications
- Preview and download
- Google Drive import
- Local storage (S3-ready abstraction)

### Phase 4: Reminders & Notifications
- Follow-up date scheduling
- Email reminders (cron job)
- In-app notification bell
- Snooze/dismiss functionality
- Nightly reminder cron

### Phase 5: Dashboard & Analytics
- Summary stats (total, active, response rate, offer rate)
- Charts: Over time, Pipeline funnel, Status donut, Response trend, Locations, Sources
- Date range filter
- CSV export

### Phase 6: Polish & Extras
- Google OAuth
- Status history timeline
- Bulk actions (select, status change, delete)
- Contacts per application
- Interview rounds with outcomes
- Calendar integration (Google Calendar deep links)
- User settings (timezone, notifications, danger zone)

---

## 9. Technical Architecture

### Frontend
- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS v4 + CVA
- **UI Components:** Radix UI primitives
- **State:** Zustand (global), TanStack Query (server state)
- **Icons:** Lucide React
- **Fonts:** Instrument Sans, Syne

### Backend
- **Runtime:** Bun
- **Framework:** Express.js
- **ORM:** Prisma (with PostgreSQL adapter)
- **Auth:** Better Auth
- **Validation:** Zod
- **Caching:** Redis

### Infrastructure
- **Database:** PostgreSQL
- **Storage:** Local disk (S3-ready abstraction)
- **Email:** Configurable provider
- **Deployment:** Docker + Nginx

---

## 10. Response Envelope Format

```typescript
// Success
{ message, data, timestamp, path }

// Paginated
{ success, message, data, pagination: { page, limit, total, pages }, ... }

// Error
{ message, code, status, timestamp, path, details }
```

---

## 11. Acceptance Criteria (Launch Readiness)

### Environment
- [ ] Environment variables documented in `.env.example`
- [ ] Database migrations tested on fresh PostgreSQL
- [ ] S3 storage backend tested
- [ ] Email provider tested with real domain

### Security
- [ ] Rate limiting on auth endpoints
- [ ] Helmet.js security headers
- [ ] CORS locked to production URL
- [ ] File access control enforced
- [ ] JWT authentication on all protected routes

### Operations
- [ ] Cron jobs verified in staging
- [ ] Error monitoring (Sentry) configured
- [ ] README with setup instructions

---

## 12. Out of Scope (Post-Launch)

- Team / shared workspace features
- Mobile app (separate product)
- Browser extension for auto-capturing job listings
- AI-powered CV tailoring
