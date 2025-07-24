# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (React + Electron)
npm run dev

# React development only
npm run react-dev

# Build for production
npm run build

# Create distributable executable
npm run build-release

# Linting
npm run lint

# Type checking
npm run typecheck

# Run tests
npm run test
```

## Architecture Overview

**My Family Finances** is an Electron-based desktop application for family finance management built with React + TypeScript.

### Core Architecture Pattern
- **Custom Routing**: No React Router - uses simple state-based navigation in App.tsx
- **Theme System**: Dynamic theming via React Context with persistent settings
- **Database Layer**: Electron IPC communication to SQLite database in main process
- **Authentication**: Local encrypted authentication with session management

### Key Architectural Components

**App.tsx**: Main application shell with custom routing system. Uses state management for page navigation instead of React Router.

**Theme System** (`src/contexts/ThemeContext.tsx`):
- Provides dark/light mode switching
- Compact view mode for reduced spacing
- Persistent settings via localStorage
- Dynamic theme switching affects entire application

**Database Service** (`src/database/databaseService.ts`):
- Electron IPC-based database communication
- SQLite database managed in main process
- Supports accounts, customers, vendors, transactions
- All database operations are async via IPC calls

**Authentication** (`src/services/authService.ts`):
- AES-encrypted password storage using CryptoJS
- Session-based authentication with localStorage
- Default credentials: Admin/Admin

### Electron Configuration
- Main process file: `public/electron.js`
- Uses `better-sqlite3` for database operations
- Supports Windows executable generation via `electron-packager`

### Component Structure
- **Pages**: Dashboard, ChartOfAccounts, Customers, Vendors, Expenses
- **Components**: Reusable UI components with theme support
- **Hooks**: Custom hooks for settings management (`useSettings`, `useDebounce`)

### Data Models
Core entities: Account, Customer, Vendor, Transaction with proper TypeScript interfaces defined in databaseService.ts.

### Styling
- **Styled Components** with TypeScript
- Global styles in App.tsx
- Theme-aware components using theme context
- Responsive design with proper spacing system

## Development Notes

- Database operations require Electron runtime (won't work in browser-only React)
- Theme changes apply globally and persist across sessions
- All data is stored locally - no external API dependencies
- Production builds create Windows executable in `dist/` directory