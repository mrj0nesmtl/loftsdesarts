# Design Documentation

This directory contains comprehensive documentation for the Lofts des Arts platform design system, visual language, and user experience principles.

## Directory Structure

- `/design-system/` - Core design system documentation
- `/brand/` - Brand identity guidelines
- `/ui-components/` - UI component design specifications
- `/wireframes/` - Low and high-fidelity wireframes
- `/mockups/` - Visual design mockups
- `/prototypes/` - Design prototypes and interactive mockups
- `/accessibility/` - Accessibility design guidelines
- `/user-research/` - User research findings and insights
- `/assets/` - Design assets and resources
- `/user-flows/` - User journey and flow diagrams

## Design System

The Lofts des Arts design system provides a unified framework for creating consistent, accessible, and visually cohesive user experiences across the platform.

### Brand Identity

- **Logo and Wordmark**: Usage guidelines, placement, sizing, and clear space requirements
- **Color Palette**: Primary, secondary, and accent colors with accessibility ratings
- **Typography**: Font families, sizes, weights, line heights, and hierarchies
- **Iconography**: Custom icon set and usage guidelines
- **Photography**: Style guide, image guidelines, and art direction
- **Voice and Tone**: Content style guidelines

[View Brand Guidelines](./brand/README.md)

### Core Design Tokens

Design tokens are the foundational variables that drive the visual design:

#### Colors

```css
:root {
  /* Primary palette */
  --color-primary: #7f1d1d;      /* Red 900 */
  --color-primary-dark: #2C5F7F; 
  --color-primary-light: #ef4444; /* Red 500 */
  
  /* Secondary palette */
  --color-secondary: #18181b;     /* Zinc 900 */
  --color-accent: #E6BC63;
  
  /* Neutral palette */
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
  
  /* Functional colors */
  --color-background: #fafafa;    /* White */
  --color-text: #18181b;          /* Zinc 900 */
  --color-text-secondary: #71717a; /* Zinc 500 */
  --color-error: #dc2626;         /* Red 600 */
  --color-success: #16a34a;       /* Green 600 */
  
  /* Theme colors - dynamically applied */
  --background: 255 255 255; /* white - light mode */
  --foreground: 34 34 34; /* dark gray for text - light mode */
  
  /* Dark mode variables are applied via .dark class selector */
}

.dark {
  --background: 0 0 0; /* black - dark mode */
  --foreground: 255 255 255; /* white text - dark mode */
}
```

#### Spacing

```css
:root {
  --spacing-px: 1px;
  --spacing-0: 0;
  --spacing-0-5: 0.125rem; /* 2px */
  --spacing-1: 0.25rem;    /* 4px */
  --spacing-1-5: 0.375rem; /* 6px */
  --spacing-2: 0.5rem;     /* 8px */
  --spacing-3: 0.75rem;    /* 12px */
  --spacing-4: 1rem;       /* 16px */
  --spacing-5: 1.25rem;    /* 20px */
  --spacing-6: 1.5rem;     /* 24px */
  --spacing-8: 2rem;       /* 32px */
  --spacing-10: 2.5rem;    /* 40px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-20: 5rem;      /* 80px */
  --spacing-24: 6rem;      /* 96px */
  --spacing-32: 8rem;      /* 128px */
  --spacing-40: 10rem;     /* 160px */
  --spacing-48: 12rem;     /* 192px */
  --spacing-56: 14rem;     /* 224px */
  --spacing-64: 16rem;     /* 256px */
  
  /* Breakpoints */
  --breakpoint-sm: 640px;  /* Mobile landscape */
  --breakpoint-md: 768px;  /* Tablets */
  --breakpoint-lg: 1024px; /* Small desktops */
  --breakpoint-xl: 1280px; /* Large desktops */
  --breakpoint-2xl: 1536px; /* Extra large screens */
}
```

#### Typography

```css
:root {
  /* Font families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-mono: 'Roboto Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  
  /* Font sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  --font-size-6xl: 3.75rem;   /* 60px */
  
  /* Font weights */
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
- **Tables**: Data tables and grid displays

[View Component Designs](./ui-components/README.md)

### Theme Support

The design system supports multiple themes and appearance modes:

- **Light Theme**: Default theme for public-facing pages
- **Dark Theme**: Dark mode option with appropriate contrast and color adjustments
- **High Contrast Theme**: Enhanced contrast option for accessibility

The theming system is implemented with:
- CSS variables for dynamic value updates
- Context-based theme provider in React
- Local storage persistence of user preferences
- System preference detection as default
- Smooth transitions between theme modes

## Responsive Design

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
- Component adaptations for different screen sizes
- Consideration for different input methods (touch vs. mouse)

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

### Information Architecture

The site structure and content organization follows:

- Clear hierarchical structure
- Intuitive navigation patterns
- Logical content grouping
- Progressive disclosure of complex information
- Consistent labeling and terminology

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
- **Interactive Prototypes**: Functional examples of interactions
- **Detailed Annotations**: Guidance for developers
- **Animation Specifications**: Timing and easing functions
- **Asset Delivery Format**: Guidelines for production-ready assets

## Design Principles

The Lofts des Arts platform follows these core design principles:

### Elegant Simplicity
Create interfaces that feel simple and intuitive while offering sophisticated functionality.

### Contextual Hierarchy
Organize information to emphasize what matters most in each context.

### Intuitive Navigation
Design navigation that allows users to confidently explore and find what they need.

### Thoughtful Animation
Use motion purposefully to enhance understanding and guide attention.

### Typographic Clarity
Employ typography that enhances readability and reinforces information hierarchy.

### Visual Harmony
Create coherent visual experiences through consistent patterns and thoughtful contrasts.

### Accessible by Default
Design with universal accessibility in mind as a fundamental requirement.

### Progressive Enhancement
Ensure core functionality is available to all users while providing enhanced experiences where supported. 