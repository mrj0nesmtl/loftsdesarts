# Design Documentation

This directory contains comprehensive documentation for the Lofts des Arts platform design system, visual language, and user experience principles.

## Directory Structure

- `/design-system/` - Core design system documentation
- `/brand/` - Brand identity guidelines
- `/ui-components/` - UI component design specifications
- `/prototypes/` - Design prototypes and mockups
- `/accessibility/` - Accessibility design guidelines
- `/user-research/` - User research findings and insights

## Design System

The Lofts des Arts design system provides a unified framework for creating consistent, accessible, and visually cohesive user experiences across the platform.

### Brand Identity

- **Logo and Wordmark**: Usage guidelines and specifications
- **Color Palette**: Primary, secondary, and accent colors with accessibility ratings
- **Typography**: Font families, sizes, and hierarchies
- **Iconography**: Custom icon set and usage guidelines
- **Photography**: Style guide and art direction
- **Voice and Tone**: Content style guidelines

[View Brand Guidelines](./brand/README.md)

### Core Design Tokens

Design tokens are the foundational variables that drive the visual design:

#### Colors

```css
:root {
  --color-primary: #3B7EA7;
  --color-primary-dark: #2C5F7F;
  --color-primary-light: #5497BE;
  --color-secondary: #C6A97E;
  --color-accent: #E6BC63;
  --color-neutral-50: #F9F9F9;
  --color-neutral-100: #F3F4F6;
  --color-neutral-200: #E5E7EB;
  --color-neutral-300: #D1D5DB;
  --color-neutral-400: #9CA3AF;
  --color-neutral-500: #6B7280;
  --color-neutral-600: #4B5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1F2937;
  --color-neutral-900: #111827;
}
```

#### Spacing

```css
:root {
  --spacing-px: 1px;
  --spacing-0: 0;
  --spacing-0-5: 0.125rem;
  --spacing-1: 0.25rem;
  --spacing-1-5: 0.375rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;
  --spacing-40: 10rem;
  --spacing-48: 12rem;
  --spacing-56: 14rem;
  --spacing-64: 16rem;
}
```

#### Typography

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-mono: 'Roboto Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;
  
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
}
```

### Component Design

The design system includes specifications for all UI components:

- **Buttons**: Primary, secondary, outline, ghost variations
- **Navigation**: Header, footer, mobile menu, breadcrumbs
- **Forms**: Inputs, selects, checkboxes, radio buttons, switches
- **Cards**: Different content card layouts and variations
- **Feedback**: Alerts, notifications, modals, toasts
- **Media**: Image displays, carousels, galleries

[View Component Designs](./ui-components/README.md)

### Theme Support

The design system supports both light and dark themes:

- **Light Theme**: Default theme for the platform
- **Dark Theme**: Accessible dark mode option
- **Contrast Theme**: High contrast option for accessibility

### Responsive Design

The design follows a mobile-first approach with responsive breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: ≥ 1280px

Responsive design principles include:

- Flexible layouts using CSS Grid and Flexbox
- Fluid typography with clamp() functions
- Adaptive component layouts
- Touch-friendly interaction targets

## User Experience

### User Personas

The platform is designed for the following primary personas:

- **Prospective Buyers**: Individuals looking for property information
- **Current Residents**: Condominium owners and residents
- **Property Managers**: Administrative staff and property managers
- **Board Members**: Condominium board members with administrative access

[View User Personas](./user-research/personas.md)

### User Journeys

Key user journeys through the application:

- **Discovery Journey**: Prospective buyers exploring the property
- **Contact Journey**: Visitors submitting inquiries
- **Resident Access Journey**: Residents accessing protected resources
- **Administrative Journey**: Staff managing content and inquiries

[View User Journeys](./user-research/journeys.md)

### Interaction Models

The platform follows these interaction principles:

- **Progressive Disclosure**: Revealing information as needed
- **Contextual Actions**: Displaying relevant actions in context
- **Feedback Loops**: Providing clear feedback for user actions
- **Error Prevention**: Designing to prevent errors before they occur
- **Graceful Recovery**: Helping users recover when errors occur

### Accessibility Guidelines

The platform adheres to WCAG 2.1 AA standards:

- **Perceivable**: Information presented in ways all users can perceive
- **Operable**: Interface elements operable by all users
- **Understandable**: Information and operation understandable to all users
- **Robust**: Content interpreted reliably by various user agents

[View Accessibility Guidelines](./accessibility/README.md)

## Design Process

### Research Methodology

The design process begins with user research:

- **User Interviews**: Direct conversations with target users
- **Competitive Analysis**: Evaluation of similar platforms
- **Heuristic Review**: Expert evaluation against usability principles

### Design Tools

The design team uses the following tools:

- **Figma**: Primary design and prototyping tool
- **Adobe Creative Suite**: For complex graphic work
- **Miro**: For collaborative design thinking and user journey mapping
- **Lookback**: For user testing and research

### Design to Development Handoff

The design-to-development workflow includes:

- **Component Specifications**: Detailed component documentation
- **Figma Developer Handoff**: Design specs and measurements
- **Zeplin**: Alternative handoff tool for specific assets
- **Style Dictionary**: Automated token generation from design variables

### Design Principles

The Lofts des Arts platform follows these core design principles:

#### Elegant Simplicity
Create interfaces that feel simple and intuitive while offering sophisticated functionality.

#### Contextual Hierarchy
Organize information to emphasize what matters most in each context.

#### Intuitive Navigation
Design navigation that allows users to confidently explore and find what they need.

#### Thoughtful Animation
Use motion purposefully to enhance understanding and guide attention.

#### Typographic Clarity
Employ typography that enhances readability and reinforces information hierarchy.

#### Visual Harmony
Create coherent visual experiences through consistent patterns and thoughtful contrasts. 