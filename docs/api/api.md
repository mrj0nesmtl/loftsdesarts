# API Documentation

This directory contains comprehensive documentation for the Lofts des Arts API, including endpoints, authentication, request/response formats, and integration guides.

*Last Updated: April 5, 2025 | Version: 0.2.0*

## Directory Structure

- `/endpoints/` - Detailed documentation for each API endpoint
  - `/endpoints/messaging/` - Messaging system API endpoints
  - `/endpoints/packages/` - Package management API endpoints
  - `/endpoints/users/` - User and profile management endpoints
  - `/endpoints/documents/` - Document management endpoints
- `/authentication/` - Authentication and authorization guides
- `/schemas/` - API data schemas and validation rules
- `/examples/` - Example API requests and responses
- `/webhooks/` - Webhook integration documentation
- `/versioning/` - API versioning guidelines
- `/rbac/` - Role-based access control documentation

## API Overview

The Lofts des Arts API enables interaction with the platform's core functionality, providing access to:

- User and profile management
- Content retrieval and management
- Contact inquiries submissions
- Administrative operations
- Media asset management
- Real-time messaging system
- Package tracking and notifications
- Document management system
- Role-based access control

## Authentication

All API requests require authentication using the following methods:

- **Supabase JWT Tokens**: For client-side applications
- **API Keys**: For server-to-server communication
- **Session Cookies**: For browser sessions

Authentication is role-based, with different permission levels according to user roles:

| Role | Permission Level | Access Examples |
|------|------------------|----------------|
| SUPER_ADMIN | Full system access | All endpoints and operations |
| ADMIN | Condominium management | User management, all building operations |
| MANAGER | Building operations | Building management, package tracking |
| BOARD_MEMBER | Governance operations | Document management, announcements |
| DOORMAN | Front desk operations | Package logging, visitor management |
| RESIDENT | Resident access | Personal messages, packages, documents |
| GUEST | Limited access | Public content only |

Authentication details can be found in the [Authentication Guide](./authentication/README.md).

## API Endpoints

The API follows RESTful conventions and provides the following main endpoint categories:

### User Management

- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user information
- `GET /api/users/:id/permissions` - Get user permissions
- `POST /api/users/invite` - Invite a new user
- `POST /api/users/:id/roles` - Assign role to user
- `DELETE /api/users/:id/roles/:roleName` - Remove role from user

### Profiles

- `GET /api/profiles` - List profiles
- `GET /api/profiles/:id` - Get profile details
- `PATCH /api/profiles/:id` - Update profile
- `GET /api/profiles/:id/roles` - Get user's roles

### Contact Inquiries

- `POST /api/contact` - Submit a contact inquiry
- `GET /api/contact` - List contact inquiries (admin only)
- `GET /api/contact/:id` - Get specific inquiry details (admin only)
- `PATCH /api/contact/:id` - Update inquiry status (admin only)

### Media

- `GET /api/media` - List media items
- `POST /api/media/upload` - Upload new media
- `DELETE /api/media/:id` - Delete media item
- `POST /api/media/:id/move` - Move media to different folder

### Documents

- `GET /api/documents` - List documents (filtered by permission)
- `POST /api/documents` - Upload new document
- `GET /api/documents/:id` - Get document details
- `DELETE /api/documents/:id` - Delete document
- `PATCH /api/documents/:id` - Update document metadata
- `POST /api/documents/:id/move` - Move document to different folder
- `POST /api/documents/:id/share` - Generate sharing link
- `GET /api/folders` - List document folders
- `POST /api/folders` - Create new folder
- `DELETE /api/folders/:id` - Delete folder

### Messaging System

- `GET /api/conversations` - List user's conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id` - Get conversation details
- `DELETE /api/conversations/:id` - Delete conversation
- `GET /api/conversations/:id/messages` - Get messages in conversation
- `POST /api/conversations/:id/messages` - Send new message
- `PATCH /api/conversations/:id/messages/:messageId` - Edit message
- `DELETE /api/conversations/:id/messages/:messageId` - Delete message
- `POST /api/conversations/:id/participants` - Add participant to conversation
- `DELETE /api/conversations/:id/participants/:userId` - Remove participant
- `POST /api/conversations/:id/read` - Mark conversation as read
- `POST /api/messages/:id/attachments` - Upload message attachment
- `GET /api/messages/:id/reads` - Get message read receipts

### Package Management

- `GET /api/packages` - List packages (filtered by role)
- `POST /api/packages` - Log new package (doorman/admin only)
- `GET /api/packages/:id` - Get package details
- `PATCH /api/packages/:id` - Update package status
- `GET /api/packages/:id/history` - Get package status history
- `POST /api/packages/:id/notify` - Send notification to resident
- `GET /api/carriers` - List package carriers
- `POST /api/packages/:id/pickup` - Record package pickup
- `GET /api/packages/qr/:id` - Generate package QR code
- `POST /api/packages/verify/:id` - Verify package via QR code

### Residents and Building Units

- `GET /api/units` - List building units (filtered by role)
- `POST /api/units` - Create new unit (admin only)
- `GET /api/units/:id` - Get unit details
- `PATCH /api/units/:id` - Update unit information
- `GET /api/units/:id/residents` - List residents in unit
- `GET /api/residents` - List residents (filtered by role)
- `POST /api/residents` - Add new resident (admin only)
- `GET /api/residents/:id` - Get resident details
- `PATCH /api/residents/:id` - Update resident information
- `POST /api/residents/import` - Batch import residents via CSV

### Role-Based Access Control

- `GET /api/roles` - List available roles (admin only)
- `GET /api/permissions` - List available permissions (admin only)
- `POST /api/users/:id/permissions` - Grant direct permission to user
- `DELETE /api/users/:id/permissions/:permissionId` - Remove permission
- `GET /api/roles/:roleName/permissions` - List permissions for role
- `POST /api/roles/:roleName/permissions` - Add permission to role
- `DELETE /api/roles/:roleName/permissions/:permissionId` - Remove permission

## Request and Response Formats

All API requests and responses use JSON format. Example:

### Request:
```json
POST /api/conversations
{
  "title": "Building Maintenance Update",
  "type": "group",
  "participants": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ],
  "initialMessage": {
    "content": "The elevator maintenance is scheduled for next Tuesday."
  }
}
```

### Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426655440000",
  "title": "Building Maintenance Update",
  "type": "group",
  "created_at": "2025-04-05T12:00:00Z",
  "message": {
    "id": "789e0123-e45b-67d8-a901-234567890000",
    "content": "The elevator maintenance is scheduled for next Tuesday.",
    "created_at": "2025-04-05T12:00:00Z"
  },
  "participants": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "first_name": "John",
      "last_name": "Doe",
      "role": "member"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "member"
    }
  ]
}
```

## Rate Limiting

API requests are subject to rate limiting to ensure platform stability:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated requests
- 300 requests per minute for admin users
- 50 requests per minute for messaging endpoints
- 200 requests per minute for package management endpoints (doorman role)

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
- `conflict` - Resource conflict (e.g., duplicate conversation)
- `method_not_allowed` - HTTP method not allowed for endpoint
- `service_unavailable` - Service temporarily unavailable
- `internal_error` - Internal server error

## Data Validation

All API requests are validated against schemas defined in [Zod schemas](./schemas/README.md). These schemas ensure data consistency and prevent invalid operations.

### Example Validation Schema (Conversation Creation)

```typescript
// Conversation creation schema
export const conversationCreateSchema = z.object({
  title: z.string().optional(),
  type: z.enum(['direct', 'group', 'announcement', 'system']),
  participants: z.array(z.string().uuid()).min(1),
  initialMessage: z.object({
    content: z.string().min(1).max(2000),
    attachments: z.array(z.string().uuid()).optional()
  }).optional()
});
```

## Real-time API

The API supports real-time updates through WebSockets for select endpoints:

### WebSocket Endpoints

- `/realtime/conversations` - Updates for conversations and messages
- `/realtime/packages` - Updates for package status changes
- `/realtime/notifications` - System and user notifications

### WebSocket Authentication

WebSocket connections require authentication via token:

```javascript
// Connect to WebSocket
const socket = new WebSocket(
  `${WEBSOCKET_URL}/realtime/conversations?token=${supabaseToken}`
);

// Listen for messages
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  // Handle different message types
  switch (data.type) {
    case 'new_message':
      // Handle new message
      break;
    case 'message_update':
      // Handle message update
      break;
    case 'read_receipt':
      // Handle read receipt
      break;
  }
});
```

## Role-Based Access Control API

The Role-Based Access Control (RBAC) system is accessible through dedicated API endpoints that allow checking and managing user permissions.

### Permission Checking

The API provides methods to check permissions programmatically:

```javascript
// Check if user has specific permission
const { data } = await supabase.rpc('has_permission', {
  user_id: userId,
  permission_name: 'documents:create'
});

// Use the result (true/false) to control access
```

### Role Management

Endpoints for managing roles:

```javascript
// Assign role to user
const { data, error } = await supabase.from('user_roles').insert({
  user_id: userId,
  role_name: 'DOORMAN',
  assigned_by: adminId
});

// Check if user has role
const { data } = await supabase.rpc('has_role', {
  user_id: userId,
  role_name: 'ADMIN'
});
```

## Webhooks (Future)

Webhook integration will enable real-time notification of events such as:

- New contact inquiry submissions
- Profile updates
- Package status changes
- New messages in conversations
- Document uploads or modifications
- Resident move-ins or move-outs

Webhook endpoints will include:

- `/webhooks/packages` - Package-related events
- `/webhooks/messages` - Messaging-related events
- `/webhooks/documents` - Document-related events
- `/webhooks/users` - User and profile-related events

## Versioning

API versioning follows this pattern:

- `/api/v1/...` - Current stable version
- `/api/v2/...` - New features (when available)

Breaking changes are only introduced in new major versions. Changes that maintain backward compatibility may be added to existing versions.

### API Changelog

- **v1.0** (April 1, 2025) - Initial stable API release
- **v1.1** (April 5, 2025) - Added messaging and package management endpoints
- **v1.2** (Planned: April 15, 2025) - Resident portal integration

## Implementation Notes

### Server-Side Implementation

The API is implemented using Next.js API routes with server-side middleware for authentication and permission checks:

```typescript
// Example API route with permission check
import { withPermission } from '@/lib/middleware/permissions';

export default withPermission('documents:create')(async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle document creation
    // ...
    return res.status(201).json(document);
  }
  
  return res.status(405).json({ error: { code: 'method_not_allowed' } });
});
```

### Client-Side Usage

The API can be accessed from the client using the Supabase client library or direct HTTP requests:

```typescript
// Using Supabase client
const { data, error } = await supabase
  .from('conversations')
  .select('*')
  .order('last_message_at', { ascending: false });

// Using fetch API
const response = await fetch('/api/conversations', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${supabaseToken}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

## Security Considerations

### API Security Measures

1. **Authentication**: All endpoints require valid authentication
2. **Authorization**: Role-based access control for all operations
3. **Validation**: Input validation on all request data
4. **Rate Limiting**: Protection against abuse and DoS attacks
5. **HTTPS**: All API traffic is encrypted
6. **Audit Logging**: All sensitive operations are logged
7. **CORS**: Strict cross-origin resource sharing policies
8. **Content Security Policy**: Strict CSP headers
9. **Error Handling**: No sensitive data in error responses
10. **Session Management**: Secure session handling and expiration

### API Security Best Practices

- Always validate user input server-side, even if client-side validation exists
- Use parameterized queries to prevent SQL injection
- Implement proper error handling that doesn't leak sensitive information
- Use HTTPS for all API communication
- Verify user permissions before performing any operation
- Implement proper logging for security-relevant events
- Regularly review API access logs for suspicious activities

## Contact Form Submission

The contact form submission endpoint requires special consideration for Row Level Security (RLS) policies in Supabase. For public submissions to work properly, the following policy must be in place:

```sql
CREATE POLICY "Public users can insert inquiries" 
ON contact_inquiries 
FOR INSERT 
TO public
WITH CHECK (true);
```

## API Usage Examples

### Messaging System

#### Creating a New Conversation

```typescript
const { data, error } = await supabase.from('conversations').insert({
  type: 'direct',
  created_by: currentUserId,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_message_at: new Date().toISOString()
}).select().single();

// Add participants
await supabase.from('conversation_participants').insert([
  {
    conversation_id: data.id,
    user_id: currentUserId,
    role: 'owner',
    joined_at: new Date().toISOString()
  },
  {
    conversation_id: data.id,
    user_id: recipientId,
    role: 'member',
    joined_at: new Date().toISOString()
  }
]);
```

#### Sending a Message

```typescript
const { data, error } = await supabase.from('messages').insert({
  conversation_id: conversationId,
  sender_id: currentUserId,
  content: messageContent,
  status: 'sent',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}).select().single();

// Update conversation's last_message_at
await supabase.from('conversations')
  .update({ last_message_at: new Date().toISOString() })
  .eq('id', conversationId);
```

### Package Management

#### Logging a New Package

```typescript
const { data, error } = await supabase.from('packages').insert({
  resident_id: residentId,
  logged_by: currentUserId,
  carrier_id: carrierId,
  tracking_number: trackingNumber,
  description: description,
  status: 'RECEIVED',
  received_at: new Date().toISOString(),
  notification_sent: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}).select().single();
```

#### Updating Package Status

```typescript
const { data, error } = await supabase.from('packages')
  .update({
    status: 'DELIVERED',
    picked_up_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
  .eq('id', packageId)
  .select()
  .single();
```

## References

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Zod Schema Validation](https://github.com/colinhacks/zod)
- [REST API Best Practices](https://www.restapitutorial.com/)
- [OWASP API Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) 