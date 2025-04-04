# Session 2 Resources

This document provides comprehensive resources, project structures, implementation guides, and technical references for Session 2 development focused on admin features enhancement.

## Project Structure Overview

The following structure outlines the organization of components, routes, and utilities for the enhanced admin features. This structure follows Next.js 14 best practices with App Router architecture and component-based organization.

### Admin Components Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── ClientAdminLayout.tsx            # Main layout wrapper for admin area
│   │   ├── AdminNav.tsx                     # Admin navigation component
│   │   ├── UserAvatar.tsx                   # User avatar with profile dropdown
│   │   ├── NotificationCenter.tsx           # Notification management component
│   │   ├── WelcomeMessage.tsx               # Personalized welcome message
│   │   ├── theme/                           # Theme system components
│   │   │   ├── ThemeProvider.tsx            # Context provider for theme state
│   │   │   ├── ThemeToggle.tsx              # UI component for switching themes
│   │   │   └── theme-utils.ts               # Helper functions for theme management
│   │   ├── messaging/                       # Messaging system components
│   │   │   ├── ConversationList.tsx         # List of available conversations
│   │   │   ├── MessageThread.tsx            # Individual message thread display
│   │   │   ├── MessageInput.tsx             # Input component with attachments
│   │   │   ├── FileAttachment.tsx           # File attachment handling
│   │   │   └── NotificationBadge.tsx        # Unread message indicator
│   │   ├── files/                           # File management components
│   │   │   ├── FileExplorer.tsx             # Main file browser component
│   │   │   ├── FolderView.tsx               # Folder contents display
│   │   │   ├── FileUpload.tsx               # Drag-drop file upload
│   │   │   ├── FilePreview.tsx              # Multi-format file preview
│   │   │   └── FilePermissions.tsx          # Access control management
│   │   ├── cameras/                         # Camera system components
│   │   │   ├── CameraGrid.tsx               # Multi-camera view layout
│   │   │   ├── CameraFeed.tsx               # Individual camera stream
│   │   │   ├── RecordingsArchive.tsx        # Historical recordings browser
│   │   │   └── MotionAlerts.tsx             # Motion detection alerts
│   │   ├── ai/                              # AI assistant components
│   │   │   ├── GPTAssistant.tsx             # Main AI interface component
│   │   │   ├── DocumentAnalyzer.tsx         # Document processing UI
│   │   │   ├── MeetingTranscription.tsx     # Audio transcription component
│   │   │   └── AIResponseFeedback.tsx       # Feedback mechanism for responses
│   │   ├── chatbot/                         # Public chatbot components
│   │   │   ├── ChatbotWidget.tsx            # Floating chat widget
│   │   │   ├── ChatbotConfiguration.tsx     # Admin configuration panel
│   │   │   └── ChatbotAnalytics.tsx         # Usage analytics dashboard
│   │   └── packages/                        # Package notification components
│   │       ├── PackageLogger.tsx            # Package logging interface
│   │       ├── ResidentNotifier.tsx         # Notification management
│   │       ├── PackageHistory.tsx           # Historical package tracking
│   │       └── PackageAnalytics.tsx         # Package volume analytics
│   └── common/                              # Shared components
│       ├── ui/                              # UI component library (Shadcn)
│       └── icons/                           # Icon components
├── app/                                     # Next.js App Router structure
│   ├── admin/                               # Admin routes
│   │   ├── dashboard/                       # Admin dashboard
│   │   ├── messaging/                       # Messaging routes
│   │   │   ├── page.tsx                     # Main messaging interface
│   │   │   └── [conversationId]/page.tsx    # Individual conversation view
│   │   ├── files/                           # File management routes
│   │   │   ├── page.tsx                     # File explorer main page
│   │   │   └── [folderId]/page.tsx          # Individual folder view
│   │   ├── cameras/                         # Camera system routes
│   │   │   ├── page.tsx                     # Camera grid main page
│   │   │   └── [cameraId]/page.tsx          # Individual camera view
│   │   ├── ai-assistant/                    # AI assistant routes
│   │   │   └── page.tsx                     # AI assistant interface
│   │   ├── chatbot/                         # Chatbot management
│   │   │   └── page.tsx                     # Chatbot configuration
│   │   └── packages/                        # Package management
│   │       └── page.tsx                     # Package logging and tracking
│   └── api/                                 # API routes
│       ├── messaging/                       # Messaging API endpoints
│       ├── files/                           # File management API
│       ├── cameras/                         # Camera system API
│       ├── ai/                              # AI integration API
│       ├── chatbot/                         # Chatbot API endpoints
│       └── packages/                        # Package notification API
└── lib/                                     # Utility functions
    ├── auth.tsx                             # Authentication utilities
    ├── supabase.ts                          # Supabase client initialization
    ├── helpers.ts                           # General helper functions
    ├── store.ts                             # Global state management
    ├── theme-provider.tsx                   # Theme context provider
    ├── ai-provider.ts                       # AI integration utilities
    ├── cameras.ts                           # Camera API integration
    └── notifications.ts                     # Notification utilities
```

## Database Schema Design

The following schema details the database structure needed for the new features. Each table includes detailed column specifications, relationships, and access controls.

### Supabase Database Schema Additions

```sql
-- Messaging Tables
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type TEXT,
  read_by JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- File System Tables
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Camera System Tables
CREATE TABLE cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  stream_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE camera_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id UUID REFERENCES cameras(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  has_motion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Package Notification Tables
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES auth.users(id),
  logged_by UUID REFERENCES auth.users(id),
  carrier TEXT,
  tracking_number TEXT,
  description TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  picked_up_at TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Doorman Role
CREATE TYPE user_role AS ENUM ('admin', 'resident', 'doorman');
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'resident';
```

### Row-Level Security Policies

```sql
-- Messaging security policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view conversations they're part of" 
  ON conversations FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM conversation_participants WHERE conversation_id = id
  ));

-- File system security policies
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all folders" 
  ON folders 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can view folders they have access to" 
  ON folders FOR SELECT 
  USING (id IN (
    SELECT folder_id FROM folder_permissions WHERE user_id = auth.uid()
  ));

-- Package notification security policies
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Residents can view their own packages" 
  ON packages FOR SELECT 
  USING (resident_id = auth.uid());
CREATE POLICY "Doormen can view and manage all packages" 
  ON packages 
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('doorman', 'admin'));
```

## Implementation Guidelines

### Theme System Implementation

The theme system should be built using a combination of React Context, CSS variables, and Tailwind CSS. This approach provides flexibility, performance, and compatibility with various rendering scenarios.

#### Component Structure

```jsx
// src/lib/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'system',
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

#### Implementation Best Practices

1. **Server/Client Components**: Remember that theme detection happens on the client side. Use the `'use client'` directive appropriately.
2. **Avoid Hydration Mismatch**: Server-rendered HTML won't know the user's theme preference, so implement a strategy to avoid flickering.
3. **CSS Variables**: Define all colors and theme-related values as CSS variables in your global styles.
4. **Accessibility**: Ensure color contrast meets WCAG 2.1 AA standards in both themes.
5. **User Preference Persistence**: Store the user's theme preference in localStorage.

### Messaging System Implementation

The messaging system should leverage Supabase Realtime for live updates while ensuring efficient data loading and state management.

#### Key Implementation Considerations

1. **Realtime Subscriptions**:
   ```typescript
   // Example subscription setup
   const channel = supabase
     .channel('messages')
     .on(
       'postgres_changes',
       { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
       (payload) => {
         // Handle new message
         setMessages((prev) => [...prev, payload.new]);
       }
     )
     .subscribe();
   ```

2. **Message Pagination**: Implement cursor-based pagination to efficiently load large message histories.

3. **Optimistic Updates**: Update UI immediately on message send, then reconcile with server response.

4. **Offline Support**: Consider implementing message queuing for offline scenarios.

5. **Read Receipts**: Use JSONB arrays to track which users have read each message.

### File Storage System Implementation

The file storage system should provide a familiar, hierarchical browsing experience while leveraging Supabase Storage for the backend.

#### Recommended Approach

1. **Storage Bucket Organization**:
   - Create separate buckets for different access levels: `public`, `private`, `shared`
   - Use folder paths within buckets for organization

2. **File Upload Flow**:
   ```typescript
   // Multi-part upload for large files
   const uploadFile = async (file: File, path: string) => {
     const fileExt = file.name.split('.').pop();
     const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
     const filePath = `${path}/${fileName}`;
     
     // Upload to Supabase Storage
     const { data, error } = await supabase.storage
       .from('private')
       .upload(filePath, file, {
         cacheControl: '3600',
         upsert: false
       });
     
     if (error) throw error;
     
     // Store metadata in database
     await supabase.from('files').insert({
       name: file.name,
       folder_id: currentFolderId,
       storage_path: filePath,
       size: file.size,
       mime_type: file.type,
       created_by: user.id
     });
     
     return data;
   };
   ```

3. **Version Control Implementation**:
   - Store file versions in a separate table with references to original files
   - Consider implementing a branching model for important documents

4. **Preview Generation**:
   - Generate thumbnails for images during upload
   - Use server-side conversion for document previews
   - Cache previews for better performance

### Camera Integration Implementation

Camera integration requires careful handling of streams and security considerations.

#### Secure Stream Handling

1. **Authentication for Streams**:
   - Use signed URLs with expiration for stream access
   - Implement token-based authentication for stream endpoints

2. **Stream Processing**:
   ```typescript
   // Example HLS stream implementation
   import Hls from 'hls.js';

   const setupStream = (videoElement: HTMLVideoElement, streamUrl: string) => {
     if (Hls.isSupported()) {
       const hls = new Hls({
         enableWorker: true,
         lowLatencyMode: true,
       });
       hls.loadSource(streamUrl);
       hls.attachMedia(videoElement);
     } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
       // Native HLS support (Safari)
       videoElement.src = streamUrl;
     }
   };
   ```

3. **Recording Management**:
   - Implement server-side recording capabilities
   - Create a retention policy for automatic cleanup
   - Ensure secure access to recordings

### AI Implementation Best Practices

When implementing AI features, consider the following best practices:

1. **API Key Security**:
   - Never expose API keys in client-side code
   - Use server-side API routes to proxy requests

2. **Prompt Engineering**:
   - Create structured prompts with clear instructions
   - Include system messages to define assistant behavior
   - Implement prompt templates for consistent results

3. **Error Handling**:
   - Implement graceful fallbacks for API failures
   - Add rate limiting mechanisms
   - Monitor token usage to prevent cost overruns

4. **Response Processing**:
   ```typescript
   // Example AI response processing
   const processAIResponse = async (query: string) => {
     try {
       const response = await fetch('/api/ai/assistant', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ query }),
       });
       
       if (!response.ok) throw new Error('AI request failed');
       
       const data = await response.json();
       
       // Process and sanitize the response
       const sanitizedResponse = sanitizeAIResponse(data.response);
       
       return sanitizedResponse;
     } catch (error) {
       console.error('AI assistant error:', error);
       return 'I apologize, but I'm unable to process your request right now.';
     }
   };
   ```

## Environment Setup

The following environment variables are required for the new features. Ensure these are properly configured in your `.env.local` file during development and in your deployment environment for production.

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORGANIZATION=your-organization-id

# Camera System
CAMERA_API_URL=your-camera-api-url
CAMERA_API_KEY=your-camera-api-key
CAMERA_SECRET=your-camera-secret

# SMS Notifications
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email Notifications
SENDGRID_API_KEY=your-sendgrid-api-key
NOTIFICATION_EMAIL=notifications@loftsdesarts.ca
NOTIFICATION_EMAIL_NAME=Lofts des Arts

# Security
NEXTAUTH_SECRET=your-nextauth-secret
ENCRYPTION_KEY=your-encryption-key
```

### Environment Setup Instructions

1. **Local Development Setup**:
   - Create a `.env.local` file in the project root
   - Copy the variables above and replace with your actual values
   - Restart your development server after changes

2. **Production Environment**:
   - Add these variables to your hosting platform's environment configuration
   - Ensure secrets are properly encrypted and access-controlled
   - Implement separate development/production API keys where possible

3. **Environment Validation**:
   ```typescript
   // src/lib/env.ts
   export function validateEnv() {
     const requiredEnvVars = [
       'NEXT_PUBLIC_SUPABASE_URL',
       'NEXT_PUBLIC_SUPABASE_ANON_KEY',
       'OPENAI_API_KEY',
       // Add other required variables
     ];
     
     const missingEnvVars = requiredEnvVars.filter(
       (envVar) => !process.env[envVar]
     );
     
     if (missingEnvVars.length > 0) {
       throw new Error(
         `Missing required environment variables: ${missingEnvVars.join(', ')}`
       );
     }
   }
   ```

## Development Tools & Libraries

The following libraries are recommended for implementing the new features. Each library has been selected based on compatibility, performance, and community support.

### Theme System
- **next-themes**: Provides theme detection, system preference matching, and persistence
- **tailwindcss**: Utility-first CSS framework with built-in dark mode support
- **clsx**: Utility for conditionally joining class names

### Messaging System
- **supabase-js**: Supabase client with realtime capabilities
- **emoji-mart**: Emoji picker component
- **react-textarea-autosize**: Auto-expanding textarea component
- **nanoid**: Tiny, secure ID generator for temporary message IDs

### File Storage
- **react-dropzone**: File upload component with drag-and-drop support
- **react-file-viewer**: Multi-format file preview component
- **pdf.js**: PDF rendering and manipulation
- **sheetjs**: Excel file handling
- **@zip.js/zip.js**: ZIP file handling

### Camera Feed
- **video.js**: Video player with extensive format support
- **hls.js**: HLS streaming implementation
- **webrtc-adapter**: WebRTC compatibility layer
- **@ffmpeg/ffmpeg**: Client-side video processing (optional)

### AI Integration
- **openai**: Official OpenAI API client
- **react-speech-recognition**: Speech-to-text capabilities
- **langchain**: Framework for LLM applications
- **zod**: Runtime type validation for API requests

### Chatbot
- **botpress**: Chatbot framework
- **react-markdown**: Markdown rendering for bot messages
- **react-syntax-highlighter**: Code block formatting
- **i18next**: Internationalization framework

### Package Notification
- **twilio**: SMS notification service
- **@sendgrid/mail**: Email notification service
- **qrcode.react**: QR code generation
- **react-to-print**: PDF generation for package labels
- **@tanstack/react-table**: Data table for package management

## Architecture Considerations

When implementing these features, consider the following architectural guidelines to ensure scalability, maintainability, and performance.

### 1. Component Architecture

Follow these principles for component design:

- **Atomic Design Methodology**: Build from atoms to organisms to templates to pages
- **Container/Presentation Pattern**: Separate data handling from UI rendering
- **Custom Hooks**: Extract complex logic into reusable hooks
- **Context API Usage**: Use React Context for state that needs to be accessed by many components
- **Prop Drilling Avoidance**: Use composition or context to avoid excessive prop drilling

### 2. State Management

Choose the appropriate state management approach based on the scope:

- **Local Component State**: For UI state that doesn't need to be shared
- **React Context**: For theme, user preferences, and other app-wide state
- **Zustand**: For complex global state that requires fine-grained control
- **Server State with TanStack Query**: For data fetching, caching, and synchronization

### 3. Performance Optimization

Implement these strategies for optimal performance:

- **Code Splitting**: Use dynamic imports to split code by route
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Virtualization**: Implement windowing for long lists (messages, files)
- **Image Optimization**: Use Next.js Image component with proper sizing
- **Streaming Optimization**: Buffer video streams appropriately

### 4. Security Architecture

Follow these security best practices:

- **Authentication Flow**: Implement secure authentication with proper token handling
- **Authorization**: Use Row Level Security in Supabase for data access control
- **API Security**: Implement rate limiting and input validation
- **XSS Prevention**: Sanitize user input and AI-generated content
- **CSRF Protection**: Implement proper CSRF tokens for form submissions

## Troubleshooting Guide

This section provides solutions for common issues that may arise during development.

### Theme System Issues

#### Issue: Theme flickering on page load
**Solution**: Implement a theme detection script in the document head to set the theme before rendering:

```html
<script>
  // Inline script in _document.js
  (function() {
    try {
      const storedTheme = localStorage.getItem('theme');
      const theme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.add(theme);
    } catch (e) {
      console.error('Theme detection failed:', e);
    }
  })();
</script>
```

#### Issue: Components not respecting theme
**Solution**: Ensure all component styles use CSS variables or Tailwind dark mode classes:

```jsx
// Good practice
<div className="bg-white dark:bg-gray-800">

// Also good (using CSS variables)
<div style={{ backgroundColor: 'var(--background)' }}>
```

### Supabase Realtime Issues

#### Issue: Messages not appearing in real-time
**Solution**: 

1. Check that realtime is enabled for your tables in Supabase dashboard
2. Verify channel subscription:

```typescript
// Debug realtime connection
supabase
  .channel('debug')
  .on('system', { event: '*' }, (status) => {
    console.log('System status change:', status);
  })
  .subscribe((status) => {
    console.log('Subscription status:', status);
  });
```

3. Ensure your RLS policies allow access to the relevant rows

#### Issue: "Failed to create subscription"
**Solution**: 
1. Check your Supabase project's realtime configuration
2. Verify your JWT token is valid and not expired
3. Ensure you're not exceeding connection limits

### File Upload Issues

#### Issue: Large file uploads failing
**Solution**: Implement chunked uploads for files over 10MB:

```typescript
const chunkSize = 5 * 1024 * 1024; // 5MB chunks
const totalChunks = Math.ceil(file.size / chunkSize);

for (let i = 0; i < totalChunks; i++) {
  const start = i * chunkSize;
  const end = Math.min(file.size, start + chunkSize);
  const chunk = file.slice(start, end);
  
  await supabase.storage
    .from('files')
    .upload(`${filePath}_part_${i}`, chunk, {
      upsert: true
    });
}

// After all chunks uploaded, combine them on the server
await fetch('/api/files/combine-chunks', {
  method: 'POST',
  body: JSON.stringify({
    filePath,
    totalChunks,
    fileName: file.name
  })
});
```

### Camera Stream Issues

#### Issue: Video streams not loading
**Solution**: Check browser compatibility and implement fallbacks:

```typescript
const tryVideoLoad = async (videoElement, streamUrl) => {
  // Try HLS.js first
  if (Hls.isSupported()) {
    setupHlsStream(videoElement, streamUrl);
    return;
  }
  
  // Try native support
  if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    videoElement.src = streamUrl;
    return;
  }
  
  // Fall back to MJPEG stream if available
  if (mjpegStreamUrl) {
    setupMjpegStream(videoElement, mjpegStreamUrl);
    return;
  }
  
  // Show error and fallback to static image
  showStreamError(videoElement);
};
```

### OpenAI API Issues

#### Issue: API rate limiting
**Solution**: Implement retry logic with exponential backoff:

```typescript
const fetchWithRetry = async (url, options, retries = 3, backoff = 300) => {
  try {
    const response = await fetch(url, options);
    
    if (response.status === 429 && retries > 0) {
      console.warn(`Rate limited, retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Request failed, retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};
```

## Known Issues & Fixes

### Contact Form Submission Error

**Error Description:**
- Public users receive "Échec de l'envoi du formulaire" error when submitting the contact form
- Console error: `{code: '42501', details: null, hint: null, message: 'new row violates row-level security policy for table "contact_inquiries"'}`

**Root Cause:**
The contact_inquiries table has Row Level Security (RLS) enabled, but lacks the necessary policy to allow public (unauthenticated) users to insert new records.

**SQL Fix:**
```sql
-- Fix for contact form submission RLS policy
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Remove existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Public users can insert inquiries" ON contact_inquiries;

-- Create policy to allow public (unauthenticated) users to submit contact forms
CREATE POLICY "Public users can insert inquiries" 
ON contact_inquiries 
FOR INSERT 
TO public
WITH CHECK (true);
```

**Alternative Server-Side Solution:**
When using server actions with Supabase, bypass RLS by using the service role client for specific operations:

```typescript
// In your server action
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Use service role client to bypass RLS
const { data, error } = await supabaseAdmin.from('contact_inquiries').insert({
  // form data
});
```

**Verification Query:**
```sql
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'contact_inquiries';
```

### Implementation Verification Checklist

When implementing the new features, use this checklist to verify proper functionality:

#### Theme System
- [ ] Theme toggle changes appearance correctly
- [ ] System preference is detected on first load
- [ ] User preference persists across sessions
- [ ] All components render correctly in both themes
- [ ] No flickering occurs during page load or transitions

#### Messaging System
- [ ] Real-time messages appear for all participants
- [ ] File attachments can be uploaded and downloaded
- [ ] Read receipts work correctly
- [ ] Conversation list updates with unread indicators
- [ ] Message history loads correctly with pagination

#### File Storage
- [ ] Files can be uploaded, viewed, and deleted
- [ ] Folder navigation works intuitively
- [ ] File previews render correctly for supported types
- [ ] Permissions are enforced correctly
- [ ] Version history tracks document changes

#### Camera Integration
- [ ] Camera feeds load and display correctly
- [ ] Motion detection alerts are triggered appropriately
- [ ] Recording history can be browsed and played back
- [ ] Camera selection works correctly in grid view
- [ ] Stream authentication prevents unauthorized access

#### AI Features
- [ ] AI assistant responds appropriately to queries
- [ ] Document analysis extracts relevant information
- [ ] Conversation history is maintained
- [ ] Error states are handled gracefully
- [ ] Response quality meets expectations

#### Package Notification
- [ ] Packages can be logged by doorman role
- [ ] Notifications are sent via email/SMS
- [ ] Package history and status tracking work correctly
- [ ] Package pickup confirmation flow works
- [ ] Analytics show relevant metrics

## Relevant Documentation & Resources

### Technical Documentation
- [Lofts des Arts Project Documentation](../../README.md)
- [Session 1 Recap](../session-1-recap.md)
- [Design System Guidelines](../design/design-system.md)
- [API Documentation](../api/README.md)
- [Security Guidelines](../security/security-guidelines.md)
- [Resident Portal Future Planning](../roadmap/resident-portal.md)

### External Resources

#### Theme System
- [Next.js Theme Implementation](https://nextra.site/docs/guide/advanced/theming)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Variables for Theming](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

#### Messaging System
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [WebSockets in Next.js](https://nextjs.org/docs/api-routes/api-middlewares#connectsocket)
- [Building Chat Applications](https://supabase.com/blog/supabase-realtime-with-multiplayer-features)

#### File Storage System
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Sentinel Property Management System Documentation]
- [File Previewer Libraries](https://www.npmjs.com/package/react-file-viewer)
- [Hierarchical Data in PostgreSQL](https://www.postgresql.org/docs/current/ltree.html)

#### Camera Integration
- [Building Camera System API Documentation]
- [Video.js](https://videojs.com/guides/react/)
- [HLS.js for Live Streaming](https://github.com/video-dev/hls.js/)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)

#### AI Integration
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [GPT Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [React-Speech-Recognition](https://www.npmjs.com/package/react-speech-recognition)
- [AI Safety Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)

#### Chatbot
- [Botpress](https://botpress.com/)
- [Rasa Open Source](https://rasa.com/docs/rasa/)
- [Chatbot UI Design Best Practices](https://www.smashingmagazine.com/2022/05/chatbot-design-ultimate-guide/)
- [Chatbot Accessibility Guidelines](https://www.w3.org/WAI/APA/task-forces/research-questions/wiki/Bots_and_Intelligent_Personal_Assistant_APIs)

#### Package Notification
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [SendGrid Email API](https://docs.sendgrid.com/api-reference)
- [QR Code Generation](https://www.npmjs.com/package/qrcode.react)
- [Delivery Management Best Practices](https://www.buildinglink.com/public/FreeRobots/BuildingLink-Delivery-Management-Best-Practices.pdf) 