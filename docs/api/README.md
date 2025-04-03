# API Documentation

This directory contains comprehensive documentation for the Lofts des Arts API, including endpoints, authentication, request/response formats, and integration guides.

## Directory Structure

- `/endpoints/` - Detailed documentation for each API endpoint
- `/authentication/` - Authentication and authorization guides
- `/schemas/` - API data schemas and validation rules
- `/examples/` - Example API requests and responses
- `/webhooks/` - Webhook integration documentation
- `/versioning/` - API versioning guidelines

## API Overview

The Lofts des Arts API enables interaction with the platform's core functionality, providing access to:

- User and profile management
- Content retrieval and management
- Contact inquiries submissions
- Administrative operations
- Media asset management

## Authentication

All API requests require authentication using the following methods:

- **Supabase JWT Tokens**: For client-side applications
- **API Keys**: For server-to-server communication
- **Session Cookies**: For browser sessions

Authentication details can be found in the [Authentication Guide](./authentication/README.md).

## API Endpoints

The API follows RESTful conventions and provides the following main endpoint categories:

### User Management

- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user information

### Profiles

- `GET /api/profiles` - List profiles
- `GET /api/profiles/:id` - Get profile details
- `PATCH /api/profiles/:id` - Update profile

### Contact Inquiries

- `POST /api/contact` - Submit a contact inquiry
- `GET /api/contact` - List contact inquiries (admin only)
- `GET /api/contact/:id` - Get specific inquiry details (admin only)
- `PATCH /api/contact/:id` - Update inquiry status (admin only)

### Media

- `GET /api/media` - List media items
- `POST /api/media/upload` - Upload new media
- `DELETE /api/media/:id` - Delete media item

## Request and Response Formats

All API requests and responses use JSON format. Example:

Request:
```json
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like more information about the property."
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426655440000",
  "status": "submitted",
  "created_at": "2023-04-01T12:00:00Z"
}
```

## Rate Limiting

API requests are subject to rate limiting to ensure platform stability:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated requests

Limits are applied per IP address and authentication token.

## Error Handling

API errors follow a standard format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "Email address is required"
  }
}
```

Common error codes:

- `unauthorized` - Authentication required
- `forbidden` - Insufficient permissions
- `not_found` - Resource not found
- `rate_limited` - Too many requests
- `validation_error` - Invalid input data

## Data Validation

All API requests are validated against schemas defined in [Zod schemas](./schemas/README.md). These schemas ensure data consistency and prevent invalid operations.

## Webhooks (Future)

Webhook integration will enable real-time notification of events such as:

- New contact inquiry submissions
- Profile updates
- System notifications

## Versioning

API versioning follows this pattern:

- `/api/v1/...` - Current stable version
- `/api/v2/...` - New features (when available)

Breaking changes are only introduced in new major versions. 