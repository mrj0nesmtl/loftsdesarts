# Changelog

All notable changes to the Lofts des Arts project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Messaging system components for conversation management
- Advanced analytics dashboard components
- Package tracking workflow interface improvements

## [0.3.0] - 2025-04-10

### Added
- Comprehensive residents management system
  - Resident profiles with detailed contact information
  - Unit assignment and tracking capabilities
  - Owner vs. tenant designation
  - Primary resident identification
  - Move-in and move-out date tracking
  - Preferred language and notification method preferences
  - Additional notes and custom fields
  - Search and filtering functionality
  
- Complete building units management system
  - Database schema for 96 units across 9 floors and penthouse level
  - Commercial units for Goethe Institute and Pikolo Cafe
  - Unit occupancy status tracking
  - Unit-resident relationship management
  - Visual representation of building layout
  - Search and filtering capabilities
  
- Building data structure for multi-building support
  - Building information model with address details
  - Relationship mapping between buildings and units
  - Preparation for multi-building portfolio management
  
- Data import/export capabilities
  - SQL scripts for database setup and verification
  - Building and unit data population scripts
  - Sample resident data generation
  
- Tab-based management interface for residents section
  - Separate tabs for residents and units management
  - Intuitive navigation between related data sets
  
- Package management components
  - Barcode scanner component for package registration
  - QR code generator for package tracking
  - Package registration form with resident lookup
  
- UI/UX enhancements
  - Improved sidebar navigation with residents section
  - Console logging for debugging database connections
  - Error handling and fallback UI for data loading failures

### Changed
- Refactored database queries to use hardcoded building ID for improved reliability
- Enhanced error handling in data fetching operations with detailed console logging
- Improved TypeScript types for resident and unit data models
- Updated sidebar navigation to include residents management section

### Fixed
- Database connection issues in the residents management page
- Building ID lookup failures in the UnitManagement component
- Type errors in the PackageRegistrationForm component
- Fixed export/import issues with the QRCodeGenerator component
- Resolved TypeScript errors related to unit_number property validation

## [0.2.0] - 2025-04-05

### Added
- Document management system with folder organization
- User management interface with role assignment
- Enhanced role-based access control (RBAC) system
- Six distinct user roles with granular permissions
- Database schema for messaging system
- Database schema for package management system
- Admin sidebar navigation with contextual sections
- French language support for core interface elements

### Changed
- Improved dashboard layout with responsive design
- Enhanced authentication flow with role-based redirects
- Refactored form components to use Zod validation
- Updated UI components to follow design system
- Optimized database queries for performance

### Fixed
- Session persistence issues after page refresh
- Mobile layout problems in the dashboard
- Form validation errors in the document upload
- Dark mode toggle inconsistencies
- Role permission checks for document access

## [0.1.0] - 2025-04-01

### Added
- Initial project setup with Next.js 14 App Router
- TypeScript configuration with strict mode
- Tailwind CSS integration with custom theme
- Shadcn/ui component library setup
- Supabase authentication implementation
- Admin dashboard with welcome screen
- Contact form with database storage
- Basic role-based access control
- Light/dark theme toggle
- Responsive layout system
- Initial admin navigation sidebar
- Form validation with React Hook Form and Zod
- Documentation structure (README, CHANGELOG, etc.)
- Development and production environment configuration
- Basic error handling and 404 page 