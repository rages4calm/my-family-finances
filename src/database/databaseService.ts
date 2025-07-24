// Direct SQLite database service - no IPC needed
const path = (window as any).require('path');
const fs = (window as any).require('fs');
const Database = (window as any).require('better-sqlite3');
const { app } = (window as any).require('@electron/remote') || (window as any).require('electron').remote;

export interface Account {
  id: number;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parent_id?: number;
  balance: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  balance: number;
  weekly_income?: number;
  job_title?: string;
  is_family_member?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  debit_account_id: number;
  credit_account_id: number;
  amount: number;
  reference?: string;
  type: 'journal' | 'invoice' | 'payment' | 'expense';
  created_at: string;
  updated_at: string;
}

class DatabaseService {
  private db: any = null;
  private dbPath: string = '';

  constructor() {
    this.initializeDatabase();
  }

  initializeDatabase(): boolean {
    try {
      // Get app path
      const documentsPath = app.getPath('documents');
      const appDataPath = path.join(documentsPath, 'My Family Finances');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(appDataPath)) {
        fs.mkdirSync(appDataPath, { recursive: true });
      }
      
      this.dbPath = path.join(appDataPath, 'myfamilyfinances.db');
      
      // Initialize database
      this.db = new Database(this.dbPath);
      
      // Enable DELETE mode for better compatibility and force commits
      this.db.pragma('journal_mode = DELETE');
      this.db.pragma('synchronous = FULL');
      
      // Create tables
      this.createTables();
      
      // Insert default accounts if database is empty
      const accountCount = this.db.prepare('SELECT COUNT(*) as count FROM accounts').get();
      if (accountCount.count === 0) {
        this.insertDefaultAccounts();
      }
      
      return true;
    } catch (error) {
      alert('Failed to initialize database: ' + (error as Error).message);
      return false;
    }
  }

  private createTables(): void {
    // Create accounts table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'income', 'expense')),
        parent_id INTEGER,
        balance REAL DEFAULT 0,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES accounts (id)
      )
    `);

    // Create customers table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        balance REAL DEFAULT 0,
        weekly_income REAL DEFAULT 0,
        job_title TEXT,
        is_family_member BOOLEAN DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create vendors table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vendors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        balance REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        debit_account_id INTEGER NOT NULL,
        credit_account_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        reference TEXT,
        type TEXT NOT NULL CHECK (type IN ('journal', 'invoice', 'payment', 'expense')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (debit_account_id) REFERENCES accounts (id),
        FOREIGN KEY (credit_account_id) REFERENCES accounts (id)
      )
    `);
  }

  private insertDefaultAccounts(): void {
    const insertAccount = this.db.prepare(`
      INSERT INTO accounts (name, type, description) 
      VALUES (?, ?, ?)
    `);

    const defaultAccounts = [
      // Assets
      { name: 'Checking Account', type: 'asset', description: 'Primary family checking account' },
      { name: 'Savings Account', type: 'asset', description: 'Family emergency fund and savings' },
      { name: 'Cash', type: 'asset', description: 'Cash on hand' },
      
      // Liabilities  
      { name: 'Credit Card', type: 'liability', description: 'Family credit card debt' },
      { name: 'Mortgage', type: 'liability', description: 'Home mortgage loan' },
      
      // Income
      { name: 'Salary', type: 'income', description: 'Primary family income' },
      { name: 'Interest Income', type: 'income', description: 'Interest from savings and investments' },
      
      // Expenses
      { name: 'Groceries', type: 'expense', description: 'Food and household items' },
      { name: 'Utilities', type: 'expense', description: 'Electricity, water, gas, internet' },
      { name: 'Gas & Transportation', type: 'expense', description: 'Vehicle fuel and transportation costs' },
      { name: 'Dining Out', type: 'expense', description: 'Restaurants and takeout' },
      { name: 'Entertainment', type: 'expense', description: 'Movies, games, family activities' },
      { name: 'Healthcare', type: 'expense', description: 'Medical expenses and insurance' },
      { name: 'Insurance', type: 'expense', description: 'Auto, home, and life insurance' },
      { name: 'Shopping', type: 'expense', description: 'Clothing, household goods, misc purchases' }
    ];

    const transaction = this.db.transaction(() => {
      for (const account of defaultAccounts) {
        insertAccount.run(account.name, account.type, account.description);
      }
    });

    transaction();
  }

  // Account methods
  getAllAccounts(): Account[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM accounts ORDER BY type, name');
      return stmt.all();
    } catch (error) {
      return [];
    }
  }

  createAccount(account: Omit<Account, 'id' | 'created_at' | 'updated_at' | 'balance'>): boolean {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO accounts (name, type, description) 
        VALUES (?, ?, ?)
      `);
      const result = stmt.run(account.name, account.type, account.description || '');
      this.db.pragma('synchronous = FULL');
      return result.changes > 0;
    } catch (error) {
      console.error('Database createAccount error:', error);
      return false;
    }
  }

  updateAccount(id: number, account: Partial<Account>): boolean {
    try {
      const stmt = this.db.prepare(`
        UPDATE accounts 
        SET name = ?, type = ?, description = ?, balance = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      const result = stmt.run(account.name, account.type, account.description || '', account.balance || 0, id);
      this.db.pragma('synchronous = FULL');
      return result.changes > 0;
    } catch (error) {
      console.error('Database updateAccount error:', error);
      return false;
    }
  }

  deleteAccount(id: number): boolean {
    try {
      const stmt = this.db.prepare('DELETE FROM accounts WHERE id = ?');
      stmt.run(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Customer methods
  getAllCustomers(): Customer[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM customers ORDER BY name');
      return stmt.all();
    } catch (error) {
      return [];
    }
  }

  createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'balance'>): boolean {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO customers (name, email, phone, address, city, state, zip, weekly_income, job_title, is_family_member) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        customer.name, 
        customer.email || '', 
        customer.phone || '', 
        customer.address || '', 
        customer.city || '', 
        customer.state || '', 
        customer.zip || '',
        customer.weekly_income || 0,
        customer.job_title || '',
        customer.is_family_member ? 1 : 0
      );
      
      // Force database sync
      this.db.pragma('synchronous = FULL');
      
      return result.changes > 0;
    } catch (error) {
      console.error('Database createCustomer error:', error);
      return false;
    }
  }

  updateCustomer(id: number, customer: Partial<Customer>): boolean {
    try {
      const stmt = this.db.prepare(`
        UPDATE customers 
        SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip = ?, 
            weekly_income = ?, job_title = ?, is_family_member = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      const result = stmt.run(
        customer.name, 
        customer.email || '', 
        customer.phone || '', 
        customer.address || '', 
        customer.city || '', 
        customer.state || '', 
        customer.zip || '',
        customer.weekly_income || 0,
        customer.job_title || '',
        customer.is_family_member ? 1 : 0,
        id
      );
      
      // Force database sync
      this.db.pragma('synchronous = FULL');
      
      return result.changes > 0;
    } catch (error) {
      console.error('Database updateCustomer error:', error);
      return false;
    }
  }

  deleteCustomer(id: number): boolean {
    try {
      const stmt = this.db.prepare('DELETE FROM customers WHERE id = ?');
      stmt.run(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Vendor methods
  getAllVendors(): Vendor[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM vendors ORDER BY name');
      return stmt.all();
    } catch (error) {
      return [];
    }
  }

  createVendor(vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at' | 'balance'>): boolean {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO vendors (name, email, phone, address, city, state, zip) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        vendor.name, 
        vendor.email || '', 
        vendor.phone || '', 
        vendor.address || '', 
        vendor.city || '', 
        vendor.state || '', 
        vendor.zip || ''
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  updateVendor(id: number, vendor: Partial<Vendor>): boolean {
    try {
      const stmt = this.db.prepare(`
        UPDATE vendors 
        SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        vendor.name, 
        vendor.email || '', 
        vendor.phone || '', 
        vendor.address || '', 
        vendor.city || '', 
        vendor.state || '', 
        vendor.zip || '',
        id
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  deleteVendor(id: number): boolean {
    try {
      const stmt = this.db.prepare('DELETE FROM vendors WHERE id = ?');
      stmt.run(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Transaction methods
  getAllTransactions(): Transaction[] {
    try {
      const stmt = this.db.prepare('SELECT * FROM transactions ORDER BY date DESC, created_at DESC');
      return stmt.all();
    } catch (error) {
      return [];
    }
  }

  getExpenseTransactions(): any[] {
    try {
      const stmt = this.db.prepare(`
        SELECT t.*, a.name as account_name 
        FROM transactions t 
        LEFT JOIN accounts a ON t.debit_account_id = a.id 
        WHERE t.type = 'expense'
        ORDER BY t.date DESC, t.created_at DESC
      `);
      return stmt.all();
    } catch (error) {
      return [];
    }
  }

  getExpenseAccounts(): Account[] {
    try {
      const stmt = this.db.prepare("SELECT * FROM accounts WHERE type = 'expense' ORDER BY name");
      return stmt.all();
    } catch (error) {
      return [];
    }
  }

  getFirstAssetAccount(): Account | null {
    try {
      const stmt = this.db.prepare("SELECT * FROM accounts WHERE type = 'asset' LIMIT 1");
      return stmt.get() || null;
    } catch (error) {
      return null;
    }
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): boolean {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO transactions (description, amount, date, debit_account_id, credit_account_id, reference, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        transaction.description,
        transaction.amount,
        transaction.date,
        transaction.debit_account_id,
        transaction.credit_account_id,
        transaction.reference || '',
        transaction.type
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  updateTransaction(id: number, transaction: Partial<Transaction>): boolean {
    try {
      const stmt = this.db.prepare(`
        UPDATE transactions 
        SET description = ?, amount = ?, date = ?, debit_account_id = ?, reference = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      stmt.run(
        transaction.description,
        transaction.amount,
        transaction.date,
        transaction.debit_account_id,
        transaction.reference || '',
        id
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  deleteTransaction(id: number): boolean {
    try {
      const stmt = this.db.prepare('DELETE FROM transactions WHERE id = ?');
      stmt.run(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Properly close database connection
  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}

export const databaseService = new DatabaseService();

// Expose to window for cleanup
(window as any).databaseService = databaseService;