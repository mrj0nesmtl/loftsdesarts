# Design Documentation

This directory contains comprehensive design documentation for the Lofts des Arts website, covering visual design, user experience, and design systems.

## Contents

- `/design-system/` - Core design system documentation
- `/wireframes/` - Low and high-fidelity wireframes
- `/mockups/` - Visual design mockups
- `/prototypes/` - Interactive prototype links
- `/assets/` - Design assets and resources
- `/user-flows/` - User journey and flow diagrams

## Design System

The Lofts des Arts design system provides a unified foundation for all user interfaces, ensuring consistency across the website.

### Brand Identity

- **Logo Usage** - Guidelines for logo placement, sizing, and clear space
- **Color Palette** - Primary, secondary, and accent colors with accessibility considerations
- **Typography** - Font families, sizes, weights, and line heights
- **Iconography** - Custom and standard icon sets
- **Photography** - Image style guidelines and art direction

### Core Design Tokens

```
// Colors
--color-primary: #7f1d1d;      // Red 900
--color-primary-light: #ef4444; // Red 500
--color-secondary: #18181b;     // Zinc 900
--color-accent: #d4d4d8;        // Zinc 300
--color-background: #fafafa;    // White
--color-text: #18181b;          // Zinc 900
--color-text-secondary: #71717a; // Zinc 500
--color-error: #dc2626;         // Red 600
--color-success: #16a34a;       // Green 600

// Spacing
--spacing-1: 0.25rem;   // 4px
--spacing-2: 0.5rem;    // 8px
--spacing-3: 0.75rem;   // 12px
--spacing-4: 1rem;      // 16px
--spacing-6: 1.5rem;    // 24px
--spacing-8: 2rem;      // 32px
--spacing-12: 3rem;     // 48px
--spacing-16: 4rem;     // 64px

// Typography
--font-family-primary: 'Inter', sans-serif;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Component Design

The component design section provides detailed specifications for:

- Buttons and input controls
- Navigation elements
- Cards and containers
- Modal dialogs
- Form elements
- Tables and data displays

### Theme Support

The design system includes specifications for both light and dark themes:

- **Light Theme** - Default theme for public-facing pages
- **Dark Theme** - Optional theme for admin dashboard and user preference

## Responsive Design

The responsive design guidelines cover:

- Mobile-first approach
- Breakpoint system
- Grid layout specifications
- Component adaptations for different screen sizes
- Touch vs. mouse interactions

```
// Breakpoints
--breakpoint-sm: 640px;  // Mobile landscape
--breakpoint-md: 768px;  // Tablets
--breakpoint-lg: 1024px; // Small desktops
--breakpoint-xl: 1280px; // Large desktops
--breakpoint-2xl: 1536px; // Extra large screens
```

## User Experience

The UX documentation includes:

- **User Personas** - Detailed resident and board member personas
- **User Journeys** - End-to-end user journeys for key tasks
- **Interaction Models** - Patterns for common user interactions
- **Information Architecture** - Site structure and content organization
- **Accessibility Guidelines** - WCAG 2.1 AA compliance documentation

## Design Process

The design process documentation covers:

- Research methodology
- Ideation and concept development
- User testing procedures
- Iteration workflow
- Design-to-development handoff

## Design-to-Development Handoff

The handoff process includes:

- Component specifications
- Interactive prototypes in Figma
- Detailed annotations for developers
- Animation and interaction specifications
- Asset delivery format guidelines

## Design Principles

The Lofts des Arts design adheres to these core principles:

1. **Elegant Simplicity** - Clean, uncluttered interfaces that prioritize content
2. **Intuitive Navigation** - Self-evident navigation that reduces cognitive load
3. **Consistent Patterns** - Reusable interaction patterns for learnability
4. **Accessible by Default** - Universal design that works for all users
5. **Progressive Enhancement** - Core functionality available to all, enhanced experiences where supported 