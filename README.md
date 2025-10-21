# Bill Tracker

A dark-themed Next.js Subscription & Bill Organizer that runs entirely in the browser with localStorage persistence.

## Features
- Monthly calendar grid with due-count badges and overdue indicators.
- Drawer for day details with edit/delete actions.
- Add/Edit modal supporting multiple recurrence types and currencies (CAD/USD/EUR).
- Accurate recurrence logic for weekly, monthly, quarterly, annual, 30-day, and custom day intervals.
- Totals bar displaying monthly, next 7 days, and next 30 days forecasts.
- Export and import JSON data, plus demo seed data for first launch.
- Responsive, keyboard-accessible dark UI built with Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Visit http://localhost:3000 and start organizing your subscriptions.

### Formatting & Linting
```bash
npm run lint
npm run format
```

## Changing the Default Currency
The totals bar uses the first bill's currency, defaulting to CAD. To change the default currency globally, update the seed data in `app/lib/storage.ts` or adjust the `baseCurrency` fallback in `app/page.tsx`.

## Recurrence Logic
Recurrences are implemented in `app/lib/recurrence.ts` and follow these rules:
- **WEEKLY**: Every 7 days from the first due date.
- **EVERY_30_DAYS**: Fixed 30-day interval.
- **MONTHLY**: Same calendar day each month, safely snapping to the last valid day.
- **QUARTERLY**: Adds 3 months with end-of-month safety.
- **ANNUALLY**: Adds 12 months with end-of-month safety.
- **CUSTOM_DAYS**: Uses the provided `intervalDays` value.

Helpers include `addMonthsSafe`, `getOccurrencesInRange`, `getOccurrencesInMonth`, `getNextDue`, and `isOverdue`.

## Deploy with GitHub
Use the provided script to push the project to your GitHub repository's `main` branch.

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

This script stages all changes, commits them with a standard message, sets the branch to `main`, and pushes upstream.
