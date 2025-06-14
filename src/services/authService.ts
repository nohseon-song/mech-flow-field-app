
import { User, LoginCredentials, SignupCredentials } from '@/types/auth';
import { getStoredUsers, updateStoredUsers, setCurrentUser } from '@/utils/authUtils';

export const authenticateUser = async (credentials: LoginCredentials): Promise<User> => {
  const users = getStoredUsers();
  const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);
  
  if (!user) {
    throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
  }
  
  if (!user.approved) {
    throw new Error('관리자 승인 대기 중입니다. 승인 후 다시 시도해주세요.');
  }
  
  const authenticatedUser: User = {
    id: user.id,
    email: user.email,
    approved: user.approved,
    role: user.role || 'user',
    created_at: user.created_at,
    updated_at: new Date().toISOString(),
  };
  
  setCurrentUser(authenticatedUser);
  return authenticatedUser;
};

export const registerUser = async (credentials: SignupCredentials): Promise<void> => {
  const users = getStoredUsers();
  const existingUser = users.find((u: any) => u.email === credentials.email);
  
  if (existingUser) {
    throw new Error('이미 가입된 이메일입니다.');
  }
  
  const newUser = {
    id: Date.now().toString(),
    email: credentials.email,
    password: credentials.password,
    approved: false,
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  users.push(newUser);
  updateStoredUsers(users);
};
