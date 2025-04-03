# Session 2 Resources

This document provides key resources, project structures, and references for the Session 2 development focused on admin features enhancement.

## Project Structure

### Updated Admin Components Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── ClientAdminLayout.tsx
│   │   ├── AdminNav.tsx
│   │   ├── UserAvatar.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── WelcomeMessage.tsx
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── theme-utils.ts
│   │   ├── messaging/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── FileAttachment.tsx
│   │   │   └── NotificationBadge.tsx
│   │   ├── files/
│   │   │   ├── FileExplorer.tsx
│   │   │   ├── FolderView.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── FilePreview.tsx
│   │   │   └── FilePermissions.tsx
│   │   ├── cameras/
│   │   │   ├── CameraGrid.tsx
│   │   │   ├── CameraFeed.tsx
│   │   │   ├── RecordingsArchive.tsx
│   │   │   └── MotionAlerts.tsx
│   │   ├── ai/
│   │   │   ├── GPTAssistant.tsx
│   │   │   ├── DocumentAnalyzer.tsx
│   │   │   ├── MeetingTranscription.tsx
│   │   │   └── AIResponseFeedback.tsx
│   │   ├── chatbot/
│   │   │   ├── ChatbotWidget.tsx
│   │   │   ├── ChatbotConfiguration.tsx
│   │   │   └── ChatbotAnalytics.tsx
│   │   └── packages/
│   │       ├── PackageLogger.tsx
│   │       ├── ResidentNotifier.tsx
│   │       ├── PackageHistory.tsx
│   │       └── PackageAnalytics.tsx
│   └── common/
│       ├── ui/
│       └── icons/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── messaging/
│   │   │   ├── page.tsx
│   │   │   └── [conversationId]/page.tsx
│   │   ├── files/
│   │   │   ├── page.tsx
│   │   │   └── [folderId]/page.tsx
│   │   ├── cameras/
│   │   │   ├── page.tsx
│   │   │   └── [cameraId]/page.tsx
│   │   ├── ai-assistant/
│   │   │   └── page.tsx
│   │   ├── chatbot/
│   │   │   └── page.tsx
│   │   └── packages/
│   │       └── page.tsx
│   └── api/
│       ├── messaging/
│       ├── files/
│       ├── cameras/
│       ├── ai/
│       ├── chatbot/
│       └── packages/
└── lib/
    ├── auth.tsx
    ├── supabase.ts
    ├── helpers.ts
    ├── store.ts
    ├── theme-provider.tsx
    ├── ai-provider.ts
    ├── cameras.ts
    └── notifications.ts
```

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

## Key Resources & Documentation

### Theme System

- [Next.js Theme Implementation](https://nextra.site/docs/guide/advanced/theming)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Variables for Theming](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Messaging System

- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [WebSockets in Next.js](https://nextjs.org/docs/api-routes/api-middlewares#connectsocket)
- [Building Chat Applications](https://supabase.com/blog/supabase-realtime-with-multiplayer-features)

### File Storage System

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Sentinel Property Management System Documentation]
- [File Previewer Libraries](https://www.npmjs.com/package/react-file-viewer)
- [Hierarchical Data in PostgreSQL](https://www.postgresql.org/docs/current/ltree.html)

### Camera Integration

- [Building Camera System API Documentation]
- [Video.js](https://videojs.com/guides/react/)
- [HLS.js for Live Streaming](https://github.com/video-dev/hls.js/)
- [WebRTC Documentation](https://webrtc.org/getting-started/overview)

### AI Integration

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [GPT Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [React-Speech-Recognition](https://www.npmjs.com/package/react-speech-recognition)
- [AI Safety Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)

### Chatbot

- [Botpress](https://botpress.com/)
- [Rasa Open Source](https://rasa.com/docs/rasa/)
- [Chatbot UI Design Best Practices](https://www.smashingmagazine.com/2022/05/chatbot-design-ultimate-guide/)
- [Chatbot Accessibility Guidelines](https://www.w3.org/WAI/APA/task-forces/research-questions/wiki/Bots_and_Intelligent_Personal_Assistant_APIs)

### Package Notification

- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [SendGrid Email API](https://docs.sendgrid.com/api-reference)
- [QR Code Generation](https://www.npmjs.com/package/qrcode.react)
- [Delivery Management Best Practices](https://www.buildinglink.com/public/FreeRobots/BuildingLink-Delivery-Management-Best-Practices.pdf)

## Development Tools & Libraries

- **Theme System**: 
  - next-themes
  - tailwindcss
  - clsx

- **Messaging System**:
  - supabase realtime
  - emoji-mart
  - react-textarea-autosize

- **File Storage**:
  - react-dropzone
  - react-file-viewer
  - pdf.js
  - sheetjs

- **Camera Feed**:
  - video.js
  - hls.js
  - webrtc-adapter

- **AI Integration**:
  - openai
  - react-speech-recognition
  - langchain

- **Chatbot**:
  - botpress
  - react-markdown
  - react-syntax-highlighter

- **Package Notification**:
  - twilio
  - sendgrid
  - qrcode.react
  - react-to-print

## Environment Setup Requirements

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Camera System
CAMERA_API_URL=your-camera-api-url
CAMERA_API_KEY=your-camera-api-key

# SMS Notifications
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email Notifications
SENDGRID_API_KEY=your-sendgrid-api-key
NOTIFICATION_EMAIL=notifications@loftsdesarts.ca
```

## Relevant Documentation

- [Lofts des Arts Project Documentation](../../README.md)
- [Session 1 Recap](../session-1-recap.md)
- [Design System Guidelines](../design/design-system.md)
- [API Documentation](../api/README.md)
- [Security Guidelines](../security/security-guidelines.md)
- [Resident Portal Future Planning](../roadmap/resident-portal.md)

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