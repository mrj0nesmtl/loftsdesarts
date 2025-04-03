# Architecture Documentation

This directory contains comprehensive documentation of the Lofts des Arts platform architecture, including system design, infrastructure, and technical decisions.

## Directory Structure

- `/diagrams/` - Architectural diagrams and visual representations
- `/decisions/` - Architecture Decision Records (ADRs)
- `/infrastructure/` - Infrastructure and deployment architecture
- `/patterns/` - Design patterns and architectural patterns
- `/security/` - Security architecture and considerations
- `/performance/` - Performance architecture and optimizations

## System Overview

The Lofts des Arts platform follows a modern web application architecture with the following key characteristics:

- **Next.js App Router**: Server-side rendering and client components
- **TypeScript**: Strong typing throughout the application
- **Supabase**: Backend-as-a-Service for database, authentication, and storage
- **Vercel/Replit**: Hosting and deployment platform
- **TanStack Query**: Data fetching and state management
- **Shadcn/UI + Tailwind CSS**: Component library and styling

## Architecture Diagrams

Key architecture diagrams include:

- [System Context Diagram](./diagrams/system-context.png)
- [Container Diagram](./diagrams/container-diagram.png)
- [Component Diagram](./diagrams/component-diagram.png)
- [Deployment Diagram](./diagrams/deployment-diagram.png)

## Architectural Principles

The architecture follows these core principles:

1. **Server-first approach**: Utilize server components where possible
2. **Progressive enhancement**: Core functionality works without JavaScript
3. **Type safety**: Strong typing across the entire codebase
4. **Security by design**: Security considered at every level
5. **Resilience**: Graceful degradation and error recovery
6. **Performance**: Optimized for speed and efficiency
7. **Accessibility**: WCAG 2.1 AA compliance

## Core Technologies

### Frontend

- **Next.js 14**: React framework with App Router for routing and rendering
- **TypeScript**: Type-safe JavaScript
- **TanStack Query**: Data fetching, caching, and state management
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management

### Backend

- **Supabase**: PostgreSQL database with built-in services
- **Next.js API Routes**: Serverless API endpoints
- **PostgreSQL**: Relational database
- **Row Level Security**: Database-level access control
- **Supabase Auth**: Authentication and authorization
- **Supabase Storage**: File storage and management

### Infrastructure

- **Replit**: Hosting and deployment
- **GitHub Actions**: CI/CD pipeline
- **Sentry**: Error monitoring
- **Lighthouse**: Performance monitoring
- **Redis**: Caching (future)

## Data Architecture

The system uses a PostgreSQL database with the following key characteristics:

- **Schema-based design**: Clear separation of concerns
- **Row Level Security**: Fine-grained access control
- **Foreign key relationships**: Data integrity
- **Indexing**: Performance optimization
- **Full-text search**: Efficient content searching

Key data entities include:

- Users (managed by Supabase Auth)
- Profiles (linked to users)
- Contact Inquiries
- Media Assets
- Content Items

## Security Architecture

Security is implemented at multiple levels:

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security policies
- **Input Validation**: Zod schema validation
- **CORS**: Controlled cross-origin resource sharing
- **CSP**: Content Security Policy headers
- **HTTPS**: Encrypted communication
- **Rate Limiting**: Protection against abuse

## Performance Architecture

Performance optimization strategies include:

- **Server Components**: Reduced client-side JavaScript
- **Static Generation**: Pre-rendered content where appropriate
- **Incremental Static Regeneration**: Updated static content
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Optimized bundle sizes
- **Caching**: Supabase data caching and HTTP caching

## Scalability Considerations

The architecture is designed to scale in the following ways:

- **Horizontal Scaling**: Adding more compute resources
- **Database Scaling**: PostgreSQL scaling options
- **Static Content**: CDN distribution
- **Caching**: Multi-level caching strategy

## Architecture Decision Records

Significant architectural decisions are documented as Architecture Decision Records (ADRs) in the [decisions directory](./decisions/).

Key decisions include:

- [ADR-001: Adoption of Next.js App Router](./decisions/adr-001-nextjs-app-router.md)
- [ADR-002: Supabase as Backend-as-a-Service](./decisions/adr-002-supabase-backend.md)
- [ADR-003: Shadcn/UI Component Library](./decisions/adr-003-shadcn-ui.md)
- [ADR-004: TanStack Query for Data Management](./decisions/adr-004-tanstack-query.md)

## Future Architecture Considerations

Planned architectural enhancements include:

- Redis caching integration
- WebSocket real-time updates
- AI-powered content features
- Enhanced search capabilities
- Multi-region deployment 