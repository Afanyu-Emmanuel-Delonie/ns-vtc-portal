# NS VTC Staff Portal

Internal staff portal for NS VTC's apprenticeship/learnership placement program — job listings, candidate applications, an application pipeline, and a directory of hiring employers, backed by Firebase.

## Tech stack

- **Next.js 16** (App Router, Turbopack, Server Actions)
- **React 19**
- **Firebase** — Auth (email/password) and Firestore (client SDK, no Admin SDK yet — see [Known gaps](#known-gaps))
- **Tailwind CSS 4**
- **TypeScript**

> This repo runs a customized/pre-release Next.js build. Before making framework-level changes, read `AGENTS.md` — it points at the local docs bundled with the `next` package, which may differ from what you'd expect from public Next.js docs.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local` (not committed — see `.gitignore`) with your Firebase Web app config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

These map to a Firebase Web app under the project referenced in `.firebaserc`.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Staff sign in at `/login`; the public application flow lives under `/apply/[listingId]`.

### 4. (Optional) Seed sample data

```bash
npm run seed
```

Runs `scripts/seed.ts`, which writes `lib/seed-data.ts` (sample listings, applications, employers) plus the trade lookup list into Firestore, using the same `NEXT_PUBLIC_FIREBASE_*` env vars.

## Firebase project

- Project config: `.firebaserc` (`vtc-portal-d5ee2`)
- Firestore security rules: `firestore.rules`
- Firestore indexes: `firestore.indexes.json`
- Cloud Functions (not yet deployed as part of the app flow): `functions/src/` — `onApplicationCreated`, `flagOverdueFollowUps`, `computeDashboardStats`

Deploy rules after changing them:

```bash
firebase deploy --only firestore:rules
```

## Project structure

```
app/
  (auth)/login/            Staff sign-in
  (dashboard)/             Authenticated staff area (gated by app/(dashboard)/layout.tsx)
    listings/               Job listing CRUD
    applications/           Candidate pipeline
    recruiters/              Employer directory (see naming note below)
    reports/                Analytics/exports
    settings/                Profile + admin lookups
  (public)/apply/[listingId]/  Public, unauthenticated candidate application form

components/
  dashboard/, listings/, recruiters/, applications/, public/, nav/, ui/

lib/
  firebase.ts               Firebase app/Auth/Firestore init (client SDK)
  types.ts                  Domain types (Listing, Application, Employer, Complaint, ...)
  constants.ts               Pipeline stages, trade options, dial codes, default application fields
  queries/                   Firestore read/write functions, grouped by domain
  seed-data.ts / scripts/seed.ts   Sample data + one-off seeding script
```

### Naming note: `recruiters/` route = Employers

The `(dashboard)/recruiters` route, `components/recruiters/`, and `lib/queries/recruiters.ts` all manage the **employer** (hiring company) directory — the sidebar label is "Employers". The `Recruiter` (internal staff) concept from earlier in the project's history was removed in favor of this; only the route/file/folder names still say "recruiters" as a holdover. `Application.recruiter` is unrelated — it's just a free-text field naming whichever staff member is handling that candidate.

## Data model

Firestore collections and their matching security rules (`firestore.rules`):

| Collection    | Purpose                              | Read       | Write                                  |
|---------------|---------------------------------------|------------|------------------------------------------|
| `listings`    | Job/apprenticeship listings           | public     | public *(temporary — see below)*          |
| `applications`| Candidate applications                | public     | create: public · update/delete: signed-in |
| `employers`   | Hiring company directory              | public     | signed-in                                 |
| `meta`        | Lookup data (e.g. `meta/config.trades`) | public   | public *(temporary — see below)*          |

## Known gaps

- **No Firebase Admin SDK.** Listing create/edit/close runs through Next.js Server Actions using the *client* Firestore SDK, with no server-side auth context — so `listings` and `meta` currently have open (`allow write: if true`) rules. Tighten these once an Admin SDK service account is wired up server-side.
- **Auth gate is a plain cookie check**, not a verified Firebase ID token (`app/(dashboard)/layout.tsx` just checks for the presence of an `ns_vtc_auth` cookie set client-side after sign-in). Fine for now since Firestore rules are the actual enforcement boundary, but don't treat the cookie as a security control.
- **Cloud Functions in `functions/`** are written but not part of the deploy/build flow described here — confirm they're deployed (`firebase deploy --only functions`) if the app depends on their side effects.

## Scripts

| Command         | Description                          |
|-----------------|----------------------------------------|
| `npm run dev`   | Start the dev server (Turbopack)       |
| `npm run build` | Production build (type-checks too)     |
| `npm run start` | Start the production server            |
| `npm run lint`  | Run ESLint                             |
| `npm run seed`  | Seed sample data into Firestore        |
