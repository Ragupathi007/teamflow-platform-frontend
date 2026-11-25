# TeamFlow Frontend

Modern project management frontend built with React 19, TypeScript, Vite, Tailwind CSS, and shadcn/ui-style components.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Redux Toolkit + React Redux
- TanStack Query + Axios
- React Router DOM
- React Hook Form + Zod
- TanStack Table
- Lucide React, Sonner, Framer Motion, Recharts, date-fns

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Environment variables

| Variable            | Description                          | Example                           |
| ------------------- | ------------------------------------ | --------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the TeamFlow REST API    | `http://localhost:3000/api/v1`    |

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Run oxlint                           |

## Architecture

The app follows a feature-based structure:

```text
src/
├── app/          # App store and providers
├── components/   # Shared UI, common, feedback, layout components
├── features/     # Feature modules (auth, users, workspaces)
├── hooks/        # Reusable hooks
├── layouts/      # Page layouts
├── lib/          # Axios client, query client, utilities
├── routes/       # Route definitions and guards
├── store/        # Redux slices
└── types/        # Shared TypeScript types
```

## Authentication security note

The current backend uses stateless JWT bearer tokens. The frontend stores the token through an isolated token-storage abstraction and attaches it to API requests.

Browser storage (`localStorage`) is readable by JavaScript, so it is vulnerable to XSS. A future backend enhancement should move tokens to secure `HttpOnly`, `SameSite` cookies. Because logout is stateless, the client removes the local token and clears client state on logout.
# teamflow-platform-frontend
