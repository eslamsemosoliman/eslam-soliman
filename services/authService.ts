import { User, UserRole } from '../types';

const STORAGE_KEY = 'master_bis_user';

export const authService = {
  login: async (email: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let user: User;

        // Hardcoded Admin Logic
        if (email.toLowerCase() === 'admin@masterbis.com') {
          user = {
            id: 'admin_01',
            name: 'Admin User',
            email: email,
            role: UserRole.ADMIN,
            isSubscribed: true
          };
        } else {
          // Normal Student Logic
          user = {
            id: 'u_' + Math.floor(Math.random() * 1000),
            name: email.split('@')[0],
            email: email,
            role: UserRole.STUDENT,
            isSubscribed: false,
            pendingSubscription: false
          };
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }
};