# Lofts des Arts Web Platform

![Lofts des Arts](public/logo.png)

## Overview

The Lofts des Arts Web Platform is a comprehensive management system for luxury condominium buildings, specifically designed for the "Lofts des Arts" located at 1625 Clark, Montreal. This Next.js 14 application provides administrators and residents with tools for building management, communication, document sharing, and community engagement.

## Current Status

- **Phase 1 (Foundation)**: ✅ Complete (April 7, 2025)
- **Phase 2 (Admin Features)**: 🔄 90% Complete - In Progress
- **Phase 3 (Resident Portal)**: 📅 Scheduled (April 15-21, 2025)

## Key Features

### Implemented Features

- **Authentication System**
  - Role-based access control with 6 distinct user roles
  - Secure login and session management
  - Account recovery and security policies

- **Admin Dashboard**
  - Personalized welcome with time-of-day greeting
  - Quick access to key management functions
  - Activity summaries and metrics

- **Document Management**
  - Secure file upload and storage
  - Category-based organization
  - Version control and access management
  - Document preview and sharing

- **User Management**
  - User creation and role assignment
  - Permission management
  - Account status controls
  - Activity logging and audit trails

- **Building and Residents Management**
  - Building structure data with multi-building support
  - 96 residential and commercial units database
  - Resident profiles with comprehensive contact information
  - Owner vs. tenant designation
  - Primary resident tracking
  - Move-in/move-out date management
  - Unit occupancy status tracking
  - Language and communication preferences
  - Data import/export capabilities
  - Tab-based management interface
  - Search and filtering functionalities

- **Package Management Components**
  - Package registration with barcode scanning
  - QR code generation for package tracking
  - Notification preference settings

- **Multilingual Support**
  - English and French language options
  - Language toggle throughout interface
  - Localized content and notifications

### In Progress Features

- Messaging system interface
- Package management workflow
- Enhanced analytics dashboard
- Board announcement system
- Email notification system
- Emergency notification center
- Audit logging visualization

## Technology Stack

```typescript
{
  frontend: {
    framework: 'Next.js 14',
    language: 'TypeScript 5.0',
    state: 'Zustand',
    styling: 'Tailwind CSS',
    ui: 'Shadcn/ui',
    routing: 'App Router',
    auth: 'Supabase Auth',
    forms: 'react-hook-form + zod',
    query: 'TanStack Query v5'
  },
  backend: {
    database: 'Supabase',
    api: 'REST + WebSocket',
    analytics: 'Custom + Recharts',
    caching: 'Redis',
    search: 'PostgreSQL + PostGIS',
    ai: ['TensorFlow.js', 'OpenCV', 'DeepSeek', 'OpenAI']
  },
  infrastructure: {
    hosting: 'Replit',
    ci_cd: 'GitHub Actions',
    monitoring: 'Sentry',
    performance: 'Lighthouse',
    security: 'Supabase RLS + Custom RBAC',
    storage: 'Supabase Storage'
  }
}
```

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Supabase account
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/loftsdesarts.git
   cd loftsdesarts
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` to add your Supabase credentials and other configurations.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Initialize the Supabase project:
   ```bash
   npx supabase init
   ```

2. Run the database setup scripts:
   ```bash
   bash scripts/setup_lda_data.sh
   ```

This script will populate your database with the building structure for Lofts des Arts, including all floors and units, as well as sample resident data for testing.

## Project Structure

```
├── public/              # Static assets
├── scripts/             # Setup and utility scripts
├── sql/                 # SQL scripts for database setup
│   ├── building_data_setup.sql    # Building and units data
│   ├── resident_data_setup.sql    # Resident sample data
│   └── ...
├── src/
│   ├── app/             # Next.js 14 App Router pages
│   │   ├── admin/       # Admin section pages
│   │   │   ├── residents/    # Residents management
│   │   │   ├── documents/    # Document management
│   │   │   ├── users/        # User management
│   │   │   └── ...
│   │   ├── auth/        # Authentication pages
│   │   └── ...
│   ├── components/      # React components
│   │   ├── admin/       # Admin-specific components
│   │   ├── auth/        # Authentication components
│   │   ├── documents/   # Document management components
│   │   ├── layout/      # Layout components
│   │   ├── residents/   # Resident management components
│   │   └── ui/          # Reusable UI components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and libraries
│   ├── middleware/      # Next.js middleware
│   ├── services/        # Service layer for API calls
│   ├── store/           # Zustand store configurations
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── .env.example         # Example environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Documentation

- [Project Roadmap](docs/project-management/ROADMAP.md)
- [Project Status](docs/project-management/STATUS.md)
- [Changelog](CHANGELOG.md)
- [API Documentation](docs/api/api.md)
- [Component Documentation](docs/components/components.md)
- [Database Schema](docs/database/database.md)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

© 2025 Lofts des Arts. All rights reserved.
