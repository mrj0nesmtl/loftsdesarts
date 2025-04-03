# Development Documentation

This directory contains comprehensive documentation for developers working on the Lofts des Arts website, providing guidelines, best practices, and setup instructions.

## Directory Structure

- `/setup/` - Environment setup and installation guides
- `/workflows/` - Development workflows and processes
- `/testing/` - Testing strategies and procedures
- `/coding-standards/` - Coding conventions and standards
- `/performance/` - Performance optimization guidelines
- `/security/` - Security best practices

## Getting Started

To set up the development environment, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/mrj0nesmtl/loftsdesarts.git
   cd loftsdesarts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For mobile testing on your local network:
   ```bash
   npm run dev:network
   ```

## Project Structure

```
loftsdesarts/
├── public/            # Static files
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── (pages)/   # Public website pages
│   │   ├── admin/     # Admin dashboard pages
│   │   ├── api/       # API routes
│   │   ├── components/    # React components
│   │   ├── admin/     # Admin-specific components
│   │   ├── layout/    # Layout components
│   │   ├── common/    # Shared components
│   │   ├── forms/     # Form components
│   │   ├── sections/  # Page section components
│   │   ├── lib/           # Utility functions and shared code
│   │   ├── styles/        # Global styles
│   │   ├── types/         # TypeScript type definitions
│   ├── docs/              # Documentation
│   ├── sql/               # SQL migration scripts
│   ├── .github/           # GitHub workflows and templates
│   └── ... configuration files
```

## Development Workflows

### Feature Development

1. Create a feature branch:
   ```bash
   git checkout -b feature/feature-name
   ```

2. Implement the feature with tests

3. Create a pull request against the main branch

4. Address review comments and merge once approved

### Code Review Standards

- All code must be reviewed by at least one other developer
- Code should follow the established coding standards
- Tests should be included for new features
- Accessibility should be verified
- Performance impact should be considered

## Testing Strategy

The project employs several testing approaches:

- **Unit Tests**: Testing individual components and functions
- **Integration Tests**: Testing interactions between components
- **End-to-End Tests**: Testing complete user flows
- **Accessibility Tests**: Verifying WCAG compliance
- **Performance Tests**: Measuring loading and interaction performance

Run tests with:
```bash
npm run test           # Run all tests
npm run test:unit      # Run only unit tests
npm run test:e2e       # Run only end-to-end tests
```

## Coding Standards

### TypeScript

- Use strict TypeScript typing
- Define interfaces for all props
- Avoid using `any` type
- Use TypeScript utility types where appropriate

### React

- Use functional components with hooks
- Follow the React hooks rules
- Keep components focused on a single responsibility
- Use the Next.js App Router conventions

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the design system tokens
- Ensure mobile-first responsive design
- Test across different browsers and devices

## Performance Guidelines

- Optimize images using Next.js Image component
- Implement code splitting for large components
- Use server components where appropriate
- Minimize client-side JavaScript
- Implement proper caching strategies

## Mobile Testing

For testing on mobile devices within your local network:

1. Start the server with network access:
   ```bash
   npm run dev:network
   ```

2. Find your local IP address:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. Access the site on your mobile device at:
   ```
   http://YOUR_LOCAL_IP:3000
   ```

See the [Mobile Testing Guide](./setup/mobile-testing.md) for detailed instructions.

## Deployment

The application is deployed on Replit with the following process:

1. Changes are pushed to the `main` branch
2. GitHub Actions runs tests and builds the application
3. Successful builds are deployed to Replit
4. The live site is available at https://loftsdesarts.replit.app

## Troubleshooting

Common development issues and their solutions:

- **API connection issues**: Check Supabase credentials in `.env.local`
- **Build errors**: Ensure all dependencies are installed with `npm install`
- **Type errors**: Fix TypeScript errors before committing
- **Network errors**: Check firewall settings for mobile testing 