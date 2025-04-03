# Database Documentation

This directory contains comprehensive documentation for the Lofts des Arts database architecture, schema design, and data access patterns.

## Directory Structure

- `/schema/` - Database schema definitions and ERD diagrams
- `/migrations/` - Documentation for database migrations
- `/queries/` - Common SQL queries and examples
- `/access-patterns/` - Data access patterns and optimization strategies
- `/security/` - Row Level Security (RLS) policies and configuration
- `/backup/` - Backup and recovery procedures

## Database Overview

The Lofts des Arts platform uses Supabase with PostgreSQL as its database, providing:

- Relational data storage with strong consistency
- Row Level Security for fine-grained access control
- Full-text search capabilities
- Real-time data subscriptions (future feature)
- Automated backups and point-in-time recovery

## Database Schema

The database is organized into several key schemas:

- `public`: Primary application data
- `auth`: Managed by Supabase Auth
- `storage`: Managed by Supabase Storage

### Core Tables

The main tables in the database include:

#### Users and Profiles

- `auth.users`: Managed by Supabase Auth, contains user authentication data
- `public.profiles`: Extended user profile information
  - Linked to `auth.users` via `id` foreign key
  - Contains display name, avatar, role, and preferences

#### Content Management

- `public.pages`: Static page content
- `public.media`: Media assets and metadata

#### Communication

- `public.contact_inquiries`: Contact form submissions and inquiries
  - Contains contact information, message, and status
  - Tracks submission time and administrative responses

### Entity Relationship Diagram

The main entity relationships are documented in the [Entity Relationship Diagram](./schema/erd.png).

## Row Level Security

Row Level Security (RLS) is implemented at the database level to enforce access control:

### RLS Policies

#### Profiles Table

- `profiles_public_read`: Anyone can read basic profile information
- `profiles_owner_update`: Users can update their own profiles
- `profiles_admin_all`: Administrators have full access to all profiles

#### Contact Inquiries Table

- `contact_inquiries_insert_public`: Anyone can insert a new inquiry
- `contact_inquiries_view_admin`: Only administrators can view inquiries
- `contact_inquiries_update_admin`: Only administrators can update inquiries

Detailed policy definitions can be found in the [RLS Policies documentation](./security/rls-policies.md).

## Database Access Patterns

### Data Access Methods

The application accesses the database through:

1. **Supabase JavaScript Client**:
   - Used for client-side queries with RLS applied
   - Provides real-time subscriptions for live updates

2. **Server-Side API Routes**:
   - Uses Supabase Admin client for privileged operations
   - Implements additional business logic and validation

3. **Direct SQL** (migrations and maintenance):
   - Used for schema migrations
   - Used for administrative tasks

### Common Query Patterns

Examples of common query patterns:

#### Fetching Profile Data

```typescript
// Client-side with RLS applied
const { data, error } = await supabase
  .from('profiles')
  .select('id, display_name, avatar_url')
  .eq('id', userId);
```

#### Submitting Contact Inquiry

```typescript
// Client-side with RLS applied
const { data, error } = await supabase
  .from('contact_inquiries')
  .insert([
    {
      name: formData.name,
      email: formData.email,
      message: formData.message
    }
  ]);
```

More query examples can be found in the [Query Examples](./queries/README.md) section.

## Database Migrations

Database migrations are managed through SQL scripts and Supabase migrations:

- Migration scripts are stored in the `/sql` directory
- Each migration is versioned and applied sequentially
- Migrations are tracked in version control

The migration process is documented in [Migration Procedures](./migrations/README.md).

## Indexes and Performance

The database uses the following indexes for performance optimization:

- Primary keys on all tables
- Foreign key indexes for relationships
- Full-text search indexes for text columns
- Custom indexes for frequent query patterns

Performance optimization strategies are documented in [Performance Tuning](./access-patterns/performance.md).

## Backup and Recovery

The database backup strategy includes:

- Automated daily backups via Supabase
- Point-in-time recovery capability
- Manual backup procedures for critical operations

Backup procedures are documented in [Backup and Recovery](./backup/README.md).

## Security Considerations

Database security is implemented through multiple layers:

- Connection encryption (SSL/TLS)
- Row Level Security policies
- Password policies and hashing
- Role-based access control
- Audit logging

Security practices are documented in [Security Best Practices](./security/README.md).

## Future Enhancements

Planned database enhancements include:

- Real-time notifications for admin users
- Enhanced search capabilities
- Archiving strategies for historical data
- Performance optimization for increased scale

## Troubleshooting

Common database issues and their solutions are documented in [Troubleshooting Guide](./troubleshooting.md).

## References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQL Style Guide](./sql-style-guide.md) 