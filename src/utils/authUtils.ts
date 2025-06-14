
import { User } from '@/types/auth';

export const initializeAdminAccount = () => {
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const adminExists = existingUsers.find((user: any) => user.role === 'admin');
  
  if (!adminExists) {
    const adminUser = {
      id: 'admin-001',
      email: 'admin@checkmate.com',
      password: 'admin123',
      approved: true,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    existingUsers.push(adminUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    console.log('관리자 계정이 생성되었습니다:', {
      email: 'admin@checkmate.com',
      password: 'admin123'
    });
  }
};

export const getStoredUsers = () => {
  return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
};

export const updateStoredUsers = (users: any[]) => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem('currentUser');
};
