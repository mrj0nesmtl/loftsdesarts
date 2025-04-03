# Lofts des Arts Website - Project Resources

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
│   │   ├── parcels/       # Parcel management
│   │   └── settings/      # Site settings and content management
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── inquiries/     # Inquiry endpoints
│   │   ├── parcels/       # Parcel management endpoints
│   │   └── uploads/       # File upload endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── ui/                # UI components (Shadcn)
│   └── gallery/           # Gallery components
├── lib/                   # Utility functions and shared code
│   ├── actions/           # Server actions
│   ├── db/                # Database utilities
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── validators/        # Zod schemas
├── public/                # Static assets
│   ├── fonts/             # Custom fonts
│   ├── images/            # Image assets
│   └── videos/            # Video assets
├── styles/                # Global styles
├── docs/                  # Project documentation
└── .env                   # Environment variables
```

## Key Resources

### Design & Assets
- Building photos and videos (to be collected)
- Logo and branding assets
- Placeholder images during development
- Typography and color scheme definitions

### External Services
- Supabase Project: [Setup pending]
- GitHub Repository: https://github.com/mrj0nesmtl/loftsdesarts
- Replit Deployment: [Setup pending]

### Database Collections
- Users (board members, staff)
- Inquiries (contact form submissions)
- Parcels (delivery tracking)
- Content (website content blocks)
- Gallery (building images and descriptions)

### API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/inquiries/*` - Contact form management
- `/api/parcels/*` - Parcel tracking system 
- `/api/uploads/*` - File upload handling
- `/api/content/*` - Content management

### Components to Adapt
- Hero section (replace film content with condominium content)
- Navigation menu (update routes and labels)
- Contact form (modify for condominium inquiries)
- Footer (update links and information)
- Gallery grid (replace portfolio with building photos)

### New Components to Create
- Parcel management interface
- Building information sections
- Amenities showcase
- Board member profiles
- Resident announcements module

## External Dependencies
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Zustand (state management)
- react-hook-form + zod
- TanStack Query v5
- Framer Motion (animations)
- Supabase JS Client
- Recharts (for admin analytics)

## Reference Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 