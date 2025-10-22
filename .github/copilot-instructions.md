# GitHub Copilot Instructions for Bill Tracker Codex

## Project Overview

This is a Bill & Subscription Tracker application built with Next.js, React, Tailwind CSS, and localStorage for data persistence. The app helps users track recurring bills and subscriptions with a clean, mobile-friendly calendar interface.

## Tech Stack

- **Framework**: Next.js (React framework)
- **Styling**: Tailwind CSS
- **Data Persistence**: localStorage
- **Language**: JavaScript/TypeScript (prefer TypeScript for type safety)

## Code Style & Best Practices

### General Guidelines

- Write clean, maintainable, and well-documented code
- Follow React best practices and hooks patterns
- Use functional components with hooks (no class components)
- Keep components small and focused (single responsibility principle)
- Use meaningful variable and function names that clearly describe their purpose

### TypeScript/JavaScript

- Prefer TypeScript over JavaScript for better type safety
- Use `const` and `let` appropriately (avoid `var`)
- Use arrow functions for consistency
- Implement proper error handling with try-catch blocks
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators
- Always validate and sanitize user input

### React & Next.js

- Use Next.js App Router (app directory) for new features
- Implement proper loading and error states
- Use React hooks appropriately (`useState`, `useEffect`, `useMemo`, `useCallback`)
- Avoid unnecessary re-renders by memoizing expensive computations
- Use `"use client"` directive only when necessary (prefer server components)
- Follow Next.js file-based routing conventions

### Tailwind CSS

- Use Tailwind utility classes instead of custom CSS when possible
- Follow mobile-first responsive design (start with base styles, then add `sm:`, `md:`, `lg:`, etc.)
- Keep consistent spacing using Tailwind's spacing scale
- Use Tailwind's color palette for consistency
- Group related utility classes logically (layout, spacing, colors, typography)

### Data Management

- Use localStorage for client-side data persistence
- Implement proper data validation before storing
- Handle localStorage errors gracefully (quota exceeded, private mode, etc.)
- Create clear data models/interfaces for bills and subscriptions
- Implement data backup/export functionality in JSON format
- Ensure data integrity when reading from localStorage

### Component Structure

- Create reusable components in a `components/` directory
- Separate business logic from presentation components
- Use proper prop types (TypeScript interfaces or PropTypes)
- Keep component files under 300 lines (split larger components)
- Co-locate related files (component, styles, tests)

### Performance

- Optimize images using Next.js Image component
- Lazy load components where appropriate
- Minimize bundle size by importing only what's needed
- Use React.memo() for expensive components that don't need frequent updates
- Debounce user input handlers where appropriate

### Accessibility

- Use semantic HTML elements
- Ensure proper keyboard navigation
- Include ARIA labels where necessary
- Maintain sufficient color contrast ratios
- Test with screen readers when implementing forms and interactive elements

### Testing (when implemented)

- Write unit tests for utility functions
- Test components with React Testing Library
- Focus on user behavior rather than implementation details
- Maintain test coverage for critical features

## Feature-Specific Guidelines

### Calendar View

- Display bills on their due dates
- Show bill count per day
- Make days clickable to view bill details
- Handle month navigation smoothly
- Account for different month lengths and leap years

### Bill Management

- Support multiple recurrence patterns (30 days, monthly, quarterly, annually, custom)
- Validate date inputs properly
- Ensure amounts are formatted correctly (currency)
- Implement proper form validation
- Provide clear success/error feedback

### Data Export/Import

- Export data in clean, readable JSON format
- Validate imported JSON structure
- Handle import errors gracefully with user feedback
- Consider backward compatibility with older data formats

## Security Considerations

- Never store sensitive information (passwords, payment details) in localStorage
- Sanitize all user inputs to prevent XSS attacks
- Validate data types and ranges before processing
- Use Content Security Policy headers
- Keep dependencies updated to avoid vulnerabilities

## Development Workflow

- Start development server with `npm run dev`
- Follow conventional commits format for commit messages
- Test changes in multiple browsers (Chrome, Firefox, Safari)
- Verify mobile responsiveness on different screen sizes
- Check console for warnings and errors before committing

## File Organization

```
/app                 # Next.js app directory (pages, layouts)
/components          # Reusable React components
/lib or /utils       # Utility functions and helpers
/types               # TypeScript type definitions
/public              # Static assets (images, fonts)
/styles              # Global styles and Tailwind config
```

## Common Patterns

### localStorage Helper

```typescript
const STORAGE_KEY = 'bill-tracker-data';

export function saveData(data: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
    // Handle storage quota exceeded
  }
}

export function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;
  }
}
```

### Bill Interface

```typescript
interface Bill {
  id: string;
  name: string;
  amount: number;
  currency: string;
  dueDate: Date | string;
  recurrence: 'monthly' | 'quarterly' | 'annually' | 'custom' | '30-days';
  customInterval?: number; // days for custom recurrence
  category?: string;
  notes?: string;
}
```

## Questions to Consider

When implementing new features, consider:

1. How does this affect mobile users?
2. What happens if localStorage is unavailable?
3. How do we handle edge cases (e.g., bill on Feb 31st)?
4. Is this component reusable?
5. Have we validated all user inputs?
6. Does this work across different time zones?
7. Is the UI accessible to all users?

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
