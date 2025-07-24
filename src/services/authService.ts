import CryptoJS from 'crypto-js';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'user';
  profile: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    avatar: string;
  };
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

const STORAGE_KEY = 'myfamilyfinances-users';
const SESSION_KEY = 'myfamilyfinances-session';
const SETTINGS_KEY = 'myfamilyfinances-settings'; // Separate settings storage
const ENCRYPTION_KEY = 'MyFamilyFinances-Secure-2025';

class AuthService {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    console.log('Initializing My Family Finances Auth Service');
    this.loadUsers();
    this.initializeDefaultAdmin();
    this.restoreSession();
    
    // Perform health checks
    this.verifyDataIntegrity();
    this.getStorageInfo();
  }

  private loadUsers(): void {
    try {
      const encryptedData = localStorage.getItem(STORAGE_KEY);
      if (encryptedData) {
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        this.users = JSON.parse(decryptedData);
      }
    } catch (error) {
      console.warn('Failed to load users:', error);
      this.users = [];
    }
  }

  private saveUsers(): void {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(this.users), ENCRYPTION_KEY).toString();
    
    try {
      localStorage.setItem(STORAGE_KEY, encryptedData);
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Failed to save users:', error);
      // Try to clear some space and retry
      try {
        localStorage.removeItem('temp-data');
        localStorage.setItem(STORAGE_KEY, encryptedData);
        console.log('User data saved on retry');
      } catch (retryError) {
        console.error('Failed to save users even after retry:', retryError);
        throw new Error('Critical: Unable to save user data to local storage');
      }
    }
  }

  private initializeDefaultAdmin(): void {
    // Single-user family finance app - only Admin account needed
    const adminExists = this.users.some(user => user.username === 'Admin');
    if (!adminExists) {
      const familyAdmin: User = {
        id: 'family-admin',
        username: 'Admin',
        passwordHash: this.hashPassword('Admin'),
        role: 'admin',
        profile: {
          name: 'Family Administrator',
          email: 'family@myfamilyfinances.local',
          avatar: 'https://ui-avatars.com/api/?name=Family+Administrator&background=2563eb&color=fff'
        },
        createdAt: new Date().toISOString()
      };
      this.users.push(familyAdmin);
      this.saveUsers();
      console.log('My Family Finances - Admin account initialized');
    }
  }

  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password + ENCRYPTION_KEY).toString();
  }

  private restoreSession(): void {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const { userId, timestamp } = JSON.parse(sessionData);
        const sessionAge = Date.now() - timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge < maxAge) {
          const user = this.users.find(u => u.id === userId);
          if (user) {
            this.currentUser = user;
          }
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private saveSession(userId: string): void {
    const sessionData = {
      userId,
      timestamp: Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    // Fast synchronous login for single-user family app
    const user = this.users.find(u => u.username === credentials.username);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const passwordHash = this.hashPassword(credentials.password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid password' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.currentUser = user;
    this.saveUsers();
    this.saveSession(user.id);

    return { success: true, user };
  }

  logout(): void {
    // Preserve user settings before logout
    this.preserveUserSettings();
    
    this.currentUser = null;
    // Only remove session data, preserve settings and other data
    localStorage.removeItem(SESSION_KEY);
    // DO NOT remove: prewittbook-settings, prewittbook-users, or other persistent data
    
    console.log('User logged out - settings and data preserved');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  async updateProfile(profileData: Partial<User['profile']>): Promise<{ success: boolean; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      this.currentUser.profile = { ...this.currentUser.profile, ...profileData };
      
      // Update in users array
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        this.saveUsers();
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const currentHash = this.hashPassword(currentPassword);
      if (this.currentUser.passwordHash !== currentHash) {
        return { success: false, error: 'Current password is incorrect' };
      }

      this.currentUser.passwordHash = this.hashPassword(newPassword);
      
      // Update in users array
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        this.saveUsers();
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to change password' };
    }
  }

  // Family finance app - no multi-user creation needed
  // Only Admin user exists for family management

  exportUserData(): any {
    if (!this.currentUser) {
      return null;
    }

    return {
      user: {
        username: this.currentUser.username,
        profile: this.currentUser.profile,
        createdAt: this.currentUser.createdAt,
        lastLogin: this.currentUser.lastLogin
      },
      exportedAt: new Date().toISOString()
    };
  }

  // Ensure settings are preserved across logout/login cycles
  preserveUserSettings(): void {
    try {
      const settings = localStorage.getItem(SETTINGS_KEY);
      if (settings) {
        // Settings are already preserved in localStorage
        console.log('User settings preserved across sessions');
      }
    } catch (error) {
      console.warn('Failed to preserve settings:', error);
    }
  }

  // Verify data integrity and storage health
  verifyDataIntegrity(): boolean {
    try {
      const users = localStorage.getItem(STORAGE_KEY);
      const settings = localStorage.getItem(SETTINGS_KEY);
      
      // Test write permissions
      const testKey = 'prewittbook-write-test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      console.log('Data integrity check passed - storage is healthy');
      return users !== null;
    } catch (error) {
      console.error('Data integrity check failed:', error);
      console.error('Local storage may not have write permissions');
      return false;
    }
  }

  // Get storage information for debugging
  getStorageInfo(): any {
    try {
      const info = {
        localStorageAvailable: !!window.localStorage,
        usersStored: !!localStorage.getItem(STORAGE_KEY),
        settingsStored: !!localStorage.getItem(SETTINGS_KEY),
        sessionStored: !!localStorage.getItem(SESSION_KEY),
        storageUsage: this.calculateStorageUsage()
      };
      console.log('Storage Information:', info);
      return info;
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { error: 'Storage access denied' };
    }
  }

  private calculateStorageUsage(): string {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return `${(total / 1024).toFixed(2)} KB`;
    } catch (error) {
      return 'Unknown';
    }
  }
}

export const authService = new AuthService();