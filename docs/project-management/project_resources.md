# Lofts des Arts Website - Project Resources

*Last Updated: April 6, 2025 | Version: 0.4.0*

## Project Structure
```
loftsdesarts/
├── app/                   # Next.js 14 App Router structure
│   ├── (auth)/            # Authentication related routes
│   │   ├── login/         # Login page
│   │   └── logout/        # Logout page
│   ├── (public)/          # Public-facing routes
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   ├── gallery/       # Gallery page
│   │   └── page.tsx       # Home/Landing page
│   ├── admin/             # Admin dashboard routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── inquiries/     # Inquiry management
│   │   ├── packages/      # Package management
│   │   ├── roles/         # Role management
│   │   ├── analytics/     # Analytics dashboard
│   │   └── settings/      # Site settings and content management
│   ├── resident/          # Resident portal routes
│   │   ├── dashboard/     # Resident dashboard
│   │   ├── packages/      # Resident package tracking
│   │   ├── messages/      # Messaging system
│   │   └── documents/     # Document access
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── inquiries/     # Inquiry endpoints
│   │   ├── packages/      # Package management endpoints
│   │   ├── messages/      # Messaging API endpoints
│   │   ├── roles/         # RBAC API endpoints
│   │   ├── settings/      # Settings API endpoints
│   │   │   ├── theme/     # Theme preferences endpoints
│   │   │   └── ui/        # UI preferences endpoints 
│   │   └── uploads/       # File upload endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── ui/                # UI components (Shadcn)
│   │   ├── ThemeToggle.tsx # Theme toggle component (admin-only)
│   ├── gallery/           # Gallery components
│   ├── messaging/         # Messaging components
│   ├── packages/          # Package management components
│   ├── theme/             # Theme-related components
│   └── rbac/              # Role-based access components
├── lib/                   # Utility functions and shared code
│   ├── actions/           # Server actions
│   ├── db/                # Database utilities
│   ├── hooks/             # Custom React hooks
│   │   ├── usePermission.ts  # Permission checking hook
│   │   ├── useRole.ts     # Role checking hook
│   │   ├── useRealtime.ts # WebSocket hook
│   │   ├── useTheme.ts    # Theme management hook
│   │   └── usePackage.ts  # Package management hook
│   ├── theme-provider.tsx # Theme context provider
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── validators/        # Zod schemas
│   └── middleware/        # Next.js middleware for auth/permissions
├── public/                # Static assets
│   ├── fonts/             # Custom fonts
│   ├── images/            # Image assets
│   └── videos/            # Video assets
├── styles/                # Global styles
│   ├── globals.css        # Global CSS including theme variables
├── docs/                  # Project documentation
│   ├── api/               # API documentation
│   ├── architecture/      # Architecture documentation
│   ├── components/        # Component documentation
│   ├── database/          # Database documentation
│   │   ├── messaging-system.md # Messaging system documentation
│   │   ├── package-system.md # Package system documentation
│   │   └── rbac-system.md # RBAC system documentation
│   ├── design/            # Design documentation
│   │   ├── design.md      # Design system documentation
│   │   └── theme/         # Theme system design documentation
│   └── project-management/ # Project management documentation
└── .env                   # Environment variables
```

## Key Resources

### Design & Assets
- Building photos and videos (to be collected)
- Logo and branding assets
- Placeholder images during development
- Typography and color scheme definitions
- Status icons for package tracking
- Role and permission icons
- Message status indicators
- QR code templates
- Theme-specific icons and assets

### External Services
- Supabase Project: [Setup pending]
- GitHub Repository: https://github.com/mrj0nesmtl/loftsdesarts
- Replit Deployment: [Setup pending]
- SendGrid Email Service: [Setup pending]
- QR Code Generation API: [Setup pending]

### Database Collections
- Users (board members, staff, residents)
- Roles and permissions (RBAC system)
- Inquiries (contact form submissions)
- Packages (delivery tracking)
- Package history (status changes)
- Package notifications (resident alerts)
- Conversations (messaging containers)
- Messages (individual communications)
- Message attachments (files in messages)
- Message reads (read receipts)
- Content (website content blocks)
- Gallery (building images and descriptions)
- User preferences (theme/UI settings)
- Site settings (system-wide configuration)

### API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/inquiries/*` - Contact form management
- `/api/packages/*` - Package tracking system 
- `/api/packages/qr/*` - QR code generation
- `/api/packages/verify/*` - Package verification
- `/api/messages/*` - Messaging system endpoints
- `/api/conversations/*` - Conversation management
- `/api/roles/*` - Role management
- `/api/permissions/*` - Permission management
- `/api/uploads/*` - File upload handling
- `/api/content/*` - Content management
- `/api/residents/*` - Resident information
- `/api/settings/theme/*` - Theme system preferences
  - `GET /api/settings/theme` - Get current user's theme preference
  - `PATCH /api/settings/theme` - Update theme preference
  - `GET /api/settings/theme/default` - Get system default theme
  - `PATCH /api/settings/theme/default` - Update system default (admin only)
- `/api/settings/ui/*` - User interface preferences

### Components to Adapt
- Hero section (replace film content with condominium content)
- Navigation menu (update routes and labels)
- Contact form (modify for condominium inquiries)
- Footer (update links and information)
- Gallery grid (replace portfolio with building photos)
- Permission guards for all admin components

### Theme System
- **Theme Provider**: Context provider for theme state management
- **Theme Toggle Component**: Admin-only toggle with role-based access
- **Theme Classes**: Standardized theme-aware class naming:
  - `bg-background` - Page background
  - `bg-card` - Card and container backgrounds
  - `bg-muted` - Secondary or muted backgrounds
  - `text-primary` - Primary text content
  - `text-muted-foreground` - Secondary or less important text
  - `border-border` - Border elements
  - `theme-transition` - Smooth theme transition elements
- **CSS Variables**:
  - Light mode variables defined at root level
  - Dark mode variables applied via .dark class selector
- **User Preferences**: 
  - Theme preferences stored in database
  - Preferences synced across devices via API
  - Default preference detection from system

### New Components Created
- Package management interface
  - Package listing with filtering
  - Package detail view with theme-aware styling
  - Package logging form
  - QR code generator with theme-aware display
  - QR code scanner
  - Theme-aware package status editor
  - Notification history with theme-aware alerts
  
- Messaging system
  - Theme-aware conversation list
  - Message thread with theme-aware bubbles
  - Message composer with theme transitions
  - Attachment uploader
  - Read receipt indicator with theme-aware status
  - Typing indicator
  - Notification badges

- RBAC system
  - Role management interface with theme support
  - Permission assignment interface
  - Role badges with theme-aware styling
  - Permission indicators
  - Role-based navigation
  - Permission guards

- Theme system components
  - ThemeProvider context component
  - ThemeToggle admin-only button
  - Theme transition wrapper
  - useTheme hook with role checking
  - ThemeAwareCard component
  - AdminThemeSettings component

## External Dependencies
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Zustand (state management)
- React Hook Form + Zod
- TanStack Query v5
- Framer Motion (animations)
- Supabase JS Client
- Supabase Realtime (WebSockets)
- Recharts (for admin analytics)
- QRCode.react (QR code generation)
- React QR Reader (QR code scanning)
- react-dropzone (file uploads)
- date-fns (date formatting)

## WebSocket Channels

### Messaging Channels
- `conversation:{id}` - Real-time updates for a specific conversation
- `user:{id}:messages` - All new messages for a user
- `user:{id}:notifications` - System notifications for a user

### Package Channels
- `package:{id}` - Status updates for a specific package
- `resident:{id}:packages` - Updates for a resident's packages
- `building:packages` - All package updates for building staff

### Theme Channels
- `user:{id}:preferences` - User preference updates
- `system:theme` - System-wide theme default changes
- `realtime/theme` - Theme preference updates for synchronization

## Permission Structure

### User Roles
- `SUPER_ADMIN` - System administrator
- `ADMIN` - Condominium administrator
- `MANAGER` - Building manager
- `BOARD_MEMBER` - Board member
- `STAFF` - Building staff
- `DOORMAN` - Lobby staff for packages
- `CONTRACTOR` - External service provider
- `RESIDENT_OWNER` - Condominium owner
- `RESIDENT_TENANT` - Tenant resident
- `GUEST` - Limited access visitor

### Permission Categories
- `users:*` - User management
- `profiles:*` - Profile management
- `documents:*` - Document management
- `packages:*` - Package management
- `messages:*` - Messaging system
- `settings:*` - System settings
  - `settings:theme:*` - Theme system settings
  - `settings:theme:default` - Change default theme (admin only)
  - `settings:ui:*` - UI preferences
- `announcements:*` - Building announcements

## Reference Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [QR Code React Library](https://github.com/zpao/qrcode.react)
- [React QR Reader](https://github.com/JodusNodus/react-qr-reader)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Development Resources

### Database Scripts
- `/sql/init/` - Initial database setup scripts
- `/sql/migrations/` - Database migration scripts
- `/sql/functions/` - PostgreSQL functions
- `/sql/permissions/` - RLS policy definitions
- `/sql/triggers/` - Database triggers
- `/sql/theme/` - Theme system tables and functions

### Testing Resources
- `/cypress/` - End-to-end tests
- `/tests/` - Unit and integration tests
- Test users with various roles
- Test package data generator
- Test message generator
- Theme testing utilities

### Project Boards
- Feature development board
- Bug tracking board
- Documentation tasks
- User story mapping
- Sprint planning 