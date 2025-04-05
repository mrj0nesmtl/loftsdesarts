# Changelog

All notable changes to the Lofts des Arts Condominium website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- User interface components for messaging system
- Package management interface with QR code generation
- Mobile camera integration for QR code scanning

## [0.2.0] - 2025-04-05

### Added
- Comprehensive role-based access control system with six user roles:
  - SUPER_ADMIN: IT administration and multi-building management
  - ADMIN: Board of directors with full building management
  - MANAGER: Condo management company with operational access
  - DOORMAN: Package and visitor management capabilities
  - SECURITY: Building security personnel access
  - RESIDENT: Unit owner and tenant access
- Role capabilities documentation with detailed permission matrix
- Database schema for messaging system:
  - Conversations and conversation participants tables
  - Messages and message attachments tables
  - Message read receipts tracking
  - Real-time notification system
- Database schema for package management:
  - Package logging and tracking tables
  - Package history for status changes
  - QR code generation infrastructure
  - Notification preferences for residents
- Comprehensive user flow documentation with Mermaid diagrams
- Building units and residents management system
- CSV import functionality for resident data
- Document management system with folder organization
- File upload functionality with progress indicators
- Document preview for images and PDFs
- File sharing capability with expiring links
- Folder operations (create, delete, duplicate)
- File operations (download, delete, duplicate, share)
- Document metadata display with size and creation date
- Mobile-responsive document interface

### Changed
- Enhanced role-based access control with granular permissions
- Improved database security with updated RLS policies
- Updated admin navigation to include document management
- Enhanced UI components with better accessibility
- Improved folder navigation with visual hierarchy indicators
- Added breadcrumb navigation for document browsing
- Updated project documentation with latest architecture decisions

### Fixed
- Theme persistence issues across page navigation
- UI component styling inconsistencies
- Folder selection and navigation issues
- RLS policy conflicts in user role management

## [0.1.5] - 2025-04-04

### Added
- Light/Dark theme toggle functionality across the site
- Theme context provider with localStorage persistence
- Network-accessible development server for mobile testing
- Mobile testing guide with troubleshooting tips
- Reusable ThemeToggle component

### Changed
- Updated admin header layout to match public site for consistency
- Improved logo sizing and placement for better visual hierarchy
- Refactored global CSS variables for better theme support

### Fixed
- Logo 404 error in the admin interface
- Hydration errors in client components
- Theme toggle button functionality in admin layout
- Header element alignment and consistency

## [0.1.0] - 2025-04-04

### Added
- Initial project setup with Next.js 14, TypeScript, and Tailwind CSS
- Database configuration with Supabase (profiles and contact_inquiries tables)
- Admin dashboard with personalized welcome messages for board members
- Analytics page with system status monitoring
- Inquiries management system
- User authentication with Supabase Auth
- Multi-language support (English/French)
- Contact form with email notification system
- Row Level Security policies for database tables
- Responsive layout for all pages

### Changed
- Repurposed site from original STTS film industry portfolio to Lofts des Arts condominium website
- Updated design with condominium-specific branding

### Removed
- All previous film industry content and assets

### Fixed
- Form accessibility issues with proper autocomplete attributes
- Admin layout rendering and component hierarchy
- Import path resolution for admin components 