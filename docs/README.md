# Lofts des Arts Documentation Documentation Index

This directory contains all documentation related to the Lofts des Arts website project. The documentation is organized in a way that helps team members, stakeholders, and future contributors understand the project's architecture, functionality, and development process.

*Last Updated: April 5, 2025 | Version: 0.2.0*

## Documentation Structure

### Project Management
- `/project-management/` - Project planning documents, timelines, and meeting notes
  - `/project-management/sessions/` - Session planning and outcomes
  - `/project-management/ROADMAP.md` - Development timeline and milestones
  - `/project-management/STATUS.md` - Current project status and progress tracking
- `/specifications/` - Detailed functional and technical specifications
- `/design/` - Design assets, wireframes, mockups, and style guides

### Technical Documentation
- `/architecture/` - System architecture diagrams and descriptions
  - `/architecture/data-flow.md` - Data flow diagrams and documentation
  - `/architecture/security-model.md` - Security model and RBAC documentation
- `/api/` - API documentation and endpoints
- `/database/` - Database schema, relations, and RLS policies
  - `/database/messaging-system.md` - Messaging system database documentation
  - `/database/package-system.md` - Package management system database documentation
  - `/database/rbac-system.md` - Role-based access control documentation
- `/components/` - Component documentation and usage examples

### User Documentation
- `/user-guides/` - End-user documentation
  - `/user-guides/admin/` - Administrative user guides
  - `/user-guides/resident/` - Resident portal user guides
  - `/user-guides/doorman/` - Doorman/concierge user guides
  - `/user-guides/public/` - Public website features

### Development
- `/development/` - Development guidelines and processes
  - `/development/setup/` - Setup instructions
  - `/development/workflows/` - Development workflows and best practices
  - `/development/testing/` - Testing strategies and procedures
  - `/development/session-logs/` - Development session logs

### Legal and Compliance
- `/legal/` - Privacy policies, terms of service, and compliance documentation

## Key Documents

- [Project Roadmap](project-management/ROADMAP.md) - High-level development timeline and milestones
- [Statement of Work](../SOW.md) - Detailed project scope and deliverables
- [Request for Product](../RFP.md) - Original project requirements
- [Changelog](../CHANGELOG.md) - Record of all notable changes to the project
- [Status](project-management/STATUS.md) - Current project status and progress tracking

## Recent Updates

### April 5, 2025
- **Database Documentation**: Added comprehensive documentation for messaging and package management systems
- **User Flows**: Added flowcharts for residents, doormen, and administrators
- **RBAC Documentation**: Created detailed role-based access control documentation
- **Technical Specifications**: Updated messaging and package system architecture documentation

### April 4, 2025
- **Document Management**: Added documentation for the document management system
- **Theme System**: Updated documentation for the theme toggle functionality

## Versioning

The project follows Semantic Versioning (SemVer):
- **MAJOR** version for incompatible API changes
- **MINOR** version for functionality added in a backward-compatible manner
- **PATCH** version for backward-compatible bug fixes

## Current Version: 0.2.0

### Major Features
- Complete document management system
- Enhanced role-based access control (RBAC)
- Database schema for messaging and package systems
- User flow documentation with Mermaid diagrams

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