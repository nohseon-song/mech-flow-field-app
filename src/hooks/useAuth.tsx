
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: '로그인 성공',
        description: '환영합니다!',
      });
    } catch (error: any) {
      const errorMessage = error?.message || '로그인 중 오류가 발생했습니다.';
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
      
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: credentials.displayName || credentials.email.split('@')[0]
          }
        }
      });

      if (error) {
        throw error;
      }

      setAuthState(prev => ({ ...prev, loading: false }));
      
      toast({
        title: '회원가입 완료',
        description: '이메일을 확인하여 계정을 활성화해주세요.',
      });
    } catch (error: any) {
      const errorMessage = error?.message || '회원가입 중 오류가 발생했습니다.';
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
    try {
      await supabase.auth.signOut();
      toast({
        title: '로그아웃',
        description: '성공적으로 로그아웃되었습니다.',
      });
    } catch (error: any) {
      toast({
        title: '로그아웃 오류',
        description: '로그아웃 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          error: null,
        });
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        error: null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
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
