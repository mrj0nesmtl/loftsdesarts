# Session 4 Development Resources

**Date:** April 5, 2025  
**Time:** 6:00 PM - 11:00 PM EDT  
**Focus:** Completing Phase 2 and preparing for Phase 3

This document compiles all necessary resources, documentation, and references for Session 4 development tasks.

## Project References

- [Project ROADMAP](../ROADMAP.md)
- [Current Project STATUS](../STATUS.md)
- [Project Architecture Documentation](../architecture/architecture.md)
- [Component Library Documentation](../components/components.md)
- [Design System Guidelines](../design/design.md)
- [Database Schema Documentation](../database/database-schema.md)
- [API Documentation](../api/api.md)
- [User Guides Directory](../user-guides/README.md)

## Technical Documentation

### Messaging System

- [Messaging System Overview](../database/messaging-system.md)
- [Messaging Database Schema](../database/messaging-database-schema.md)
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [TanStack Query Guide for WebSockets](https://tanstack.com/query/latest/docs/react/guides/subscriptions)
- [React Hook Form Documentation](https://react-hook-form.com/get-started)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Package Management

- [Package Management System Overview](../database/package-system.md)
- [Package Management Database Schema](../database/package-database-schema.md)
- [QR Code Generation Libraries](https://github.com/wojtekmaj/react-qr-code)
- [QR Code Scanner Documentation](https://github.com/nimiq/qr-scanner)
- [PDF Generation Documentation](https://react-pdf.org/)
- [Date/Time Formatting with Day.js](https://day.js.org/docs/en/display/format)

### UI Components

- [Shadcn/ui Component Library](https://ui.shadcn.com/docs)
- [Component Architecture Overview](../components/architecture.md)
- [Form Component Documentation](../components/forms.md)
- [Dialog Component Documentation](../components/dialogs.md)
- [Table Component Documentation](../components/tables.md)
- [Card Component Documentation](../components/cards.md)
- [Component Best Practices](../components/best-practices.md)

## Design Assets

- [Figma Design System](https://www.figma.com/file/loftsdesarts-design-system)
- [UI Component Mockups](https://www.figma.com/file/loftsdesarts-components)
- [Color Palette Reference](../design/color-palette.md)
- [Typography Guidelines](../design/typography.md)
- [Icon Library](../design/icons.md)
- [Responsive Design Guidelines](../design/responsive.md)
- [Accessibility Standards](../design/accessibility.md)

## Development Tools

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/get-started)
- [Zod Schema Validation](https://github.com/colinhacks/zod)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Recharts Documentation](https://recharts.org/en-US/)
- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)

## Testing Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Accessibility Testing Tools](https://www.w3.org/WAI/test-evaluate/)
- [Lighthouse Performance Testing](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

## Code Snippets and Examples

### Supabase Realtime Subscription

```typescript
import { useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQueryClient } from '@tanstack/react-query'

export function useMessagingSubscription(conversationId: string) {
  const supabase = useSupabaseClient()
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          queryClient.invalidateQueries(['conversation', conversationId])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase, queryClient])
}
```

### QR Code Generation

```typescript
import { QRCodeSVG } from 'qrcode.react'

export default function PackageQRCode({ packageId }: { packageId: string }) {
  const qrValue = `https://loftsdesarts.replit.app/packages/verify/${packageId}`
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <QRCodeSVG 
        value={qrValue}
        size={200}
        level="H" // High error correction
        includeMargin={true}
      />
      <p className="text-center mt-2 text-sm font-mono">{packageId}</p>
    </div>
  )
}
```

### Date Formatting Utility

```typescript
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export function formatMessageTime(timestamp: string): string {
  const date = dayjs(timestamp)
  const now = dayjs()
  
  if (now.diff(date, 'day') < 1) {
    return date.format('LT') // 8:30 PM
  } else if (now.diff(date, 'day') < 7) {
    return date.format('ddd LT') // Mon 8:30 PM
  } else {
    return date.format('MMM D, YYYY') // Jan 1, 2023
  }
}

export function formatRelativeTime(timestamp: string): string {
  return dayjs(timestamp).fromNow() // 5 minutes ago, 2 hours ago, etc.
}
```

## API Endpoints Reference

### Messaging API

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/conversations` | GET | List all conversations for current user | `limit`, `offset`, `status` |
| `/api/conversations/:id` | GET | Get single conversation by ID | - |
| `/api/conversations` | POST | Create new conversation | `title`, `participants`, `initialMessage` |
| `/api/conversations/:id/messages` | GET | Get messages for a conversation | `limit`, `offset` |
| `/api/conversations/:id/messages` | POST | Send a new message | `content`, `attachments` |
| `/api/conversations/:id/read` | POST | Mark conversation as read | - |

### Package Management API

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/packages` | GET | List all packages | `limit`, `offset`, `status`, `residentId` |
| `/api/packages` | POST | Register new package | `trackingNumber`, `carrier`, `residentId`, `size`, `location` |
| `/api/packages/:id` | GET | Get package details | - |
| `/api/packages/:id` | PATCH | Update package status | `status`, `notes` |
| `/api/packages/:id/notify` | POST | Send notification for package | `method` (email, sms, app) |
| `/api/packages/:id/qrcode` | GET | Generate QR code for package | `size`, `format` (svg, png) |
| `/api/packages/verify/:code` | POST | Verify package pickup | `signature` |

## Deployment Information

- **Development Environment**: [https://loftsdesarts.replit.app](https://loftsdesarts.replit.app)
- **GitHub Repository**: [https://github.com/mrjones/loftsdesarts](https://github.com/mrjones/loftsdesarts)
- **Supabase Project**: [https://vhoawwviyezabrfpjtzv.supabase.co](https://vhoawwviyezabrfpjtzv.supabase.co)
- **Replit Dashboard**: [https://replit.com/~/loftsdesarts](https://replit.com/~/loftsdesarts)

## Meeting Agenda

1. Review of progress and current deployment (15 minutes)
2. Discussion of messaging system interface requirements (30 minutes)
3. Discussion of package management system requirements (30 minutes)
4. Break (15 minutes)
5. Development work on prioritized tasks (3.5 hours)
6. Testing and documentation (45 minutes)
7. Session wrap-up and next steps (15 minutes)

## Support Contacts

- **Technical Support**: tech@loftsdesarts.com
- **Design Team**: design@loftsdesarts.com
- **Project Manager**: pm@loftsdesarts.com
- **Supabase Support**: https://supabase.com/support
- **Next.js Community**: https://nextjs.org/discord 