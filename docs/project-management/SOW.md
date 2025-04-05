# Statement of Work
## Lofts des Arts Website Development Project

**Effective Date:** April 1, 2025  
**Project End Date:** May 1, 2025  
**Last Updated:** April 5, 2025 | Version: 0.2.0

## 1. Project Overview

This Statement of Work (SOW) outlines the development of a comprehensive website and management system for Lofts des Arts Condominiums. The project will transform an existing site framework into a modern, responsive platform serving both public visitors and condominium residents with administrative capabilities for the board of directors.

## 2. Objectives

- Create an informative public-facing website showcasing the Lofts des Arts property
- Implement a secure administrative portal for condominium management
- Develop a resident portal for building information and service requests
- Establish multilingual support (English/French) throughout the platform
- Enable efficient communication between residents and management
- Provide data-driven insights for property management decisions
- Enhance community engagement through digital tools
- Ensure accessibility compliance across all platform areas

## 3. Scope of Work

### 3.1 Phase 1: Foundation (April 1-7, 2025)
- Project setup using Next.js 14, TypeScript, and Tailwind CSS
- Supabase integration for authentication and database
- Basic public pages (Home, About, Gallery, Contact)
- Admin authentication and dashboard implementation
- Contact form with inquiry management
- Multilingual framework implementation
- Responsive design system establishment
- SEO optimization for public-facing pages

**Success Criteria:**
- Functioning public website with complete core pages
- Secure admin login with role-based permissions
- Contact form submissions successfully stored in database
- Language toggle working between English and French
- Responsive layout functioning on mobile, tablet, and desktop
- Google Lighthouse score of 90+ on all public pages

### 3.2 Phase 2: Extended Admin Capabilities (April 8-14, 2025)
- Document management system for administrative documents
  - Folder organization with hierarchical structure
  - File upload with progress indicators
  - Document preview and sharing capabilities 
  - Permission-based access controls
- Enhanced analytics dashboard
- Announcement publishing system
- Notification center development
- Administrative logging and user management
- Email template system for communications
- Board meeting scheduling tools
- Administrative reporting capabilities
- Role-Based Access Control (RBAC) system
  - Role definition and management interface
  - Permission mapping and enforcement
  - Access control auditing and reporting
  - Visual role hierarchy representation
  - Dynamic UI adaptation based on permissions

**Success Criteria:**
- Document upload, categorization, and retrieval working
- Analytics dashboard displaying key metrics with visualizations
- Announcement creation, editing, and publishing functionality
- Email notifications delivering correctly to appropriate recipients
- Complete audit trail of administrative actions
- User management with role assignment capabilities
- Scheduled reports generated and delivered
- RBAC system correctly enforcing permissions across all interfaces
- Role management interface allowing for permission adjustments
- Access control logs providing detailed audit capabilities

### 3.3 Phase 3: Resident Portal (April 15-21, 2025)
- Resident authentication system
- Profile management functionality
- Building information repository
- Maintenance request system
- Internal messaging system
  - Real-time messaging using Supabase Realtime
  - Direct messaging between residents and management
  - Group conversations for committees and interest groups
  - File attachments with secure storage
  - Message read receipts and delivery status
  - Push notifications for new messages
  - Message threading with reply context
  - Rich text formatting support
  - Message scheduling and draft saving
  - Emoji reactions and interactive elements
  - Searchable message history with filters
  - Message archiving and retention policies
- Package management system
  - Staff interface for logging incoming packages
  - QR code generation for package tracking
  - Resident notification via email and in-app alerts
  - Package pickup confirmation with electronic signature
  - Package history and reporting dashboard
  - Package status tracking (delivered, notified, picked up)
  - Automated reminder notifications for unclaimed packages
  - Digital photo capture of delivered packages
  - Package size classification and storage location tracking
  - Package delivery scheduling for outgoing shipments
  - Integration with major carrier APIs (USPS, FedEx, UPS)
- Service provider directory
- Building rules and regulations access
- Resident-specific notification preferences

**Success Criteria:**
- Secure resident login with unit verification
- Complete profile creation and editing capabilities
- Searchable building information with document access
- End-to-end maintenance request lifecycle working
- Real-time messaging with proper delivery confirmation
- Message read receipts accurately tracking message status
- Group conversations properly managing participant permissions
- File attachments securely stored and properly displayed
- Package notification system with QR tracking
- Package status accurately reflected throughout lifecycle
- QR codes successfully scanning and validating package pickup
- Directory with search and filtering functionality
- All resident-specific areas protected by proper authorization

### 3.4 Phase 4: Community Features (April 22-28, 2025)
- Events calendar and booking systems
- Amenity reservation functionality
- Community bulletin board
- Community forum implementation
- Polls and voting system
- Photo galleries and media management
- Community announcements
- Group messaging capabilities

**Success Criteria:**
- Event creation, registration, and calendar integration working
- Amenity booking system with conflict prevention
- Community bulletin board with moderation tools
- Discussion forums with topic management and moderation
- Secure voting system with results visualization
- Photo galleries with organization and privacy controls
- Messaging system with thread management

### 3.5 Phase 5: Advanced Features (April 29-May 5, 2025)
- Mobile application development
- Building systems integration
- Security system connections
- Payment processing implementation
- Third-party service integrations
- Push notification system
- Offline capabilities for critical functions
- Advanced search implementation

**Success Criteria:**
- Native mobile apps functioning on iOS and Android
- Building system data successfully displayed in dashboard
- Security integrations operating with proper authorization
- Payment processing with secure transactions and receipts
- Third-party data properly integrated and displayed
- Push notifications delivering through all channels
- Search functionality returning relevant results

### 3.6 Phase 6: Refinement and Optimization (May 6-12, 2025)
- Performance optimization
- User experience refinements
- Accessibility enhancements
- Search improvements
- Analytics and reporting expansion
- Security hardening
- Documentation finalization
- Knowledge transfer and training

**Success Criteria:**
- Performance metrics meeting specified targets
- User feedback incorporated into interface improvements
- WCAG 2.1 AA compliance verified and documented
- Search returning relevant results with filtering
- Complete reporting system with customization options
- Security testing completed with vulnerabilities addressed
- Documentation completed for all system aspects
- Training materials created and sessions conducted

## 4. Deliverables

### 4.1 Software Components
- Fully functional public website with multilingual support
- Administrative management portal with complete feature set
  - Role-based access control system with permission management
  - Administrative document management with version control
  - User management interface with role assignment
- Resident services portal with community features
  - Real-time messaging system with comprehensive feature set
    - One-to-one and group messaging capabilities
    - Message status tracking and delivery confirmation
    - File attachment support with preview capabilities
    - Searchable message archive with advanced filters
  - Package tracking and notification system
    - QR-based package identification and tracking
    - Status monitoring through delivery lifecycle
    - Automated notification system with delivery alerts
    - Package history and reporting capabilities
  - Maintenance request system
  - Document access portal
- Native mobile applications for iOS and Android
- API endpoints for third-party integrations
- Progressive Web App functionality

### 4.2 Documentation
- Technical system architecture documentation
- Database schema and relationship diagrams
  - Messaging system data model
    - Conversations and participant relationships
    - Message storage and attachment handling
    - Read status tracking and notification schema
  - Package tracking system data model
    - Package metadata and delivery information
    - Notification and status tracking schema
    - QR code generation and validation system
  - RBAC system data model
    - Role definitions and hierarchies
    - Permission mappings and inheritance
    - User-role assignments and audit trails
- API documentation with endpoint specifications
- Security implementation details
- Deployment and infrastructure configuration
- Development standards and conventions

### 4.3 User Resources
- Administrative user manual
- Resident user guide
- Video tutorials for key features
- FAQ documentation
- Troubleshooting guides
- Feature update announcements

### 4.4 Source Materials
- Complete source code with documentation
- Build scripts and configuration files
- Asset files (images, icons, media)
- Database migration scripts
- Seed data for development and testing
- Test suite with automation scripts

## 5. Technical Requirements

### 5.1 Frontend Technologies
- **Framework**: Next.js 14 with App Router architecture
- **Language**: TypeScript 5.0 with strict mode enabled
- **Styling**: Tailwind CSS with custom theme configuration
- **Components**: Shadcn/ui component library
- **State Management**: Zustand for global state
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query v5
- **Animations**: Framer Motion for UI transitions
- **Internationalization**: next-intl for translations
- **Testing**: Vitest, React Testing Library, and Playwright

### 5.2 Backend Technologies
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with JWT
- **Storage**: Supabase Storage with access controls
- **Serverless Functions**: Edge Functions
- **Caching**: Redis for performance optimization
- **Search**: PostgreSQL Full-Text Search
- **Email**: SendGrid for transactional emails
- **Scheduling**: Temporal for background jobs
- **Websockets**: Supabase Realtime for live updates
  - Real-time message delivery and status updates
  - Live package status notifications
  - Dynamic permission and role updates
- **QR Code Generation**: QRCode.react library
- **Permission System**: Custom RBAC implementation with Supabase RLS

### 5.3 Infrastructure
- **Hosting**: Replit with continuous deployment
- **CI/CD**: GitHub Actions workflow
- **Monitoring**: Sentry for error tracking
- **Analytics**: Custom analytics with Recharts visualizations
- **CDN**: Cloudflare for static assets
- **Backups**: Automated daily database backups
- **Domain & SSL**: Managed through Cloudflare

### 5.4 Quality Standards
- **Accessibility**: WCAG 2.1 AA compliance required
- **Performance**: Google PageSpeed score of 90+ on all pages
- **Security**: OWASP Top 10 vulnerabilities addressed
- **Code Quality**: 90%+ test coverage for critical paths
- **Browser Support**: Latest 2 versions of major browsers
- **Mobile Compatibility**: iOS 15+, Android 10+

### 5.5 AI and Machine Learning
- **Natural Language Processing**: OpenAI integration for chatbot
- **Computer Vision**: TensorFlow.js for image analysis
- **Recommendation Engine**: Custom algorithm for personalized content
- **Predictive Analytics**: Data modeling for maintenance predictions

## 6. Project Management

### 6.1 Methodology and Approach
- Agile development methodology with 1-week sprints
- Daily standup meetings (15 minutes)
- Weekly sprint planning and retrospective sessions
- Bi-weekly stakeholder demonstrations
- Continuous integration and deployment pipeline
- Feature branch workflow with pull request reviews

### 6.2 Tools and Platforms
- **Project Management**: GitHub Projects
- **Communication**: Slack and Google Meet
- **Documentation**: Notion and GitHub Wiki
- **Source Control**: GitHub with protected branches
- **Time Tracking**: Toggl with project codes
- **Design Collaboration**: Figma with developer handoff

### 6.3 Communication Plan
- **Daily Updates**: Development team standup (9:00 AM EDT)
- **Weekly Reports**: Status report delivered each Friday by 3:00 PM EDT
- **Bi-weekly Reviews**: Client demonstration each alternate Wednesday at 10:00 AM EDT
- **Issue Resolution**: Critical issues communicated within 2 hours of discovery
- **Change Requests**: Reviewed and responded to within 48 hours
- **Documentation Updates**: Published weekly following sprint completion

### 6.4 Risk Management
- Weekly risk assessment and mitigation planning
- Issue tracking with priority classification
- Automated testing to prevent regression
- Regular security scanning and vulnerability assessment
- Performance monitoring with alert thresholds
- Contingency buffer built into sprint planning

## 7. Acceptance Criteria

### 7.1 Quality Gates
Each phase will proceed through the following quality gates:
1. **Development Complete**: All functionality implemented
2. **Testing Passed**: All tests passing, zero critical bugs
3. **Code Review**: Peer review completed with issues addressed
4. **Documentation**: Feature documentation completed
5. **Client Review**: Stakeholder demonstration and feedback
6. **User Testing**: Validation with representative users
7. **Performance Verification**: Meeting established metrics
8. **Security Assessment**: Vulnerability scanning clear
9. **Accessibility Check**: WCAG compliance verified
10. **Final Approval**: Formal signoff from project stakeholders

### 7.2 General Acceptance Criteria
- All specified features function as described
- Performance metrics meet established targets
- All critical and high-priority bugs resolved
- Documentation complete and accurate
- Code meets established quality standards
- User testing validates usability requirements
- Accessibility requirements met and verified
- Security testing completed without critical findings

### 7.3 Specific Feature Acceptance Criteria

#### Messaging System
- Messages deliver in real-time with no more than 2-second latency
- File attachments up to 10MB upload successfully with progress indication
- Message read status accurately displays in sender's interface
- Group conversations correctly handle participant management
- Search returns accurate results across message content and metadata
- Message threading correctly maintains context and relationships
- All messages properly encrypted at rest and in transit

#### Package Management System
- Package entry form captures all required metadata in under 30 seconds
- QR codes generate correctly and scan on first attempt with standard scanners
- Notification delivery occurs within 60 seconds of package status change
- Package history maintains accurate audit trail of all status changes
- Reports accurately reflect package volume, delivery times, and pickup patterns
- Integration with carrier APIs successfully retrieves tracking data
- User interface adapts appropriately for staff vs. resident views

#### Role-Based Access Control System
- Role definitions correctly enforce access restrictions across all interfaces
- Permission changes take effect immediately without system restart
- Role assignment interface successfully maps users to appropriate roles
- Inheritance hierarchy correctly propagates permission changes
- Audit logs capture all permission-related changes with accurate timestamps
- User interface elements correctly show/hide based on permission context
- API endpoints correctly enforce permission requirements

## 8. Timeline

The project will follow the six-phase approach detailed in the project roadmap:

| Phase | Dates | Key Deliverables |
|-------|-------|-----------------|
| 1: Foundation | April 1-7, 2025 | Core website, admin authentication, contact system |
| 2: Admin Capabilities | April 8-14, 2025 | Document system, analytics, announcements |
| 3: Resident Portal | April 15-21, 2025 | Resident access, messaging system, package management |
| 4: Community Features | April 22-28, 2025 | Events, bookings, forums, voting |
| 5: Advanced Features | April 29-May 5, 2025 | Mobile app, integrations, payments |
| 6: Refinement | May 6-12, 2025 | Optimization, security, documentation |

## 9. Support and Maintenance

### 9.1 Warranty Period
- 60-day warranty period following project completion
- Bug fixes and critical issues addressed at no additional cost
- Weekly maintenance window scheduled for updates
- Emergency support for critical issues (24/7)

### 9.2 Post-Launch Support
- Technical support available 9:00 AM to 5:00 PM EDT, Monday to Friday
- Issue response time: Critical (4 hours), High (24 hours), Normal (48 hours)
- Monthly security updates and patch installation
- Quarterly feature enhancement planning
- Automated monitoring and alerting

### 9.3 Knowledge Transfer
- Comprehensive documentation handover
- Admin training sessions (minimum 3 sessions)
- Resident portal usage workshops (minimum 2 sessions)
- Video tutorials for common tasks
- Developer knowledge transfer sessions

## 10. Stakeholders and Responsibilities

### 10.1 Development Team
- **Project Manager**: Overall project coordination, stakeholder communication, timeline management
- **Lead Developer**: Technical architecture, code quality, development coordination
- **Frontend Developer**: UI implementation, responsive design, accessibility
- **Backend Developer**: Database design, API implementation, security
- **UX/UI Designer**: User experience, interface design, usability testing
- **QA Engineer**: Testing strategy, test automation, quality assurance

### 10.2 Client Representatives
- **Board President**: Final approval authority, vision alignment
- **Property Manager**: System requirements, operational workflows, user acceptance
- **IT Representative**: Technical requirements, integration needs, security compliance
- **Resident Representative**: User feedback, usability validation
- **Communications Director**: Content requirements, messaging standards

### 10.3 Responsibility Matrix

| Activity | Dev Team | Board | Property Mgr | IT Rep | Residents |
|----------|----------|-------|-------------|--------|-----------|
| Requirements Definition | Support | Approve | Lead | Support | Consult |
| Technical Architecture | Lead | Informed | Informed | Consult | - |
| Content Creation | Support | Approve | Support | - | - |
| UI/UX Design | Lead | Approve | Consult | - | Consult |
| Development | Lead | Informed | Informed | Informed | - |
| Testing | Lead | Support | Support | Support | Support |
| Training | Lead | - | Support | - | - |
| Deployment | Lead | Informed | Informed | Support | - |
| Acceptance | Support | Approve | Support | Support | Consult |

## 11. Change Management

### 11.1 Change Request Process
1. Change request submitted using standardized form
2. Impact assessment (schedule, budget, scope) completed within 3 business days
3. Change review meeting with key stakeholders
4. Formal approval or rejection documented
5. Approved changes incorporated into project plan
6. Implementation and verification

### 11.2 Change Control Board
- Project Manager (chair)
- Lead Developer
- Board President
- Property Manager
- IT Representative

### 11.3 Change Prioritization
Changes will be evaluated based on:
- Business value and alignment with objectives
- Technical impact and risk assessment
- Resource requirements and availability
- Timeline implications
- Cost considerations
- Interdependencies with other features

## 12. Legal and Compliance

### 12.1 Intellectual Property
- All custom code developed for this project will be owned by Lofts des Arts Condominiums
- Third-party libraries and components will remain under their respective licenses
- Development team retains portfolio rights for non-confidential aspects

### 12.2 Data Privacy and Security
- Compliance with relevant data privacy regulations (PIPEDA, GDPR principles)
- Personal data handling according to privacy best practices
- Security implementation following OWASP guidelines
- Regular security assessments and vulnerability testing
- Data breach notification procedures defined
- Message content encryption for sensitive communications
- Secure attachment handling with virus scanning
- Package notification privacy controls
- Role-based information access limitations
- Data retention policies for messaging history
- User consent management for communication preferences
- Audit logging of all sensitive data access

### 12.3 Service Level Agreement
- System uptime guarantee: 99.9% excluding scheduled maintenance
- Scheduled maintenance windows: Sundays 1:00 AM - 5:00 AM EDT
- Data backup frequency: Daily with 30-day retention
- Disaster recovery time objective: 4 hours
- Maximum consecutive downtime: 2 hours
- Messaging system availability: 99.95%
- Real-time notification delivery: Maximum 2-minute delay
- Package system response time: 99% of transactions under 3 seconds
- Permission changes propagation: Maximum 5-second delay
- QR code generation: Under 1 second per code
- Search query response: 95% of queries under 2 seconds

## 13. Approval

This Statement of Work is agreed upon by all parties as indicated by the signatures below:

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Board President | | | |
| Property Manager | | | |
| Project Manager | | | |
| Lead Developer | | | | 