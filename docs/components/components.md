# Components Documentation

This directory contains documentation for all UI components used throughout the Lofts des Arts website, providing a comprehensive reference for developers.

## Component Organization

Components are organized into the following categories:

- `/admin/` - Components specific to the administrative dashboard
- `/common/` - Shared components used across multiple areas
- `/layout/` - Layout components like headers, footers, and navigation
- `/forms/` - Form components and input elements
- `/sections/` - Page section components for the public website

## Component Architecture

The component architecture follows these principles:

1. **Atomic Design Methodology**
   - Atoms: Basic building blocks (buttons, inputs, icons)
   - Molecules: Simple component combinations (search fields, form groups)
   - Organisms: Complex UI sections (navigation bars, hero sections)
   - Templates: Page layouts with placeholder content
   - Pages: Complete page implementations

2. **Component API Standards**
   - Consistent prop interfaces
   - Clear typing with TypeScript
   - Default props for common use cases
   - Comprehensive JSDoc comments

3. **Composition over Inheritance**
   - Components are designed to be composed rather than extended
   - Higher-order components and render props used where appropriate

## Admin Components

The admin dashboard uses a specialized set of components:

- `ClientAdminLayout` - Main layout wrapper for admin pages
- `AdminNav` - Navigation sidebar for admin section
- `UserAvatar` - User profile avatar with role indication
- `NotificationCenter` - System notification components
- `WelcomeMessage` - Personalized greeting component
- Specialized components for messaging, file management, etc.

## UI Component Library

The website uses a combination of custom components and those from the Shadcn/UI library:

- `Button` - Various button styles (primary, secondary, ghost)
- `Input` - Text input fields with validation
- `Dialog` - Modal dialog components
- `Dropdown` - Dropdown menus and select components
- `Card` - Content container components
- `Tabs` - Tabbed interface components

## Form Components

Form components adhere to the following standards:

- Built using React Hook Form for state management
- Zod schema validation for type-safe validation
- Accessible error messaging
- Consistent loading and success states
- Self-contained form submission logic

## Usage Examples

Each component includes usage examples:

```tsx
import { Button } from "@/components/common/Button";

// Primary button
<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

// Secondary button
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Ghost button
<Button variant="ghost" onClick={handleReset}>
  Reset
</Button>
```

## Theme Customization

Components support theming through:

- CSS variables for colors, spacing, and typography
- Dark/light mode support via theme context
- Responsive design properties
- Design token consistency

## Accessibility Standards

All components adhere to WCAG 2.1 AA standards:

- Proper semantic HTML
- ARIA attributes where necessary
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader support

## Testing

Each component includes:

- Unit tests with Jest and React Testing Library
- Snapshot tests for UI stability
- Integration tests for complex interactions
- Visual regression tests (Storybook) 