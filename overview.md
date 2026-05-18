# ReNourish - Food Donation Platform

## Overview

ReNourish is a food donation platform that connects donors, NGOs, and volunteers to reduce food waste and feed those in need. The application consists of a React + TypeScript frontend with a Node.js/Express backend that can optionally proxy to a Spring Boot backend running on localhost:8080.

The platform supports four user roles:
- **DONOR**: Create and manage food donations
- **NGO**: Browse and claim available donations for distribution
- **VOLUNTEER**: Claim delivery assignments and update delivery status
- **ADMIN**: Access to analytics and platform management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom design system, Radix UI primitives for accessible components
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors for JWT authentication
- **Charts**: Recharts for analytics visualization
- **Maps**: Leaflet with React-Leaflet for donation location display
- **Animations**: Framer Motion for page transitions

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with TSX for execution
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express-session with MemoryStore (development)
- **Build Tool**: Vite for frontend, esbuild for server bundling

### Data Storage
- **Primary Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Definition**: Drizzle ORM schema in `shared/schema.ts`
- **Tables**: users, donations, assignments

### Authentication & Authorization
- JWT-based authentication stored in localStorage
- Axios interceptors inject Bearer token on all API requests
- Role-based route protection via `ProtectedRoute` component
- Session-based fallback for server-side auth

### API Structure
The backend exposes REST endpoints matching a Spring Boot backend:
- `/api/auth/*` - Authentication (register, login, profile)
- `/api/donations/*` - Donation CRUD and claiming
- `/api/analytics/*` - Dashboard and user statistics
- `/api/volunteer/*` - Volunteer assignment management

### Project Structure
```
React-Bootstrap-Frontend/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route page components
│   │   ├── hooks/        # Custom React hooks (auth, donations, etc.)
│   │   └── lib/          # Utilities (axios config, query client)
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Database access layer
│   └── db.ts             # Drizzle database connection
├── shared/               # Shared types and schemas
│   ├── schema.ts         # Drizzle table definitions
│   └── routes.ts         # API contract definitions
└── migrations/           # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migration and schema push (`npm run db:push`)

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **axios**: HTTP client with request/response interceptors
- **recharts**: Data visualization for analytics dashboard
- **framer-motion**: Animation library for smooth transitions
- **react-leaflet + leaflet**: Interactive maps for donation locations
- **@radix-ui/***: Accessible UI component primitives
- **react-hook-form + @hookform/resolvers**: Form handling with Zod validation
- **date-fns**: Date formatting utilities

### Backend Libraries
- **express**: Web server framework
- **drizzle-orm**: TypeScript ORM for database operations
- **express-session + memorystore**: Session management
- **connect-pg-simple**: PostgreSQL session store (production)

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TSX**: TypeScript execution for Node.js
- **@replit/vite-plugin-***: Replit-specific development plugins

### Optional External Backend
The frontend is designed to optionally connect to a Spring Boot backend at `http://localhost:8080`. When the Spring Boot backend is unavailable, the Express server provides equivalent functionality with mock data fallbacks.
