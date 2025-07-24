# My Family Finances v1.0.0

A **production-ready** family finance management application built with Electron and React, featuring secure local data storage, comprehensive financial tracking, and a modern user interface.

## 🎯 **Features**

### 💰 **Financial Management**
- **Chart of Accounts**: Comprehensive account management with assets, liabilities, income, and expenses
- **Family Members**: Track family member profiles with income and employment information  
- **Vendors**: Manage vendor relationships and payment tracking
- **Expenses**: Record and categorize all family expenses with detailed reporting
- **Budget Tracking**: Monitor budget progress with visual indicators
- **Savings Goals**: Set and track family financial goals

### 🔐 **Security & Authentication**
- **Secure Login**: AES encrypted password storage
- **Local Data Storage**: All data stored locally in Documents folder
- **Session Management**: Secure session handling with proper cleanup
- **Profile Management**: Editable user profiles with encrypted data

### 🎨 **User Experience**
- **Modern UI**: Clean, responsive interface with professional styling
- **Theme Support**: Light/dark mode themes throughout the application
- **Real-time Updates**: Instant feedback for all operations
- **Notifications**: Clean notification system (no pre-loaded content)
- **Proper Shutdown**: Application closes cleanly without zombie processes

## 🚀 **Quick Start**

### For End Users:
1. **Copy the entire folder:** `release/MyFamilyFinances-win32-x64/` to your desired location
2. **Run the executable:** `MyFamilyFinances.exe` (requires all files in the folder)
3. **Default Login:** 
   - Username: `Admin`
   - Password: `Admin`
   - ⚠️ **Change the password immediately after first login for security**

### ⚠️ **Important Installation Notes:**
- **The .exe file alone will NOT work** - you need the entire `MyFamilyFinances-win32-x64` folder
- The folder contains required DLL files, resources, and localization files
- You can move/copy the entire folder anywhere, but keep all files together

### For Developers:
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build production executable
npm run build-release

# Type checking & linting
npm run typecheck
npm run lint
```

## 📊 **Database**

- **Engine**: SQLite with better-sqlite3
- **Location**: `Documents/My Family Finances/myfamilyfinances.db`
- **Tables**: accounts, customers, vendors, transactions
- **Backup**: Manual backup by copying the database file

## 🛡️ **Security Features**

- **Local Data Only**: No external servers or cloud dependencies
- **Encrypted Passwords**: AES encryption using CryptoJS
- **Secure Sessions**: 24-hour session expiration
- **Database Integrity**: ACID compliance with immediate writes
- **Clean Shutdown**: Proper database cleanup on application exit

## 🔧 **Tech Stack**

- **Frontend**: React 18 + TypeScript + Styled Components
- **Desktop**: Electron 22 with secure webPreferences
- **Database**: SQLite via better-sqlite3 with direct renderer access
- **State Management**: React Context + Custom hooks
- **Charts**: Recharts for financial visualization
- **Authentication**: Custom service with AES encryption
- **Remote Access**: @electron/remote for Node.js API access

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header with user info
│   ├── Sidebar.tsx     # Main navigation sidebar
│   ├── LoginScreen.tsx # Authentication interface
│   └── NotificationsPanel.tsx # Clean notifications (no preloaded content)
├── contexts/           # React contexts for global state
│   ├── ThemeContext.tsx     # Theme management
│   └── SaveStatusContext.tsx # Save status tracking
├── database/           # Database layer
│   └── databaseService.ts   # Direct SQLite operations
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Financial overview
│   ├── ChartOfAccounts.tsx # Account management
│   ├── Customers.tsx   # Family member management
│   ├── Vendors.tsx     # Vendor management
│   └── Expenses.tsx    # Expense tracking
├── services/           # Business logic services
│   └── authService.ts  # Authentication & user management
└── hooks/              # Custom React hooks
    └── useSettings.ts  # Settings persistence
```

## ✅ **Recent Fixes**

- ✅ **Fixed zombie processes**: Application now closes properly without leaving background processes
- ✅ **Fixed customer save failures**: Resolved database boolean handling and transaction commits  
- ✅ **Fixed data persistence**: Data now saves correctly between app restarts
- ✅ **Removed preloaded notifications**: Clean notification system with clear functionality
- ✅ **Removed default login hints**: Cleaner login interface
- ✅ **Fixed database initialization errors**: Proper SQLite configuration and error handling
- ✅ **Fixed input focus issues**: Improved form interaction reliability

## 💡 **Usage Tips**

### First Time Setup:
1. Log in with default credentials (Admin/Admin)
2. **Immediately change your password** in Settings
3. Add your family members in the Customers section
4. Set up your accounts in Chart of Accounts
5. Begin tracking expenses and setting budget goals

### Best Practices:
- Regular database backups (copy the .db file)
- Use descriptive account names and categories
- Set up recurring expenses for bills
- Review monthly reports for spending patterns
- Keep vendor information updated for easy expense tracking

### 🔄 **Reset to Factory Defaults:**
To completely reset the application (clear all data, passwords, and settings):

**Option 1 - Database Only (keeps login changes):**
1. **Close the application completely**
2. **Delete the database file:** `Documents/My Family Finances/myfamilyfinances.db`
3. **Restart the application** - financial data reset, but login/password changes preserved

**Option 2 - Complete Reset (everything back to default):**
1. **Close the application completely**
2. **Delete the database file:** `Documents/My Family Finances/myfamilyfinances.db`
3. **Clear Electron data folder:**
   - Windows: `%APPDATA%\MyFamilyFinances` (if it exists)
   - Or use Developer Tools in app: F12 → Application → Storage → Clear All
4. **Restart the application** - everything back to Admin/Admin defaults

**What gets reset:**
- ✅ All financial data (accounts, transactions, customers, vendors)
- ✅ Password back to Admin/Admin  
- ✅ All user profile changes
- ✅ Theme and display settings
- ✅ All family member information

## 🆘 **Troubleshooting**

### If the app won't start:
- Check if any previous instances are running in Task Manager
- Ensure Documents folder is writable
- Try running as administrator if permissions are an issue

### If data isn't saving:
- Check the database file exists in Documents/My Family Finances/
- Ensure sufficient disk space
- Try restarting the application

### For developer issues:
- Run `npm run typecheck` to verify TypeScript
- Check `npm run lint` for code quality issues  
- Use dev tools in development mode for debugging

## 📄 **License**

Created by Carl Prewitt Jr (carl@carl-prewitt.com)  
© 2025 All rights reserved

---

**A complete family financial management solution - secure, local, and easy to use.**