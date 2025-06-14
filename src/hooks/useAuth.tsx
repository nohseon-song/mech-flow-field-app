
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { initializeAdminAccount, getCurrentUser, removeCurrentUser, checkAdminPersistentLogin } from '@/utils/authUtils';
import { authenticateUser, registerUser } from '@/services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      
      initializeAdminAccount();
      
      // 먼저 관리자 영구 로그인 상태 확인
      const persistentAdmin = checkAdminPersistentLogin();
      if (persistentAdmin) {
        setAuthState({
          user: persistentAdmin,
          loading: false,
          error: null,
        });
        return;
      }
      
      const user = getCurrentUser();
      setAuthState({
        user,
        loading: false,
        error: null,
      });
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
      
      const user = await authenticateUser(credentials);
      
      setAuthState({
        user,
        loading: false,
        error: null,
      });
      
      toast({
        title: '로그인 성공',
        description: `환영합니다${user.role === 'admin' ? ', 관리자님' : ''}!${user.role === 'admin' ? ' (영구 로그인 상태)' : ''}`,
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
      
      await registerUser(credentials);
      
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
    const currentUser = authState.user;
    
    removeCurrentUser();
    
    // 관리자 영구 로그인 상태인 경우 로그아웃되지 않음
    if (currentUser?.role === 'admin' && localStorage.getItem('adminPersistentLogin') === 'true') {
      toast({
        title: '관리자 계정',
        description: '관리자 계정은 영구 로그인 상태가 유지됩니다.',
      });
      return;
    }
    
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
