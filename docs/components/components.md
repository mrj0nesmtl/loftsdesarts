# Components Documentation

This directory contains comprehensive documentation for all React components used in the Lofts des Arts platform, including usage guidelines, props, and examples.

*Last Updated: April 6, 2025 | Version: 0.4.0*

## Directory Structure

- `/layout/` - Layout component documentation
- `/ui/` - UI component documentation
- `/forms/` - Form component documentation
- `/admin/` - Admin-specific component documentation
- `/messaging/` - Messaging system components
- `/packages/` - Package management components
- `/auth/` - Authentication and RBAC components
- `/patterns/` - Component pattern documentation
- `/examples/` - Example component usage
- `/theme/` - Theme system components

## Component Overview

The Lofts des Arts platform uses a modular component architecture based on:

- **Shadcn/UI**: Core UI components built on Radix UI primitives
- **Custom Components**: Domain-specific components built for the platform
- **Layout Components**: Page structure and responsive layout components
- **Form Components**: Input, validation, and form handling components
- **Admin Components**: Components for the administrative interface
- **Messaging Components**: Real-time communication components
- **Package Components**: Package tracking and management components
- **Permission Components**: Role-based access control components
- **Theme Components**: Theme management with admin-only controls

## Component Categories

### Layout Components

Layout components define the overall structure of pages and sections:

- `Header`: Site-wide header with navigation
- `Footer`: Site-wide footer with links and information
- `PageLayout`: Standard page layout wrapper
- `AdminLayout`: Admin dashboard layout
- `ResidentLayout`: Resident portal layout
- `Section`: Content section with standard padding and structure

[View Layout Components](./layout/README.md)

### UI Components

UI components are the building blocks of the interface:

- `Button`: Action triggers in various styles
- `Card`: Content containers with theme-aware backgrounds
- `Modal`: Dialog overlays
- `Tabs`: Tabbed interface sections
- `Accordion`: Collapsible content sections
- `Carousel`: Image and content sliders
- `Alert`: User notifications
- `Avatar`: User profile images
- `ThemeToggle`: Admin-only theme switching button with appropriate icons for light/dark modes
- `Badge`: Status indicators and labels
- `QRCode`: QR code generation for package tracking
- `Scanner`: QR code scanning component

[View UI Components](./ui/README.md)

### Theme Components

Theme components manage the site-wide theming system:

- `ThemeProvider`: Context provider for theme state management
- `ThemeToggle`: Admin-only toggle button for switching themes
- `ThemeTransition`: Wrapper component for smooth theme transitions
- `useTheme`: Custom hook for consuming theme context in components
- `AdminThemeSettings`: Admin panel for theme configuration
- `ThemeAwareCard`: Card component with theme-aware styling

#### ThemeProvider Usage

```tsx
// In layout.tsx
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

#### ThemeToggle Usage

```tsx
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  
  return (
    <header>
      <nav>
        {/* Navigation items */}
      </nav>
      {isAdmin && <ThemeToggle />}
    </header>
  );
}
```

#### useTheme Hook Usage

```tsx
import { useTheme } from "@/lib/theme-provider";

export function ThemeAwareComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="theme-transition">
      <p className="text-primary">Current theme: {theme}</p>
      <button 
        onClick={toggleTheme}
        className="bg-card text-muted-foreground px-4 py-2 rounded"
      >
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </button>
    </div>
  );
}
```

#### Theme-Aware Component Example

```tsx
// A card component using theme-aware classes
export function ThemeAwareCard({ children, title }) {
  return (
    <div className="bg-card rounded-lg shadow-md p-6 theme-transition">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
```

### Form Components

Form components handle user input and validation:

- `Input`: Text input fields
- `Select`: Dropdown selection fields
- `Checkbox`: Boolean input fields
- `RadioGroup`: Option selection
- `Switch`: Toggle controls
- `DatePicker`: Date selection
- `FileUpload`: File upload controls
- `Form`: Form wrapper with validation
- `SearchInput`: Search field with autocomplete
- `AddressInput`: Address input with formatting
- `PhoneInput`: Phone number input with formatting

[View Form Components](./forms/README.md)

### Admin Components

Admin components are specific to the administrative interface:

- `AdminNav`: Admin navigation sidebar
- `DataTable`: Interactive data tables
- `StatusBadge`: Status indicators
- `UserAvatar`: User profile displays
- `NotificationCenter`: Admin notifications
- `ActionMenu`: Contextual action menus
- `RoleManager`: Role assignment interface
- `PermissionManager`: Permission management interface
- `AuditLog`: Activity logging display
- `AdminThemeToggle`: Admin-only theme toggle component

[View Admin Components](./admin/README.md)

### Messaging Components

Messaging components handle real-time communication:

- `ConversationList`: List of user conversations
- `ConversationItem`: Individual conversation preview
- `MessageThread`: Thread of messages in a conversation
- `MessageBubble`: Individual message display
- `MessageComposer`: Message input and sending interface
- `AttachmentUploader`: File attachment component
- `ReadReceipt`: Message read status indicator
- `ParticipantList`: Conversation participant display
- `NotificationBadge`: Unread message indicator

#### ConversationList Usage

```tsx
import { ConversationList } from "@/components/messaging/ConversationList";

export function MessagingPage() {
  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <ConversationList 
          onSelectConversation={handleSelectConversation}
          selectedId={selectedConversationId}
        />
      </div>
      <div className="w-2/3">
        {selectedConversationId ? (
          <MessageThread conversationId={selectedConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### MessageComposer Usage

```tsx
import { MessageComposer } from "@/components/messaging/MessageComposer";

export function ConversationView({ conversationId }) {
  const handleSendMessage = async (content, attachments) => {
    // Send message logic
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Message thread */}
      </div>
      <MessageComposer 
        onSendMessage={handleSendMessage}
        conversationId={conversationId}
        placeholder="Type a message..."
        allowAttachments
        maxAttachments={5}
      />
    </div>
  );
}
```

[View Messaging Components](./messaging/README.md)

### Package Management Components

Package management components handle package tracking and notifications:

- `PackageList`: List of packages with filtering
- `PackageDetail`: Detailed package information
- `PackageForm`: Package logging interface
- `PackageHistory`: Package status history timeline
- `QRCodeGenerator`: Package QR code creation
- `QRCodeScanner`: Package verification scanner
- `CarrierSelect`: Shipping carrier selection
- `NotificationSettings`: Delivery notification preferences
- `StatusUpdater`: Package status update interface

#### PackageList Usage

```tsx
import { PackageList } from "@/components/packages/PackageList";

export function PackagesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Package Tracking</h1>
      <PackageList 
        filterStatus={["RECEIVED", "NOTIFIED"]}
        onSelectPackage={handleSelectPackage}
        onStatusChange={handleStatusChange}
        sortBy="received_at"
        sortDirection="desc"
      />
    </div>
  );
}
```

#### PackageForm Usage

```tsx
import { PackageForm } from "@/components/packages/PackageForm";

export function LogPackagePage() {
  const handleSubmit = async (data) => {
    // Submit package data
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Log New Package</h1>
      <PackageForm 
        onSubmit={handleSubmit}
        carriers={carriers}
        residents={residents}
      />
    </div>
  );
}
```

[View Package Management Components](./packages/README.md)

### Permission Components

Permission-based components handle access control:

- `PermissionGuard`: Component wrapper that renders based on permissions
- `RoleGuard`: Component wrapper that renders based on user roles
- `RoleBadge`: Display for user roles
- `PermissionIndicator`: Visual indicator for permission status
- `RoleSelector`: Role assignment dropdown
- `PermissionSelector`: Permission assignment interface

#### PermissionGuard Usage

```tsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";

export function DocumentActions({ documentId }) {
  return (
    <div className="flex space-x-2">
      <PermissionGuard permission="documents:read">
        <Button variant="outline" onClick={() => viewDocument(documentId)}>
          View
        </Button>
      </PermissionGuard>
      
      <PermissionGuard permission="documents:update">
        <Button variant="outline" onClick={() => editDocument(documentId)}>
          Edit
        </Button>
      </PermissionGuard>
      
      <PermissionGuard permission="documents:delete">
        <Button variant="destructive" onClick={() => deleteDocument(documentId)}>
          Delete
        </Button>
      </PermissionGuard>
    </div>
  );
}
```

#### RoleGuard Usage

```tsx
import { RoleGuard } from "@/components/auth/RoleGuard";

export function AdminSection() {
  return (
    <RoleGuard
      roles={["ADMIN", "MANAGER"]}
      fallback={<AccessDeniedMessage />}
    >
      <div className="admin-dashboard">
        {/* Admin content only visible to ADMIN and MANAGER roles */}
        <h1>Admin Dashboard</h1>
        <AnalyticsDashboard />
      </div>
    </RoleGuard>
  );
}
```

[View Permission Components](./auth/README.md)

## Component Usage

Each component in the system follows consistent usage patterns:

### Basic Import Pattern

```tsx
import { ComponentName } from "@/components/path/ComponentName";
```

### Usage Example

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

## Component Props

Component props are documented using TypeScript interfaces. Example:

```tsx
interface ButtonProps {
  /** The button's visual style */
  variant: "primary" | "secondary" | "outline" | "ghost";
  /** The button's size */
  size: "sm" | "md" | "lg";
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Button content */
  children: React.ReactNode;
}
```

## Component Structure

Components follow a consistent file structure:

```
ComponentName/
├── index.ts       # Export file
├── ComponentName.tsx  # Main component
├── ComponentName.test.tsx  # Unit tests
└── ComponentName.stories.tsx  # Storybook stories (future)
```

## Styling Approach

Components use Tailwind CSS for styling with consistent patterns:

- Utility-first approach
- CSS variables for theming
- Theme-aware class naming
- Responsive design with mobile-first approach
- Accessibility considerations built-in
- Smooth transitions between themes

### Theme-Aware Class Structure

Components follow a theme-aware class structure for consistent styling across themes:

```tsx
// Theme-aware class naming pattern
<div className="bg-card text-card-foreground p-6 rounded-lg theme-transition">
  <h2 className="text-2xl font-bold">Card Title</h2>
  <p className="text-muted-foreground mt-2">Card description text that adapts to theme.</p>
  <div className="bg-muted p-4 mt-4 rounded">
    <p>This is a muted background section that works in both themes.</p>
  </div>
</div>
```

Key theme-aware classes include:
- `bg-background`: Page background
- `bg-card`: Card and container backgrounds
- `bg-muted`: Secondary or muted backgrounds
- `text-primary`: Primary text content
- `text-muted-foreground`: Secondary or less important text
- `border-border`: Border elements
- `theme-transition`: Applied to elements that should transition smoothly

## Component Composition

Components are designed for composition, allowing complex UIs to be built from simple parts:

```tsx
<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card description text</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

## Real-time Component Patterns

Components that deal with real-time data follow these patterns:

- Optimistic UI updates for immediate feedback
- WebSocket subscriptions for live data
- Loading states and fallbacks
- Error handling and recovery
- Cache synchronization with TanStack Query

Example of optimistic updates pattern:

```tsx
// In MessageComposer component
const sendMessage = async (content) => {
  // Generate temporary ID for optimistic update
  const tempId = `temp-${Date.now()}`;
  
  // Add message to UI immediately
  queryClient.setQueryData(['messages', conversationId], old => ({
    ...old,
    messages: [...old.messages, {
      id: tempId,
      content,
      status: 'sending',
      created_at: new Date().toISOString(),
      sender_id: currentUserId
    }]
  }));
  
  try {
    // Actually send message to server
    const { data } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      content,
      sender_id: currentUserId
    }).select().single();
    
    // Update with real data from server
    queryClient.setQueryData(['messages', conversationId], old => ({
      ...old,
      messages: old.messages.map(msg => 
        msg.id === tempId ? data : msg
      )
    }));
  } catch (error) {
    // Handle error - mark message as failed
    queryClient.setQueryData(['messages', conversationId], old => ({
      ...old,
      messages: old.messages.map(msg => 
        msg.id === tempId ? {...msg, status: 'failed'} : msg
      )
    }));
  }
};
```

## Permission-Based Rendering Patterns

Components use these patterns for permission-based UI rendering:

### Hook-based Permission Check

```tsx
// Custom permission hook
function AdminAction() {
  const hasPermission = useHasPermission('users:manage');
  
  if (!hasPermission) {
    return null;
  }
  
  return (
    <Button onClick={handleAdminAction}>
      Admin Action
    </Button>
  );
}
```

### Higher-Order Component Pattern

```tsx
// HOC for permission checking
const withPermission = (permission, Component) => {
  return function PermissionCheckedComponent(props) {
    const hasPermission = useHasPermission(permission);
    
    if (!hasPermission) {
      return null;
    }
    
    return <Component {...props} />;
  };
};

const AdminButton = withPermission('admin:access', Button);
```

## QR Code Component Patterns

QR code components follow these implementation patterns:

### QR Generation

```tsx
import QRCode from 'qrcode.react';

function PackageQRCode({ packageId }) {
  const qrValue = `${window.location.origin}/packages/verify/${packageId}`;
  
  return (
    <div className="qr-container p-4 bg-white rounded-lg shadow">
      <QRCode 
        value={qrValue}
        size={200}
        level="H" // High error correction
        renderAs="svg"
        includeMargin={true}
      />
      <p className="text-center mt-2 text-sm text-gray-600">
        Scan to verify package
      </p>
    </div>
  );
}
```

### QR Scanning

```tsx
import { QrReader } from 'react-qr-reader';

function PackageVerificationScanner({ onScan }) {
  const [scanResult, setScanResult] = useState(null);
  
  const handleScan = (result) => {
    if (result) {
      setScanResult(result);
      onScan(result);
    }
  };
  
  return (
    <div className="scanner-container">
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={handleScan}
        containerStyle={{ width: '100%', maxWidth: '300px' }}
        videoStyle={{ width: '100%' }}
      />
      {scanResult && (
        <div className="scan-result mt-4 p-2 bg-green-100 text-green-800 rounded">
          Package verified: {scanResult}
        </div>
      )}
    </div>
  );
}
```

## Accessibility

All components are built with accessibility in mind:

- ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance
- Motion preferences respect
- WCAG 2.1 AA compliance
- Role-specific announcements for screen readers

## State Management

Components handle state in the following ways:

- Local state with React useState
- Form state with react-hook-form
- Global state with Zustand where needed
- Context providers for shared state
- TanStack Query for server state
- Optimistic updates for real-time operations

## Custom Hooks

Many components use custom hooks for behavior:

- `useMediaQuery`: Responsive behavior
- `useDebounce`: Performance optimization
- `useFocusTrap`: Accessibility enhancement
- `useLocalStorage`: Persistent settings
- `usePermission`: Permission checking
- `useRole`: User role checking
- `useConversation`: Messaging state management
- `usePackage`: Package data management
- `useRealtime`: WebSocket subscription management

## Testing

Components are tested using:

- Jest for unit testing
- React Testing Library for component testing
- Storybook for visual testing (future)
- Mock Service Worker for API mocking
- Playwright for end-to-end testing

## Performance Considerations

Components are optimized for performance:

- Code splitting
- Memoization where beneficial
- Virtualization for long lists
- Lazy loading where appropriate
- Bundle size monitoring
- React.memo for expensive renders
- Web Worker delegation for heavy computations
- Adaptive loading based on device capabilities 