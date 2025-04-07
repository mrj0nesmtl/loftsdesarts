# Lofts des Arts Documentation Index

This directory contains all documentation related to the Lofts des Arts website project. The documentation is organized in a way that helps team members, stakeholders, and future contributors understand the project's architecture, functionality, and development process.

*Last Updated: April 7, 2025 | Version: 0.5.0*

## Documentation Structure

### Project Management
- `/project-management/` - Project planning documents, timelines, and meeting notes
  - `/project-management/ROADMAP.md` - Development timeline and milestones
  - `/project-management/STATUS.md` - Current project status and progress tracking
  - `/project-management/SOW.md` - Statement of Work 
  - `/project-management/RFP.md` - Request for Product
  - `/project-management/project_resources.md` - Project resources and references
  - `/project-management/session-6/` - Current session planning and resources
    - `/project-management/session-6/session-6b-checklist.md` - Session 6B checklist
    - `/project-management/session-6/session-6b-kickoff-narrative.md` - Session 6B kickoff
    - `/project-management/session-6/session-6b-resources.md` - Session 6B resources
    - `/project-management/session-6/session-6c-checklist.md` - Session 6C checklist
    - `/project-management/session-6/session-6c-kickoff-narrative.md` - Session 6C kickoff
    - `/project-management/session-6/session-6c-resources.md` - Session 6C resources
  - `/project-management/session_archive/` - Archive of previous session documents

### Technical Documentation
- `/architecture/` - System architecture diagrams and descriptions
  - `/architecture/architecture.md` - System architecture documentation
- `/api/` - API documentation and endpoints
  - `/api/api.md` - API specification and documentation
- `/database/` - Database schema, relations, and RLS policies
  - `/database/database.md` - Main database documentation
  - `/database/messaging-system.md` - Messaging system database documentation
  - `/database/package-system.md` - Package management system database documentation
  - `/database/rbac-system.md` - Role-based access control documentation
- `/components/` - Component documentation and usage examples
  - `/components/components.md` - Component library documentation
- `/design/` - Design assets, wireframes, mockups, and style guides
  - `/design/design.md` - Design system documentation
- `/project-structure/` - Generated project structure documentation
  - `/project-structure/index.md` - Index of all structure files
  - `/project-structure/src-structure.md` - Source code structure
  - `/project-structure/api-structure.md` - API directory structure
  - `/project-structure/architecture-structure.md` - Architecture directory structure
  - `/project-structure/components-structure.md` - Components directory structure
  - `/project-structure/database-structure.md` - Database directory structure
  - `/project-structure/design-structure.md` - Design directory structure
  - `/project-structure/development-structure.md` - Development directory structure
  - `/project-structure/docs-structure.md` - Documentation directory structure
  - `/project-structure/project-management-structure.md` - Project management directory structure
  - `/project-structure/sql-structure.md` - SQL scripts structure
  - `/project-structure/user-guides-structure.md` - User guides directory structure
  - `/project-structure/overall-structure.md` - Overall project structure

### User Documentation
- `/user-guides/` - End-user documentation
  - `/user-guides/admin/` - Administrative user guides
  - `/user-guides/resident/` - Resident portal user guides
  - `/user-guides/public/` - Public website features
  - `/user-guides/common/` - Common user guides
  - `/user-guides/features/` - Feature-specific documentation
    - `/user-guides/features/document-management/` - Document management system
    - `/user-guides/features/messaging-system/` - Messaging system
    - `/user-guides/features/package-management/` - Package management system
    - `/user-guides/features/rbac/` - Role-based access control
  - `/user-guides/roles/` - Role-specific documentation
    - `/user-guides/roles/admin/` - Admin role documentation
    - `/user-guides/roles/board-member/` - Board member role documentation
    - `/user-guides/roles/contractor/` - Contractor role documentation
    - `/user-guides/roles/doorman/` - Doorman role documentation
    - `/user-guides/roles/guest/` - Guest role documentation
    - `/user-guides/roles/manager/` - Manager role documentation
    - `/user-guides/roles/resident-owner/` - Resident owner role documentation
    - `/user-guides/roles/resident-tenant/` - Resident tenant role documentation
    - `/user-guides/roles/staff/` - Staff role documentation
    - `/user-guides/roles/super-admin/` - Super admin role documentation

### Development
- `/development/` - Development guidelines and processes
  - `/development/setup/` - Setup instructions
    - `/development/setup/mobile-testing.md` - Mobile testing setup guide
  - `/development/workflows/` - Development workflows and best practices
  - `/development/testing/` - Testing strategies and procedures
  - `/development/github_initialization.md` - GitHub setup documentation

### Legal and Compliance
- `/legal/` - Privacy policies, terms of service, and compliance documentation

### Specifications
- `/specifications/` - Detailed functional and technical specifications

## Key Documents

- [Project Roadmap](project-management/ROADMAP.md) - High-level development timeline and milestones
- [Statement of Work](project-management/SOW.md) - Detailed project scope and deliverables
- [Request for Product](project-management/RFP.md) - Original project requirements
- [Status](project-management/STATUS.md) - Current project status and progress tracking
- [Architecture Documentation](architecture/architecture.md) - System architecture and design
- [API Documentation](api/api.md) - API endpoints and usage
- [Component Documentation](components/components.md) - React component library
- [Database Documentation](database/database.md) - Database schema and structure
- [Messaging System](database/messaging-system.md) - Messaging system documentation
- [Package System](database/package-system.md) - Package management system documentation
- [RBAC System](database/rbac-system.md) - Role-based access control documentation

## Recent Updates

### April 7, 2025
- **Version 0.5.0 Release**: Released v0.5.0 with completed messaging system conversation capabilities
- **UI/UX Improvements**: Enhanced homepage layout and visual design consistency
- **Project Structure**: Added comprehensive project structure documentation with improved script
- **Login Flow**: Fixed login page navigation and improved user experience
- **Documentation**: Updated all documentation to reflect current project state

### April 6, 2025
- **Theme System**: Completed comprehensive theme system with admin-only controls
- **Project Structure**: Added automated project structure documentation generation
- **Session 6**: Added documentation for Session 6 (Resident Portal implementation)
- **Architecture Documentation**: Enhanced theme architecture documentation

### April 5, 2025
- **Database Documentation**: Added comprehensive documentation for messaging and package management systems
- **User Flows**: Added flowcharts for residents, doormen, and administrators
- **RBAC Documentation**: Created detailed role-based access control documentation
- **Technical Specifications**: Updated messaging and package system architecture documentation

## Versioning

The project follows Semantic Versioning (SemVer):
- **MAJOR** version for incompatible API changes
- **MINOR** version for functionality added in a backward-compatible manner
- **PATCH** version for backward-compatible bug fixes

## Current Version: 0.5.0

### Major Features
- Complete document management system
- Enhanced role-based access control (RBAC)
- Comprehensive theme system with admin controls
- Functional messaging system with conversation capabilities
- Improved homepage layout and visual consistency
- Database schema for messaging and package systems
- User flow documentation with Mermaid diagrams
- Automated project structure documentation

## Contributing to Documentation

When contributing to the documentation:

1. Ensure all technical documentation is up-to-date with the current codebase
2. Use Markdown for all documentation files
3. Include code examples where appropriate
4. Add diagrams or images to explain complex concepts
   - Use Mermaid for flowcharts and diagrams when possible
   - Use screenshots for UI elements and interactions
5. Follow the established folder structure
6. Update the changelog when making significant changes
7. Update the "Last Updated" date at the top of each document
8. Run `node scripts/generate-project-trees.js` to update project structure documentation

## Documentation Standards

- Use clear, concise language
- Organize content with headings and lists
- Include example use cases
- Define technical terms
- Ensure documentation is accessible to the intended audience
- Include flowcharts for complex processes
- Update documentation immediately after implementing features

## Contact

For questions about the documentation or to suggest improvements, contact the project manager: joel.yaffe@loftsdesarts.com 