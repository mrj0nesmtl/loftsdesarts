# Components Documentation

This directory contains comprehensive documentation for all React components used in the Lofts des Arts platform, including usage guidelines, props, and examples.

## Directory Structure

- `/layout/` - Layout component documentation
- `/ui/` - UI component documentation
- `/forms/` - Form component documentation
- `/admin/` - Admin-specific component documentation
- `/patterns/` - Component pattern documentation
- `/examples/` - Example component usage

## Component Overview

The Lofts des Arts platform uses a modular component architecture based on:

- **Shadcn/UI**: Core UI components built on Radix UI primitives
- **Custom Components**: Domain-specific components built for the platform
- **Layout Components**: Page structure and responsive layout components
- **Form Components**: Input, validation, and form handling components
- **Admin Components**: Components for the administrative interface

## Component Categories

### Layout Components

Layout components define the overall structure of pages and sections:

- `Header`: Site-wide header with navigation
- `Footer`: Site-wide footer with links and information
- `PageLayout`: Standard page layout wrapper
- `AdminLayout`: Admin dashboard layout
- `Section`: Content section with standard padding and structure

[View Layout Components](./layout/README.md)

### UI Components

UI components are the building blocks of the interface:

- `Button`: Action triggers in various styles
- `Card`: Content containers
- `Modal`: Dialog overlays
- `Tabs`: Tabbed interface sections
- `Accordion`: Collapsible content sections
- `Carousel`: Image and content sliders
- `Alert`: User notifications
- `Avatar`: User profile images
- `ThemeToggle`: Theme switching button with appropriate icons for light/dark modes

[View UI Components](./ui/README.md)

### Theme Components

Theme components manage the site-wide theming system:

- `ThemeProvider`: Context provider for theme state management
- `ThemeToggle`: User-facing toggle button for switching themes
- `useTheme`: Custom hook for consuming theme context in components

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

export function Header() {
  return (
    <header>
      <nav>
        {/* Navigation items */}
      </nav>
      <ThemeToggle />
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
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </button>
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

[View Form Components](./forms/README.md)

### Admin Components

Admin components are specific to the administrative interface:

- `AdminNav`: Admin navigation sidebar
- `DataTable`: Interactive data tables
- `StatusBadge`: Status indicators
- `UserAvatar`: User profile displays
- `NotificationCenter`: Admin notifications
- `ActionMenu`: Contextual action menus

[View Admin Components](./admin/README.md)

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
- Responsive design with mobile-first approach
- Accessibility considerations built-in

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

## Accessibility

All components are built with accessibility in mind:

- ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance
- Motion preferences respect

## State Management

Components handle state in the following ways:

- Local state with React useState
- Form state with react-hook-form
- Global state with Zustand where needed
- Context providers for shared state

## Custom Hooks

Many components use custom hooks for behavior:

- `useMediaQuery`: Responsive behavior
- `useDebounce`: Performance optimization
- `useFocusTrap`: Accessibility enhancement
- `useLocalStorage`: Persistent settings

## Testing

Components are tested using:

- Jest for unit testing
- React Testing Library for component testing
- Storybook for visual testing (future)

## Performance Considerations

Components are optimized for performance:

- Code splitting
- Memoization where beneficial
- Virtualization for long lists
- Lazy loading where appropriate
- Bundle size monitoring 