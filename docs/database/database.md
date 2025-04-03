# Database Documentation

This directory contains documentation for the database architecture, schema design, and data management strategies used in the Lofts des Arts application.

## Database Architecture

The application uses Supabase, a PostgreSQL-based Backend-as-a-Service (BaaS), as its primary database system.

### Key Architectural Features

- **PostgreSQL Foundation**: Built on PostgreSQL 13+
- **Row-Level Security (RLS)**: Fine-grained access control at the row level
- **Real-time Capabilities**: PubSub mechanism for live data updates
- **Edge Functions**: Serverless functions for database operations
- **Storage Integration**: File storage with database references

## Database Schema

The database schema is organized into the following main tables:

### Authentication & Users

- `auth.users` - User authentication managed by Supabase Auth
- `profiles` - Extended user profile information linked to auth.users

### Content Management

- `conversations` - Board communication threads
- `messages` - Individual messages within conversations
- `folders` - File system directory structure
- `files` - Document metadata linked to Supabase Storage

### Property Management

- `cameras` - Security camera registration and metadata
- `camera_recordings` - Archived camera recordings
- `packages` - Package delivery tracking
- `maintenance_requests` - Resident maintenance requests

### Public Website

- `contact_inquiries` - Public contact form submissions
- `announcements` - Board announcements and notifications

## Schema Diagrams

Entity Relationship Diagrams (ERDs) can be found in the `/diagrams/` subdirectory, showing:

- Table relationships
- Foreign key constraints
- Cardinality between entities
- Inheritance hierarchies

## SQL Migrations

Database changes are managed through version-controlled SQL migration scripts located in:

- `/migrations/` - SQL scripts for schema changes

Key migration files:

- `create_profiles_table.sql` - Profile table creation
- `update_contact_inquiries.sql` - Contact form table updates
- `insert_board_profiles.sql` - Board member data insertion

## Row-Level Security Policies

Access control is implemented using PostgreSQL's Row-Level Security (RLS) policies:

### Profiles Table

```sql
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);
```

### Contact Inquiries Table

```sql
-- Authenticated users can view inquiries
CREATE POLICY "Authenticated users can view inquiries" 
ON contact_inquiries 
FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated users can update inquiries
CREATE POLICY "Authenticated users can update inquiries" 
ON contact_inquiries 
FOR UPDATE
TO authenticated 
USING (true);
```

## Database Access Patterns

The application uses the following access patterns:

- **Server Component Access**: Direct PostgreSQL queries with RLS applied
- **Client Component Access**: Supabase client with user-specific auth context
- **API Routes**: Server-side access with enhanced security
- **Webhooks**: Event-driven database updates via Supabase Edge Functions

## Performance Optimization

Database performance is optimized through:

- **Indexing Strategy**: Indexes on frequently queried columns
- **Query Optimization**: Prepared statements and minimized data fetching
- **Connection Pooling**: Efficient connection management
- **Materialized Views**: For complex aggregate queries

## Data Backup & Recovery

Backup and recovery strategy includes:

- Automated daily backups
- Point-in-time recovery capability
- Disaster recovery procedures
- Data retention policies

## Future Schema Evolution

Planned database schema changes:

- Resident portal user tables
- Event and amenity booking system
- Payment processing integration
- Smart building system integration 