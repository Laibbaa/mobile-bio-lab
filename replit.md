# LIMS - Laboratory Information Management System

## Overview

This is a full-stack Laboratory Information Management System (LIMS) built with Express.js backend and React frontend. The system provides sample tracking, protocol management, reporting capabilities, and user management features for laboratory environments. It's designed to support different user roles including students, researchers, technicians, and administrators.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

- **Frontend**: React with TypeScript, using Vite for bundling and development
- **Backend**: Express.js with TypeScript for API endpoints
- **Database**: PostgreSQL with Drizzle ORM for database operations
- **Authentication**: Passport.js with local strategy and session-based authentication
- **UI Components**: shadcn/ui components built on Radix UI primitives with Tailwind CSS

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Passport.js with local strategy
- **Session Management**: Express-session with PostgreSQL store
- **Database Provider**: Neon serverless PostgreSQL
- **Validation**: Shared schemas using Drizzle Zod

### Database Schema
The system uses PostgreSQL with the following main entities:
- **Users**: Authentication and profile information with role-based access
- **Samples**: Core sample tracking with metadata and location data
- **Protocols**: Step-by-step laboratory procedures and instructions
- **Reports**: Generated analysis reports linked to samples
- **Notifications**: System notifications for users
- **Sensor Data**: IoT sensor readings and measurements

### Authentication & Authorization
- Session-based authentication using Passport.js
- Role-based access control (student, researcher, technician, admin)
- Password hashing using Node.js crypto scrypt
- Protected routes with authentication middleware

## Data Flow

1. **User Authentication**: Users log in through the auth page, creating a session stored in PostgreSQL
2. **Sample Management**: Users can create, view, and track samples with associated metadata
3. **Protocol Access**: Users can browse and follow laboratory protocols
4. **Report Generation**: System generates reports based on sample analysis
5. **Real-time Updates**: TanStack Query manages cache invalidation for real-time data updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Development Server**: Runs on port 5000 with Vite dev server
- **Database**: Provisioned PostgreSQL instance with connection pooling

### Production Build
- **Frontend Build**: Vite builds React app to `dist/public`
- **Backend Build**: esbuild bundles Express server to `dist/index.js`
- **Deployment Target**: Autoscale deployment on external port 80

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption
- `NODE_ENV`: Environment mode (development/production)

## Recent Changes

- **June 26, 2025**: Implemented comprehensive admin features including admin dashboard, user management, and protocol management
- **June 26, 2025**: Added admin-only routes with proper role-based access control and security
- **June 26, 2025**: Created admin dashboard with stats, analytics, user trends, and activity logs
- **June 26, 2025**: Built complete user management system with edit/delete capabilities and role management
- **June 26, 2025**: Implemented protocol library management with categorization and difficulty levels
- **June 26, 2025**: Added notification system for admin broadcasting and user alerts
- **June 26, 2025**: Fixed sample form validation and date handling issues
- **June 26, 2025**: Created Profile and Settings pages with proper navigation
- **June 25, 2025**: Added missing pages: Lab Scheduling, QR Scanner, Sensor Data, and Data Visualization
- **June 25, 2025**: Fixed authentication system with case-insensitive username lookup

## User Preferences

```
Preferred communication style: Simple, everyday language.
```