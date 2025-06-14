import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 초기 관리자 계정 설정
const initializeAdminAccount = () => {
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const { toast } = useToast();

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // 관리자 계정 초기화
      initializeAdminAccount();
      
      // 로컬 스토리지에서 사용자 정보 확인 (실제 프로젝트에서는 Supabase auth 사용)
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: '인증 상태 확인 중 오류가 발생했습니다.',
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // 임시 사용자 데이터 (실제로는 Supabase에서 인증)
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
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
      
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      
      setAuthState({
        user: authenticatedUser,
        loading: false,
        error: null,
      });
      
      toast({
        title: '로그인 성공',
        description: `환영합니다${user.role === 'admin' ? ', 관리자님' : ''}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast({
        title: '로그인 실패',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
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
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
      
      toast({
        title: '회원가입 신청 완료',
        description: '관리자 승인 후 로그인이 가능합니다.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast({
        title: '회원가입 실패',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const logout = async () => {
    localStorage.removeItem('currentUser');
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
    toast({
      title: '로그아웃',
      description: '성공적으로 로그아웃되었습니다.',
    });
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
      checkAuthStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
