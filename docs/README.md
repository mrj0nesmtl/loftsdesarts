# Lofts des Arts Documentation Documentation Index

This directory contains all documentation related to the Lofts des Arts website project. The documentation is organized in a way that helps team members, stakeholders, and future contributors understand the project's architecture, functionality, and development process.

*Last Updated: April 6, 2025 | Version: 0.4.0*

## Documentation Structure

### Project Management
- `/project-management/` - Project planning documents, timelines, and meeting notes
  - `/project-management/ROADMAP.md` - Development timeline and milestones
  - `/project-management/STATUS.md` - Current project status and progress tracking
  - `/project-management/SOW.md` - Statement of Work 
  - `/project-management/RFP.md` - Request for Product
  - `/project-management/project_resources.md` - Project resources and references
  - `/project-management/session-6/` - Current session planning and resources
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
  - `/project-structure/app-structure.md` - App directory structure
  - `/project-structure/components-structure.md` - Components directory structure
  - `/project-structure/lib-structure.md` - Library directory structure
  - `/project-structure/styles-structure.md` - Styles directory structure
  - `/project-structure/docs-structure.md` - Documentation directory structure
  - `/project-structure/overall-structure.md` - Overall project structure

### User Documentation
- `/user-guides/` - End-user documentation
  - `/user-guides/admin/` - Administrative user guides
  - `/user-guides/resident/` - Resident portal user guides
  - `/user-guides/public/` - Public website features
  - `/user-guides/common/` - Common user guides
  - `/user-guides/features/` - Feature-specific documentation
  - `/user-guides/roles/` - Role-specific documentation

### Development
- `/development/` - Development guidelines and processes
  - `/development/setup/` - Setup instructions
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

## Recent Updates

### April 12, 2025
- **Theme System**: Completed comprehensive theme system with admin-only controls
- **Project Structure**: Added automated project structure documentation generation
- **Session 6**: Added documentation for Session 6 (Resident Portal implementation)
- **Architecture Documentation**: Enhanced theme architecture documentation

### April 6, 2025
- **API Documentation**: Updated API documentation with theme and settings endpoints
- **Component Documentation**: Enhanced theme-related component documentation
- **Design Documentation**: Updated design system documentation with theme guidelines

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

## Current Version: 0.4.0

### Major Features
- Complete document management system
- Enhanced role-based access control (RBAC)
- Comprehensive theme system with admin controls
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
8. Run `npm run generate-trees` to update project structure documentation

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