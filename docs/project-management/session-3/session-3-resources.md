# Session 3 Resources - Messaging & Package Management

This document provides resources, references, and implementation guides for Session 3 development tasks.

## Supabase Resources

### Realtime Features
- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [Realtime Multiplayer Tutorial](https://supabase.com/docs/guides/realtime/multiplayer)
- [Supabase Realtime with React](https://supabase.com/docs/guides/realtime/react)
- [Row Level Security for Realtime](https://supabase.com/docs/guides/auth/row-level-security)

### Database Schema Examples
- [Messages Schema Design](https://github.com/supabase/supabase/tree/master/examples/slack-clone)
- [User Relationships Schema](https://supabase.com/docs/guides/auth/managing-user-data#user-relationships)
- [Supabase Functions](https://supabase.com/docs/guides/functions)
- [Database Triggers](https://supabase.com/docs/guides/database/triggers)

## Libraries & Components

### Messaging UI Components
- [ChatUI Kit for React](https://chatscope.io/chat-ui-kit-react/)
- [TanStack Virtual for Message Lists](https://tanstack.com/virtual/latest)
- [React Message Components](https://github.com/chatscope/chat-ui-kit-react)
- [Message Composition UI Examples](https://www.figma.com/community/file/1111346534604431890/chat-messaging-ui-kit)

### File Handling
- [File Upload Components](https://react-dropzone.js.org/)
- [Image Optimization in Next.js](https://nextjs.org/docs/api-reference/next/image)
- [File Preview Components](https://github.com/nmn/react-file-previewer)
- [Browser-based Image Compression](https://github.com/Donaldcwl/browser-image-compression)

### QR Code Generation
- [QR Code React](https://github.com/zpao/qrcode.react)
- [React QR Reader for Scanning](https://github.com/JodusNodus/react-qr-reader)
- [Next.js QR Code Generation Examples](https://github.com/vercel/next.js/tree/canary/examples/with-qrcode)
- [QR Code Styling Options](https://github.com/kozakdenys/qr-code-styling)

### Notification Components
- [React Hot Toast](https://react-hot-toast.com/)
- [React Notification Badge](https://github.com/joshwcomeau/react-fancy-badge)
- [Notification Sounds with Howler.js](https://howlerjs.com/)
- [Push Notifications in Next.js](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

## Design Patterns & Architecture

### Messaging System Architecture
- [Real-time Chat Architecture](https://www.cometchat.com/tutorials/build-chat-app-reactjs-firebase)
- [Unread Message Indicator Pattern](https://slack.engineering/building-hybrid-applications-with-electron/)
- [Message Threading Models](https://dev.to/mesadhan/real-time-chat-app-architecture-e3m)
- [Conversation History Loading Patterns](https://leerob.io/blog/postgres-supabase-nextjs-building-modern-applications)

### State Management
- [Zustand for Global State](https://github.com/pmndrs/zustand)
- [TanStack Query for Data Fetching](https://tanstack.com/query/latest)
- [WebSocket Connection Management](https://socket.io/get-started/chat)
- [Managing WebSocket Reconnection](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)

### Package Tracking System
- [Status Tracking State Machine](https://xstate.js.org/docs/guides/introduction-to-state-machines-and-statecharts)
- [Package Delivery Status Flow](https://www.ups.com/us/en/help-center/tracking-support.page)
- [Event-based Status Updates](https://medium.com/event-driven-utopia/a-practical-introduction-to-event-driven-architecture-for-package-delivery-systems-5a8b8a3ae0a0)
- [QR Code-based Tracking Systems](https://blog.beaconstac.com/2022/05/qr-code-package-tracking/)

## UI/UX Resources

### Design Systems
- [Chat UI Design Systems](https://www.figma.com/community/file/1159088506896474311/chat-ui-kit)
- [Notification Pattern Libraries](https://uxdesign.cc/designing-for-notifications-dc1dbc4644a8)
- [Mobile Input Patterns](https://mobbin.com/browse/ios/patterns/chat-input)
- [Message Thread Visualization](https://www.saashub.com/compare-thread-vs-slack)

### Accessibility Guidelines
- [WCAG for Real-time Communications](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Notification Accessibility Best Practices](https://web.dev/articles/push-notifications-accessibility)
- [Mobile Form Accessibility](https://www.smashingmagazine.com/2018/01/mobile-form-accessibility/)
- [Keyboard Navigation for Complex UI](https://webaim.org/techniques/keyboard/)

## Testing Resources

### Real-time Testing
- [Testing WebSockets in Jest](https://jestjs.io/docs/testing-web-frameworks)
- [Mocking Supabase Realtime in Tests](https://github.com/supabase/supabase-js/blob/master/test/helpers.ts)
- [Integration Testing with Cypress](https://docs.cypress.io/guides/component-testing/react/overview)
- [E2E Testing Real-time Features](https://playwright.dev/docs/intro)

### Performance Testing
- [React Performance Profiler](https://reactjs.org/docs/profiler.html)
- [Measuring WebSocket Performance](https://blog.logrocket.com/websocket-performance-optimization/)
- [Lighthouse CI for Performance Monitoring](https://github.com/GoogleChrome/lighthouse-ci)
- [Next.js Analytics](https://nextjs.org/analytics)

## Code Examples

### Supabase Realtime Subscription
```typescript
// Example of subscribing to realtime updates in a conversation
const setupMessagesSubscription = async (conversationId: string) => {
  const subscription = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        // Handle new message
        addMessageToState(payload.new);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};
```

### QR Code Generation
```tsx
import QRCode from 'qrcode.react';

const PackageQRCode = ({ packageId, size = 128 }) => {
  const qrValue = `${window.location.origin}/packages/scan/${packageId}`;
  
  return (
    <div className="qr-container">
      <QRCode 
        value={qrValue}
        size={size}
        level="H" // High error correction
        includeMargin={true}
        renderAs="svg"
      />
      <div className="package-id">{packageId}</div>
    </div>
  );
};
```

### Toast Notification Example
```tsx
import { useToast } from '@/components/ui/use-toast';

const MessageNotification = () => {
  const { toast } = useToast();
  
  const notifyNewMessage = (sender, message) => {
    toast({
      title: `New message from ${sender}`,
      description: message.length > 50 ? message.substring(0, 50) + '...' : message,
      action: <ToastAction altText="View">View</ToastAction>,
      duration: 5000,
    });
  };
  
  return (
    // Component JSX
  );
};
```

## Additional Resources

### Project Management
- [Agile User Stories for Messaging Features](https://www.mountaingoatsoftware.com/agile/user-stories)
- [QA Checklist for Real-time Features](https://abstracta.us/blog/software-testing/checklist-web-app-performance-tests)
- [Accessibility Testing Workflow](https://www.deque.com/blog/accessibility-testing-in-agile-methodologies/)

### Security Considerations
- [WebSocket Security Best Practices](https://www.wallarm.com/what/websocket-security-vulnerabilities)
- [File Upload Security](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Supabase RLS Testing](https://supabase.com/docs/guides/auth/row-level-security#testing-rls-policies)
- [Message Content Security](https://owasp.org/www-community/vulnerabilities/Insufficient_Session_Expiration) 