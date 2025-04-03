# API Documentation

This directory contains documentation for all APIs used in the Lofts des Arts project, including both internal APIs and external service integrations.

## Structure

- `/endpoints/` - REST API endpoint documentation
- `/auth/` - Authentication API documentation
- `/supabase/` - Supabase API integration details
- `/external/` - Third-party API integrations

## API Principles

- All APIs follow RESTful design principles where applicable
- Authentication is handled via JWT tokens
- Rate limiting is implemented on public-facing endpoints
- All endpoints include proper error handling

## Available APIs

### Internal APIs

- **Authentication API** - User registration, login, and session management
- **Inquiries API** - Contact form submission and management
- **Files API** - Document storage and retrieval
- **Messaging API** - Internal communication system
- **Package API** - Package delivery notifications and tracking

### External Service Integrations

- **Supabase Auth** - User authentication and management
- **Supabase Storage** - File storage
- **Supabase Database** - Data storage and retrieval
- **OpenAI API** - AI assistance and chatbot functionality
- **Camera System API** - Building security camera feeds
- **Twilio/SendGrid** - SMS and email notifications

## API Versioning

All internal APIs are versioned with the format `/api/v{majorVersion}/{resource}`. The current version is v1.

## Authentication

Most API endpoints require authentication using JWT tokens. Token validation occurs through Supabase Auth.

## Error Handling

All APIs return standard HTTP status codes with a JSON response body in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Rate Limiting

Public-facing APIs implement rate limiting to prevent abuse. Limits are set at:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users 