# Changelog

All notable changes to the Lofts des Arts Condominium website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.5] - 2025-04-06

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